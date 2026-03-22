from dataclasses import dataclass, field
from typing import List, Optional
from dataclasses_json import dataclass_json

@dataclass
class ResourceUsage:
    alloc: int
    total: int
    type: Optional[str] = None  # Specifically for GPU objects (e.g. "V100", "A100", etc.)

@dataclass
class JobInfo:
    id: str
    user: str
    name: str
    status: str
    partition: str
    cores: int
    gpus: int
    mem: int
    node: Optional[str] = None
    time: Optional[str] = None

@dataclass
class Node:
    id: str
    state: str
    partition: str
    cpu: ResourceUsage
    gpu: ResourceUsage
    mem: ResourceUsage
    jobs: List[JobInfo]

@dataclass_json
@dataclass
class ClusterStatus:
    nodes: List[Node]
    partitions: List[str]
    jobs: List[JobInfo]