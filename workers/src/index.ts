import { DurableObject } from "cloudflare:workers";

type SigningEnv = Env & {
	SLURM_DASHBOARD_SIGNING_KEY: string;
};

const CORS_HEADERS: Record<string, string> = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, X-Signature",
};

function withCors(response: Response): Response {
	const headers = new Headers(response.headers);
	for (const [key, value] of Object.entries(CORS_HEADERS)) {
		headers.set(key, value);
	}
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
}

async function hmacSha256Hex(secret: string, message: ArrayBuffer): Promise<string> {
	const keyBytes = new TextEncoder().encode(secret);
	const cryptoKey = await crypto.subtle.importKey(
		"raw",
		keyBytes,
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const signature = await crypto.subtle.sign("HMAC", cryptoKey, message);
	const bytes = new Uint8Array(signature);
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
	const maxLen = Math.max(a.length, b.length);
	let diff = a.length ^ b.length;
	for (let i = 0; i < maxLen; i++) {
		const ac = i < a.length ? a.charCodeAt(i) : 0;
		const bc = i < b.length ? b.charCodeAt(i) : 0;
		diff |= ac ^ bc;
	}
	return diff === 0;
}

/**
 * Welcome to Cloudflare Workers! This is your first Durable Objects application.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your Durable Object in action
 * - Run `npm run deploy` to publish your application
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/durable-objects
 */

/** A Durable Object's behavior is defined in an exported Javascript class */
export class ClusterStatus extends DurableObject<Env> {
	/**
	 * The constructor is invoked once upon creation of the Durable Object, i.e. the first call to
	 * 	`DurableObjectStub::get` for a given identifier (no-op constructors can be omitted)
	 *
	 * @param ctx - The interface for interacting with Durable Object state
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 */
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}

	/**
	 * set_status stores the raw cluster status payload in Durable Object storage.
	 *
	 * @param status - The JSON payload bytes containing the cluster status
	 * @returns A string confirming that the status has been set
	 */
	async set_status(status: ArrayBuffer): Promise<null> {
		await this.ctx.storage.put("status", status);
		return null;
	}

	/**
	 * get_status retrieves the stored cluster status payload from Durable Object storage.
	 *
	 * @returns The JSON payload bytes containing the cluster status, or null if not found
	 */
	async get_status(): Promise<ArrayBuffer | null> {
		const status = await this.ctx.storage.get<ArrayBuffer>("status");
		return status || null;
	}
}

async function handleGet(request: Request, env: Env, getMatch: RegExpMatchArray): Promise<Response> {
	if (request.method !== "GET") {
		return withCors(new Response("Method Not Allowed", {
			status: 405,
			headers: { Allow: "GET" },
		}));
	}

	const name = decodeURIComponent(getMatch[1]);
	const stub = env.CLUSTER_STATUS.getByName(name);
	const status = (await stub.get_status()) as ArrayBuffer | null;

	if (!status) {
		return withCors(new Response("Not Found", { status: 404 }));
	}

	return withCors(new Response(status, {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	}));
}

async function handlePut(request: Request, env: Env, putMatch: RegExpMatchArray): Promise<Response> {
	if (request.method !== "POST") {
		return withCors(new Response("Method Not Allowed", {
			status: 405,
			headers: { Allow: "POST" },
		}));
	}

	const signingEnv = env as SigningEnv;
	if (!signingEnv.SLURM_DASHBOARD_SIGNING_KEY) {
		return withCors(new Response("Signing secret is not configured", { status: 500 }));
	}

	const signature = request.headers.get("X-Signature");
	if (!signature) {
		return withCors(new Response("Missing X-Signature header", { status: 401 }));
	}

	const name = decodeURIComponent(putMatch[1]);
	const stub = env.CLUSTER_STATUS.getByName(name);
	const body = await request.arrayBuffer();
	if (body.byteLength === 0) {
		return withCors(new Response("Request body is empty", { status: 400 }));
	}

	const expected = await hmacSha256Hex(signingEnv.SLURM_DASHBOARD_SIGNING_KEY, body);
	const receivedSig = signature.trim().toLowerCase();
	console.log(`Signature verification: received='${receivedSig}' expected='${expected}'`);
	if (!timingSafeEqual(receivedSig, expected)) {
		return withCors(new Response(`Invalid signature`, { status: 401 }));
	}

	await stub.set_status(body);
	return withCors(new Response("Ok", { status: 200 }));
}

export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === "OPTIONS") {
			return withCors(new Response(null, { status: 204 }));
		}

		const url = new URL(request.url);
		const path = url.pathname;
		const getMatch = path.match(/^\/get\/([^/]+)\/?$/);
		const putMatch = path.match(/^\/put\/([^/]+)\/?$/);

		if (getMatch) {
			return await handleGet(request, env, getMatch);
		}

		if (putMatch) {
			return await handlePut(request, env, putMatch);
		}

		return withCors(new Response("Not Found", { status: 404 }));
	},
} satisfies ExportedHandler<Env>;
