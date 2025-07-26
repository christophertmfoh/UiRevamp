import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Generic Entity Types for Universal Template System
export type EntityType = 
  | 'character';

// Base Entity Interface (shared across all entity types)
export interface BaseEntity {
  id: string;
  projectId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

// Generic Entity Field Configuration
export interface EntityFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'array' | 'select' | 'number' | 'date' | 'boolean';
  section: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  aiEnhanceable?: boolean;
}

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
  
  // Basic Information (Core Identity)
  name: text("name").default(''),
  nicknames: text("nicknames").default(''),
  title: text("title").default(''),
  aliases: text("aliases").default(''),
  race: text("race").default(''),
  species: text("species").default(''),
  ethnicity: text("ethnicity").default(''),
  class: text("class").default(''),
  profession: text("profession").default(''),
  occupation: text("occupation").default(''),
  age: text("age").default(''),
  birthdate: text("birthdate").default(''),
  zodiacSign: text("zodiac_sign").default(''),
  role: text("role").default(''),
  
  // Physical Appearance (Comprehensive Physical Description)
  physicalDescription: text("physical_description").default(''),
  height: text("height").default(''),
  weight: text("weight").default(''),
  build: text("build").default(''),
  bodyType: text("body_type").default(''),
  facialFeatures: text("facial_features").default(''),
  eyes: text("eyes").default(''),
  eyeColor: text("eye_color").default(''),
  hair: text("hair").default(''),
  hairColor: text("hair_color").default(''),
  hairStyle: text("hair_style").default(''),
  facialHair: text("facial_hair").default(''),
  skin: text("skin").default(''),
  skinTone: text("skin_tone").default(''),
  complexion: text("complexion").default(''),
  scars: text("scars").default(''),
  tattoos: text("tattoos").default(''),
  piercings: text("piercings").default(''),
  birthmarks: text("birthmarks").default(''),
  distinguishingMarks: text("distinguishing_marks").default(''),
  attire: text("attire").default(''),
  clothingStyle: text("clothing_style").default(''),
  accessories: text("accessories").default(''),
  posture: text("posture").default(''),
  gait: text("gait").default(''),
  gestures: text("gestures").default(''),
  mannerisms: text("mannerisms").default(''),
  
  // Core Character Details (Central Character Definition)
  description: text("description").default(''),
  characterSummary: text("character_summary").default(''),
  oneLine: text("one_line").default(''),
  
  // Personality (Deep Psychological Profile)
  personality: text("personality").default(''),
  personalityTraits: text("personality_traits").array().default([]),
  temperament: text("temperament").default(''),
  disposition: text("disposition").default(''),
  worldview: text("worldview").default(''),
  beliefs: text("beliefs").default(''),
  values: text("values").default(''),
  principles: text("principles").default(''),
  morals: text("morals").default(''),
  ethics: text("ethics").default(''),
  virtues: text("virtues").default(''),
  vices: text("vices").default(''),
  habits: text("habits").default(''),
  quirks: text("quirks").default(''),
  idiosyncrasies: text("idiosyncrasies").default(''),
  petPeeves: text("pet_peeves").default(''),
  likes: text("likes").default(''),
  dislikes: text("dislikes").default(''),
  hobbies: text("hobbies").default(''),
  interests: text("interests").default(''),
  passions: text("passions").default(''),
  
  // Psychological Profile (Mental & Emotional Depth)
  motivations: text("motivations").default(''),
  desires: text("desires").default(''),
  needs: text("needs").default(''),
  drives: text("drives").default(''),
  ambitions: text("ambitions").default(''),
  fears: text("fears").default(''),
  phobias: text("phobias").default(''),
  anxieties: text("anxieties").default(''),
  insecurities: text("insecurities").default(''),
  secrets: text("secrets").default(''),
  shame: text("shame").default(''),
  guilt: text("guilt").default(''),
  regrets: text("regrets").default(''),
  trauma: text("trauma").default(''),
  wounds: text("wounds").default(''),
  copingMechanisms: text("coping_mechanisms").default(''),
  defenses: text("defenses").default(''),
  vulnerabilities: text("vulnerabilities").default(''),
  weaknesses: text("weaknesses").default(''),
  blindSpots: text("blind_spots").default(''),
  mentalHealth: text("mental_health").default(''),
  emotionalState: text("emotional_state").default(''),
  maturityLevel: text("maturity_level").default(''),
  intelligenceType: text("intelligence_type").default(''),
  learningStyle: text("learning_style").default(''),
  
  // Background & History (Life Story & Context)
  background: text("background").default(''),
  backstory: text("backstory").default(''),
  origin: text("origin").default(''),
  upbringing: text("upbringing").default(''),
  childhood: text("childhood").default(''),
  familyHistory: text("family_history").default(''),
  socialClass: text("social_class").default(''),
  economicStatus: text("economic_status").default(''),
  education: text("education").default(''),
  academicHistory: text("academic_history").default(''),
  formativeEvents: text("formative_events").default(''),
  lifeChangingMoments: text("life_changing_moments").default(''),
  personalStruggle: text("personal_struggle").default(''),
  challenges: text("challenges").default(''),
  achievements: text("achievements").default(''),
  failures: text("failures").default(''),
  losses: text("losses").default(''),
  victories: text("victories").default(''),
  reputation: text("reputation").default(''),
  
  // Abilities & Skills (Competencies & Powers)
  abilities: text("abilities").array().default([]),
  skills: text("skills").array().default([]),
  talents: text("talents").array().default([]),
  expertise: text("expertise").array().default([]),
  powers: text("powers").default(''),
  superpowers: text("superpowers").default(''),
  strengths: text("strengths").default(''),
  competencies: text("competencies").default(''),
  training: text("training").default(''),
  experience: text("experience").default(''),
  
  // Story Elements (Narrative Function & Arc)
  goals: text("goals").default(''),
  objectives: text("objectives").default(''),
  wants: text("wants").default(''),
  obstacles: text("obstacles").default(''),
  conflicts: text("conflicts").default(''),
  conflictSources: text("conflict_sources").default(''),
  stakes: text("stakes").default(''),
  consequences: text("consequences").default(''),
  arc: text("arc").default(''),
  journey: text("journey").default(''),
  transformation: text("transformation").default(''),
  growth: text("growth").default(''),
  relationships: text("relationships").default(''),
  allies: text("allies").default(''),
  enemies: text("enemies").default(''),
  mentors: text("mentors").default(''),
  rivals: text("rivals").default(''),
  connectionToEvents: text("connection_to_events").default(''),
  plotRelevance: text("plot_relevance").default(''),
  storyFunction: text("story_function").default(''),
  
  // Language & Communication (Voice & Expression)
  spokenLanguages: text("spoken_languages").array().default([]),
  primaryLanguage: text("primary_language").default(''),
  accent: text("accent").default(''),
  dialect: text("dialect").default(''),
  voiceDescription: text("voice_description").default(''),
  speechPatterns: text("speech_patterns").default(''),
  vocabulary: text("vocabulary").default(''),
  catchphrases: text("catchphrases").default(''),
  slang: text("slang").default(''),
  communicationStyle: text("communication_style").default(''),
  
  // Social & Cultural (Relationships & Society)
  family: text("family").default(''),
  parents: text("parents").default(''),
  siblings: text("siblings").default(''),
  spouse: text("spouse").default(''),
  children: text("children").default(''),
  friends: text("friends").default(''),
  socialCircle: text("social_circle").default(''),
  community: text("community").default(''),
  culturalBackground: text("cultural_background").default(''),
  traditions: text("traditions").default(''),
  customs: text("customs").default(''),
  religion: text("religion").default(''),
  spirituality: text("spirituality").default(''),
  politicalViews: text("political_views").default(''),
  
  // Meta Information (Writing & Creative Elements)
  archetypes: text("archetypes").array().default([]),
  tropes: text("tropes").array().default([]),
  inspiration: text("inspiration").default(''),
  basedOn: text("based_on").default(''),
  tags: text("tags").array().default([]),
  genre: text("genre").default(''),
  proseVibe: text("prose_vibe").default(''),
  narrativeRole: text("narrative_role").default(''),
  characterType: text("character_type").default(''),
  importance: text("importance").default(''),
  screenTime: text("screen_time").default(''),
  firstAppearance: text("first_appearance").default(''),
  lastAppearance: text("last_appearance").default(''),
  
  // Writer's Notes & Development (Creative Process)
  notes: text("notes").default(''),
  development: text("development").default(''),
  evolution: text("evolution").default(''),
  alternatives: text("alternatives").default(''),
  unused: text("unused").default(''),
  research: text("research").default(''),
  references: text("references").default(''),
  mood: text("mood").default(''),
  personalTheme: text("personal_theme").default(''),
  symbolism: text("symbolism").default(''),
  
  // Technical (System & Display)
  isModelTrained: boolean("is_model_trained").default(false),
  displayImageId: integer("display_image_id"),
  imageUrl: text("image_url").default(''),
  portraits: json("portraits").default([]),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});









// Generic Entity Metadata table for Universal Template System
export const entityMetadata = pgTable("entity_metadata", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  entityType: text("entity_type").notNull().default('character'),
  entityId: text("entity_id").notNull(), // Reference to the actual entity
  
  // Universal metadata fields
  tags: text("tags").array().default([]),
  notes: text("notes").default(''),
  status: text("status").default('active'),
  priority: text("priority").default('medium'),
  completionPercentage: integer("completion_percentage").default(0),
  
  // AI Enhancement tracking
  lastAIEnhancement: timestamp("last_ai_enhancement"),
  aiEnhancementCount: integer("ai_enhancement_count").default(0),
  
  // Template system tracking
  templateSource: text("template_source"), // Which template was used to create this entity
  templateVersion: text("template_version"), // Version of template system
  
  // Generic display preferences
  displayImageId: integer("display_image_id"),
  imageUrl: text("image_url").default(''),
  portraits: json("portraits").default([]),
  
  // Custom field overrides (JSON storage for template system flexibility)
  customFields: json("custom_fields").default({}),
  fieldVisibility: json("field_visibility").default({}), // Which fields to show/hide
  fieldOrder: json("field_order").default([]), // Custom field ordering
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Generic Entity Relationships table
export const entityRelationships = pgTable("entity_relationships", {
  id: text("id").primaryKey(),
  projectId: text("project_id").references(() => projects.id, { onDelete: 'cascade' }).notNull(),
  
  // Source entity
  sourceEntityType: text("source_entity_type").notNull(),
  sourceEntityId: text("source_entity_id").notNull(),
  
  // Target entity
  targetEntityType: text("target_entity_type").notNull(),
  targetEntityId: text("target_entity_id").notNull(),
  
  // Relationship details
  relationshipType: text("relationship_type").notNull(), // 'friend', 'enemy', 'located_in', 'owns', etc.
  relationshipStrength: text("relationship_strength").default('medium'), // 'weak', 'medium', 'strong'
  relationshipStatus: text("relationship_status").default('active'), // 'active', 'inactive', 'past'
  description: text("description").default(''),
  notes: text("notes").default(''),
  
  // Bidirectional relationship flag
  isBidirectional: boolean("is_bidirectional").default(false),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Generic Entity Templates table (for template system)
export const entityTemplates = pgTable("entity_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").default(''),
  entityType: text("entity_type").notNull(),
  
  // Template configuration
  fieldConfiguration: json("field_configuration").notNull(), // Complete field setup
  defaultValues: json("default_values").default({}), // Default field values
  requiredFields: text("required_fields").array().default([]),
  sectionConfiguration: json("section_configuration").default({}),
  
  // Template metadata
  category: text("category").default('general'),
  tags: text("tags").array().default([]),
  difficulty: text("difficulty").default('beginner'), // 'beginner', 'intermediate', 'advanced'
  genre: text("genre").array().default([]),
  
  // Template system metadata
  version: text("version").default('1.0'),
  isSystemTemplate: boolean("is_system_template").default(true), // System vs user templates
  createdBy: text("created_by").default('system'),
  usageCount: integer("usage_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  entityType: text("entity_type", { enum: ['character'] }).notNull(),
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
}));

export const projectSettingsRelations = relations(projectSettings, ({ one }) => ({
  project: one(projects, {
    fields: [projectSettings.projectId],
    references: [projects.id],
  }),
}));

// Insert schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
  createdAt: true,
  lastModified: true,
});
export const insertCharacterSchema = createInsertSchema(characters).omit({
  createdAt: true,
  updatedAt: true,
});
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

// Generic Entity Template System Schemas & Types
export const insertEntityMetadataSchema = createInsertSchema(entityMetadata);
export const insertEntityRelationshipSchema = createInsertSchema(entityRelationships);
export const insertEntityTemplateSchema = createInsertSchema(entityTemplates);

export type EntityMetadata = typeof entityMetadata.$inferSelect;
export type InsertEntityMetadata = z.infer<typeof insertEntityMetadataSchema>;
export type EntityRelationship = typeof entityRelationships.$inferSelect;
export type InsertEntityRelationship = z.infer<typeof insertEntityRelationshipSchema>;
export type EntityTemplate = typeof entityTemplates.$inferSelect;
export type InsertEntityTemplate = z.infer<typeof insertEntityTemplateSchema>;

// Generic Entity Union Type (for Universal Template System)
