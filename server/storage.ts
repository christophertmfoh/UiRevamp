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
import { createStorageAdapter } from "./storage/factory";

/**
 * Professional Storage Interface
 * Defines all storage operations for the application
 */
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

/**
 * Professional Storage Instance
 * 
 * Uses the storage factory to automatically route operations to the appropriate
 * storage implementation based on environment configuration:
 * - Development: MockStorage (in-memory with demo data)
 * - Production: DatabaseStorage (real database operations)
 */
export const storage = createStorageAdapter();