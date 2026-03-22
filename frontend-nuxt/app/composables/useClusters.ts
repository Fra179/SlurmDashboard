export const useClusters = () => {
  const clusters = useLocalStorage<{ id: string, name: string, url: string }[]>('slurm_clusters', [])
  const activeClusterId = useLocalStorage<string | null>('slurm_active_cluster', null)

  const activeClusterUrl = computed(() => {
    const cluster = clusters.value.find(c => c.id === activeClusterId.value)
    return cluster ? cluster.url : null
  })

  const addCluster = (name: string, url: string) => {
    const existing = clusters.value.find(c => c.url === url)
    if (existing) {
      return existing.id
    }

    const newId = 'cluster-' + Date.now()
    clusters.value.push({ id: newId, name, url })
    if (!activeClusterId.value) {
      activeClusterId.value = newId
    }
    return newId
  }

  const removeCluster = (id: string) => {
    clusters.value = clusters.value.filter(c => c.id !== id)
    if (activeClusterId.value === id) {
      activeClusterId.value = clusters.value[0]?.id ?? null
    }
  }

  const switchCluster = (id: string) => {
    activeClusterId.value = id
  }

  return {
    clusters,
    activeClusterId,
    activeClusterUrl,
    addCluster,
    removeCluster,
    switchCluster
  }
}
