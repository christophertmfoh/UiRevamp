import { 
  projects, 
  characters, 
  factions, 
  items, 
  organizations,
  magicSystems,
  outlines, 
  proseDocuments, 
  characterRelationships, 
  imageAssets, 
  projectSettings,
  type Project, 
  type InsertProject,
  type Character,
  type InsertCharacter,
  type Faction,
  type InsertFaction,
  type Item,
  type InsertItem,
  type Organization,
  type InsertOrganization,
  type MagicSystem,
  type InsertMagicSystem,
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

  // Organization operations
  getOrganizations(projectId: string): Promise<Organization[]>;
  getOrganization(id: string): Promise<Organization | undefined>;
  createOrganization(organization: InsertOrganization): Promise<Organization>;
  updateOrganization(id: string, organization: Partial<InsertOrganization>): Promise<Organization | undefined>;
  deleteOrganization(id: string): Promise<boolean>;

  // Magic System operations
  getMagicSystems(projectId: string): Promise<MagicSystem[]>;
  getMagicSystem(id: string): Promise<MagicSystem | undefined>;
  createMagicSystem(magicSystem: InsertMagicSystem): Promise<MagicSystem>;
  updateMagicSystem(id: string, magicSystem: Partial<InsertMagicSystem>): Promise<MagicSystem | undefined>;
  deleteMagicSystem(id: string): Promise<boolean>;

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
  // Project operations
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project || undefined;
  }

  async createProject(project: InsertProject): Promise<Project> {
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
    const [updatedCharacter] = await db.update(characters).set(character).where(eq(characters.id, id)).returning();
    return updatedCharacter || undefined;
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const result = await db.delete(characters).where(eq(characters.id, id));
    return result.rowCount !== null && result.rowCount > 0;
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
    const [updatedFaction] = await db.update(factions).set(faction).where(eq(factions.id, id)).returning();
    return updatedFaction || undefined;
  }

  async deleteFaction(id: string): Promise<boolean> {
    const result = await db.delete(factions).where(eq(factions.id, id));
    return result.rowCount !== null && result.rowCount > 0;
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
    const [updatedItem] = await db.update(items).set(item).where(eq(items.id, id)).returning();
    return updatedItem || undefined;
  }

  async deleteItem(id: string): Promise<boolean> {
    const result = await db.delete(items).where(eq(items.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Organization operations
  async getOrganizations(projectId: string): Promise<Organization[]> {
    return await db.select().from(organizations).where(eq(organizations.projectId, projectId));
  }

  async getOrganization(id: string): Promise<Organization | undefined> {
    const [organization] = await db.select().from(organizations).where(eq(organizations.id, id));
    return organization || undefined;
  }

  async createOrganization(organization: InsertOrganization): Promise<Organization> {
    const [newOrganization] = await db.insert(organizations).values(organization).returning();
    return newOrganization;
  }

  async updateOrganization(id: string, organization: Partial<InsertOrganization>): Promise<Organization | undefined> {
    const [updatedOrganization] = await db.update(organizations).set(organization).where(eq(organizations.id, id)).returning();
    return updatedOrganization || undefined;
  }

  async deleteOrganization(id: string): Promise<boolean> {
    const result = await db.delete(organizations).where(eq(organizations.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Magic System operations
  async getMagicSystems(projectId: string): Promise<MagicSystem[]> {
    return await db.select().from(magicSystems).where(eq(magicSystems.projectId, projectId));
  }

  async getMagicSystem(id: string): Promise<MagicSystem | undefined> {
    const [magicSystem] = await db.select().from(magicSystems).where(eq(magicSystems.id, id));
    return magicSystem || undefined;
  }

  async createMagicSystem(magicSystem: InsertMagicSystem): Promise<MagicSystem> {
    const [newMagicSystem] = await db.insert(magicSystems).values(magicSystem).returning();
    return newMagicSystem;
  }

  async updateMagicSystem(id: string, magicSystem: Partial<InsertMagicSystem>): Promise<MagicSystem | undefined> {
    const [updatedMagicSystem] = await db.update(magicSystems).set(magicSystem).where(eq(magicSystems.id, id)).returning();
    return updatedMagicSystem || undefined;
  }

  async deleteMagicSystem(id: string): Promise<boolean> {
    const result = await db.delete(magicSystems).where(eq(magicSystems.id, id));
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