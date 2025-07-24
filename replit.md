# Story Weaver Creative Suite

## Overview

Story Weaver is a comprehensive AI-integrated creative suite designed to take creators from initial idea to final video output. The application provides a complete pipeline for creative content development: idea brainstorming → world building → outlining → manuscript writing → storyboarding → pre-visualization → scoring → final video output. This full-stack application serves writers, screenwriters, and content creators who want an all-in-one solution for their creative projects.

## Recent Changes (Latest: July 24, 2025)

### AI-Powered Character Generation System Complete
- **Contextual Character Creation**: AI generates complete character sheets based on story context using Google Gemini 2.0
- **Smart Context Analysis**: System analyzes project genre, tone, locations, and existing characters for authentic generation
- **Complete Character Sheets**: Automatically fills name, role, personality, backstory, motivations, fears, secrets, relationships, goals, flaws, skills, and equipment
- **World-Aware Generation**: Characters are tailored to fit naturally into existing story world and complement other characters
- **One-Click Generation**: "Generate Character" button next to "Add Character" for instant character creation
- **Gemini Integration**: Uses Google Gemini 2.0 Flash for high-quality, contextual character generation
- **Error Handling**: Graceful fallbacks and clear error messages for missing API keys

### Character Portrait Management System Complete & Optimized
- **AI-Powered Portrait Generation**: Integrated Google Gemini 2.0 and OpenAI DALL-E 3 for character image generation
- **Smart Prompt Generation**: Automatically creates detailed prompts from character data (race, physical description, attire, etc.)
- **Dual Engine Support**: Gemini 2.0 as primary engine with OpenAI as backup option
- **Manual Upload Support**: Direct image upload with file handling and preview
- **Style Reference System**: Customizable style prompts for consistent artistic direction
- **Train Model Foundation**: UI framework ready for future character consistency ML training
- **Clickable Image Interface**: Both character detail view and list view images open portrait modal on click
- **Real-time Updates**: Generated/uploaded images immediately update character profiles with cache invalidation
- **Optimized Code Organization**: Reorganized into feature-based modules (character/, project/, world/) with centralized exports for faster navigation

### World Bible Implementation Complete
- **Comprehensive Database Schema**: Added 8 new tables for all world bible categories (organizations, magic systems, timeline events, creatures, languages, cultures, prophecies, themes)
- **Functional World Bible Interface**: Built complete interface with drag-and-drop sidebar navigation for all 12 categories
- **BloomWeaver Content Integration**: Populated with user's actual cosmic horror world including Essylt/Somnus, Garden of Expanse, Cultist Group, Stone Lords, and complete timeline
- **Interactive Category Views**: Detailed views for characters, locations, factions, magic systems, and timeline with search functionality
- **Rich Content Display**: Proper formatting, badges, threat levels, relationships, and cross-references between world elements

### Project Dashboard Redesign & Intelligent Import
- **Cinematic Header Layout**: Project name prominently centered with type and genre badges underneath
- **Micro Menu Navigation**: Horizontal navigation bar with Studio Overview, World Bible, Outline, Manuscript, Storyboard, Pre-Vis, and Score sections
- **Creative Pipeline Cards**: Long rectangular cards showing progress, counts, and direct navigation to each section
- **Recent Activity Tracking**: Bottom section showing recent changes with rollback capabilities (foundation)
- **Intelligent Document Import**: New import button with AI-powered content extraction foundation for manuscripts and world bibles
- **Progress Visualization**: Enhanced progress bars and statistics for each creative pipeline step

### Major UI/UX Redesign Complete
- **Typography Overhaul**: Implemented modern, comfortable font hierarchy using Playfair Display for headings and Source Serif 4 for body text
- **Color Scheme Update**: Adopted warmer, cozy color palette inspired by writing interfaces - deep chocolate browns, caramel accents, and golden highlights
- **Landing Page Redesign**: Complete rebuild with "Story Weaver" branding, "weave your worlds" tagline, and "From Spark to Story" concept
- **Database Integration**: Successfully migrated from localStorage to PostgreSQL with comprehensive schema for all creative elements
- **Landing Page Structure**: Clean separation between landing and app functionality, includes story idea generator and feature showcase

## User Preferences

Preferred communication style: Simple, everyday language.
Development approach: Build core system architecture first, add AI generation features later for solid foundation and immediate utility.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: React hooks and context for local state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Custom dark theme with modern glassmorphic elements and "studio" aesthetic
- **Code Organization**: Feature-based modules with centralized index exports:
  - `components/character/` - All character-related components
  - `components/project/` - Project dashboard and management
  - `components/world/` - World building components
  - `lib/config/` - Configuration files and constants
  - `lib/services/` - API services and external integrations

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Session Management**: Express sessions with PostgreSQL session store
- **Development**: Hot module replacement via Vite middleware integration

### Database Architecture
- **Primary Database**: PostgreSQL via Neon Database serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Connection**: @neondatabase/serverless for optimized serverless connections

## Key Components

### Creative Pipeline Tools
- **World Bible**: Comprehensive world-building system including characters, locations, factions, organizations, items, magic systems, timeline, bestiary, languages, cultures, prophecies, and themes
- **Outline Manager**: Hierarchical story structure with support for classic 15-beat structure, three-act structure, or custom outlines
- **Manuscript Editor**: Dual-format writing (novel/screenplay) with AI assistance
- **Storyboard Creator**: Visual story planning and scene organization
- **Pre-Visualization Tools**: 3D scene planning and camera work
- **Scoring System**: Music and audio integration for multimedia projects

### AI Integration Layer
- **Google Gemini API**: Primary AI service for content generation, character development, and creative assistance
- **Configurable AI Tools**: Modular AI assistance that can be enabled/disabled per tool
- **Context-Aware Generation**: AI systems that understand project context and maintain consistency across all creative elements
- **Multi-Modal Generation**: Text, image, and potentially audio/video generation capabilities

### User Interface Components
- **Modular Sidebar**: Collapsible navigation with tool-specific sections
- **Workspace Canvas**: Main content area that adapts to current tool
- **Modal System**: Overlay dialogs for creation, editing, and AI interactions
- **Responsive Design**: Mobile-first approach with progressive enhancement

## Data Flow

### Project Data Management
1. **PostgreSQL Database**: Projects stored in Neon serverless PostgreSQL database for persistent storage
2. **API Integration**: RESTful API with React Query for efficient data fetching and caching
3. **Auto-Save**: Debounced save system with database persistence
4. **Import/Export**: Support for manuscript imports (DOCX, PDF, TXT)

### AI Request Pipeline
1. **Context Assembly**: Gather relevant project data and enabled craft knowledge
2. **Prompt Construction**: Build contextual prompts with user input and project state
3. **API Communication**: Secure communication with Google Gemini API
4. **Response Processing**: Parse and integrate AI responses into project data
5. **Error Handling**: Graceful fallbacks for API failures

### Content Generation Flow
1. **User Input**: Prompts, selections, or requests through UI
2. **Context Analysis**: System analyzes current project state and relevant data
3. **AI Processing**: Gemini API generates content based on context and craft knowledge
4. **Content Integration**: Generated content merged into appropriate project sections
5. **User Review**: Generated content presented for approval/editing

## External Dependencies

### Core Dependencies
- **@google/generative-ai**: Official Google Gemini API client
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management and caching

### UI/UX Dependencies
- **@radix-ui/***: Accessible, unstyled UI primitives
- **lucide-react**: Modern icon library
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx/tailwind-merge**: Conditional CSS class management

### Development Dependencies
- **typescript**: Static type checking
- **vite**: Fast build tool and dev server
- **@vitejs/plugin-react**: React integration for Vite
- **@replit/vite-plugin-runtime-error-modal**: Development error handling

### Document Processing
- **mammoth**: DOCX file parsing for manuscript imports
- **pdfjs-dist**: PDF parsing for document imports

## Deployment Strategy

### Development Environment
- **Replit Integration**: Optimized for Replit development environment
- **Hot Reload**: Instant feedback during development via Vite HMR
- **Environment Variables**: Secure API key management via .env files
- **Error Overlay**: Runtime error display for debugging

### Production Deployment
- **Build Process**: Vite production build with optimizations
- **Static Assets**: Compiled frontend served via Express static middleware
- **Database Migrations**: Drizzle Kit for schema deployment
- **Environment Configuration**: Production environment variable management

### Performance Optimizations
- **Code Splitting**: Dynamic imports for large components
- **Asset Optimization**: Vite's built-in asset optimization
- **Database Connection Pooling**: Efficient PostgreSQL connection management
- **Caching Strategy**: TanStack Query for intelligent data caching

The application follows a modular, component-based architecture that allows for easy extension and maintenance while providing a seamless creative workflow from initial concept to final output.