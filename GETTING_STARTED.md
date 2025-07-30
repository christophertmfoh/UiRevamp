# 🚀 Getting Started with FableCraft

Welcome to the **NEW** FableCraft repository! This guide will help you set up the modern, clean version of the creative writing platform.

## 📁 **Repository Structure**

```
NEW_FABLECRAFT_REPO/
├── FABLE/                  # 📦 Legacy system (your original code)
├── frontend/               # ⚛️  NEW: Modern React 19 frontend
├── backend/                # 🔧 NEW: Modern Node.js backend  
├── shared/                 # 🔗 NEW: Shared types & utilities
├── docs/                   # 📚 Documentation
└── deployment/             # 🚀 Deployment configurations
```

## 🎯 **What You're Getting**

### **🔄 Migration Strategy**
- **Legacy Code**: Safely preserved in `FABLE/` folder
- **New Architecture**: Clean, modern monorepo structure
- **Gradual Migration**: Port features one by one from legacy to new
- **Zero Downtime**: Keep old system running while building new

### **🏗️ New Architecture Benefits**
- **Monorepo Structure** - All code in one place, shared dependencies
- **Feature-Based Organization** - Easy to find and maintain code
- **Modern Tooling** - Vite, TypeScript 5.8, React 19
- **Professional Standards** - Like Notion, Linear, Vercel
- **Replit Optimized** - Built specifically for your workflow

## 🚀 **Quick Setup**

### **1. Create New GitHub Repository**
```bash
# Create new repo on GitHub (e.g., "fablecraft-v2")
# Clone it locally
git clone https://github.com/yourusername/fablecraft-v2.git
cd fablecraft-v2

# Copy this entire NEW_FABLECRAFT_REPO folder contents to your new repo
```

### **2. Initial Setup**
```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm run install-all

# Copy environment template
cp .env.example .env
```

### **3. Configure Environment**
Edit `.env` file with your settings:
```bash
# Required for basic functionality
DATABASE_URL="your_database_url"
JWT_SECRET="your_secure_secret"

# Optional for AI features
OPENAI_API_KEY="your_openai_key"
```

### **4. Start Development**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:3001
```

## 📋 **Development Workflow**

### **Daily Development**
```bash
# Pull latest changes
git pull

# Start development servers
npm run dev

# Make your changes...

# Check everything works
npm run lint
npm run type-check
npm run test

# Commit and push
git add .
git commit -m "feat: add new feature"
git push
```

### **Adding New Features**
```bash
# Create feature branch
git checkout -b feature/character-relationships

# Work on frontend
cd frontend/src/features/characters/
# Create your components...

# Work on backend  
cd backend/src/api/characters/
# Create your endpoints...

# Test and commit
npm run test
git commit -m "feat: character relationships system"
```

## 🎨 **Frontend Development**

### **Key Technologies**
- **React 19** - Latest React with concurrent features
- **TanStack Router** - Type-safe routing
- **Zustand** - Simple state management
- **shadcn/ui** - Beautiful, accessible components
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations

### **Project Structure**
```
frontend/src/
├── app/                    # App shell, routing, global setup
├── features/               # Feature modules
│   ├── auth/              # Authentication system
│   ├── projects/          # Project management
│   ├── writing/           # Writing interface
│   ├── characters/        # Character development
│   └── world/             # World building
├── shared/                # Shared components & utilities
│   ├── ui/               # UI component library
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand stores
│   └── utils/            # Utility functions
└── assets/               # Static assets
```

### **Creating Components**
```bash
# Create new feature
mkdir frontend/src/features/newfeature
cd frontend/src/features/newfeature

# Create component files
touch index.ts
touch NewFeature.tsx
touch NewFeature.test.tsx
touch useNewFeature.ts
```

## 🔧 **Backend Development**

### **Key Technologies**
- **Node.js + TypeScript** - Modern backend development
- **Express** - Web framework
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Robust database
- **Socket.io** - Real-time features
- **OpenAI API** - AI integration

### **Project Structure**
```
backend/src/
├── api/                   # Route handlers
│   ├── auth/             # Authentication routes
│   ├── projects/         # Project management
│   ├── characters/       # Character system
│   └── ai/               # AI integration
├── services/             # Business logic
├── database/             # Schema, migrations, seeds
├── middleware/           # Express middleware
├── integrations/         # External APIs
└── utils/                # Utility functions
```

### **Creating API Endpoints**
```typescript
// backend/src/api/characters/routes.ts
import { Router } from 'express';
import { getCharacters, createCharacter } from './controller.js';

const router = Router();

router.get('/', getCharacters);
router.post('/', createCharacter);

export default router;
```

## 🗄️ **Database Setup**

### **Using Drizzle ORM**
```bash
# Generate migration
npm run db:generate

# Run migration
npm run db:migrate

# Seed test data
npm run db:seed

# Open database studio
npm run db:studio
```

### **Schema Example**
```typescript
// backend/src/database/schema/projects.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

## 🧪 **Testing**

### **Frontend Testing**
```bash
# Run tests
npm run test:frontend

# Run with UI
npm run test:frontend -- --ui

# Run with coverage
npm run test:frontend -- --coverage
```

### **Backend Testing**
```bash
# Run API tests
npm run test:backend

# Test specific endpoint
npm run test:backend -- characters
```

## 🚀 **Deployment**

### **Replit Deployment**
```bash
# Build for production
npm run build

# The built files will be ready for Replit
# Frontend: frontend/dist/
# Backend: backend/dist/
```

### **Environment Setup for Production**
```bash
# Set production environment variables in Replit
DATABASE_URL=your_production_db
NODE_ENV=production
JWT_SECRET=your_production_secret
```

## 🔄 **Migration from Legacy**

### **Step-by-Step Migration**
1. **Start with Authentication** - Port user system first
2. **Projects** - Migrate project management
3. **Characters** - Move character system
4. **Writing Interface** - Port editor and documents
5. **AI Features** - Integrate AI assistants
6. **World Building** - Add world bible features

### **Migration Commands**
```bash
# Analyze legacy code
cd FABLE/
find . -name "*.tsx" | xargs grep -l "Character"

# Port specific features
cp FABLE/client/src/components/character/ frontend/src/features/characters/
# Then refactor to new architecture...
```

## 📚 **Key Resources**

- **Frontend**: [React 19 Docs](https://react.dev), [TanStack Router](https://tanstack.com/router)
- **Backend**: [Express Guide](https://expressjs.com), [Drizzle ORM](https://orm.drizzle.team)
- **UI**: [shadcn/ui](https://ui.shadcn.com), [Tailwind CSS](https://tailwindcss.com)
- **Database**: [PostgreSQL Docs](https://postgresql.org/docs)

## 🆘 **Getting Help**

### **Common Issues**
- **Port conflicts**: Change ports in `.env` file
- **Database errors**: Check `DATABASE_URL` in `.env`
- **Build failures**: Run `npm run clean && npm install`
- **Type errors**: Run `npm run type-check` for details

### **Debug Commands**
```bash
# Check all packages
npm run type-check

# Clean and reinstall
npm run clean && npm install

# View logs
npm run dev 2>&1 | tee debug.log
```

---

**You now have a modern, professional FableCraft setup!** 🎉

**Next Steps:**
1. ✅ Create new GitHub repository
2. ✅ Copy this structure to your repo
3. ✅ Set up `.env` file
4. ✅ Run `npm run dev`
5. 🚀 Start building amazing features!