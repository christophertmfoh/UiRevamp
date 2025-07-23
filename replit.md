# Story Weaver Creative Suite

## Overview

Story Weaver is a comprehensive AI-integrated creative suite designed to take creators from initial idea to final video output. The application provides a complete pipeline for creative content development: idea brainstorming → world building → outlining → manuscript writing → storyboarding → pre-visualization → scoring → final video output. This full-stack application serves writers, screenwriters, and content creators who want an all-in-one solution for their creative projects.

## Recent Changes (Latest: July 23, 2025)

### Major UI/UX Redesign Complete
- **Typography Overhaul**: Implemented modern, comfortable font hierarchy using Playfair Display for headings and Source Serif 4 for body text
- **Color Scheme Update**: Adopted warmer, cozy color palette inspired by writing interfaces - deep chocolate browns, caramel accents, and golden highlights
- **Landing Page Redesign**: Complete rebuild with "Story Weaver" branding, "weave your worlds" tagline, and "From Spark to Story" concept
- **Database Integration**: Successfully migrated from localStorage to PostgreSQL with comprehensive schema for all creative elements
- **Landing Page Structure**: Clean separation between landing and app functionality, includes story idea generator and feature showcase

### Project Dashboard Redesign & Intelligent Import
- **Cinematic Header Layout**: Project name prominently centered with type and genre badges underneath
- **Micro Menu Navigation**: Horizontal navigation bar with Studio Overview, World Bible, Outline, Manuscript, Storyboard, Pre-Vis, and Score sections
- **Creative Pipeline Cards**: Long rectangular cards showing progress, counts, and direct navigation to each section
- **Recent Activity Tracking**: Bottom section showing recent changes with rollback capabilities (foundation)
- **Intelligent Document Import**: New import button with AI-powered content extraction foundation for manuscripts and world bibles
- **Progress Visualization**: Enhanced progress bars and statistics for each creative pipeline step

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: React hooks and context for local state, TanStack Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Custom dark theme with modern glassmorphic elements and "studio" aesthetic

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