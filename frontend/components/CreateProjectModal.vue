<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
    <div 
      class="bg-background border border-border rounded-lg shadow-lg w-full max-w-md"
      @click.stop
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-border">
        <h2 class="text-lg font-semibold">Create New Project</h2>
        <button 
          @click="closeModal"
          class="p-1 hover:bg-muted rounded"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 space-y-4">
        <!-- Project Name -->
        <div>
          <label class="text-sm font-medium mb-2 block">Project Name</label>
          <input 
            v-model="form.name"
            type="text"
            placeholder="Enter project name"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <!-- Project Type -->
        <div>
          <label class="text-sm font-medium mb-2 block">Project Type</label>
          <select 
            v-model="form.type"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select type</option>
            <option value="novel">Novel</option>
            <option value="screenplay">Screenplay</option>
            <option value="comic">Comic</option>
            <option value="short-story">Short Story</option>
            <option value="game">Game</option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- Description -->
        <div>
          <label class="text-sm font-medium mb-2 block">Description (Optional)</label>
          <textarea 
            v-model="form.description"
            placeholder="Describe your project"
            rows="3"
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          ></textarea>
        </div>

        <!-- Genre Tags -->
        <div>
          <label class="text-sm font-medium mb-2 block">Genre (Optional)</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span 
              v-for="genre in form.genre" 
              :key="genre"
              class="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
            >
              {{ genre }}
              <button 
                @click="removeGenre(genre)"
                class="ml-1 hover:text-destructive"
              >
                <X class="w-3 h-3" />
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input 
              v-model="newGenre"
              type="text"
              placeholder="Add genre tag"
              @keyup.enter="addGenre"
              class="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <button 
              @click="addGenre"
              class="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end space-x-2 p-6 border-t border-border">
        <button 
          @click="closeModal"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
        >
          Cancel
        </button>
        <button 
          @click="createProject"
          :disabled="!form.name || !form.type || loading"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
        >
          <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Create Project
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { useProjectsStore } from '~/stores/projects'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'created': [project: any]
}>()

const projectsStore = useProjectsStore()
const loading = ref(false)

const form = ref({
  name: '',
  type: '',
  description: '',
  genre: [] as string[]
})

const newGenre = ref('')

const addGenre = () => {
  if (newGenre.value.trim() && !form.value.genre.includes(newGenre.value.trim())) {
    form.value.genre.push(newGenre.value.trim())
    newGenre.value = ''
  }
}

const removeGenre = (genre: string) => {
  form.value.genre = form.value.genre.filter(g => g !== genre)
}

const createProject = async () => {
  if (!form.value.name || !form.value.type) return
  
  loading.value = true
  try {
    const project = await projectsStore.createProject({
      name: form.value.name,
      type: form.value.type,
      description: form.value.description,
      genre: form.value.genre
    })
    
    emit('created', project)
    closeModal()
  } catch (error) {
    console.error('Failed to create project:', error)
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  emit('update:open', false)
  // Reset form
  form.value = {
    name: '',
    type: '',
    description: '',
    genre: []
  }
  newGenre.value = ''
}

// Close modal on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal()
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>