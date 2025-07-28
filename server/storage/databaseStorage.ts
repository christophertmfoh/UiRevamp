import { 
  users, projects, characters, outlines, proseDocuments, characterRelationships, 
  imageAssets, projectSettings, sessions,
  type User, type InsertUser,
  type Project, type InsertProject,
  type Character, type InsertCharacter,
  type Outline, type InsertOutline,
  type ProseDocument, type InsertProseDocument,
  type CharacterRelationship, type InsertCharacterRelationship,
  type ImageAsset, type InsertImageAsset,
  type ProjectSettings, type InsertProjectSettings,
  type Session, type InsertSession
} from "@shared/schema";
import { db } from "../db";
import { eq, and, gt } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { IStorage } from "../storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUserByEmail(email: string): Promise<User | undefined> {
    const start = performance.now();
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      const duration = performance.now() - start;
      console.log(`⚡ DatabaseStorage.getUserByEmail: ${duration.toFixed(2)}ms`);
      return user || undefined;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ DatabaseStorage.getUserByEmail failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const start = performance.now();
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      const duration = performance.now() - start;
      console.log(`⚡ DatabaseStorage.getUserByUsername: ${duration.toFixed(2)}ms`);
      return user || undefined;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ DatabaseStorage.getUserByUsername failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | undefined> {
    const start = performance.now();
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      const duration = performance.now() - start;
      console.log(`⚡ DatabaseStorage.getUserById: ${duration.toFixed(2)}ms`);
      return user || undefined;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ DatabaseStorage.getUserById failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    const start = performance.now();
    try {
      const newUser = {
        id: nanoid(),
        ...user,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const [created] = await db.insert(users).values(newUser).returning();
      const duration = performance.now() - start;
      console.log(`⚡ DatabaseStorage.createUser: ${duration.toFixed(2)}ms`);
      return created;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ DatabaseStorage.createUser failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db.update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, id));
  }

  // Session operations
  async createSession(session: InsertSession): Promise<Session> {
    const newSession = {
      id: nanoid(),
      ...session,
      createdAt: new Date()
    };
    
    const [created] = await db.insert(sessions).values(newSession).returning();
    return created;
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions)
      .where(and(
        eq(sessions.token, token),
        gt(sessions.expiresAt, new Date())
      ));
    return session || undefined;
  }

  async deleteSession(token: string): Promise<boolean> {
    const result = await db.delete(sessions).where(eq(sessions.token, token));
    return (result.rowCount ?? 0) > 0;
  }

  async deleteExpiredSessions(): Promise<void> {
    await db.delete(sessions).where(gt(sessions.expiresAt, new Date()));
  }

  // Project operations
  async getProjects(userId?: string): Promise<Project[]> {
    const start = performance.now();
    try {
      const results = userId 
        ? await db.select().from(projects).where(eq(projects.userId, userId))
        : await db.select().from(projects);
      const duration = performance.now() - start;
      console.log(`⚡ DatabaseStorage.getProjects: ${duration.toFixed(2)}ms (${results.length} projects)`);
      return results;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ DatabaseStorage.getProjects failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  async getProject(id: string): Promise<Project | undefined> {
    const start = performance.now();
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, id));
      const duration = performance.now() - start;
      console.log(`⚡ DatabaseStorage.getProject: ${duration.toFixed(2)}ms`);
      return project || undefined;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ DatabaseStorage.getProject failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  async createProject(project: any): Promise<Project> {
    const start = performance.now();
    try {
      const newProject = {
        id: nanoid(),
        ...project,
        createdAt: new Date(),
        lastModified: new Date()
      };
      
      const [created] = await db.insert(projects).values(newProject).returning();
      const duration = performance.now() - start;
      console.log(`⚡ DatabaseStorage.createProject: ${duration.toFixed(2)}ms`);
      return created;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ DatabaseStorage.createProject failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db.update(projects)
      .set({ ...project, lastModified: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return (result.rowCount ?? 0) > 0;
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
    const newCharacter = {
      ...character,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const [created] = await db.insert(characters).values(newCharacter).returning();
    return created;
  }

  async updateCharacter(id: string, character: Partial<InsertCharacter>): Promise<Character | undefined> {
    const [updated] = await db.update(characters)
      .set({ ...character, updatedAt: new Date() })
      .where(eq(characters.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const result = await db.delete(characters).where(eq(characters.id, id));
    return (result.rowCount ?? 0) > 0;
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
    const newOutline = {
      ...outline,
      id: nanoid(),
      createdAt: new Date()
    };
    
    const [created] = await db.insert(outlines).values(newOutline).returning();
    return created;
  }

  async updateOutline(id: string, outline: Partial<InsertOutline>): Promise<Outline | undefined> {
    const [updated] = await db.update(outlines)
      .set(outline)
      .where(eq(outlines.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteOutline(id: string): Promise<boolean> {
    const result = await db.delete(outlines).where(eq(outlines.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Prose Document operations
  async getProseDocuments(projectId: string): Promise<ProseDocument[]> {
    return await db.select().from(proseDocuments).where(eq(proseDocuments.projectId, projectId));
  }

  async getProseDocument(id: string): Promise<ProseDocument | undefined> {
    const [doc] = await db.select().from(proseDocuments).where(eq(proseDocuments.id, id));
    return doc || undefined;
  }

  async createProseDocument(proseDocument: InsertProseDocument): Promise<ProseDocument> {
    const newDoc = {
      ...proseDocument,
      id: nanoid(),
      createdAt: new Date()
    };
    
    const [created] = await db.insert(proseDocuments).values(newDoc).returning();
    return created;
  }

  async updateProseDocument(id: string, proseDocument: Partial<InsertProseDocument>): Promise<ProseDocument | undefined> {
    const [updated] = await db.update(proseDocuments)
      .set(proseDocument)
      .where(eq(proseDocuments.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProseDocument(id: string): Promise<boolean> {
    const result = await db.delete(proseDocuments).where(eq(proseDocuments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Character Relationship operations
  async getCharacterRelationships(characterId: string): Promise<CharacterRelationship[]> {
    return await db.select().from(characterRelationships)
      .where(eq(characterRelationships.characterId, characterId));
  }

  async createCharacterRelationship(relationship: InsertCharacterRelationship): Promise<CharacterRelationship> {
    const newRelationship = {
      ...relationship,
      id: nanoid(),
      createdAt: new Date()
    };
    
    const [created] = await db.insert(characterRelationships).values(newRelationship).returning();
    return created;
  }

  async updateCharacterRelationship(id: string, relationship: Partial<InsertCharacterRelationship>): Promise<CharacterRelationship | undefined> {
    const [updated] = await db.update(characterRelationships)
      .set(relationship)
      .where(eq(characterRelationships.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCharacterRelationship(id: string): Promise<boolean> {
    const result = await db.delete(characterRelationships).where(eq(characterRelationships.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Image Asset operations
  async getImageAssets(): Promise<ImageAsset[]> {
    return await db.select().from(imageAssets);
  }

  async createImageAsset(asset: InsertImageAsset): Promise<ImageAsset> {
    const [created] = await db.insert(imageAssets).values(asset).returning();
    return created;
  }

  async updateImageAsset(id: number, asset: Partial<InsertImageAsset>): Promise<ImageAsset | undefined> {
    const [updated] = await db.update(imageAssets)
      .set(asset)
      .where(eq(imageAssets.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteImageAsset(id: number): Promise<boolean> {
    const result = await db.delete(imageAssets).where(eq(imageAssets.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Project Settings operations
  async getProjectSettings(projectId: string): Promise<ProjectSettings | undefined> {
    const [settings] = await db.select().from(projectSettings)
      .where(eq(projectSettings.projectId, projectId));
    return settings || undefined;
  }

  async createProjectSettings(settings: InsertProjectSettings): Promise<ProjectSettings> {
    const newSettings = {
      ...settings,
      id: nanoid(),
      createdAt: new Date()
    };
    
    const [created] = await db.insert(projectSettings).values(newSettings).returning();
    return created;
  }

  async updateProjectSettings(id: string, settings: Partial<InsertProjectSettings>): Promise<ProjectSettings> {
    const [updated] = await db.update(projectSettings)
      .set({ ...settings, lastModified: new Date() })
      .where(eq(projectSettings.id, id))
      .returning();
    return updated;
  }
}

export const databaseStorage = new DatabaseStorage();