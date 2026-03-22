# SLURM Data Gatherer

This component is responsible for querying the SLURM controller to extract current cluster metrics (like active jobs, node statuses, and utilization) and transmitting them securely to the Cloudflare Worker backend.

## Deployment

**This tool should be configured to run as a cronjob on your SLURM cluster.** 
Scheduling it to run periodically (e.g., once every minute) ensures that the frontend dashboard always reflects near real-time data.

## Security Notice

The gatherer communicates directly with your deployed Cloudflare Worker API. 
**The signing secret must be kept highly secure to prevent unauthorized actors from publishing fabricated results to your backend.** This secret is required for authentication and **must exactly match** the one defined in the Cloudflare Worker secrets.
