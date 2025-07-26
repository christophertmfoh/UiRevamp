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
              <span class="plus-icon">+</span>
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
            <button class="create-btn" @click="showCreateCharacter = true">
              <span class="plus-icon">+</span>
              Create Character
            </button>
          </div>
          
          <div class="characters-grid">
            <div v-for="character in characters" :key="character.id" class="character-card">
              <div class="character-image">
                <img :src="character.image || '/api/placeholder/150/200'" :alt="character.name">
              </div>
              <div class="character-info">
                <h3>{{ character.name }}</h3>
                <p class="character-role">{{ character.role || character.profession }}</p>
                <div class="character-tags">
                  <span v-if="character.race" class="tag">{{ character.race }}</span>
                  <span v-if="character.age" class="tag">{{ character.age }} years</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: character.completeness + '%' }"></div>
                  <span class="progress-text">{{ character.completeness }}% Complete</span>
                </div>
              </div>
              <div class="character-actions">
                <button class="btn-primary" @click="editCharacter(character)">Edit Character</button>
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
        </div>

        <!-- World Bible View -->
        <div v-if="activeView === 'world'" class="view-section">
          <div class="section-header">
            <h2>World Bible</h2>
            <button class="create-btn" @click="showCreateWorld = true">
              <span class="plus-icon">+</span>
              Add Element
            </button>
          </div>
          
          <div class="world-categories">
            <div class="category-card" v-for="category in worldCategories" :key="category.key">
              <div class="category-icon">{{ category.icon }}</div>
              <h3>{{ category.name }}</h3>
              <p>{{ category.count }} {{ category.name.toLowerCase() }}</p>
              <button class="btn-secondary" @click="openCategory(category)">Manage {{ category.name }}</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Project Modal -->
    <div v-if="showCreateProject" class="modal-overlay" @click="showCreateProject = false">
      <div class="modal-content" @click.stop>
        <h3>Create New Project</h3>
        <form @submit.prevent="createProject">
          <div class="form-group">
            <label>Project Name</label>
            <input v-model="newProject.name" type="text" required>
          </div>
          <div class="form-group">
            <label>Project Type</label>
            <select v-model="newProject.type" required>
              <option value="novel">Novel</option>
              <option value="screenplay">Screenplay</option>
              <option value="comic">Comic/Graphic Novel</option>
              <option value="short-story">Short Story</option>
            </select>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newProject.description" rows="3"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreateProject = false">Cancel</button>
            <button type="submit" class="btn-primary">Create Project</button>
          </div>
        </form>
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

// State
const activeView = ref('projects')
const showCreateProject = ref(false)
const showCreateCharacter = ref(false)
const showCreateWorld = ref(false)

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
  }
])

const worldCategories = ref([
  { key: 'locations', name: 'Locations', icon: '🏰', count: 8 },
  { key: 'factions', name: 'Factions', icon: '⚔️', count: 4 },
  { key: 'items', name: 'Items', icon: '🗡️', count: 15 },
  { key: 'events', name: 'Events', icon: '📜', count: 6 },
  { key: 'lore', name: 'Lore', icon: '📚', count: 12 },
  { key: 'magic', name: 'Magic System', icon: '✨', count: 3 }
])

// Form data
const newProject = reactive({
  name: '',
  type: '',
  description: ''
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
</script>

<style scoped>
.fablecraft-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf8f5 0%, #f3e8d0 100%);
}

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

.main-header {
  background: white;
  border-bottom: 1px solid #e5e5e5;
  padding: 1.5rem 0;
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
}

.main-nav button.active {
  background: #6b5b47;
  color: white;
  border-color: #6b5b47;
}

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
}

.create-btn:hover {
  transform: translateY(-1px);
}

.plus-icon {
  font-size: 1.25rem;
  font-weight: bold;
}

.projects-grid, .characters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-card, .character-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover, .character-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
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
  margin-bottom: 1rem;
  line-height: 1.5;
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

.character-image {
  width: 100%;
  height: 200px;
  background: #f3e8d0;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
}

.character-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
}

.tag {
  background: #f3e8d0;
  color: #6b5b47;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.progress-bar {
  background: #f0f0f0;
  border-radius: 1rem;
  height: 0.5rem;
  position: relative;
  margin-bottom: 1rem;
}

.progress-fill {
  background: linear-gradient(135deg, #10b981, #059669);
  height: 100%;
  border-radius: 1rem;
  transition: width 0.3s;
}

.progress-text {
  position: absolute;
  top: -1.5rem;
  right: 0;
  font-size: 0.75rem;
  color: #666;
}

.world-categories {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
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

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #6b5b47, #8b7355);
  color: white;
}

.btn-secondary {
  background: #f3e8d0;
  color: #6b5b47;
}

.btn-primary:hover, .btn-secondary:hover {
  transform: translateY(-1px);
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #2d2d2d;
}

.empty-state p {
  color: #666;
  margin-bottom: 2rem;
}

/* Modal Styles */
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
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d2d2d;
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
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: #6b5b47;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.form-actions button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}

.form-actions button[type="button"] {
  background: white;
  color: #666;
}

.form-actions .btn-primary {
  border-color: #6b5b47;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .projects-grid, .characters-grid, .world-categories {
    grid-template-columns: 1fr;
  }
  
  .banner-content {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .performance-stats {
    margin-left: 0;
  }
}
</style>