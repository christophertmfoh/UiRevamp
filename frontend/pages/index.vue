

<template>
  <div class="landing-page">
    <!-- Background Pattern -->
    <div class="background-pattern"></div>
    <div class="radial-gradient"></div>
    
    <!-- Navigation -->
    <nav class="nav-header">
      <div class="nav-brand">
        <div class="brand-icon">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <span class="brand-text">Fablecraft</span>
        <span class="brand-tagline">Craft Your Fable</span>
      </div>
      
      <div class="nav-actions">
        <button @click="showProjects = true" class="projects-btn">
          Your Projects
          <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </nav>

    <!-- Hero Content -->
    <div class="hero-content">
      <div class="hero-container">
        <!-- Hero Badge -->
        <div class="hero-badge">
          <div class="badge-pulse"></div>
          <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span class="badge-text">AI-Powered Creative Writing Studio</span>
        </div>

        <!-- Main Heading -->
        <h1 class="hero-heading">
          The Complete
          <span class="hero-highlight">Your Creative Journey</span>
        </h1>

        <!-- Description -->
        <p class="hero-description">
          Transform fleeting ideas into rich, immersive worlds. From initial brainstorming to
          final production, Fablecraft guides you through every step of the creative journey
          with AI-powered tools and professional storytelling frameworks.
        </p>

        <!-- Loading Animation -->
        <div class="loading-section">
          <div class="loading-bar">
            <div class="loading-fill"></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button @click="createNewProject" class="btn-primary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Start Your Story
          </button>
          
          <button @click="showProjects = true" class="btn-secondary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            Browse Projects
          </button>
        </div>

        <!-- Feature Tags -->
        <div class="feature-tags">
          <span class="feature-tag">Character Development</span>
          <span class="feature-tag">World Building</span>
          <span class="feature-tag">AI Assistance</span>
          <span class="feature-tag">Story Structure</span>
        </div>
      </div>
    </div>

    <!-- Projects Modal -->
    <div v-if="showProjects" class="modal-overlay" @click="showProjects = false">
      <div class="modal-content projects-modal" @click.stop>
        <div class="modal-header">
          <h3>Your Creative Projects</h3>
          <button class="close-btn" @click="showProjects = false">×</button>
        </div>
        
        <div class="projects-content">
          <div class="projects-grid">
            <div v-for="project in projects" :key="project.id" class="project-card">
              <div class="project-icon">📚</div>
              <h4>{{ project.name }}</h4>
              <p>{{ project.description }}</p>
              <span class="project-type">{{ project.type }}</span>
              <button @click="openProject(project)" class="open-project-btn">Open</button>
            </div>
            
            <div class="create-project-card" @click="showCreateProject = true">
              <div class="create-icon">+</div>
              <h4>Create New Project</h4>
              <p>Start a fresh creative project</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Project Modal -->
    <div v-if="showCreateProject" class="modal-overlay" @click="showCreateProject = false">
      <div class="modal-content create-modal" @click.stop>
        <div class="modal-header">
          <h3>Create New Project</h3>
          <button class="close-btn" @click="showCreateProject = false">×</button>
        </div>
        
        <form @submit.prevent="createProject" class="create-form">
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
            </select>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea v-model="newProject.description" rows="3" placeholder="Describe your project..."></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showCreateProject = false" class="btn-cancel">Cancel</button>
            <button type="submit" class="btn-create">Create Project</button>
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

// Composables
const { $fetch } = useNuxtApp()

// State
const showProjects = ref(false)
const showCreateProject = ref(false)
const loading = ref(false)

// Sample projects data
const projects = ref([
  {
    id: 1,
    name: "The Last Guardian",
    type: "Novel",
    description: "A fantasy epic about ancient magic and forgotten realms",
    characters: 12,
    locations: 8,
    createdAt: "2025-01-15"
  },
  {
    id: 2,
    name: "Neon Dreams", 
    type: "Screenplay",
    description: "Cyberpunk thriller set in 2087 Neo-Tokyo",
    characters: 6,
    locations: 15,
    createdAt: "2025-01-20"
  },
  {
    id: 3,
    name: "Mystic Chronicles",
    type: "Comic",
    description: "Visual storytelling with supernatural elements",
    characters: 8,
    locations: 12,
    createdAt: "2025-01-22"
  }
])

// Form data
const newProject = reactive({
  name: '',
  type: '',
  description: ''
})

// Methods
const createNewProject = () => {
  showCreateProject.value = true
}

const openProject = (project) => {
  console.log('Opening project:', project.name)
  showProjects.value = false
  // Navigate to project workspace
}

const createProject = () => {
  if (!newProject.name.trim() || !newProject.type) return
  
  const project = {
    id: Date.now(),
    name: newProject.name,
    type: newProject.type,
    description: newProject.description || 'New creative project',
    characters: 0,
    locations: 0,
    createdAt: new Date().toISOString().split('T')[0]
  }
  
  projects.value.push(project)
  
  // Reset form
  Object.assign(newProject, { name: '', type: '', description: '' })
  showCreateProject.value = false
  showProjects.value = false
  
  console.log('Created project:', project.name)
}
</script>

<style scoped>
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');

.landing-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: #e5e7eb;
}

/* Background */
.background-pattern {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 100%);
  z-index: -2;
}

.radial-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.15) 0%, transparent 50%);
  z-index: -1;
}

/* Navigation */
.nav-header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  font-family: 'Playfair Display', serif;
}

.brand-tagline {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
  margin-left: 0.5rem;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.projects-btn {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 0.5rem;
  color: #a5b4fc;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.projects-btn:hover {
  background: rgba(79, 70, 229, 0.2);
  border-color: rgba(79, 70, 229, 0.5);
  color: #c7d2fe;
  transform: translateY(-1px);
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 100px);
  padding: 2rem;
}

.hero-container {
  text-align: center;
  max-width: 56rem;
  animation: fadeIn 1s ease-out;
}

/* Hero Badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  animation: pulseGlow 2s infinite;
}

.badge-pulse {
  width: 0.5rem;
  height: 0.5rem;
  background: #6366f1;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.badge-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #a5b4fc;
}

/* Hero Heading */
.hero-heading {
  font-size: 3.75rem;
  font-weight: 800;
  line-height: 0.9;
  color: #f1f5f9;
  margin-bottom: 2rem;
  font-family: 'Playfair Display', serif;
  letter-spacing: -0.025em;
}

.hero-highlight {
  display: block;
  background: linear-gradient(135deg, #d4af37 0%, #f1c40f 50%, #d4af37 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* Hero Description */
.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #94a3b8;
  max-width: 48rem;
  margin: 0 auto 3rem auto;
  font-weight: 300;
}

/* Loading Section */
.loading-section {
  margin-bottom: 3rem;
}

.loading-bar {
  width: 100%;
  max-width: 20rem;
  height: 0.25rem;
  background: rgba(79, 70, 229, 0.2);
  border-radius: 0.125rem;
  margin: 0 auto;
  overflow: hidden;
}

.loading-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1);
  border-radius: 0.125rem;
  animation: loadingProgress 3s ease-in-out infinite;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
}

.btn-secondary {
  background: rgba(79, 70, 229, 0.1);
  color: #a5b4fc;
  border: 1px solid rgba(79, 70, 229, 0.3);
}

.btn-secondary:hover {
  background: rgba(79, 70, 229, 0.2);
  color: #c7d2fe;
  transform: translateY(-2px);
}

/* Feature Tags */
.feature-tags {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.feature-tag {
  padding: 0.5rem 1rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal-content {
  background: #1e293b;
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #f1f5f9;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
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
  background: rgba(79, 70, 229, 0.1);
  color: #c7d2fe;
}

/* Projects Modal */
.projects-content {
  padding: 2rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.project-card, .create-project-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.project-card:hover, .create-project-card:hover {
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(79, 70, 229, 0.4);
  transform: translateY(-4px);
}

.project-icon, .create-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.create-icon {
  font-size: 3rem;
  color: #6366f1;
  font-weight: 300;
}

.project-card h4, .create-project-card h4 {
  margin: 0 0 0.5rem 0;
  color: #f1f5f9;
  font-weight: 600;
}

.project-card p, .create-project-card p {
  color: #94a3b8;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.project-type {
  display: inline-block;
  background: rgba(79, 70, 229, 0.2);
  color: #a5b4fc;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.open-project-btn {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.open-project-btn:hover {
  background: #5856eb;
  transform: translateY(-1px);
}

/* Create Project Form */
.create-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #f1f5f9;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 0.5rem;
  color: #f1f5f9;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-group input::placeholder, .form-group textarea::placeholder {
  color: #64748b;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel, .btn-create {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background: rgba(79, 70, 229, 0.1);
  color: #94a3b8;
  border: 1px solid rgba(79, 70, 229, 0.2);
}

.btn-cancel:hover {
  background: rgba(79, 70, 229, 0.2);
  color: #c7d2fe;
}

.btn-create {
  background: #6366f1;
  color: white;
}

.btn-create:hover {
  background: #5856eb;
  transform: translateY(-1px);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
  }
}

@keyframes loadingProgress {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .hero-heading {
    font-size: 2.5rem;
  }
  
  .hero-description {
    font-size: 1.125rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 300px;
  }
  
  .feature-tags {
    justify-content: center;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-container {
    padding: 0 1rem;
  }
  
  .hero-heading {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .brand-tagline {
    display: none;
  }
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
