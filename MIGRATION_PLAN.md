# Fablecraft Migration Plan: React → Vue 3/Nuxt 3 + Node.js → Kotlin/Spring Boot

## Overview
This migration plan ensures zero downtime and complete feature preservation while modernizing the tech stack. We'll use a parallel development approach with incremental cutover.

## Current State Analysis
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Google Gemini API
- **Authentication**: Express sessions
- **Features**: Character management, world-building, AI generation, project organization

## Target Architecture
- **Frontend**: Vue 3 + Nuxt 3 + TypeScript + Tailwind CSS
- **Backend**: Kotlin + Spring Boot + Spring WebFlux
- **Database**: PostgreSQL with Spring Data JPA + Flyway migrations
- **API**: GraphQL with Spring GraphQL
- **State Management**: Pinia
- **Authentication**: Spring Security + JWT
- **AI Stack**: Google Gemini + Redis caching
- **Performance**: SSR with Nuxt 3

---

## Phase 1: Infrastructure Setup & Parallel Environment (Week 1-2)

### Step 1.1: Create Parallel Backend Structure
```bash
# Create new backend directory
mkdir backend-kotlin
cd backend-kotlin

# Initialize Spring Boot project structure
mkdir -p src/main/kotlin/com/fablecraft
mkdir -p src/main/resources
mkdir -p src/test/kotlin/com/fablecraft
```

### Step 1.2: Setup Spring Boot Configuration
- **Dependencies**: Spring Boot 3.2, Spring WebFlux, Spring Data JPA, Spring Security, Spring GraphQL
- **Database**: PostgreSQL driver, Flyway migrations
- **AI Integration**: WebClient for HTTP calls, Redis for caching
- **Tools**: Jackson for JSON, MapStruct for mapping

### Step 1.3: Create Parallel Frontend Structure
```bash
# Create new frontend directory
mkdir frontend-vue
cd frontend-vue

# Initialize Nuxt 3 project
npx nuxi@latest init .
npm install @nuxtjs/tailwindcss @pinia/nuxt
```

### Step 1.4: Database Migration Strategy
- **Phase 1**: Keep existing PostgreSQL schema
- **Create Flyway migrations** matching current Drizzle schema
- **Setup dual database access** (Node.js and Kotlin can both connect)
- **Data consistency checks** between both systems

---

## Phase 2: Backend API Migration (Week 3-5)

### Step 2.1: Domain Model Creation
**Priority Order**:
1. **User & Authentication** models
2. **Project** models  
3. **Character** models (highest complexity - 164+ fields)
4. **World-building** models (locations, factions, items, etc.)

```kotlin
// Example: Character entity
@Entity
@Table(name = "characters")
data class Character(
    @Id val id: String,
    val name: String,
    val projectId: String,
    // ... 164+ fields mapped from current schema
)
```

### Step 2.2: GraphQL Schema Design
```graphql
type Character {
  id: ID!
  name: String!
  project: Project!
  # All 164+ fields from current character system
  personalityTraits: [String!]!
  abilities: [String!]!
  # Complex nested types for relationships, arcs, etc.
}

type Mutation {
  createCharacter(input: CreateCharacterInput!): Character!
  updateCharacter(id: ID!, input: UpdateCharacterInput!): Character!
  generateCharacterWithAI(input: AIGenerationInput!): Character!
}
```

### Step 2.3: Service Layer Implementation
**Character Service Priority**:
1. **CRUD operations** - Create, Read, Update, Delete
2. **AI Integration** - Character generation with Google Gemini
3. **Image Generation** - Portrait creation and management
4. **Complex Features** - Relationships, character arcs, insights

### Step 2.4: Authentication Migration
- **JWT Implementation** with Spring Security
- **Session Migration Tool** - Convert existing sessions to JWT
- **Dual Authentication Support** - Both systems work during transition

---

## Phase 3: Frontend Component Migration (Week 6-9)

### Step 3.1: Design System Migration
```vue
<!-- Example: Character card component -->
<template>
  <div class="character-card">
    <img :src="character.portraitUrl" :alt="character.name" />
    <h3>{{ character.name }}</h3>
    <p>{{ character.title }}</p>
  </div>
</template>

<script setup lang="ts">
interface Character {
  id: string
  name: string
  title?: string
  portraitUrl?: string
}

defineProps<{
  character: Character
}>()
</script>
```

### Step 3.2: Component Migration Priority
1. **Core UI Components** (buttons, inputs, cards, modals)
2. **Layout Components** (header, sidebar, navigation)
3. **Character Management** (forms, lists, details, AI generation)
4. **World Building Components** (locations, factions, items)
5. **Project Management** (dashboard, creation, organization)

### Step 3.3: State Management with Pinia
```typescript
// Character store
export const useCharacterStore = defineStore('character', () => {
  const characters = ref<Character[]>([])
  
  const fetchCharacters = async (projectId: string) => {
    // GraphQL query to new backend
    const { data } = await $graphql(`
      query GetCharacters($projectId: ID!) {
        characters(projectId: $projectId) {
          id name title portraitUrl
        }
      }
    `, { projectId })
    characters.value = data.characters
  }
  
  return { characters, fetchCharacters }
})
```

### Step 3.4: Route Migration
- **Nuxt 3 file-based routing** matches current React Router structure
- **Pages directory** mirrors current route structure
- **Middleware** for authentication and project access

---

## Phase 4: Feature Parity Validation (Week 10-11)

### Step 4.1: Feature Checklist Validation
**Character System**:
- [ ] Character creation (blank, template, AI)
- [ ] Character editing (all 164+ fields)
- [ ] AI enhancement for all field types
- [ ] Portrait generation and upload
- [ ] Character relationships mapping
- [ ] Character arc tracking
- [ ] Character insights dashboard
- [ ] Drag-and-drop featured characters

**World Building**:
- [ ] Locations CRUD
- [ ] Factions CRUD  
- [ ] Items CRUD
- [ ] All other world bible modules
- [ ] AI generation for world elements

**Project Management**:
- [ ] Project creation and organization
- [ ] Project dashboard
- [ ] Multi-user support (if applicable)

### Step 4.2: Performance Benchmarking
- **SSR Performance**: Measure initial load times vs current SPA
- **API Performance**: GraphQL vs REST response times
- **AI Generation**: Response times with Redis caching
- **Database Performance**: JPA queries vs Drizzle ORM

### Step 4.3: Cross-Browser Testing
- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **Mobile responsiveness**: iOS Safari, Chrome Mobile
- **Accessibility**: Screen readers, keyboard navigation

---

## Phase 5: Data Migration & Cutover (Week 12-13)

### Step 5.1: Data Migration Strategy
```sql
-- Example: Character data migration
INSERT INTO new_characters 
SELECT 
  id, name, project_id, created_at, updated_at,
  -- Transform JSON fields to proper columns
  personality_traits::jsonb,
  abilities::jsonb,
  -- Map all 164+ fields
FROM old_characters;
```

### Step 5.2: Gradual Traffic Migration
1. **Feature Flags**: Enable new components for beta users
2. **A/B Testing**: Compare performance between old/new systems
3. **Rollback Plan**: Instant switch back to React if issues arise
4. **Monitoring**: Real-time error tracking and performance metrics

### Step 5.3: Database Cutover
- **Maintenance Window**: Schedule brief downtime for final data sync
- **Dual-Write Period**: Write to both databases temporarily
- **Validation**: Ensure data consistency before switching reads
- **Old Database Retirement**: Keep as backup for 30 days

---

## Phase 6: Legacy Cleanup & Optimization (Week 14-15)

### Step 6.1: React Component Removal
```bash
# Systematic removal of React components
rm -rf client/src/components/
rm -rf client/src/pages/
rm -rf client/src/hooks/
# Keep: assets, types, utilities that can be reused
```

### Step 6.2: Node.js Backend Decommission
- **Traffic Validation**: Confirm 100% traffic on new backend
- **API Endpoint Shutdown**: Return 410 Gone for old endpoints
- **Database Connection Removal**: Stop old backend database access
- **File Cleanup**: Archive old backend code

### Step 6.3: Performance Optimization
- **Bundle Optimization**: Tree shaking, code splitting
- **Caching Strategy**: Redis for AI responses, CDN for assets
- **Database Optimization**: Query optimization, indexing
- **Monitoring Setup**: Application metrics, error tracking

---

## Risk Mitigation & Rollback Plans

### Technical Risks
1. **Data Loss**: Multiple backups, validation scripts
2. **Performance Regression**: Load testing, gradual rollout
3. **AI Integration Issues**: Fallback to direct API calls
4. **Authentication Problems**: Dual auth support during transition

### Business Continuity
1. **Zero Downtime**: Parallel systems during migration
2. **Feature Parity**: Comprehensive testing checklist
3. **User Experience**: Maintain all UI/UX elements
4. **Rollback Capability**: Instant switch back to React system

### Quality Assurance
1. **Automated Testing**: Unit, integration, e2e tests
2. **Manual Testing**: Full user journey validation
3. **Performance Testing**: Load testing with realistic data
4. **Security Testing**: Authentication, authorization, data protection

---

## Success Metrics

### Technical Metrics
- **Performance**: 40% faster initial load with SSR
- **Scalability**: Support 10x current user load
- **Maintainability**: Reduced codebase complexity
- **Type Safety**: 100% TypeScript coverage

### Business Metrics
- **User Satisfaction**: No regression in user experience
- **Feature Completeness**: 100% feature parity
- **Development Velocity**: Faster feature development post-migration
- **Cost Efficiency**: Reduced infrastructure costs with optimizations

---

## Timeline Summary
- **Week 1-2**: Infrastructure setup
- **Week 3-5**: Backend API migration
- **Week 6-9**: Frontend component migration  
- **Week 10-11**: Feature validation
- **Week 12-13**: Data migration & cutover
- **Week 14-15**: Legacy cleanup

**Total Duration**: 15 weeks with parallel development approach
**Risk Level**: Low (parallel systems ensure zero downtime)
**Rollback Time**: < 5 minutes at any point during migration