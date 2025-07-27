import { 
  projects, 
  characters, 
  outlines, 
  proseDocuments, 
  characterRelationships, 
  imageAssets, 
  projectSettings,
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
  type InsertProjectSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, inArray, and } from "drizzle-orm";

// Simple in-memory cache for frequently accessed data
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

const cache = new SimpleCache();

export interface IStorage {
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: any): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Character operations
  getCharacters(projectId: string): Promise<Character[]>;
  getCharacter(id: string): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: string, character: Partial<InsertCharacter>): Promise<Character | undefined>;
  deleteCharacter(id: string): Promise<boolean>;

  // Batch operations for performance
  createCharacters(characters: InsertCharacter[]): Promise<Character[]>;
  getCharactersByIds(ids: string[]): Promise<Character[]>;

  // Outline operations
  getOutlines(projectId: string): Promise<Outline[]>;
  getOutline(id: string): Promise<Outline | undefined>;
  createOutline(outline: InsertOutline): Promise<Outline>;
  updateOutline(id: string, outline: Partial<InsertOutline>): Promise<Outline | undefined>;
  deleteOutline(id: string): Promise<boolean>;

  // Prose Document operations
  getProseDocuments(projectId: string): Promise<ProseDocument[]>;
  getProseDocument(id: string): Promise<ProseDocument | undefined>;
  createProseDocument(proseDocument: InsertProseDocument): Promise<ProseDocument>;
  updateProseDocument(id: string, proseDocument: Partial<InsertProseDocument>): Promise<ProseDocument | undefined>;
  deleteProseDocument(id: string): Promise<boolean>;

  // Character Relationship operations
  getCharacterRelationships(characterId: string): Promise<CharacterRelationship[]>;
  createCharacterRelationship(relationship: InsertCharacterRelationship): Promise<CharacterRelationship>;
  updateCharacterRelationship(id: string, relationship: Partial<InsertCharacterRelationship>): Promise<CharacterRelationship | undefined>;
  deleteCharacterRelationship(id: string): Promise<boolean>;

  // Image Asset operations
  createImageAsset(imageAsset: InsertImageAsset): Promise<ImageAsset>;
  getImageAssets(entityType: string, entityId: string): Promise<ImageAsset[]>;

  // Project Settings operations
  getProjectSettings(projectId: string): Promise<ProjectSettings | undefined>;
  updateProjectSettings(projectId: string, settings: Partial<InsertProjectSettings>): Promise<ProjectSettings>;

  // Cache management
  clearCache(): void;
  getCacheStats(): any;
}

class MemoryStorage implements IStorage {
  // Project operations with caching
  async getProjects(): Promise<Project[]> {
    const cacheKey = 'projects:all';
    const cached = cache.get<Project[]>(cacheKey);
    if (cached) return cached;

    const result = await db.select().from(projects).orderBy(desc(projects.createdAt));
    cache.set(cacheKey, result, 2 * 60 * 1000); // 2 minutes TTL
    return result;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const cacheKey = `project:${id}`;
    const cached = cache.get<Project>(cacheKey);
    if (cached) return cached;

    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    if (project) {
      cache.set(cacheKey, project);
    }
    return project || undefined;
  }

  async createProject(project: any): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    // Invalidate projects cache
    cache.invalidate('projects:');
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    // Invalidate caches
    cache.invalidate('projects:');
    cache.invalidate(`project:${id}`);
    return updatedProject || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    // Invalidate caches
    cache.invalidate('projects:');
    cache.invalidate(`project:${id}`);
    cache.invalidate(`characters:${id}`);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Character operations with caching and batch support
  async getCharacters(projectId: string): Promise<Character[]> {
    const cacheKey = `characters:${projectId}`;
    const cached = cache.get<Character[]>(cacheKey);
    if (cached) return cached;

    const result = await db.select().from(characters).where(eq(characters.projectId, projectId));
    cache.set(cacheKey, result);
    return result;
  }

  async getCharacter(id: string): Promise<Character | undefined> {
    const cacheKey = `character:${id}`;
    const cached = cache.get<Character>(cacheKey);
    if (cached) return cached;

    const [character] = await db.select().from(characters).where(eq(characters.id, id));
    if (character) {
      cache.set(cacheKey, character);
    }
    return character || undefined;
  }

  // Batch character retrieval for performance
  async getCharactersByIds(ids: string[]): Promise<Character[]> {
    if (ids.length === 0) return [];
    
    // Check cache first
    const cachedResults: Character[] = [];
    const uncachedIds: string[] = [];
    
    for (const id of ids) {
      const cached = cache.get<Character>(`character:${id}`);
      if (cached) {
        cachedResults.push(cached);
      } else {
        uncachedIds.push(id);
      }
    }

    // Fetch uncached characters in batch
    let uncachedResults: Character[] = [];
    if (uncachedIds.length > 0) {
      uncachedResults = await db.select().from(characters).where(inArray(characters.id, uncachedIds));
      
      // Cache the results
      for (const character of uncachedResults) {
        cache.set(`character:${character.id}`, character);
      }
    }

    return [...cachedResults, ...uncachedResults];
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    console.log('Storage updateCharacter - incoming data sample:', {
      name: character.name,
      role: character.role,
      personalityTraits: Array.isArray(character.personalityTraits) ? character.personalityTraits.slice(0, 2) : character.personalityTraits,
      skills: Array.isArray(character.skills) ? character.skills.slice(0, 2) : character.skills,
      hasPersonalityTraits: !!character.personalityTraits,
      hasSkills: !!character.skills
    });

    // Transform arrays to proper format if needed
    const processedCharacter = {
      ...character,
      personalityTraits: Array.isArray(character.personalityTraits) 
        ? character.personalityTraits.filter(trait => trait && trait.trim()) 
        : (character.personalityTraits || '').split(',').map(s => s.trim()).filter(s => s),
      skills: Array.isArray(character.skills) 
        ? character.skills.filter(skill => skill && skill.trim()) 
        : (character.skills || '').split(',').map(s => s.trim()).filter(s => s),
      talents: Array.isArray(character.talents) 
        ? character.talents.filter(talent => talent && talent.trim()) 
        : (character.talents || '').split(',').map(s => s.trim()).filter(s => s),
      archetypes: Array.isArray(character.archetypes) 
        ? character.archetypes.filter(archetype => archetype && archetype.trim()) 
        : (character.archetypes || '').split(',').map(s => s.trim()).filter(s => s)
    };

    // Remove empty arrays to prevent database errors
    Object.keys(processedCharacter).forEach(key => {
      const value = (processedCharacter as any)[key];
      if (Array.isArray(value) && value.length === 0) {
        delete (processedCharacter as any)[key];
      }
    });

    const [newCharacter] = await db.insert(characters).values(processedCharacter).returning();
    
    // Invalidate caches
    cache.invalidate(`characters:${character.projectId}`);
    
    return newCharacter;
  }

  // Batch character creation for performance
  async createCharacters(characterList: InsertCharacter[]): Promise<Character[]> {
    if (characterList.length === 0) return [];

    const processedCharacters = characterList.map(character => {
      // Same processing logic as createCharacter
      const processed = {
        ...character,
        personalityTraits: Array.isArray(character.personalityTraits) 
          ? character.personalityTraits.filter(trait => trait && trait.trim()) 
          : (character.personalityTraits || '').split(',').map(s => s.trim()).filter(s => s),
        skills: Array.isArray(character.skills) 
          ? character.skills.filter(skill => skill && skill.trim()) 
          : (character.skills || '').split(',').map(s => s.trim()).filter(s => s),
        talents: Array.isArray(character.talents) 
          ? character.talents.filter(talent => talent && talent.trim()) 
          : (character.talents || '').split(',').map(s => s.trim()).filter(s => s),
        archetypes: Array.isArray(character.archetypes) 
          ? character.archetypes.filter(archetype => archetype && archetype.trim()) 
          : (character.archetypes || '').split(',').map(s => s.trim()).filter(s => s)
      };

      // Remove empty arrays
      Object.keys(processed).forEach(key => {
        const value = (processed as any)[key];
        if (Array.isArray(value) && value.length === 0) {
          delete (processed as any)[key];
        }
      });

      return processed;
    });

    const newCharacters = await db.insert(characters).values(processedCharacters).returning();
    
    // Invalidate caches for all affected projects
    const projectIds = [...new Set(characterList.map(c => c.projectId))];
    for (const projectId of projectIds) {
      cache.invalidate(`characters:${projectId}`);
    }
    
    return newCharacters;
  }

  async updateCharacter(id: string, character: Partial<InsertCharacter>): Promise<Character | undefined> {
    console.log('Storage updateCharacter - incoming data sample:', {
      id,
      name: character.name,
      role: character.role,
      personalityTraits: Array.isArray(character.personalityTraits) ? character.personalityTraits.slice(0, 2) : character.personalityTraits,
      skills: Array.isArray(character.skills) ? character.skills.slice(0, 2) : character.skills,
      hasPersonalityTraits: !!character.personalityTraits,
      hasSkills: !!character.skills
    });

    // Filter out undefined and empty array fields to prevent PostgreSQL array errors
    const cleanedData: Record<string, any> = {};
    
    Object.entries(character).forEach(([key, value]) => {
      if (value === null) {
        cleanedData[key] = '';
      } else if (Array.isArray(value)) {
        // Filter out empty strings and ensure it's actually an array
        const filteredArray = value.filter(item => item && typeof item === 'string' && item.trim());
        // Skip empty arrays to avoid PostgreSQL issues
        if (filteredArray.length > 0) {
          cleanedData[key] = filteredArray;
        }
      } else if (value !== undefined) {
        cleanedData[key] = value;
      }
    });

    console.log('Cleaned character data for update:', {
      id,
      name: cleanedData.name,
      keysCount: Object.keys(cleanedData).length,
      hasPersonalityTraits: !!cleanedData.personalityTraits,
      personalityTraitsLength: Array.isArray(cleanedData.personalityTraits) ? cleanedData.personalityTraits.length : 'not array',
      hasSkills: !!cleanedData.skills,
      skillsLength: Array.isArray(cleanedData.skills) ? cleanedData.skills.length : 'not array'
    });

    try {
      const [updatedCharacter] = await db.update(characters).set(cleanedData).where(eq(characters.id, id)).returning();
      
      // Invalidate caches
      cache.invalidate(`character:${id}`);
      if (updatedCharacter) {
        cache.invalidate(`characters:${updatedCharacter.projectId}`);
      }
      
      return updatedCharacter || undefined;
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  }

  async deleteCharacter(id: string): Promise<boolean> {
    // Get character first to invalidate project cache
    const character = await this.getCharacter(id);
    
    const result = await db.delete(characters).where(eq(characters.id, id));
    
    // Invalidate caches
    cache.invalidate(`character:${id}`);
    if (character) {
      cache.invalidate(`characters:${character.projectId}`);
    }
    
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Outline operations
  async getOutlines(projectId: string): Promise<Outline[]> {
    return await db.select().from(outlines).where(eq(outlines.projectId, projectId));
  }

  async getOutline(id: string): Promise<Outline | undefined> {
    const [outline] = await db.select().from(outlines).where(eq(outlines.id, id));
    return outline || undefined;
  }

  async createOutline(outline: InsertOutline): Promise<Outline> {
    const [newOutline] = await db.insert(outlines).values(outline).returning();
    return newOutline;
  }

  async updateOutline(id: string, outline: Partial<InsertOutline>): Promise<Outline | undefined> {
    const [updatedOutline] = await db.update(outlines).set(outline).where(eq(outlines.id, id)).returning();
    return updatedOutline || undefined;
  }

  async deleteOutline(id: string): Promise<boolean> {
    const result = await db.delete(outlines).where(eq(outlines.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Prose Document operations
  async getProseDocuments(projectId: string): Promise<ProseDocument[]> {
    return await db.select().from(proseDocuments).where(eq(proseDocuments.projectId, projectId));
  }

  async getProseDocument(id: string): Promise<ProseDocument | undefined> {
    const [proseDocument] = await db.select().from(proseDocuments).where(eq(proseDocuments.id, id));
    return proseDocument || undefined;
  }

  async createProseDocument(proseDocument: InsertProseDocument): Promise<ProseDocument> {
    const [newProseDocument] = await db.insert(proseDocuments).values(proseDocument).returning();
    return newProseDocument;
  }

  async updateProseDocument(id: string, proseDocument: Partial<InsertProseDocument>): Promise<ProseDocument | undefined> {
    const [updatedProseDocument] = await db.update(proseDocuments).set(proseDocument).where(eq(proseDocuments.id, id)).returning();
    return updatedProseDocument || undefined;
  }

  async deleteProseDocument(id: string): Promise<boolean> {
    const result = await db.delete(proseDocuments).where(eq(proseDocuments.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Character Relationship operations
  async getCharacterRelationships(characterId: string): Promise<CharacterRelationship[]> {
    return await db.select().from(characterRelationships).where(eq(characterRelationships.characterId, characterId));
  }

  async createCharacterRelationship(relationship: InsertCharacterRelationship): Promise<CharacterRelationship> {
    const [newRelationship] = await db.insert(characterRelationships).values(relationship).returning();
    return newRelationship;
  }

  async updateCharacterRelationship(id: string, relationship: Partial<InsertCharacterRelationship>): Promise<CharacterRelationship | undefined> {
    const [updatedRelationship] = await db.update(characterRelationships).set(relationship).where(eq(characterRelationships.id, id)).returning();
    return updatedRelationship || undefined;
  }

  async deleteCharacterRelationship(id: string): Promise<boolean> {
    const result = await db.delete(characterRelationships).where(eq(characterRelationships.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Image Asset operations
  async createImageAsset(imageAsset: InsertImageAsset): Promise<ImageAsset> {
    const [newImageAsset] = await db.insert(imageAssets).values(imageAsset).returning();
    return newImageAsset;
  }

  async getImageAssets(entityType: string, entityId: string): Promise<ImageAsset[]> {
    return await db.select().from(imageAssets)
      .where(and(eq(imageAssets.entityType, entityType), eq(imageAssets.entityId, entityId)));
  }

  // Project Settings operations
  async getProjectSettings(projectId: string): Promise<ProjectSettings | undefined> {
    const [settings] = await db.select().from(projectSettings).where(eq(projectSettings.projectId, projectId));
    return settings || undefined;
  }

  async updateProjectSettings(projectId: string, settings: Partial<InsertProjectSettings>): Promise<ProjectSettings> {
    const [updatedSettings] = await db.update(projectSettings).set(settings).where(eq(projectSettings.projectId, projectId)).returning();
    return updatedSettings;
  }

  // Cache management methods
  clearCache(): void {
    cache.clear();
  }

  getCacheStats(): any {
    return cache.getStats();
  }
}

export const storage = new MemoryStorage();