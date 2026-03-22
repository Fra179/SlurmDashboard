<template>
  <div v-if="isOpen" class="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 transition-opacity duration-300" @click.self="$emit('close')">
    <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 transform transition-all duration-300 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850 rounded-t-xl">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon class="w-5 h-5" /> Settings
        </h2>
        <button @click="$emit('close')" class="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-lg p-1 hover:bg-slate-200 dark:hover:bg-slate-800">
          <XIcon class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Body -->
      <div class="p-6 overflow-y-auto space-y-8 flex-1">
        <!-- Theme -->
        <div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">Appearance</h3>
          <div class="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950/50">
            <div>
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300 block">Dark Mode</span>
              <span class="text-xs text-slate-500 dark:text-slate-400">Toggle dark theme interface</span>
            </div>
            <button @click="toggleDark()" class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900" :class="isDark ? 'bg-blue-600' : 'bg-slate-300'">
              <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm" :class="isDark ? 'translate-x-6' : 'translate-x-1'"></span>
            </button>
          </div>
        </div>

        <!-- Clusters -->
        <div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">Backend Clusters</h3>
          <div class="space-y-4">
            <ul class="space-y-2">
              <li v-if="clusters.length === 0" class="text-center p-4 text-sm text-slate-500 dark:text-slate-400">No clusters configured. Add one below.</li>
              <li v-for="c in clusters" :key="c.id" class="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="overflow-hidden pr-3">
                  <div class="text-sm font-medium text-slate-900 dark:text-white truncate flex items-center">
                    {{ c.name }}
                    <span v-if="activeClusterId === c.id" class="text-[10px] bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ml-2">Active</span>
                  </div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{{ c.url }}</div>
                </div>
                <div class="flex items-center gap-1">
                  <button @click="handleShareCluster(c)" class="p-1.5 shrink-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Share Cluster">
                    <CheckIcon v-if="copiedId === c.id" class="w-4 h-4 text-green-500" />
                    <Share2Icon v-else class="w-4 h-4" />
                  </button>
                  <button v-if="activeClusterId !== c.id" @click="removeCluster(c.id)" class="p-1.5 shrink-0 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Remove Cluster">
                    <Trash2Icon class="w-4 h-4" />
                  </button>
                  <div v-else class="w-7 shrink-0"></div>
                </div>
              </li>
            </ul>
            
            <div class="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950/50">
              <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Add New Cluster</h4>
              <form @submit.prevent="handleAddCluster" class="space-y-3">
                <div>
                  <input v-model="newName" type="text" placeholder="Cluster Nickname (e.g. GPU Cluster)" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition-shadow">
                </div>
                <div>
                  <input v-model="newUrl" type="text" placeholder="API URL (e.g. https://api.cluster.local)" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none transition-shadow">
                </div>
                <p v-if="error" class="text-xs text-red-500 m-0">Please fill in both fields.</p>
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <PlusIcon class="w-4 h-4" /> Add Cluster
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SettingsIcon, XIcon, PlusIcon, Trash2Icon, Share2Icon, CheckIcon } from 'lucide-vue-next'

defineProps<{ isOpen: boolean }>()
defineEmits(['close'])

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { clusters, activeClusterId, addCluster, removeCluster } = useClusters()

const newName = ref('')
const newUrl = ref('')
const error = ref(false)

const { copy } = useClipboard()
const copiedId = ref<string | null>(null)

const handleShareCluster = (c: { id: string, name: string, url: string }) => {
  const url = new URL(window.location.origin)
  url.pathname = '/add'
  url.searchParams.set('name', c.name)
  url.searchParams.set('url', c.url)
  copy(url.toString())
  
  copiedId.value = c.id
  setTimeout(() => { copiedId.value = null }, 2000)
}

const handleAddCluster = () => {
  if (!newName.value.trim() || !newUrl.value.trim()) {
    error.value = true
    return
  }
  error.value = false
  addCluster(newName.value.trim(), newUrl.value.trim())
  newName.value = ''
  newUrl.value = ''
}
</script>
