# Your Exact Pages and Components Map
*January 28, 2025 - Precise Location Guide*

## 🎯 YOUR EXACT PAGE LOCATIONS

### 🏠 **LANDING PAGE** 
**What You See**: Professional landing page with animated background, hero section, floating orbs
**Location**: `client/src/pages/landing/LandingPage.tsx` (PRIMARY VERSION)
**Secondary**: `client/src/pages/workspace.tsx` (DUPLICATE - ignore this one)
**Routing Logic**: Shows when user is NOT authenticated
**Key Components**:
- Animated floating orbs background
- Hero section with "Craft Your Fable" heading  
- Call-to-action buttons (View Projects, Brainstorm Ideas)
- Feature cards grid
- Professional gradient themes

**Assets Used**: None (all CSS/SVG generated)
**API Calls**: None (static landing page)

---

### 📁 **PROJECTS PAGE**
**What You See**: Grid of project cards, create project functionality
**Location**: `client/src/components/projects/ProjectsPage.tsx` (MAIN VERSION)
**Alternative**: `client/src/components/project/ProjectsView.tsx` (NEWER VERSION)
**Routing Logic**: Shows when user IS authenticated at `/projects`
**Key Components**:
- Project grid layout
- Create project modal
- Project cards with thumbnails
- Filter and search functionality

**API Calls**: 
- `GET /api/projects` (loads user projects)
- `POST /api/projects` (creates new projects)
- `PUT /api/projects/:id` (updates projects)
- `DELETE /api/projects/:id` (deletes projects)

---

### 🏠 **MAIN DASHBOARD** 
**What You See**: When logged in and navigate to `/` or `/dashboard`
**Location**: `client/src/components/project/ProjectDashboard.tsx`
**Routing Logic**: Main authenticated home page
**Key Components**:
- Project overview widgets
- Quick actions panel
- Recent activity
- Performance metrics

---

### 👥 **CHARACTER SYSTEM**
**What You See**: Character management within projects
**Location**: `client/src/components/character/CharacterManager.tsx` (MAIN)
**Sub-components**:
- `CharacterDetailView.tsx` - Individual character details
- `CharacterFormExpanded.tsx` - Character creation/editing form
- `CharacterPortraitModalImproved.tsx` - AI portrait generation
- `CharacterUnifiedViewPremium.tsx` - Advanced character view

**API Calls**:
- `GET /api/projects/:projectId/characters` (loads characters)
- `POST /api/projects/:projectId/characters` (creates characters)
- `PUT /api/characters/:id` (updates characters)
- `DELETE /api/characters/:id` (deletes characters)

---

### 🌍 **WORLD BIBLE SYSTEM**
**What You See**: Complex world-building interface
**Location**: `client/src/components/world/WorldBible.tsx`
**Features**:
- Location management
- Character relationships
- Timeline tracking  
- World-building notes
- Cross-references between elements

**API Calls**: Uses project and character APIs

---

### 🔐 **AUTHENTICATION PAGES**
**What You See**: Login/signup forms
**Primary**: `client/src/pages/AuthPageRedesign.tsx` (NEWER VERSION)
**Secondary**: `client/src/pages/AuthPage.tsx` (OLDER VERSION)  
**Features**:
- Professional login form
- User registration
- Password validation
- Theme-aware styling

**API Calls**:
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/auth/me`

---

## 🔄 **ROUTING LOGIC IN APP.TSX**

The main routing logic is in `client/src/App.tsx` around lines 400-500:

```typescript
// When user is NOT authenticated
if (!isAuthenticated) {
  return <LandingPage onNavigate={navigateToView} ... />
}

// When user IS authenticated, show based on current view:
switch (view) {
  case 'projects': 
    return <ProjectsPage ... />
  case 'dashboard':
    return <ProjectDashboard ... />
  default:
    return <ProjectsPage ... /> // Default authenticated view
}
```

## 🧩 **KEY COMPONENT RELATIONSHIPS**

### Main App Structure:
```
App.tsx (ROOT)
├── LandingPage (unauthenticated users)
├── ProjectsPage (authenticated main view)  
├── ProjectDashboard (dashboard view)
├── CharacterManager (within projects)
├── WorldBible (advanced features)
└── Various Modals (create, edit, delete)
```

### Modal System:
All managed in `client/src/components/Modals.tsx`:
- ProjectModal (create/edit projects)
- ConfirmDeleteModal (delete confirmations)
- ImportManuscriptModal (document import)
- IntelligentImportModal (AI-powered import)

## 🎨 **THEME AND STYLING**

**Theme Provider**: `client/src/components/theme-provider.tsx`
**Theme Switcher**: `client/src/components/theme-toggle.tsx`  
**Available Themes**: 7 custom themes including:
- Arctic Focus
- Golden Hour  
- Midnight Ink
- Forest Manuscript
- Starlit Prose
- Coffee House

## 📊 **ASSETS AND DEPENDENCIES**

**Static Assets**: Primarily CSS/SVG generated (no external image dependencies)
**Key Dependencies**:
- React Query for API state management
- Radix UI for accessible components
- Tailwind CSS for styling
- Lucide React for icons

## 🚨 **DUPLICATES TO IGNORE DURING EXTRACTION**

**Landing Page Duplicates**:
- `client/src/pages/workspace.tsx` (old version - ignore)

**Authentication Duplicates**:
- `client/src/pages/AuthPage.tsx` (old version - use AuthPageRedesign instead)

**Project View Duplicates**:
- Multiple project view implementations (use ProjectsPage.tsx as primary)

**Character System Duplicates**:
- Multiple character unified views (use CharacterManager.tsx as main)

---

**This map gives you EXACTLY what you have and where everything is located for precise extraction.**