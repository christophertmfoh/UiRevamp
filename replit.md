# FableCraft - Professional Creative Writing Platform

## Overview
FableCraft is a creative writing platform optimized for Replit development, designed for writers, storytellers, and creative teams. Built with modern Replit-native technologies, it provides intuitive tools for managing creative priting projects with advanced AI integration for character development, story structure, and creative assistance.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS with shadcn/ui
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: Zustand + TanStack React Query
- **AI Integration**: Google Gemini AI + OpenAI (optional)
- **Testing**: Vitest + Testing Library
- **Build Tools**: Vite + PostCSS + Autoprefixer

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared TypeScript schemas and types
├── scripts/         # Utility scripts (security, health checks, etc.)
├── docs/           # Documentation
└── backups/        # Module backups
```

## Key Components

### State Management (PRESERVED - Phase 4)
- **Zustand Stores**: UI state management (auth, theme, modals) ✅ PRESERVED
- **React Query**: Server state management (projects, characters) ✅ PRESERVED  
- **Clean Separation**: Local vs server state clearly separated ✅ PRESERVED
- **Optimistic Updates**: Proper error handling with rollback ✅ PRESERVED

### Frontend Architecture
- **Component System**: Modular React components with TypeScript
- **Styling**: Professional theme system with 7 custom writing-optimized themes
- **State Management**: Zustand for local state, React Query for server state
- **Routing**: Client-side routing with React
- **Authentication**: JWT-based authentication with session management

### Backend Architecture
- **API Design**: RESTful Express.js server with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL
- **Storage Abstraction**: Unified storage interface supporting both database and mock storage
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Upload**: Multer for character document imports

### Database Schema
- **Users & Sessions**: Authentication and session management
- **Projects**: Multi-format project support (novels, screenplays, comics)
- **Characters**: Comprehensive character profiles with 164+ fields
- **Outlines**: Story structure and narrative planning
- **Prose Documents**: Manuscript content management
- **Relationships**: Character relationship mapping
- **Assets**: Image and media management

## Data Flow

### Authentication Flow
1. User registration/login with validation
2. JWT token generation and storage
3. Token-based API authentication
4. Session management with expiration

### Character Management Flow
1. Character creation with AI assistance
2. Field-by-field enhancement using Gemini AI
3. Portrait generation and upload
4. Data transformation for database storage
5. Real-time updates with optimistic UI

### AI Integration Flow
1. Rate-limited requests to Gemini API
2. Intelligent fallback system for API failures
3. Context-aware character generation
4. Safety filtering and content validation

## External Dependencies

### AI Services
- **Google Gemini AI**: Primary AI service for character generation and enhancement
- **OpenAI**: Optional service for image generation (DALL-E)

### Database
- **PostgreSQL**: Primary database with Neon serverless support
- **Mock Storage**: Development fallback for offline work

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon system

### Development Tools
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **Vitest**: Testing framework

## Deployment Strategy

### Development Environment
- **Dual Mode**: Supports both database and mock storage
- **Hot Reload**: Vite dev server with HMR
- **Environment Detection**: Automatic routing based on DATABASE_URL
- **Script Automation**: Health checks, security scanning, secret generation

### Production Environment
- **Database**: PostgreSQL with connection pooling
- **Security**: Environment variable validation, JWT secrets
- **Monitoring**: Health check endpoints and error handling
- **Build Process**: Optimized Vite build with asset optimization

### Environment Variables
- **Required**: DATABASE_URL, JWT_SECRET, GEMINI_API_KEY
- **Optional**: OPENAI_API_KEY, NODE_ENV, PORT
- **Security**: Automated validation and secret generation scripts

### Quality Assurance
- **Testing**: Comprehensive test suite with coverage reporting ✅ PRESERVED
- **Linting**: Replit-optimized ESLint configuration ✅ PRESERVED (simplified)
- **Security**: JWT auth, bcrypt hashing, API protection ✅ PRESERVED
- **Type Safety**: Full TypeScript coverage with strict mode ✅ PRESERVED

## Phase 6 Production Standards Refactor (PLANNED - January 28, 2025)
📋 **Objective**: Transform FableCraft from mixed architecture to production-grade React TypeScript application following 2025 industry standards

🎯 **Key Issues Identified**:
- Mixed client/server structure with root folder clutter
- Type-based component organization instead of feature-first
- No barrel exports leading to messy relative imports
- Missing modern React patterns (monorepo, proper TypeScript organization)
- Inconsistent with production apps like Notion, Linear, Vercel

📈 **Phase 6 Scope**:
- **Part A**: Architectural restructure (monorepo, feature-first organization)
- **Part B**: Component architecture (design system extraction, barrel exports)
- **Part C**: Development experience (path mapping, workspace configuration)
- **Part D**: Performance & production (code splitting, testing architecture)

🔧 **Target Structure**: Clean monorepo with `apps/web/`, `apps/api/`, `packages/shared-types/` following industry standards
📊 **Success Metrics**: Feature-first organization, absolute imports, proper TypeScript architecture, production-ready build configuration

**Full Implementation Guide**: See `PHASE_6_PRODUCTION_REFACTOR_GUIDE.md` for complete task list and Replit/Cursor instructions

