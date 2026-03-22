# Cloudflare Worker Backend

This is the serverless backend component that acts as the bridge between the SLURM cluster's `data-gatherer` and the user-facing frontend dashboard.

## Functionality

It receives JSON data payloads from the gatherer cronjob, securely validates them, and serves the aggregated cluster state back to the frontend via API endpoints. It utilizes Cloudflare's global edge network for low-latency distribution.

## Configuration & Security Key

**Important Security Notice:** This worker exposes endpoints that accept cluster data. To prevent malicious or accidental data overwriting, requests are authenticated using an encryption key.

1. Ensure that the encryption key is securely stored in your Cloudflare Worker Secrets (`wrangler secret put`).
2. **This key must be exactly identical to the secret defined in the `data-gatherer` environment.** If they do not match, the worker will silently drop the incoming data payloads.
