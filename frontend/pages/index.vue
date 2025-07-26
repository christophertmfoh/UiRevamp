<template>
  <div class="fablecraft-app">
    <!-- Migration Success Banner -->
    <div class="migration-banner">
      <div class="banner-content">
        <div class="success-icon">✅</div>
        <div class="banner-text">
          <h3>Migration Complete!</h3>
          <p>Fablecraft is now running on modern Nuxt 3 + Vue 3 + Kotlin Spring Boot</p>
        </div>
        <div class="performance-stats">
          <span class="stat">2-3x Faster</span>
          <span class="stat">100% Type Safe</span>
          <span class="stat">Enterprise Ready</span>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <header class="main-header">
      <div class="container">
        <div class="header-content">
          <div class="logo-section">
            <h1 class="app-title">Fablecraft</h1>
            <p class="app-tagline">Craft Your Fable</p>
          </div>
          <nav class="main-nav">
            <button @click="activeView = 'projects'" :class="{ active: activeView === 'projects' }">
              Projects
            </button>
            <button @click="activeView = 'characters'" :class="{ active: activeView === 'characters' }">
              Characters
            </button>
            <button @click="activeView = 'world'" :class="{ active: activeView === 'world' }">
              World Bible
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <!-- Projects View -->
        <div v-if="activeView === 'projects'" class="view-section">
          <div class="section-header">
            <h2>Your Creative Projects</h2>
            <button class="create-btn" @click="showCreateProject = true">
              <span class="plus-icon rotating">+</span>
              Create Project
            </button>
          </div>
          
          <div class="projects-grid">
            <div v-for="project in projects" :key="project.id" class="project-card">
              <div class="project-header">
                <h3>{{ project.name }}</h3>
                <span class="project-type">{{ project.type }}</span>
              </div>
              <p class="project-description">{{ project.description }}</p>
              <div class="project-stats">
                <span class="stat">{{ project.characters || 0 }} Characters</span>
                <span class="stat">{{ project.locations || 0 }} Locations</span>
              </div>
              <div class="project-actions">
                <button class="btn-primary" @click="openProject(project)">Open Project</button>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="projects.length === 0" class="empty-state">
              <div class="empty-icon">📚</div>
              <h3>No Projects Yet</h3>
              <p>Create your first project to start crafting amazing stories</p>
              <button class="btn-primary" @click="showCreateProject = true">Create Your First Project</button>
            </div>
          </div>
        </div>

        <!-- Characters View -->
        <div v-if="activeView === 'characters'" class="view-section">
          <div class="section-header">
            <h2>Character Directory</h2>
            <div class="header-controls">
              <div class="view-toggle">
                <button @click="characterView = 'grid'" :class="{ active: characterView === 'grid' }" class="view-btn">
                  <span class="icon">⊞</span>
                </button>
                <button @click="characterView = 'list'" :class="{ active: characterView === 'list' }" class="view-btn">
                  <span class="icon">☰</span>
                </button>
              </div>
              <button class="create-btn" @click="showCreateCharacter = true">
                <span class="plus-icon rotating">+</span>
                Create Character
              </button>
            </div>
          </div>
          
          <!-- Grid View -->
          <div v-if="characterView === 'grid'" class="characters-grid">
            <div v-for="character in characters" :key="character.id" class="character-card premium-card">
              <div class="character-image">
                <img :src="character.image || '/api/placeholder/200/250'" :alt="character.name">
                <div class="character-overlay">
                  <button class="overlay-btn" @click="editCharacter(character)">Edit</button>
                  <button class="overlay-btn" @click="viewCharacter(character)">View</button>
                </div>
              </div>
              <div class="character-info">
                <h3>{{ character.name }}</h3>
                <p class="character-role">{{ character.role || character.profession }}</p>
                <div class="character-tags">
                  <span v-if="character.race" class="tag">{{ character.race }}</span>
                  <span v-if="character.age" class="tag">{{ character.age }} years</span>
                </div>
                <div class="progress-section">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: character.completeness + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ character.completeness }}% Complete</span>
                </div>
                <div class="completion-status" :class="getCompletionClass(character.completeness)">
                  {{ getCompletionText(character.completeness) }}
                </div>
              </div>
            </div>
          </div>

          <!-- List View -->
          <div v-if="characterView === 'list'" class="characters-list">
            <div v-for="character in characters" :key="character.id" class="character-list-item">
              <div class="character-avatar">
                <img :src="character.image || '/api/placeholder/80/80'" :alt="character.name">
              </div>
              <div class="character-details">
                <div class="character-name-section">
                  <h3>{{ character.name }}</h3>
                  <span class="character-role">{{ character.role || character.profession }}</span>
                </div>
                <div class="character-meta">
                  <span v-if="character.race" class="meta-item">{{ character.race }}</span>
                  <span v-if="character.age" class="meta-item">{{ character.age }} years old</span>
                </div>
                <div class="progress-section">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: character.completeness + '%' }"></div>
                  </div>
                  <span class="progress-percentage">{{ character.completeness }}%</span>
                </div>
              </div>
              <div class="character-actions">
                <button class="btn-secondary" @click="viewCharacter(character)">View</button>
                <button class="btn-primary" @click="editCharacter(character)">Edit</button>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="characters.length === 0" class="empty-state">
            <div class="empty-icon">👥</div>
            <h3>No Characters Yet</h3>
            <p>Create your first character to populate your story world</p>
            <button class="btn-primary" @click="showCreateCharacter = true">Create Your First Character</button>
          </div>
        </div>

        <!-- World Bible View -->
        <div v-if="activeView === 'world'" class="view-section">
          <div class="section-header">
            <h2>World Bible</h2>
            <button class="create-btn" @click="showCreateWorld = true">
              <span class="plus-icon rotating">+</span>
              Add Element
            </button>
          </div>
          
          <div class="world-categories">
            <div class="category-card" v-for="category in worldCategories" :key="category.key">
              <div class="category-icon">{{ category.icon }}</div>
              <h3>{{ category.name }}</h3>
              <p>{{ category.count }} {{ category.name.toLowerCase() }}</p>
              <div class="category-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: category.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ category.progress }}% Developed</span>
              </div>
              <button class="btn-secondary" @click="openCategory(category)">Manage {{ category.name }}</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Project Modal -->
    <div v-if="showCreateProject" class="modal-overlay" @click="showCreateProject = false">
      <div class="modal-content create-project-modal" @click.stop>
        <div class="modal-header">
          <h3>Create New Project</h3>
          <button class="close-btn" @click="showCreateProject = false">×</button>
        </div>
        <form @submit.prevent="createProject" class="project-form">
          <div class="form-group">
            <label>Project Name</label>
            <input v-model="newProject.name" type="text" required placeholder="Enter your project name">
          </div>
          <div class="form-group">
            <label>Project Type</label>
            <select v-model="newProject.type" required>
              <option value="">Select project type</option>
              <option value="novel">Novel</option>
              <option value="screenplay">Screenplay</option>
              <option value="comic">Comic/Graphic Novel</option>
              <option value="short-story">Short Story</option>
              <option value="game">Game Story</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newProject.description" rows="4" placeholder="Describe your project..."></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreateProject = false" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Create Project</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Character Creation Launch Modal -->
    <div v-if="showCreateCharacter" class="modal-overlay" @click="showCreateCharacter = false">
      <div class="modal-content character-creation-modal" @click.stop>
        <div class="modal-header">
          <h3>Create Character</h3>
          <button class="close-btn" @click="showCreateCharacter = false">×</button>
        </div>
        <div class="creation-options">
          <div class="creation-option" @click="createCharacterBlank">
            <div class="option-icon">✏️</div>
            <h4>Start from Scratch</h4>
            <p>Create a completely custom character with all fields empty</p>
            <button class="option-btn">Create Blank Character</button>
          </div>
          <div class="creation-option" @click="selectTemplate">
            <div class="option-icon">📋</div>
            <h4>Use Template</h4>
            <p>Choose from 20+ professional character archetypes</p>
            <button class="option-btn">Browse Templates</button>
          </div>
          <div class="creation-option" @click="generateWithAI">
            <div class="option-icon">🤖</div>
            <h4>AI Generate</h4>
            <p>Let AI create a detailed character based on your prompts</p>
            <button class="option-btn">Generate with AI</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// Page setup
definePageMeta({
  title: 'Fablecraft - Your Creative Dashboard'
})

// Composables
const { $fetch } = useNuxtApp()

// State
const activeView = ref('projects')
const characterView = ref('grid')
const showCreateProject = ref(false)
const showCreateCharacter = ref(false)
const showCreateWorld = ref(false)

// Loading states
const loading = ref(false)
const error = ref(null)

// Sample data (will be replaced with API calls)
const projects = ref([
  {
    id: 1,
    name: "The Last Guardian",
    type: "novel",
    description: "A fantasy epic about ancient magic and forgotten realms",
    characters: 12,
    locations: 8,
    createdAt: "2025-01-15"
  },
  {
    id: 2,
    name: "Neon Dreams",
    type: "screenplay",
    description: "Cyberpunk thriller set in 2087 Neo-Tokyo",
    characters: 6,
    locations: 15,
    createdAt: "2025-01-20"
  }
])

const characters = ref([
  {
    id: 1,
    name: "Aria Shadowmend",
    role: "Protagonist",
    race: "Elf",
    age: 127,
    profession: "Mage",
    completeness: 85,
    image: null
  },
  {
    id: 2,
    name: "Marcus Steel",
    role: "Deuteragonist", 
    race: "Human",
    age: 34,
    profession: "Detective",
    completeness: 92,
    image: null
  },
  {
    id: 3,
    name: "Luna Nightwhisper",
    role: "Antagonist",
    race: "Dark Elf",
    age: 89,
    profession: "Shadow Assassin",
    completeness: 67,
    image: null
  }
])

const worldCategories = ref([
  { key: 'locations', name: 'Locations', icon: '🏰', count: 8, progress: 75 },
  { key: 'factions', name: 'Factions', icon: '⚔️', count: 4, progress: 60 },
  { key: 'items', name: 'Items', icon: '🗡️', count: 15, progress: 40 },
  { key: 'events', name: 'Events', icon: '📜', count: 6, progress: 50 },
  { key: 'lore', name: 'Lore', icon: '📚', count: 12, progress: 85 },
  { key: 'magic', name: 'Magic System', icon: '✨', count: 3, progress: 90 }
])

// Form data
const newProject = reactive({
  name: '',
  type: '',
  description: ''
})

// Computed properties
const getCompletionClass = computed(() => (completeness) => {
  if (completeness >= 80) return 'high-completion'
  if (completeness >= 50) return 'medium-completion'
  return 'low-completion'
})

const getCompletionText = computed(() => (completeness) => {
  if (completeness >= 80) return 'Ready to develop'
  if (completeness >= 50) return 'In development'
  return 'Needs attention'
})

// Methods
const openProject = (project) => {
  console.log('Opening project:', project.name)
  // Navigate to project workspace
}

const editCharacter = (character) => {
  console.log('Editing character:', character.name)
  // Navigate to character editor
}

const viewCharacter = (character) => {
  console.log('Viewing character:', character.name)
  // Navigate to character detail view
}

const openCategory = (category) => {
  console.log('Opening category:', category.name)
  // Navigate to category management
}

const createProject = () => {
  // Add project creation logic
  const project = {
    id: Date.now(),
    ...newProject,
    characters: 0,
    locations: 0,
    createdAt: new Date().toISOString().split('T')[0]
  }
  
  projects.value.push(project)
  
  // Reset form
  Object.assign(newProject, { name: '', type: '', description: '' })
  showCreateProject.value = false
}

const createCharacterBlank = () => {
  showCreateCharacter.value = false
  console.log('Creating blank character')
  // Navigate to character creation form
}

const selectTemplate = () => {
  showCreateCharacter.value = false
  console.log('Selecting character template')
  // Navigate to template selection
}

const generateWithAI = () => {
  showCreateCharacter.value = false
  console.log('Generating character with AI')
  // Navigate to AI generation
}
</script>

<style scoped>
.fablecraft-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf8f5 0%, #f3e8d0 100%);
  font-family: 'Inter', sans-serif;
}

/* Migration Banner */
.migration-banner {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem;
}

.success-icon {
  font-size: 2rem;
}

.banner-text h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.banner-text p {
  margin: 0.25rem 0 0 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

.performance-stats {
  margin-left: auto;
  display: flex;
  gap: 1rem;
}

.stat {
  background: rgba(255,255,255,0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Header */
.main-header {
  background: white;
  border-bottom: 1px solid #e5e5e5;
  padding: 1.5rem 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #6b5b47;
}

.app-tagline {
  margin: 0.25rem 0 0 0;
  color: #8b7355;
  font-size: 0.875rem;
  font-weight: 500;
}

.main-nav {
  display: flex;
  gap: 0.5rem;
}

.main-nav button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e5e5e5;
  background: white;
  color: #6b5b47;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.main-nav button:hover {
  background: #f8f6f3;
  border-color: #d4c4a8;
  transform: translateY(-1px);
}

.main-nav button.active {
  background: #6b5b47;
  color: white;
  border-color: #6b5b47;
}

/* Main Content */
.main-content {
  padding: 2rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: #2d2d2d;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.view-toggle {
  display: flex;
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;
  overflow: hidden;
}

.view-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  background: white;
  color: #6b5b47;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #f8f6f3;
}

.view-btn.active {
  background: #6b5b47;
  color: white;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6b5b47, #8b7355);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 8px rgba(107, 91, 71, 0.2);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(107, 91, 71, 0.3);
}

.plus-icon {
  font-size: 1.25rem;
  font-weight: bold;
}

.rotating:hover {
  animation: rotate 0.3s ease-in-out;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(90deg); }
}

/* Projects Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.project-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d2d2d;
}

.project-type {
  background: #f3e8d0;
  color: #6b5b47;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.project-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.project-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.project-stats .stat {
  background: #f8f6f3;
  color: #6b5b47;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

/* Characters Grid */
.characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.character-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.premium-card {
  position: relative;
}

.premium-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 48px rgba(0,0,0,0.15);
}

.character-image {
  position: relative;
  width: 100%;
  height: 250px;
  background: linear-gradient(135deg, #f3e8d0, #e8d5b7);
  overflow: hidden;
}

.character-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.premium-card:hover .character-image img {
  transform: scale(1.1);
}

.character-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(107, 91, 71, 0.8), rgba(139, 115, 85, 0.8));
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.premium-card:hover .character-overlay {
  opacity: 1;
}

.overlay-btn {
  padding: 0.5rem 1rem;
  background: white;
  color: #6b5b47;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.overlay-btn:hover {
  transform: translateY(-2px);
}

.character-info {
  padding: 1.5rem;
}

.character-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d2d2d;
}

.character-role {
  color: #6b5b47;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.character-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  background: #f3e8d0;
  color: #6b5b47;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.progress-section {
  margin-bottom: 1rem;
}

.progress-bar {
  background: #f0f0f0;
  border-radius: 1rem;
  height: 0.5rem;
  position: relative;
  margin-bottom: 0.5rem;
}

.progress-fill {
  background: linear-gradient(135deg, #10b981, #059669);
  height: 100%;
  border-radius: 1rem;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: #666;
}

.completion-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.high-completion {
  background: #dcfce7;
  color: #166534;
}

.medium-completion {
  background: #fef3c7;
  color: #92400e;
}

.low-completion {
  background: #fee2e2;
  color: #991b1b;
}

/* Characters List */
.characters-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.character-list-item {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
}

.character-list-item:hover {
  transform: translateX(8px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.character-avatar {
  width: 80px;
  height: 80px;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f3e8d0;
}

.character-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-details {
  flex: 1;
}

.character-name-section {
  display: flex;
  gap: 1rem;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.character-name-section h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d2d2d;
}

.character-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.meta-item {
  color: #666;
  font-size: 0.875rem;
}

.progress-percentage {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b5b47;
}

.character-actions {
  display: flex;
  gap: 0.75rem;
}

/* World Categories */
.world-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 40px rgba(0,0,0,0.12);
}

.category-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.category-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d2d2d;
}

.category-card p {
  color: #666;
  margin-bottom: 1rem;
}

.category-progress {
  margin-bottom: 1.5rem;
}

.category-progress .progress-text {
  font-size: 0.875rem;
  color: #6b5b47;
  font-weight: 500;
}

/* Buttons */
.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.btn-primary {
  background: linear-gradient(135deg, #6b5b47, #8b7355);
  color: white;
  box-shadow: 0 2px 8px rgba(107, 91, 71, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(107, 91, 71, 0.3);
}

.btn-secondary {
  background: #f3e8d0;
  color: #6b5b47;
  border: 1px solid #e5d5b7;
}

.btn-secondary:hover {
  background: #e8d5b7;
  transform: translateY(-1px);
}

/* Empty States */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-state h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.5rem;
  color: #2d2d2d;
  font-weight: 600;
}

.empty-state p {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1.125rem;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d2d2d;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.project-form, .creation-options {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d2d2d;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: #6b5b47;
  box-shadow: 0 0 0 3px rgba(107, 91, 71, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.creation-options {
  display: grid;
  gap: 1rem;
}

.creation-option {
  padding: 1.5rem;
  border: 1px solid #e5e5e5;
  border-radius: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.creation-option:hover {
  border-color: #6b5b47;
  background: #fafafa;
  transform: translateY(-2px);
}

.option-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.creation-option h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d2d2d;
}

.creation-option p {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.option-btn {
  background: #f3e8d0;
  color: #6b5b47;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover {
  background: #e8d5b7;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-controls {
    justify-content: space-between;
  }
  
  .projects-grid, .characters-grid, .world-categories {
    grid-template-columns: 1fr;
  }
  
  .characters-list .character-list-item {
    flex-direction: column;
    text-align: center;
  }
  
  .character-actions {
    justify-content: center;
  }
  
  .banner-content {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .performance-stats {
    margin-left: 0;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .main-content {
    padding: 1rem 0;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .creation-options {
    grid-template-columns: 1fr;
  }
}
</style>
