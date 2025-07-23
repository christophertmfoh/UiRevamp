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

// Additional World Bible tables for BloomWeaver complexity
export const organizations = pgTable("organizations", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  type: text("type").default(''),
  description: text("description").default(''),
  goals: text("goals").default(''),
  methods: text("methods").default(''),
  leadership: text("leadership").default(''),
  structure: text("structure").default(''),
  resources: text("resources").default(''),
  relationships: text("relationships").default(''),
  status: text("status").default(''),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const magicSystems = pgTable("magic_systems", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  type: text("type").default(''),
  description: text("description").default(''),
  source: text("source").default(''),
  practitioners: text("practitioners").array().default([]),
  effects: text("effects").array().default([]),
  limitations: text("limitations").default(''),
  corruption: text("corruption").default(''),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const timelineEvents = pgTable("timeline_events", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  era: text("era").notNull(),
  period: text("period").default(''),
  title: text("title").notNull(),
  description: text("description").default(''),
  significance: text("significance").default(''),
  participants: text("participants").array().default([]),
  locations: text("locations").array().default([]),
  consequences: text("consequences").default(''),
  order: integer("order").notNull(),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const creatures = pgTable("creatures", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  species: text("species").default(''),
  classification: text("classification").default(''),
  description: text("description").default(''),
  habitat: text("habitat").default(''),
  behavior: text("behavior").default(''),
  abilities: text("abilities").array().default([]),
  weaknesses: text("weaknesses").array().default([]),
  threat: text("threat").default(''),
  significance: text("significance").default(''),
  tags: text("tags").array().default([]),
  displayImageId: integer("display_image_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const languages = pgTable("languages", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  family: text("family").default(''),
  speakers: text("speakers").array().default([]),
  description: text("description").default(''),
  script: text("script").default(''),
  grammar: text("grammar").default(''),
  vocabulary: text("vocabulary").default(''),
  culturalSignificance: text("cultural_significance").default(''),
  examples: text("examples").default(''),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cultures = pgTable("cultures", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  description: text("description").default(''),
  values: text("values").array().default([]),
  traditions: text("traditions").default(''),
  customs: text("customs").default(''),
  religion: text("religion").default(''),
  government: text("government").default(''),
  economy: text("economy").default(''),
  technology: text("technology").default(''),
  conflicts: text("conflicts").default(''),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const prophecies = pgTable("prophecies", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  text: text("text").notNull(),
  origin: text("origin").default(''),
  interpretation: text("interpretation").default(''),
  fulfillment: text("fulfillment").default(''),
  significance: text("significance").default(''),
  relatedEvents: text("related_events").array().default([]),
  relatedCharacters: text("related_characters").array().default([]),
  status: text("status").default(''),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const themes = pgTable("themes", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  description: text("description").default(''),
  manifestation: text("manifestation").default(''),
  symbolism: text("symbolism").array().default([]),
  examples: text("examples").array().default([]),
  significance: text("significance").default(''),
  tags: text("tags").array().default([]),
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
  organizations: many(organizations),
  magicSystems: many(magicSystems),
  timelineEvents: many(timelineEvents),
  creatures: many(creatures),
  languages: many(languages),
  cultures: many(cultures),
  prophecies: many(prophecies),
  themes: many(themes),
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
export const insertOrganizationSchema = createInsertSchema(organizations);
export const insertMagicSystemSchema = createInsertSchema(magicSystems);
export const insertTimelineEventSchema = createInsertSchema(timelineEvents);
export const insertCreatureSchema = createInsertSchema(creatures);
export const insertLanguageSchema = createInsertSchema(languages);
export const insertCultureSchema = createInsertSchema(cultures);
export const insertProphecySchema = createInsertSchema(prophecies);
export const insertThemeSchema = createInsertSchema(themes);
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
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type MagicSystem = typeof magicSystems.$inferSelect;
export type InsertMagicSystem = z.infer<typeof insertMagicSystemSchema>;
export type TimelineEvent = typeof timelineEvents.$inferSelect;
export type InsertTimelineEvent = z.infer<typeof insertTimelineEventSchema>;
export type Creature = typeof creatures.$inferSelect;
export type InsertCreature = z.infer<typeof insertCreatureSchema>;
export type Language = typeof languages.$inferSelect;
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type Culture = typeof cultures.$inferSelect;
export type InsertCulture = z.infer<typeof insertCultureSchema>;
export type Prophecy = typeof prophecies.$inferSelect;
export type InsertProphecy = z.infer<typeof insertProphecySchema>;
export type Theme = typeof themes.$inferSelect;
export type InsertTheme = z.infer<typeof insertThemeSchema>;
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
