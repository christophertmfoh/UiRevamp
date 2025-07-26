<template>
  <div class="character-card">
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
      <button class="btn-primary" @click="$emit('edit', character)">Edit Character</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  character: {
    type: Object,
    required: true
  }
})

defineEmits(['edit'])
</script>

<style scoped>
.character-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.character-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
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

.btn-primary {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6b5b47, #8b7355);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
}
</style>