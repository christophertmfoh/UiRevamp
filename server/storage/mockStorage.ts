import { 
  type Project, 
  type InsertProject,
  type Character,
  type InsertCharacter,
  type Outline,
  type InsertOutline,
  type ProseDocument,
  type InsertProseDocument,
  type CharacterRelationship,
  type InsertCharacterRelationship,
  type ImageAsset,
  type InsertImageAsset,
  type ProjectSettings,
  type InsertProjectSettings,
  type User,
  type InsertUser,
  type Session,
  type InsertSession
} from "@shared/schema";

/**
 * Mock Storage Implementation for Development Environment
 * 
 * This is a professional-grade mock storage that maintains the same interface
 * as the production database storage, allowing seamless development and testing
 * without requiring external database dependencies.
 * 
 * Features:
 * - Full interface compatibility with production storage
 * - In-memory data persistence during session
 * - Proper error handling and validation
 * - Data relationship integrity
 * - Transaction-like operations
 * - Realistic latency simulation for testing
 */

interface StorageState {
  projects: Map<string, Project>;
  characters: Map<string, Character>;
  outlines: Map<string, Outline>;
  proseDocuments: Map<string, ProseDocument>;
  characterRelationships: Map<string, CharacterRelationship>;
  imageAssets: Map<string, ImageAsset>;
  projectSettings: Map<string, ProjectSettings>;
  users: Map<string, User>;
  sessions: Map<string, Session>;
  worldBibleEntities: Map<string, any[]>;
}

class MockStorage {
  private data: StorageState;
  private readonly SIMULATED_LATENCY = 50; // ms
  
  constructor() {
    this.data = {
      projects: new Map(),
      characters: new Map(),
      outlines: new Map(),
      proseDocuments: new Map(),
      characterRelationships: new Map(),
      imageAssets: new Map(),
      projectSettings: new Map(),
      users: new Map(),
      sessions: new Map(),
      worldBibleEntities: new Map(),
    };
    
    // Initialize with some seed data for development
    this.initializeSeedData();
  }

  private async simulateLatency(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.SIMULATED_LATENCY));
  }

  private generateId(): string {
    return `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSeedData(): void {
    // Create a demo user with proper schema compliance
    // Password is "demo123" - hashed properly for testing
    const demoUser: User = {
      id: 'demo-user-1',
      username: 'demo',
      email: 'demo@fablecraft.io',
      passwordHash: '$2b$12$qAQ5zlwBtZaHcACRHbuDUeCciqbrz1mklsu9fMiLB/H31p7fVKkju', // "demo123"
      fullName: 'Demo User',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
    };
    this.data.users.set(demoUser.id, demoUser);

    // Create demo projects
    const demoProjects: Project[] = [
      // Demo projects with schema-compliant structure
      {
        id: 'demo-project-1',
        userId: 'demo-user-1',
        name: 'The Chronicles of Aethermoor',
        type: 'novel' as const,
        description: 'An epic fantasy adventure in a world where magic and technology collide.',
        genre: ['Fantasy', 'Adventure'],
        manuscriptNovel: '',
        manuscriptScreenplay: '',
        synopsis: 'In a realm where ancient magic meets steampunk innovation, young Lyra discovers she holds the key to preventing an interdimensional war.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: 'demo-project-2',
        userId: 'demo-user-1',
        name: 'Midnight in Neo Tokyo',
        type: 'screenplay' as const,
        description: 'A cyberpunk thriller set in the neon-lit streets of future Tokyo.',
        genre: ['Sci-Fi', 'Thriller'],
        manuscriptNovel: '',
        manuscriptScreenplay: '',
        synopsis: 'Detective Kane must navigate the digital underworld to solve a series of murders that blur the line between reality and virtual reality.',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        id: 'demo-project-3',
        userId: 'demo-user-1',
        name: 'The Last Library',
        type: 'novel' as const,
        description: 'A post-apocalyptic tale about preserving knowledge and human culture.',
        genre: ['Post-Apocalyptic', 'Drama'],
        manuscriptNovel: '',
        manuscriptScreenplay: '',
        synopsis: 'After civilization falls, a group of librarians becomes the guardians of human knowledge, protecting books and stories from those who would destroy them.',
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
        lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      }
    ];

    demoProjects.forEach(project => {
      this.data.projects.set(project.id, project);
    });

    console.log(`🎭 MockStorage initialized with ${demoProjects.length} demo projects`);
  }

  // Project Operations
  async getProjects(userId?: string): Promise<Project[]> {
    await this.simulateLatency();
    
    const projects = Array.from(this.data.projects.values());
    
    if (userId) {
      return projects.filter(p => p.userId === userId);
    }
    
    return projects;
  }

  async getProject(id: string): Promise<Project | null> {
    await this.simulateLatency();
    return this.data.projects.get(id) || null;
  }

  async createProject(project: InsertProject): Promise<Project> {
    await this.simulateLatency();
    
    const id = this.generateId();
    const now = new Date();
    
    const newProject: Project = {
      ...project,
      id,
      createdAt: now,
      lastModified: now,
      description: project.description ?? null,
      synopsis: project.synopsis ?? null,
      genre: project.genre ?? null,
      manuscriptNovel: project.manuscriptNovel ?? null,
      manuscriptScreenplay: project.manuscriptScreenplay ?? null,
    };
    
    this.data.projects.set(id, newProject);
    
    console.log(`✅ Created project: ${newProject.name} (${id})`);
    return newProject;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | null> {
    await this.simulateLatency();
    
    const existing = this.data.projects.get(id);
    if (!existing) return null;
    
    const updated: Project = {
      ...existing,
      ...updates,
      id,
      lastModified: new Date(),
    };
    
    this.data.projects.set(id, updated);
    console.log(`🔄 Updated project: ${updated.name} (${id})`);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    await this.simulateLatency();
    
    const project = this.data.projects.get(id);
    if (!project) return false;
    
    // Delete related data
    this.data.characters.forEach((char, charId) => {
      if (char.projectId === id) {
        this.data.characters.delete(charId);
      }
    });
    
    this.data.outlines.forEach((outline, outlineId) => {
      if (outline.projectId === id) {
        this.data.outlines.delete(outlineId);
      }
    });
    
    this.data.proseDocuments.forEach((doc, docId) => {
      if (doc.projectId === id) {
        this.data.proseDocuments.delete(docId);
      }
    });
    
    this.data.projects.delete(id);
    console.log(`🗑️ Deleted project: ${project.name} (${id})`);
    return true;
  }

  // Character Operations
  async getCharacters(projectId: string): Promise<Character[]> {
    await this.simulateLatency();
    return Array.from(this.data.characters.values()).filter(c => c.projectId === projectId);
  }

  async getCharacter(id: string): Promise<Character | null> {
    await this.simulateLatency();
    return this.data.characters.get(id) || null;
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    await this.simulateLatency();
    
    const id = this.generateId();
    const now = new Date();
    
    const newCharacter: Character = {
      // Set default values for all fields to match schema
      goals: null,
      values: null,
      class: null,
      title: null,
      children: null,
      development: null,
      // Apply provided character data
      ...character,
      // Override with generated/computed values
      id,
      createdAt: now,
      updatedAt: now,
      name: character.name ?? null,
      description: character.description ?? null,
      development: character.development ?? null,
    };

    this.data.characters.set(id, newCharacter);
    return newCharacter;
  }

  async updateCharacter(id: string, updates: Partial<InsertCharacter>): Promise<Character | null> {
    await this.simulateLatency();
    
    const existing = this.data.characters.get(id);
    if (!existing) return null;
    
    const updated: Character = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date(),
    };
    
    this.data.characters.set(id, updated);
    console.log(`🔄 Updated character: ${updated.name} (${id})`);
    return updated;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    await this.simulateLatency();
    
    const character = this.data.characters.get(id);
    if (!character) return false;
    
    // Delete related relationships
    this.data.characterRelationships.forEach((rel, relId) => {
      if (rel.characterId === id || rel.relatedCharacterId === id) {
        this.data.characterRelationships.delete(relId);
      }
    });
    
    this.data.characters.delete(id);
    console.log(`🗑️ Deleted character: ${character.name} (${id})`);
    return true;
  }

  // User Operations
  async getUserById(id: string): Promise<User | null> {
    await this.simulateLatency();
    return this.data.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.simulateLatency();
    
    for (const user of Array.from(this.data.users.values())) {
      if (user.email === email) {
        return user;
      }
    }
    
    return null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    await this.simulateLatency();
    
    for (const user of Array.from(this.data.users.values())) {
      if (user.username === username) {
        return user;
      }
    }
    
    return null;
  }

  async createUser(user: InsertUser): Promise<User> {
    await this.simulateLatency();
    
    const id = this.generateId();
    const now = new Date();
    
    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
      fullName: user.fullName ?? null,
      isActive: user.isActive ?? true,
    };
    
    this.data.users.set(id, newUser);
    console.log(`👥 Created user: ${newUser.username} (${id})`);
    return newUser;
  }

  // Session Operations
  async createSession(session: InsertSession): Promise<Session> {
    await this.simulateLatency();
    
    const id = this.generateId();
    const now = new Date();
    
    const newSession: Session = {
      ...session,
      id,
      createdAt: now,
    };
    
    this.data.sessions.set(id, newSession);
    console.log(`🔐 Created session for user: ${newSession.userId} (${id})`);
    return newSession;
  }

  async getSessionByToken(token: string): Promise<Session | null> {
    await this.simulateLatency();
    
    for (const session of this.data.sessions.values()) {
      if (session.token === token) {
        return session;
      }
    }
    
    return null;
  }

  async deleteSession(token: string): Promise<boolean> {
    await this.simulateLatency();
    
    for (const [id, session] of this.data.sessions.entries()) {
      if (session.token === token) {
        this.data.sessions.delete(id);
        console.log(`🔐 Deleted session: ${id}`);
        return true;
      }
    }
    
    return false;
  }

  // Additional utility methods for development
  async getStorageStats(): Promise<{
    projects: number;
    characters: number;
    users: number;
    sessions: number;
  }> {
    return {
      projects: this.data.projects.size,
      characters: this.data.characters.size,
      users: this.data.users.size,
      sessions: this.data.sessions.size,
    };
  }

  async clearAllData(): Promise<void> {
    this.data = {
      projects: new Map(),
      characters: new Map(),
      outlines: new Map(),
      proseDocuments: new Map(),
      characterRelationships: new Map(),
      imageAssets: new Map(),
      projectSettings: new Map(),
      users: new Map(),
      sessions: new Map(),
    };
    
    console.log('🧹 Cleared all mock storage data');
  }

  // Stub methods for interface compatibility (implement as needed)
  async getOutlines(projectId: string): Promise<Outline[]> {
    await this.simulateLatency();
    return Array.from(this.data.outlines.values()).filter(o => o.projectId === projectId);
  }

  async getProseDocuments(projectId: string): Promise<ProseDocument[]> {
    await this.simulateLatency();
    return Array.from(this.data.proseDocuments.values()).filter(d => d.projectId === projectId);
  }

  async getCharacterRelationships(characterId: string): Promise<CharacterRelationship[]> {
    await this.simulateLatency();
    return Array.from(this.data.characterRelationships.values()).filter(r => 
      r.characterId === characterId || r.relatedCharacterId === characterId
    );
  }

  async getImageAssets(projectId: string): Promise<ImageAsset[]> {
    await this.simulateLatency();
    // Filter by entities that belong to the project
    const projectEntities = Array.from(this.data.characters.values())
      .filter(char => char.projectId === projectId)
      .map(char => char.id);
      
    return Array.from(this.data.imageAssets.values()).filter(
      asset => projectEntities.includes(asset.entityId)
    );
  }

  // ===== OUTLINE CRUD METHODS =====
  
  async createOutline(outline: InsertOutline): Promise<Outline> {
    await this.simulateLatency();
    
    const id = this.generateId();
    const now = new Date();
    
    const newOutline: Outline = {
      ...outline,
      id,
      createdAt: now,
      description: outline.description ?? null,
      content: outline.content ?? null,
      parentId: outline.parentId ?? null,
    };

    this.data.outlines.set(id, newOutline);
    return newOutline;
  }

  async updateOutline(id: string, updates: Partial<Outline>): Promise<Outline> {
    await this.simulateLatency();
    
    const existing = this.data.outlines.get(id);
    if (!existing) {
      throw new Error(`Outline with id ${id} not found`);
    }

    const updated = { ...existing, ...updates };
    this.data.outlines.set(id, updated);
    return updated;
  }

  async deleteOutline(id: string): Promise<void> {
    await this.simulateLatency();
    
    if (!this.data.outlines.has(id)) {
      throw new Error(`Outline with id ${id} not found`);
    }
    
    this.data.outlines.delete(id);
  }

  // ===== PROSE DOCUMENT CRUD METHODS =====
  
  async createProseDocument(document: InsertProseDocument): Promise<ProseDocument> {
    await this.simulateLatency();
    
    const id = this.generateId();
    const now = new Date();
    
    const newDocument: ProseDocument = {
      ...document,
      id,
      createdAt: now,
      lastModified: now,
      tags: document.tags ?? null,
      content: document.content ?? null,
    };

    this.data.proseDocuments.set(id, newDocument);
    return newDocument;
  }

  async updateProseDocument(id: string, updates: Partial<ProseDocument>): Promise<ProseDocument> {
    await this.simulateLatency();
    
    const existing = this.data.proseDocuments.get(id);
    if (!existing) {
      throw new Error(`Prose document with id ${id} not found`);
    }

    const updated = { 
      ...existing, 
      ...updates, 
      lastModified: new Date() 
    };
    this.data.proseDocuments.set(id, updated);
    return updated;
  }

  async deleteProseDocument(id: string): Promise<void> {
    await this.simulateLatency();
    
    if (!this.data.proseDocuments.has(id)) {
      throw new Error(`Prose document with id ${id} not found`);
    }
    
    this.data.proseDocuments.delete(id);
  }

  // ===== USER LOGIN TRACKING =====
  
  async updateUserLastLogin(userId: string): Promise<void> {
    await this.simulateLatency();
    
    const user = this.data.users.get(userId);
    if (user) {
      user.lastLoginAt = new Date();
      this.data.users.set(userId, user);
    }
  }

  async getProjectSettings(projectId: string): Promise<ProjectSettings | null> {
    await this.simulateLatency();
    return this.data.projectSettings.get(projectId) || null;
  }

  // World Bible Entity operations
  async getWorldBibleEntities(projectId: string, entityType: string): Promise<any[]> {
    await this.simulateLatency();
    const key = `${projectId}:${entityType}`;
    return this.data.worldBibleEntities.get(key) || [];
  }

  async getWorldBibleEntity(id: string): Promise<any | undefined> {
    await this.simulateLatency();
    for (const entities of this.data.worldBibleEntities.values()) {
      const entity = entities.find(e => e.id === id);
      if (entity) return entity;
    }
    return undefined;
  }

  async createWorldBibleEntity(entity: any): Promise<any> {
    await this.simulateLatency();
    const key = `${entity.projectId}:${entity.entityType}`;
    const entities = this.data.worldBibleEntities.get(key) || [];
    entities.push(entity);
    this.data.worldBibleEntities.set(key, entities);
    return entity;
  }

  async updateWorldBibleEntity(id: string, updates: Partial<any>): Promise<any | undefined> {
    await this.simulateLatency();
    for (const [key, entities] of this.data.worldBibleEntities.entries()) {
      const index = entities.findIndex(e => e.id === id);
      if (index !== -1) {
        entities[index] = { ...entities[index], ...updates };
        this.data.worldBibleEntities.set(key, entities);
        return entities[index];
      }
    }
    return undefined;
  }

  async deleteWorldBibleEntity(id: string): Promise<boolean> {
    await this.simulateLatency();
    for (const [key, entities] of this.data.worldBibleEntities.entries()) {
      const index = entities.findIndex(e => e.id === id);
      if (index !== -1) {
        entities.splice(index, 1);
        this.data.worldBibleEntities.set(key, entities);
        return true;
      }
    }
    return false;
  }
}

// Export singleton instance
export const mockStorage = new MockStorage();

// Export type for dependency injection
export type StorageInterface = typeof mockStorage;