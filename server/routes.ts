import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { 
  insertProjectSchema, 
  insertCharacterSchema, 
  insertOutlineSchema, 
  insertProseDocumentSchema 
} from "@shared/schema";
import { storage } from "./storage";
import { generateCharacterImage } from "./imageGeneration";

export async function registerRoutes(app: Express): Promise<Server> {
  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Fetch related data
      const [characters, outlines, proseDocuments] = await Promise.all([
        storage.getCharacters(id),
        storage.getOutlines(id),
        storage.getProseDocuments(id)
      ]);
      
      // Transform database project to frontend project format
      const transformedProject = {
        id: project.id,
        name: project.name,
        type: project.type,
        description: project.description || '',
        genre: project.genre || [],
        createdAt: project.createdAt,
        lastModified: project.lastModified,
        manuscript: {
          novel: project.manuscriptNovel || '',
          screenplay: project.manuscriptScreenplay || ''
        },
        outline: outlines.map(o => ({
          id: parseInt(o.id),
          title: o.title,
          content: o.content || '',
          description: o.description || '',
          children: [] // TODO: Handle hierarchical structure
        })),
        characters: characters.map(c => ({
          id: c.id,
          name: c.name,
          role: c.role || '',
          description: c.description || '',
          personality: c.personality || '',
          backstory: c.backstory || '',
          motivations: c.motivations || '',
          fears: c.fears || '',
          secrets: c.secrets || '',
          relationships: [], // TODO: Fetch relationships
          archetypes: c.archetypes || [],
          imageGallery: [], // TODO: Fetch images
          displayImageId: c.displayImageId,
          modelImageUrls: [], // TODO: Handle model URLs
          isModelTrained: c.isModelTrained || false,
          tags: c.tags || []
        })),
        proseDocuments: proseDocuments.map(doc => ({
          id: doc.id,
          title: doc.title,
          content: doc.content || '',
          type: doc.type,
          createdAt: doc.createdAt
        })),
        settings: project.settings || { aiCraftConfig: { 'story-structure': true, 'character-development': true, 'world-building': true } }
      };
      
      res.json(transformedProject);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Character routes
  app.get("/api/projects/:projectId/characters", async (req, res) => {
    try {
      const { projectId } = req.params;
      const characters = await storage.getCharacters(projectId);
      res.json(characters);
    } catch (error) {
      console.error("Error fetching characters:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/characters", async (req, res) => {
    try {
      const { projectId } = req.params;
      const validatedData = insertCharacterSchema.parse(req.body);
      const character = await storage.createCharacter(projectId, validatedData);
      res.status(201).json(character);
    } catch (error) {
      console.error("Error creating character:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/characters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertCharacterSchema.parse(req.body);
      const character = await storage.updateCharacter(id, validatedData);
      res.json(character);
    } catch (error) {
      console.error("Error updating character:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/characters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteCharacter(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting character:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Character image generation
  app.post("/api/characters/:id/generate-image", async (req, res) => {
    try {
      const { id } = req.params;
      const character = await storage.getCharacter(id);
      
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }

      const imageUrl = await generateCharacterImage(character);
      res.json({ imageUrl });
    } catch (error) {
      console.error("Error generating character image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  const server = createServer(app);
  return server;
}
