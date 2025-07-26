export default defineEventHandler(async (event) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    migration: {
      frontend: 'Nuxt 3 + Vue 3 + Pinia',
      backend: 'Kotlin + Spring Boot (in progress)',
      database: 'PostgreSQL (preserved)'
    }
  }
})