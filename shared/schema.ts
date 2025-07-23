import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Core project table
export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ['novel', 'screenplay', 'comic'] }).notNull(),
  description: text("description"),
  genre: text("genre").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastModified: timestamp("last_modified").defaultNow().notNull(),
  manuscriptNovel: text("manuscript_novel").default(''),
  manuscriptScreenplay: text("manuscript_screenplay").default(''),
});

// World Bible tables
export const characters = pgTable("characters", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  role: text("role").default(''),
  description: text("description").default(''),
  personality: text("personality").default(''),
  backstory: text("backstory").default(''),
  motivations: text("motivations").default(''),
  fears: text("fears").default(''),
  secrets: text("secrets").default(''),
  archetypes: text("archetypes").array().default([]),
  tags: text("tags").array().default([]),
  isModelTrained: boolean("is_model_trained").default(false),
  displayImageId: integer("display_image_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const locations = pgTable("locations", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  description: text("description").default(''),
  history: text("history").default(''),
  significance: text("significance").default(''),
  atmosphere: text("atmosphere").default(''),
  tags: text("tags").array().default([]),
  displayImageId: integer("display_image_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const factions = pgTable("factions", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  description: text("description").default(''),
  goals: text("goals").default(''),
  methods: text("methods").default(''),
  history: text("history").default(''),
  leadership: text("leadership").default(''),
  resources: text("resources").default(''),
  relationships: text("relationships").default(''),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const items = pgTable("items", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  description: text("description").default(''),
  history: text("history").default(''),
  powers: text("powers").default(''),
  significance: text("significance").default(''),
  tags: text("tags").array().default([]),
  displayImageId: integer("display_image_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const outlines = pgTable("outlines", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  content: text("content").default(''),
  description: text("description").default(''),
  order: integer("order").notNull(),
  parentId: text("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const proseDocuments = pgTable("prose_documents", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  title: text("title").notNull(),
  content: text("content").default(''),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastModified: timestamp("last_modified").defaultNow().notNull(),
});

export const characterRelationships = pgTable("character_relationships", {
  id: text("id").primaryKey(),
  characterId: text("character_id").references(() => characters.id, { onDelete: 'cascade' }).notNull(),
  relatedCharacterId: text("related_character_id").notNull(),
  relationshipType: text("relationship_type").notNull(),
  description: text("description").default(''),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const imageAssets = pgTable("image_assets", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  entityType: text("entity_type", { enum: ['character', 'location', 'item'] }).notNull(),
  entityId: text("entity_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectSettings = pgTable("project_settings", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  aiCraftConfig: json("ai_craft_config").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastModified: timestamp("last_modified").defaultNow().notNull(),
});

// Relations
export const projectsRelations = relations(projects, ({ many, one }) => ({
  characters: many(characters),
  locations: many(locations),
  factions: many(factions),
  items: many(items),
  outlines: many(outlines),
  proseDocuments: many(proseDocuments),
  settings: one(projectSettings),
}));

export const charactersRelations = relations(characters, ({ one, many }) => ({
  project: one(projects, {
    fields: [characters.projectId],
    references: [projects.id],
  }),
  relationships: many(characterRelationships),
  imageAssets: many(imageAssets),
}));

export const locationsRelations = relations(locations, ({ one, many }) => ({
  project: one(projects, {
    fields: [locations.projectId],
    references: [projects.id],
  }),
  imageAssets: many(imageAssets),
}));

export const factionsRelations = relations(factions, ({ one }) => ({
  project: one(projects, {
    fields: [factions.projectId],
    references: [projects.id],
  }),
}));

export const itemsRelations = relations(items, ({ one, many }) => ({
  project: one(projects, {
    fields: [items.projectId],
    references: [projects.id],
  }),
  imageAssets: many(imageAssets),
}));

export const outlinesRelations = relations(outlines, ({ one }) => ({
  project: one(projects, {
    fields: [outlines.projectId],
    references: [projects.id],
  }),
}));

export const proseDocumentsRelations = relations(proseDocuments, ({ one }) => ({
  project: one(projects, {
    fields: [proseDocuments.projectId],
    references: [projects.id],
  }),
}));

export const characterRelationshipsRelations = relations(characterRelationships, ({ one }) => ({
  character: one(characters, {
    fields: [characterRelationships.characterId],
    references: [characters.id],
  }),
}));

export const imageAssetsRelations = relations(imageAssets, ({ one }) => ({
  character: one(characters, {
    fields: [imageAssets.entityId],
    references: [characters.id],
  }),
  location: one(locations, {
    fields: [imageAssets.entityId],
    references: [locations.id],
  }),
  item: one(items, {
    fields: [imageAssets.entityId],
    references: [items.id],
  }),
}));

export const projectSettingsRelations = relations(projectSettings, ({ one }) => ({
  project: one(projects, {
    fields: [projectSettings.projectId],
    references: [projects.id],
  }),
}));

// Insert schemas
export const insertProjectSchema = createInsertSchema(projects);
export const insertCharacterSchema = createInsertSchema(characters);
export const insertLocationSchema = createInsertSchema(locations);
export const insertFactionSchema = createInsertSchema(factions);
export const insertItemSchema = createInsertSchema(items);
export const insertOutlineSchema = createInsertSchema(outlines);
export const insertProseDocumentSchema = createInsertSchema(proseDocuments);
export const insertCharacterRelationshipSchema = createInsertSchema(characterRelationships);
export const insertImageAssetSchema = createInsertSchema(imageAssets);
export const insertProjectSettingsSchema = createInsertSchema(projectSettings);

// Types
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type Location = typeof locations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Faction = typeof factions.$inferSelect;
export type InsertFaction = z.infer<typeof insertFactionSchema>;
export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type Outline = typeof outlines.$inferSelect;
export type InsertOutline = z.infer<typeof insertOutlineSchema>;
export type ProseDocument = typeof proseDocuments.$inferSelect;
export type InsertProseDocument = z.infer<typeof insertProseDocumentSchema>;
export type CharacterRelationship = typeof characterRelationships.$inferSelect;
export type InsertCharacterRelationship = z.infer<typeof insertCharacterRelationshipSchema>;
export type ImageAsset = typeof imageAssets.$inferSelect;
export type InsertImageAsset = z.infer<typeof insertImageAssetSchema>;
export type ProjectSettings = typeof projectSettings.$inferSelect;
export type InsertProjectSettings = z.infer<typeof insertProjectSettingsSchema>;
