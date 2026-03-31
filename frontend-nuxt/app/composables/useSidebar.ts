export const useSidebar = () => {
  const activeSidebarNode = useState<any>('sidebar_node', () => null)
  const isSidebarOpen = useState<boolean>('sidebar_open', () => false)

  const activeSidebarUser = useState<string | null>('sidebar_user', () => null)
  const isUserSidebarOpen = useState<boolean>('sidebar_user_open', () => false)

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

  const openUserSidebar = (username: string) => {
    activeSidebarUser.value = username
    isUserSidebarOpen.value = true
  }

  const closeUserSidebar = () => {
    isUserSidebarOpen.value = false
    setTimeout(() => {
      activeSidebarUser.value = null
    }, 300)
  }

  return {
    activeSidebarNode,
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    activeSidebarUser,
    isUserSidebarOpen,
    openUserSidebar,
    closeUserSidebar
  }
}
