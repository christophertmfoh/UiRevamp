import { 
  projects, 
  characters, 
  outlines, 
  proseDocuments, 
  characterRelationships, 
  imageAssets, 
  projectSettings,
  users,
  sessions,
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
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLastLogin(id: string): Promise<void>;

  // Session operations
  createSession(session: InsertSession): Promise<Session>;
  getSessionByToken(token: string): Promise<Session | undefined>;
  deleteSession(token: string): Promise<boolean>;
  deleteExpiredSessions(): Promise<void>;

  // Project operations
  getProjects(userId?: string): Promise<Project[]>;
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
}

class MemoryStorage implements IStorage {
  // User operations
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = {
      id: Date.now().toString(),
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const [createdUser] = await db.insert(users).values(newUser).returning();
    return createdUser;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, id));
  }

  // Session operations
  async createSession(session: InsertSession): Promise<Session> {
    const newSession = {
      id: Date.now().toString(),
      ...session,
      createdAt: new Date()
    };
    const [createdSession] = await db.insert(sessions).values(newSession).returning();
    return createdSession;
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions)
      .where(eq(sessions.token, token));
    
    if (session && session.expiresAt > new Date()) {
      return session;
    }
    return undefined;
  }

  async deleteSession(token: string): Promise<boolean> {
    const result = await db.delete(sessions).where(eq(sessions.token, token));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async deleteExpiredSessions(): Promise<void> {
    const now = new Date();
    await db.delete(sessions).where(eq(sessions.expiresAt, now));
  }

  // Project operations
  async getProjects(userId?: string): Promise<Project[]> {
    if (userId) {
      return await db.select().from(projects)
        .where(eq(projects.userId, userId))
        .orderBy(desc(projects.createdAt));
    }
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(project: any): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return updatedProject || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Character operations
  async getCharacters(projectId: string): Promise<Character[]> {
    return await db.select().from(characters).where(eq(characters.projectId, projectId));
  }

  async getCharacter(id: string): Promise<Character | undefined> {
    const [character] = await db.select().from(characters).where(eq(characters.id, id));
    return character || undefined;
  }

  async createCharacter(character: InsertCharacter): Promise<Character> {
    const [newCharacter] = await db.insert(characters).values(character).returning();
    return newCharacter;
  }

  async updateCharacter(id: string, character: Partial<InsertCharacter>): Promise<Character | undefined> {
    console.log('Storage updateCharacter - incoming data sample:', {
      personalityTraits: character.personalityTraits,
      abilities: character.abilities,
      skills: character.skills,
      types: {
        personalityTraits: typeof character.personalityTraits,
        abilities: typeof character.abilities,
        skills: typeof character.skills
      }
    });
    
    // Filter out undefined and empty array fields to prevent PostgreSQL array errors
    const cleanedCharacter: any = {};
    const arrayFields = ['personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 'tropes', 'tags', 'spokenLanguages'];
    const timestampFields = ['createdAt', 'updatedAt'];
    
    Object.keys(character).forEach(key => {
      const value = (character as any)[key];
      
      if (arrayFields.includes(key)) {
        // Only include array fields if they have actual content
        if (Array.isArray(value) && value.length > 0) {
          cleanedCharacter[key] = value;
        }
        // Skip empty arrays to avoid PostgreSQL issues
      } else if (timestampFields.includes(key)) {
        // Convert timestamp strings/numbers to Date objects
        if (value !== undefined && value !== null) {
          cleanedCharacter[key] = new Date(value);
        }
      } else if (value !== undefined && value !== null) {
        cleanedCharacter[key] = value;
      }
    });
    
    console.log('Cleaned character data for update:', {
      originalKeys: Object.keys(character),
      cleanedKeys: Object.keys(cleanedCharacter),
      skippedArrays: arrayFields.filter(field => 
        Array.isArray((character as any)[field]) && (character as any)[field].length === 0
      )
    });
    
    const [updatedCharacter] = await db.update(characters).set(cleanedCharacter).where(eq(characters.id, id)).returning();
    return updatedCharacter || undefined;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const result = await db.delete(characters).where(eq(characters.id, id));
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
      .where(eq(imageAssets.entityType, entityType))
      .where(eq(imageAssets.entityId, entityId));
  }

  // Project Settings operations
  async getProjectSettings(projectId: string): Promise<ProjectSettings | undefined> {
    const [settings] = await db.select().from(projectSettings).where(eq(projectSettings.projectId, projectId));
    return settings || undefined;
  }

  async updateProjectSettings(projectId: string, settings: Partial<InsertProjectSettings>): Promise<ProjectSettings> {
    const existing = await this.getProjectSettings(projectId);
    
    if (existing) {
      const [updatedSettings] = await db.update(projectSettings)
        .set(settings)
        .where(eq(projectSettings.projectId, projectId))
        .returning();
      return updatedSettings;
    } else {
      const newSettings: InsertProjectSettings = {
        id: `settings_${Date.now()}`,
        projectId,
        ...settings
      };
      const [createdSettings] = await db.insert(projectSettings).values(newSettings).returning();
      return createdSettings;
    }
  }
}

export const storage = new MemoryStorage();