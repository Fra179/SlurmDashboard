# SLURM Dashboard Frontend

This represents the user interface of the SLURM Dashboard. Built with Nuxt 3 and Tailwind CSS, it provides a clean, responsive, and dynamic visualization of your monitored SLURM clusters.

## Pre-Hosted Version

If you prefer to immediately start tracking your clusters without bothering to host the frontend yourself, **a pre-hosted solution is available.**

👉 **[slurm.francescodb.me](https://slurm.francescodb.me)**

You can simply visit this link, navigate to the Settings panel, and add your Cloudflare Worker URL. Your data stays entirely in the browser and connects directly to your worker.

## Local Hosting & Development

If you wish to modify the dashboard or self-host it, follow these steps:

1. Install dependencies using your preferred Node package manager (e.g., `bun install`).
2. Run the hot-reloading development server using `bun run dev`.
3. To deploy it as a Single Page Application (SPA) on services like GitHub Pages, Vercel, or Netlify, simply execute `bun run generate` to produce static files in the `.output/public` directory.
