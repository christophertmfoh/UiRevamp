<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
// Global app configuration
useHead({
  title: 'Fablecraft - Craft Your Fable',
  meta: [
    { name: 'description', content: 'Advanced AI-powered creative writing platform with intelligent character generation and world-building tools.' }
  ]
})
</script>

<style>
/* Global styles will be added here */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background: #faf8f5;
  color: #2d2d2d;
}

* {
  box-sizing: border-box;
}
</style>