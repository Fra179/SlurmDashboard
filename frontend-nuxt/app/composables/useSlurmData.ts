export interface SlurmNode {
  id: string;
  state: string;
  partition: string;
  cpu: { total: number; alloc: number };
  mem: { total: number; alloc: number };
  gpu: { total: number; alloc: number; type: string };
  jobs: any[]; // Or detail it more if needed
}

export interface SlurmJob {
  id: string;
  name: string;
  status: string;
  partition: string;
  user: string;
  node: string;
  cores: number;
  mem: number;
  gpus: number;
  time: string;
}

export interface SlurmData {
  nodes: SlurmNode[];
  partitions: string[];
  jobs: SlurmJob[];
}

export const useSlurmData = () => {
  const { activeClusterUrl } = useClusters()

  const lastUpdated = ref<Date | null>(null)

  // Polling fetch via useFetch
  const { data, pending, error, refresh } = useFetch<SlurmData>(() => activeClusterUrl.value as string, {
    key: 'slurm_data',
    immediate: false, // Don't fetch if no URL
    watch: [activeClusterUrl]
  })

  watch(data, (newData) => {
    if (newData) {
      lastUpdated.value = new Date()
    }
  })

  // Start polling
  const { pause, resume } = useIntervalFn(() => {
    if (activeClusterUrl.value) {
      refresh()
    }
  }, 60000, { immediate: true })

  // Trigger manual refresh
  const manualRefresh = () => refresh()

  // Make sure to only fetch if valid active URL is present
  watch(activeClusterUrl, (newUrl) => {
    if (newUrl) {
      refresh()
      resume()
    } else {
      pause()
      data.value = null
    }
  }, { immediate: true })

  // Derived summaries
  const totalNodes = computed(() => data.value?.nodes.length || 0)
  
  const idleNodesCount = computed(() => data.value?.nodes.filter(n => n.state === 'IDLE').length || 0)
  const activeNodesCount = computed(() => data.value?.nodes.filter(n => ['MIXED', 'ALLOCATED'].includes(n.state)).length || 0)
  const offlineNodesCount = computed(() => data.value?.nodes.filter(n => ['DOWN', 'DRAINED', 'DOWN|NOT_RESPONDING'].includes(n.state)).length || 0)
  
  const totalJobsCount = computed(() => data.value?.jobs.length || 0)

  const cpuStats = computed(() => {
    let total = 0, alloc = 0, offline = 0
    data.value?.nodes.forEach(n => {
      total += n.cpu.total
      alloc += n.cpu.alloc
      if (['DOWN', 'DRAINED', 'DOWN|NOT_RESPONDING'].includes(n.state)) {
        offline += n.cpu.total
      }
    })
    const idle = Math.max(0, total - alloc - offline)
    return { 
      total, 
      alloc, 
      offline,
      idle,
      pct: total > 0 ? Math.round((alloc / total) * 100) : 0,
      offlinePct: total > 0 ? Math.round((offline / total) * 100) : 0
    }
  })

  const gpuStats = computed(() => {
    let total = 0, alloc = 0, offline = 0
    data.value?.nodes.forEach(n => {
      total += n.gpu.total
      alloc += n.gpu.alloc
      if (['DOWN', 'DRAINED', 'DOWN|NOT_RESPONDING'].includes(n.state)) {
        offline += n.gpu.total
      }
    })
    const idle = Math.max(0, total - alloc - offline)
    return { 
      total, 
      alloc, 
      offline,
      idle,
      pct: total > 0 ? Math.round((alloc / total) * 100) : 0,
      offlinePct: total > 0 ? Math.round((offline / total) * 100) : 0
    }
  })

  return {
    data,
    pending,
    error,
    manualRefresh,
    totalNodes,
    idleNodesCount,
    activeNodesCount,
    offlineNodesCount,
    totalJobsCount,
    cpuStats,
    gpuStats,
    lastUpdated
  }
}
