import subprocess
import json
from data_struct import *
import re
from typing import List

def get_job_gpus(j: dict) -> int:
    # First check total allocated/requested TRES
    for field in ['tres_alloc_str', 'tres_req_str', 'tres_per_job']:
        val = j.get(field, "")
        if val and isinstance(val, str) and 'gpu' in val.lower():
            match = re.search(r'gpu[^\d,]*[:=](\d+)', val.lower())
            if match:
                return int(match.group(1))
                
    # Fallback to per-node TRES and multiply by node count
    val = j.get('tres_per_node', "")
    if val and isinstance(val, str) and 'gpu' in val.lower():
        match = re.search(r'gpu[^\d,]*[:=](\d+)', val.lower())
        if match:
            gpus_per_node = int(match.group(1))
            node_count = 1
            if 'node_count' in j:
                if isinstance(j['node_count'], dict) and 'number' in j['node_count']:
                    node_count = j['node_count']['number']
                elif isinstance(j['node_count'], int):
                    node_count = j['node_count']
            return gpus_per_node * node_count
            
    return 0

def get_all_jobs() -> List[JobInfo]:
    # Execute squeue with JSON output
    result = subprocess.run(['squeue', '--all', '--json'], capture_output=True, text=True)
    data = json.loads(result.stdout)
    
    jobs = []
    for j in data.get('jobs', []):
        jobs.append(JobInfo(
            id=str(j['job_id']),
            user=j['user_name'],
            name=j['name'],
            status=j['job_state'],
            partition=j['partition'],
            cores=j['cpus']['number'],
            gpus=get_job_gpus(j),
            mem=j['memory_per_node']['number'] if j.get('memory_per_node') else 0,
            node=j.get('nodes'),
            time=j['time_limit']['number']
        ))
    return jobs

def parse_gres(gres_str: str):
    """Parses GRES string like 'gpu:quadro_rtx_6000:2' into type and count."""
    if not gres_str or "gpu" not in gres_str:
        return None, 0
    # Matches 'gpu', then an optional type, then a count
    match = re.search(r"gpu:?([\w_]+)?:(\d+)", gres_str)
    if match:
        gpu_type = match.group(1)
        gpu_count = int(match.group(2))
        return gpu_type, gpu_count
    return None, 0

def get_nodes() -> List[Node]:
    # use scontrol so we have individual node granularity
    result = subprocess.run(['scontrol', 'show', 'nodes', '--json'], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error fetching nodes: {result.stderr}")
        return []
        
    data = json.loads(result.stdout)
    nodes = []

    for n in data.get('nodes', []):
        cpu_usage = ResourceUsage(
            alloc=n.get('alloc_cpus', 0),
            total=n.get('cpus', 0)
        )

        mem_usage = ResourceUsage(
            alloc=n.get('alloc_memory', 0),
            total=n.get('real_memory', 0)
        )

        gpu_type, gpu_total = parse_gres(n.get('gres', ""))
        _, gpu_alloc = parse_gres(n.get('gres_used', ""))
        
        gpu_usage = ResourceUsage(
            alloc=gpu_alloc,
            total=gpu_total,
            type=gpu_type
        )

        nodes.append(Node(
            id=n['name'],
            state=n.get('state', ['UNKNOWN'])[0],
            partition=n.get('partitions', ["unknown"])[0], 
            cpu=cpu_usage,
            gpu=gpu_usage,
            mem=mem_usage,
            jobs=[]  # Will be filled later by cross-referencing with jobs
        ))

    return nodes

def get_partition_names() -> List[str]:
    data = json.loads(subprocess.run(['sinfo', '--all', '--json'], capture_output=True, text=True).stdout)
    
    # In the JSON, partition name is nested under entry['partition']['name']
    partitions = {entry['partition']['name'] for entry in data.get('sinfo', [])}
    return list(partitions)
