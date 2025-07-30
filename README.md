# 🎭 FableCraft - Modern Creative Writing Platform

> **Professional creative writing environment built for modern teams and individual creators**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🚀 **What is FableCraft?**

FableCraft is a modern creative writing platform designed for novelists, screenwriters, and storytellers. Think **Notion meets Sudowrite** - a comprehensive workspace for creative projects with AI-powered assistance.

### **✨ Core Features**

- **📖 Multi-Format Writing** - Novels, screenplays, short stories
- **👥 Character Management** - Deep character development with relationships
- **🌍 World Building** - Comprehensive world bible system
- **🤖 AI Assistant** - Integrated creative writing help
- **📊 Progress Tracking** - Goals, analytics, and productivity insights
- **🎨 Professional Themes** - Beautiful writing environments
- **👥 Collaboration** - Team projects and sharing

## 🏗️ **Project Structure**

This repository contains both the **legacy system** (in `FABLE/`) and the **new modern architecture**:

```
NEW_FABLECRAFT_REPO/
├── FABLE/                  # Legacy system (reference/migration)
│   ├── client/            # Old React frontend
│   ├── server/            # Old Node.js backend
│   └── shared/            # Shared utilities
├── frontend/              # NEW: Modern React 19 frontend
├── backend/               # NEW: Modern Node.js backend
├── shared/                # NEW: Shared types and utilities
├── docs/                  # Documentation
└── deployment/            # Deployment configurations
```

## 🎯 **New Architecture Goals**

### **Frontend** (React 19 + TypeScript)
- **Modern App Shell** - Notion-style sidebar navigation
- **Workspace Architecture** - Project-centric interface
- **Real-time Collaboration** - Live editing and sharing
- **Professional UI** - shadcn/ui + Tailwind CSS
- **Performance First** - Optimized for large documents

### **Backend** (Node.js + TypeScript)
- **RESTful API** - Clean, documented endpoints
- **Real-time Features** - WebSocket support
- **AI Integration** - OpenAI/Google AI APIs
- **Database** - PostgreSQL + Drizzle ORM
- **Authentication** - Secure user management

### **Developer Experience**
- **Type Safety** - Full TypeScript coverage
- **Modern Tooling** - Vite, ESLint, Prettier
- **Testing** - Vitest + Testing Library
- **Documentation** - Comprehensive guides
- **Deployment** - Replit + production ready

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 20+
- PostgreSQL (or use Replit Database)
- Git

### **1. Clone & Setup**
```bash
git clone <your-new-repo-url>
cd fablecraft
npm install
```

### **2. Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Add your configuration
VITE_API_URL=http://localhost:3001
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_key
```

### **3. Development**
```bash
# Start frontend (port 5173)
npm run dev:frontend

# Start backend (port 3001)  
npm run dev:backend

# Start both
npm run dev
```

### **4. Database Setup**
```bash
# Generate and run migrations
npm run db:generate
npm run db:migrate
npm run db:seed
```

## 📁 **New Architecture Detailed**

### **Frontend Structure**
```
frontend/
├── src/
│   ├── app/              # App shell and routing
│   ├── features/         # Feature-based modules
│   │   ├── auth/         # Authentication
│   │   ├── projects/     # Project management
│   │   ├── writing/      # Writing interface
│   │   ├── characters/   # Character system
│   │   └── world/        # World building
│   ├── shared/           # Shared components & utilities
│   │   ├── ui/           # UI component library
│   │   ├── hooks/        # Custom React hooks
│   │   ├── stores/       # State management
│   │   └── utils/        # Utility functions
│   └── assets/           # Static assets
```

### **Backend Structure**
```
backend/
├── src/
│   ├── api/              # API route handlers
│   ├── services/         # Business logic
│   ├── database/         # Database schema & migrations
│   ├── middleware/       # Express middleware
│   ├── integrations/     # External APIs (AI, etc.)
│   └── utils/            # Utility functions
```

## 🛠 **Available Scripts**

```bash
# Development
npm run dev                 # Start both frontend & backend
npm run dev:frontend        # Frontend only (port 5173)
npm run dev:backend         # Backend only (port 3001)

# Building
npm run build              # Build both
npm run build:frontend     # Build frontend only
npm run build:backend      # Build backend only

# Testing  
npm run test               # Run all tests
npm run test:frontend      # Frontend tests only
npm run test:backend       # Backend tests only

# Database
npm run db:generate        # Generate migrations
npm run db:migrate         # Run migrations
npm run db:seed           # Seed test data

# Code Quality
npm run lint              # Lint all code
npm run type-check        # TypeScript check
npm run format           # Format with Prettier
```

## 🎨 **Key Features Deep Dive**

### **📖 Writing Environment**
- **Distraction-free editor** with markdown support
- **Multiple document types** (chapters, scenes, notes)
- **Version history** and automatic saves
- **Export options** (PDF, DOCX, Fountain)

### **👥 Character System**
- **Character profiles** with photos and details
- **Relationship mapping** between characters
- **Character arcs** and development tracking
- **AI-generated character insights**

### **🌍 World Building**
- **Location library** with descriptions and maps
- **Timeline management** for complex narratives
- **Research organization** and note-taking
- **Consistency checking** across documents

### **🤖 AI Integration**
- **Writing suggestions** and continuation
- **Character dialogue** generation
- **Plot development** assistance
- **Grammar and style** improvements

## 🚢 **Deployment**

### **Replit Deployment**
```bash
# Optimized for Replit hosting
npm run deploy:replit
```

### **Production Deployment**
```bash
# Build for production
npm run build

# Deploy to your hosting platform
npm run deploy:production
```

## 📚 **Documentation**

- [**Development Guide**](docs/DEVELOPMENT.md) - Setup and workflow
- [**API Documentation**](docs/API.md) - Backend endpoints
- [**Component Library**](docs/COMPONENTS.md) - Frontend components
- [**Database Schema**](docs/DATABASE.md) - Data structure
- [**Deployment Guide**](docs/DEPLOYMENT.md) - Production setup

## 🤝 **Contributing**

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Inspiration**: Notion, Sudowrite, Scrivener, Linear
- **UI Framework**: shadcn/ui component library
- **Icons**: Lucide React
- **Fonts**: Inter, Playfair Display

---

**Ready to craft amazing stories!** ✨