export const useSidebar = () => {
  const activeSidebarNode = useState<any>('sidebar_node', () => null)
  const isSidebarOpen = useState<boolean>('sidebar_open', () => false)

  const openSidebar = (node: any) => {
    activeSidebarNode.value = node
    isSidebarOpen.value = true
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
    setTimeout(() => {
      activeSidebarNode.value = null
    }, 300) // Clear after animation
  }

  return {
    activeSidebarNode,
    isSidebarOpen,
    openSidebar,
    closeSidebar
  }
}
