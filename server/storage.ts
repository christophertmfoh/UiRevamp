import { 
  projects, 
  characters, 
  locations, 
  factions, 
  items, 
  outlines, 
  proseDocuments, 
  characterRelationships, 
  imageAssets, 
  projectSettings,
  type Project, 
  type InsertProject,
  type Character,
  type InsertCharacter,
  type Location,
  type InsertLocation,
  type Faction,
  type InsertFaction,
  type Item,
  type InsertItem,
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
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Character operations
  getCharacters(projectId: string): Promise<Character[]>;
  getCharacter(id: string): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;
  updateCharacter(id: string, character: Partial<InsertCharacter>): Promise<Character | undefined>;
  deleteCharacter(id: string): Promise<boolean>;

  // Location operations
  getLocations(projectId: string): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location | undefined>;
  deleteLocation(id: string): Promise<boolean>;

  // Faction operations
  getFactions(projectId: string): Promise<Faction[]>;
  getFaction(id: string): Promise<Faction | undefined>;
  createFaction(faction: InsertFaction): Promise<Faction>;
  updateFaction(id: string, faction: Partial<InsertFaction>): Promise<Faction | undefined>;
  deleteFaction(id: string): Promise<boolean>;

  // Item operations
  getItems(projectId: string): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: string, item: Partial<InsertItem>): Promise<Item | undefined>;
  deleteItem(id: string): Promise<boolean>;

  // Outline operations
  getOutlines(projectId: string): Promise<Outline[]>;
  getOutline(id: string): Promise<Outline | undefined>;
  createOutline(outline: InsertOutline): Promise<Outline>;
  updateOutline(id: string, outline: Partial<InsertOutline>): Promise<Outline | undefined>;
  deleteOutline(id: string): Promise<boolean>;

  // Prose document operations
  getProseDocuments(projectId: string): Promise<ProseDocument[]>;
  getProseDocument(id: string): Promise<ProseDocument | undefined>;
  createProseDocument(document: InsertProseDocument): Promise<ProseDocument>;
  updateProseDocument(id: string, document: Partial<InsertProseDocument>): Promise<ProseDocument | undefined>;
  deleteProseDocument(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Project operations
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.lastModified));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    
    // Create default project settings
    await db.insert(projectSettings).values({
      id: `${project.id}-settings`,
      projectId: project.id,
      aiCraftConfig: {
        'story-structure': true,
        'character-development': true,
        'world-building': true
      }
    });
    
    return newProject;
  }

  async updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...project, lastModified: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject || undefined;
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
    const [newCharacter] = await db.insert(characters).values(character).returning();
    return newCharacter;
  }

  async updateCharacter(id: string, character: Partial<InsertCharacter>): Promise<Character | undefined> {
    const [updatedCharacter] = await db
      .update(characters)
      .set(character)
      .where(eq(characters.id, id))
      .returning();
    return updatedCharacter || undefined;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const result = await db.delete(characters).where(eq(characters.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Location operations
  async getLocations(projectId: string): Promise<Location[]> {
    return await db.select().from(locations).where(eq(locations.projectId, projectId));
  }

  async getLocation(id: string): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location || undefined;
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const [newLocation] = await db.insert(locations).values(location).returning();
    return newLocation;
  }

  async updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location | undefined> {
    const [updatedLocation] = await db
      .update(locations)
      .set(location)
      .where(eq(locations.id, id))
      .returning();
    return updatedLocation || undefined;
  }

  async deleteLocation(id: string): Promise<boolean> {
    const result = await db.delete(locations).where(eq(locations.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Faction operations
  async getFactions(projectId: string): Promise<Faction[]> {
    return await db.select().from(factions).where(eq(factions.projectId, projectId));
  }

  async getFaction(id: string): Promise<Faction | undefined> {
    const [faction] = await db.select().from(factions).where(eq(factions.id, id));
    return faction || undefined;
  }

  async createFaction(faction: InsertFaction): Promise<Faction> {
    const [newFaction] = await db.insert(factions).values(faction).returning();
    return newFaction;
  }

  async updateFaction(id: string, faction: Partial<InsertFaction>): Promise<Faction | undefined> {
    const [updatedFaction] = await db
      .update(factions)
      .set(faction)
      .where(eq(factions.id, id))
      .returning();
    return updatedFaction || undefined;
  }

  async deleteFaction(id: string): Promise<boolean> {
    const result = await db.delete(factions).where(eq(factions.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Item operations
  async getItems(projectId: string): Promise<Item[]> {
    return await db.select().from(items).where(eq(items.projectId, projectId));
  }

  async getItem(id: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || undefined;
  }

  async createItem(item: InsertItem): Promise<Item> {
    const [newItem] = await db.insert(items).values(item).returning();
    return newItem;
  }

  async updateItem(id: string, item: Partial<InsertItem>): Promise<Item | undefined> {
    const [updatedItem] = await db
      .update(items)
      .set(item)
      .where(eq(items.id, id))
      .returning();
    return updatedItem || undefined;
  }

  async deleteItem(id: string): Promise<boolean> {
    const result = await db.delete(items).where(eq(items.id, id));
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
    const [newOutline] = await db.insert(outlines).values(outline).returning();
    return newOutline;
  }

  async updateOutline(id: string, outline: Partial<InsertOutline>): Promise<Outline | undefined> {
    const [updatedOutline] = await db
      .update(outlines)
      .set(outline)
      .where(eq(outlines.id, id))
      .returning();
    return updatedOutline || undefined;
  }

  async deleteOutline(id: string): Promise<boolean> {
    const result = await db.delete(outlines).where(eq(outlines.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Prose document operations
  async getProseDocuments(projectId: string): Promise<ProseDocument[]> {
    return await db.select().from(proseDocuments).where(eq(proseDocuments.projectId, projectId));
  }

  async getProseDocument(id: string): Promise<ProseDocument | undefined> {
    const [document] = await db.select().from(proseDocuments).where(eq(proseDocuments.id, id));
    return document || undefined;
  }

  async createProseDocument(document: InsertProseDocument): Promise<ProseDocument> {
    const [newDocument] = await db.insert(proseDocuments).values(document).returning();
    return newDocument;
  }

  async updateProseDocument(id: string, document: Partial<InsertProseDocument>): Promise<ProseDocument | undefined> {
    const [updatedDocument] = await db
      .update(proseDocuments)
      .set({ ...document, lastModified: new Date() })
      .where(eq(proseDocuments.id, id))
      .returning();
    return updatedDocument || undefined;
  }

  async deleteProseDocument(id: string): Promise<boolean> {
    const result = await db.delete(proseDocuments).where(eq(proseDocuments.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
