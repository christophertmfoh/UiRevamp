# Technical Implementation Guide: Fablecraft Migration

## Phase 1: Infrastructure Setup Commands

### Backend Setup (Kotlin + Spring Boot)
```bash
# Create backend directory structure
mkdir backend-kotlin && cd backend-kotlin

# Create Spring Boot project structure
mkdir -p src/main/kotlin/com/fablecraft/{config,controller,service,repository,entity,dto,security}
mkdir -p src/main/resources/{db/migration,graphql}
mkdir -p src/test/kotlin/com/fablecraft

# Create build.gradle.kts
cat > build.gradle.kts << 'EOF'
plugins {
    kotlin("jvm") version "1.9.21"
    kotlin("plugin.spring") version "1.9.21"
    kotlin("plugin.jpa") version "1.9.21"
    id("org.springframework.boot") version "3.2.0"
    id("io.spring.dependency-management") version "1.1.4"
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-graphql")
    implementation("org.postgresql:postgresql")
    implementation("org.flywaydb:flyway-core")
    implementation("redis.clients:jedis")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
}
EOF
```

### Frontend Setup (Vue 3 + Nuxt 3)
```bash
# Create frontend directory
mkdir frontend-vue && cd frontend-vue

# Initialize Nuxt 3
npx nuxi@latest init .
npm install @nuxtjs/tailwindcss @pinia/nuxt @apollo/client graphql

# Create directory structure
mkdir -p {components,composables,stores,types,graphql}/{character,project,world}
mkdir -p pages/{character,project,world}
mkdir -p assets/{css,images,icons}

# Create nuxt.config.ts
cat > nuxt.config.ts << 'EOF'
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true
  }
})
EOF
```

## Phase 2: Database Migration Scripts

### Flyway Migration Files
```sql
-- V1__Initial_Schema.sql
-- Recreate existing Drizzle schema in Flyway format

CREATE TABLE projects (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE characters (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    race VARCHAR(255),
    -- All 164+ fields from current character system
    personality_traits JSONB DEFAULT '[]',
    abilities JSONB DEFAULT '[]',
    relationships JSONB DEFAULT '[]',
    character_arcs JSONB DEFAULT '[]',
    -- Continue with all existing fields...
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_characters_project_id ON characters(project_id);
CREATE INDEX idx_characters_name ON characters(name);
```

## Phase 3: Kotlin Backend Implementation

### Entity Models
```kotlin
// Character.kt
@Entity
@Table(name = "characters")
data class Character(
    @Id
    val id: String = "",
    
    @Column(name = "project_id")
    val projectId: String = "",
    
    val name: String = "",
    val title: String? = null,
    val race: String? = null,
    
    @Type(JsonType::class)
    @Column(columnDefinition = "jsonb")
    val personalityTraits: List<String> = emptyList(),
    
    @Type(JsonType::class)
    @Column(columnDefinition = "jsonb")
    val abilities: List<String> = emptyList(),
    
    // Continue with all 164+ fields...
    
    @CreationTimestamp
    val createdAt: LocalDateTime = LocalDateTime.now(),
    
    @UpdateTimestamp
    val updatedAt: LocalDateTime = LocalDateTime.now()
)
```

### GraphQL Schema
```graphql
# schema.graphqls
type Character {
  id: ID!
  projectId: ID!
  name: String!
  title: String
  race: String
  personalityTraits: [String!]!
  abilities: [String!]!
  relationships: [Relationship!]!
  characterArcs: [CharacterArc!]!
  # All other fields...
  createdAt: String!
  updatedAt: String!
}

input CreateCharacterInput {
  projectId: ID!
  name: String!
  title: String
  race: String
  # All other input fields...
}

input UpdateCharacterInput {
  name: String
  title: String
  race: String
  personalityTraits: [String!]
  # All other updatable fields...
}

type Query {
  characters(projectId: ID!): [Character!]!
  character(id: ID!): Character
}

type Mutation {
  createCharacter(input: CreateCharacterInput!): Character!
  updateCharacter(id: ID!, input: UpdateCharacterInput!): Character!
  deleteCharacter(id: ID!): Boolean!
  generateCharacterWithAI(prompt: String!, projectId: ID!): Character!
}
```

### Service Layer
```kotlin
// CharacterService.kt
@Service
class CharacterService(
    private val characterRepository: CharacterRepository,
    private val aiService: AIService
) {
    
    suspend fun createCharacter(input: CreateCharacterInput): Character {
        val character = Character(
            id = UUID.randomUUID().toString(),
            projectId = input.projectId,
            name = input.name,
            title = input.title,
            // Map all fields...
        )
        return characterRepository.save(character)
    }
    
    suspend fun generateCharacterWithAI(prompt: String, projectId: String): Character {
        val aiResponse = aiService.generateCharacter(prompt)
        return createCharacter(
            CreateCharacterInput(
                projectId = projectId,
                name = aiResponse.name,
                // Map AI response to character fields...
            )
        )
    }
    
    // All other CRUD operations...
}
```

### AI Integration Service
```kotlin
// AIService.kt
@Service
class AIService(
    private val webClient: WebClient,
    private val redisTemplate: RedisTemplate<String, Any>
) {
    
    suspend fun generateCharacter(prompt: String): AICharacterResponse {
        val cacheKey = "ai_character:${prompt.hashCode()}"
        
        // Check Redis cache first
        val cached = redisTemplate.opsForValue().get(cacheKey)
        if (cached != null) {
            return cached as AICharacterResponse
        }
        
        // Call Google Gemini API
        val response = webClient.post()
            .uri("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent")
            .header("Authorization", "Bearer ${apiKey}")
            .bodyValue(createGeminiRequest(prompt))
            .retrieve()
            .awaitBody<GeminiResponse>()
        
        val result = parseGeminiResponse(response)
        
        // Cache for 1 hour
        redisTemplate.opsForValue().set(cacheKey, result, Duration.ofHours(1))
        
        return result
    }
}
```

## Phase 4: Vue 3 Frontend Implementation

### Pinia Store
```typescript
// stores/character.ts
export const useCharacterStore = defineStore('character', () => {
  const characters = ref<Character[]>([])
  const currentCharacter = ref<Character | null>(null)
  const loading = ref(false)
  
  const fetchCharacters = async (projectId: string) => {
    loading.value = true
    try {
      const { data } = await $graphql(`
        query GetCharacters($projectId: ID!) {
          characters(projectId: $projectId) {
            id name title race
            personalityTraits abilities
            # All fields...
          }
        }
      `, { projectId })
      characters.value = data.characters
    } finally {
      loading.value = false
    }
  }
  
  const createCharacter = async (input: CreateCharacterInput) => {
    const { data } = await $graphql(`
      mutation CreateCharacter($input: CreateCharacterInput!) {
        createCharacter(input: $input) {
          id name title race
          # All fields...
        }
      }
    `, { input })
    characters.value.push(data.createCharacter)
    return data.createCharacter
  }
  
  const generateWithAI = async (prompt: string, projectId: string) => {
    loading.value = true
    try {
      const { data } = await $graphql(`
        mutation GenerateCharacter($prompt: String!, $projectId: ID!) {
          generateCharacterWithAI(prompt: $prompt, projectId: $projectId) {
            id name title race
            personalityTraits abilities
            # All fields...
          }
        }
      `, { prompt, projectId })
      characters.value.push(data.generateCharacterWithAI)
      return data.generateCharacterWithAI
    } finally {
      loading.value = false
    }
  }
  
  return {
    characters: readonly(characters),
    currentCharacter: readonly(currentCharacter),
    loading: readonly(loading),
    fetchCharacters,
    createCharacter,
    generateWithAI
  }
})
```

### Vue Components
```vue
<!-- components/character/CharacterCard.vue -->
<template>
  <div class="character-card group p-6 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-300">
    <div class="flex items-start space-x-4">
      <div class="character-avatar">
        <img 
          :src="character.portraitUrl || '/default-avatar.png'" 
          :alt="character.name"
          class="w-16 h-16 rounded-lg object-cover"
        />
      </div>
      
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-foreground truncate">
            {{ character.name }}
          </h3>
          <CharacterActions :character="character" />
        </div>
        
        <p v-if="character.title" class="text-sm text-muted-foreground">
          {{ character.title }}
        </p>
        
        <div v-if="character.personalityTraits.length" class="mt-2">
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="trait in character.personalityTraits.slice(0, 3)" 
              :key="trait"
              class="px-2 py-1 text-xs bg-accent/10 text-accent rounded-md"
            >
              {{ trait }}
            </span>
            <span 
              v-if="character.personalityTraits.length > 3"
              class="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md"
            >
              +{{ character.personalityTraits.length - 3 }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-4 flex items-center justify-between">
      <CharacterCompleteness :character="character" />
      <NuxtLink 
        :to="`/character/${character.id}`"
        class="text-sm text-accent hover:text-accent/80 transition-colors"
      >
        View Details →
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  character: Character
}

defineProps<Props>()
</script>
```

### Page Components
```vue
<!-- pages/character/[id].vue -->
<template>
  <div class="character-detail-page">
    <CharacterHeader :character="character" />
    
    <div class="character-content grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <CharacterTabs :character="character" />
      </div>
      
      <div class="character-sidebar">
        <CharacterInsights :character="character" />
        <CharacterRelationships :character="character" />
        <CharacterArcs :character="character" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const characterStore = useCharacterStore()

const { data: character } = await useLazyAsyncData(
  `character-${route.params.id}`,
  () => characterStore.fetchCharacter(route.params.id as string)
)

if (!character.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Character not found'
  })
}

// SEO optimization
useHead({
  title: `${character.value.name} | Fablecraft`,
  meta: [
    {
      name: 'description',
      content: `Character profile for ${character.value.name}${character.value.title ? `, ${character.value.title}` : ''}`
    }
  ]
})
</script>
```

## Phase 5: Deployment Configuration

### Docker Configuration
```dockerfile
# backend-kotlin/Dockerfile
FROM openjdk:17-jdk-slim
COPY build/libs/fablecraft-backend.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]

# frontend-vue/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

### Environment Configuration
```bash
# .env.example
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/fablecraft
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=fablecraft
DATABASE_USER=fablecraft_user
DATABASE_PASSWORD=secure_password

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=redis_password

# AI Services
GOOGLE_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Security
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400

# Application
BACKEND_URL=http://localhost:8080
FRONTEND_URL=http://localhost:3000
```

## Phase 6: Testing Strategy

### Backend Tests
```kotlin
// CharacterServiceTest.kt
@SpringBootTest
class CharacterServiceTest {
    
    @Autowired
    private lateinit var characterService: CharacterService
    
    @Test
    fun `should create character with all fields`() = runTest {
        val input = CreateCharacterInput(
            projectId = "test-project",
            name = "Test Character",
            title = "Hero"
            // All other fields...
        )
        
        val result = characterService.createCharacter(input)
        
        assertThat(result.name).isEqualTo("Test Character")
        assertThat(result.title).isEqualTo("Hero")
        // Assert all fields...
    }
    
    @Test
    fun `should generate character with AI`() = runTest {
        val prompt = "Create a heroic fantasy character"
        val projectId = "test-project"
        
        val result = characterService.generateCharacterWithAI(prompt, projectId)
        
        assertThat(result.name).isNotBlank()
        assertThat(result.projectId).isEqualTo(projectId)
        // Assert AI-generated fields are populated...
    }
}
```

### Frontend Tests
```typescript
// tests/character.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CharacterCard from '~/components/character/CharacterCard.vue'

describe('CharacterCard', () => {
  it('renders character information correctly', () => {
    const character = {
      id: '1',
      name: 'Test Character',
      title: 'Hero',
      personalityTraits: ['Brave', 'Kind', 'Determined']
    }
    
    const wrapper = mount(CharacterCard, {
      props: { character }
    })
    
    expect(wrapper.text()).toContain('Test Character')
    expect(wrapper.text()).toContain('Hero')
    expect(wrapper.text()).toContain('Brave')
  })
})
```

This technical guide provides the concrete implementation details needed to execute the migration plan successfully while maintaining all existing functionality.