from data_struct import *
from parse_data import get_all_jobs, get_nodes, get_partition_names
import json
import hashlib
import requests
import hmac
import os
import re

def expand_nodelist(nodelist: str) -> list[str]:
    """Expands SLURM node list like 'node[123-124],node130' to ['node123', 'node124', 'node130']"""
    if not nodelist: return []
    
    parts = re.findall(r'[^,\[]+(?:\[[^\]]*\])?', nodelist)
    nodes = []
    
    for part in parts:
        match = re.match(r'([^\[]+)(?:\[(.*?)\])?', part)
        if not match:
            continue
        prefix = match.group(1)
        ranges_str = match.group(2)
        
        if not ranges_str:
            nodes.append(prefix)
        else:
            subparts = ranges_str.split(',')
            for sp in subparts:
                if '-' in sp:
                    start, end = sp.split('-', 1)
                    width = len(start)
                    for i in range(int(start), int(end) + 1):
                        nodes.append(f"{prefix}{str(i).zfill(width)}")
                else:
                    nodes.append(f"{prefix}{sp}")
    return nodes

def gather_cluster_status() -> ClusterStatus:
    jobs = get_all_jobs()
    nodes = get_nodes()
    partitions = get_partition_names()
    
    # Cross-reference jobs to nodes
    node_dict = {node.id: node for node in nodes}
    for job in jobs:
        if job.node:
            expanded_nodes = expand_nodelist(job.node)
            for n in expanded_nodes:
                if n in node_dict:
                    node_dict[n].jobs.append(job)
    
    return ClusterStatus(
        nodes=list(node_dict.values()),
        partitions=partitions,
        jobs=jobs
    )

def sign_data(data: str | bytes) -> str:
    if not isinstance(data, (str, bytes)):
        raise TypeError("data must be a string or bytes")

    if isinstance(data, str):
        data_bytes = data.encode("utf-8")
    else:
        data_bytes = data

    signing_key = os.getenv("SLURM_DASHBOARD_SIGNING_KEY")

    # Use HMAC when a key is configured, otherwise return a deterministic digest.
    if signing_key:
        return hmac.new(signing_key.encode("utf-8"), data_bytes, hashlib.sha256).hexdigest()
    return hashlib.sha256(data_bytes).hexdigest()


def push_data(cluster_status: ClusterStatus):
    url = os.getenv("SLURM_DASHBOARD_ENDPOINT_URL")
    if not url:
        print("No endpoint URL configured, skipping data push.")
        return
    
    data_json = cluster_status.to_json()
    if isinstance(data_json, bytes):
        data_json_str = data_json.decode("utf-8")
    else:
        data_json_str = str(data_json)
    
    signature = sign_data(data_json_str)
    
    headers = {
        "Content-Type": "application/json",
        "X-Signature": signature,
        "User-Agent": "SlurmDashboardDataGatherer/1.0 (https://github.com/Fra179/SlurmDashboard)"
    }
    
    try:
        response = requests.post(url, data=data_json_str, headers=headers)
        response.raise_for_status()
        print(f"Data pushed successfully: {response.status_code}")
    except requests.RequestException as e:
        print(f"Failed to push data: {e}")

if __name__ == "__main__":
    cluster_status = gather_cluster_status()
    print(f"Gathered status for {len(cluster_status.nodes)} nodes and {len(cluster_status.jobs)} jobs.")
    push_data(cluster_status)