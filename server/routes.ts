import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { 
  insertProjectSchema, 
  insertCharacterSchema, 
  insertLocationSchema, 
  insertFactionSchema, 
  insertItemSchema, 
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
      const [characters, locations, factions, items, outlines, proseDocuments] = await Promise.all([
        storage.getCharacters(id),
        storage.getLocations(id),
        storage.getFactions(id),
        storage.getItems(id),
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
        locations: locations.map(l => ({
          id: l.id,
          name: l.name,
          description: l.description || '',
          history: l.history || '',
          significance: l.significance || '',
          atmosphere: l.atmosphere || '',
          imageGallery: [], // TODO: Fetch images
          displayImageId: l.displayImageId,
          tags: l.tags || []
        })),
        factions: factions.map(f => ({
          id: f.id,
          name: f.name,
          description: f.description || '',
          goals: f.goals || '',
          methods: f.methods || '',
          history: f.history || '',
          leadership: f.leadership || '',
          resources: f.resources || '',
          relationships: f.relationships || '',
          tags: f.tags || []
        })),
        items: items.map(i => ({
          id: i.id,
          name: i.name,
          description: i.description || '',
          history: i.history || '',
          powers: i.powers || '',
          significance: i.significance || '',
          imageGallery: [], // TODO: Fetch images
          displayImageId: i.displayImageId,
          tags: i.tags || []
        })),
        proseDocuments: proseDocuments.map(p => ({
          id: p.id,
          title: p.title,
          content: p.content || '',
          tags: p.tags || [],
          createdAt: p.createdAt,
          lastModified: p.lastModified
        })),
        settings: {
          aiCraftConfig: {
            'story-structure': true,
            'character-development': true,
            'world-building': true
          }
        }
      };
      
      res.json(transformedProject);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, projectData);
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProject(id);
      
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
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
      const characterData = insertCharacterSchema.parse({ ...req.body, projectId });
      const character = await storage.createCharacter(characterData);
      res.status(201).json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating character:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/characters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const characterData = insertCharacterSchema.partial().parse(req.body);
      const character = await storage.updateCharacter(id, characterData);
      
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }
      
      res.json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating character:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/characters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCharacter(id);
      
      if (!success) {
        return res.status(404).json({ error: "Character not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting character:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Character image generation endpoint
  app.post("/api/characters/generate-image", async (req, res) => {
    try {
      const { characterPrompt, stylePrompt = "digital art, fantasy", aiEngine = "openai" } = req.body;
      
      if (!characterPrompt) {
        return res.status(400).json({ error: "Character prompt is required" });
      }

      const result = await generateCharacterImage({
        characterPrompt,
        stylePrompt,
        aiEngine
      });
      
      res.json(result);
    } catch (error: any) {
      console.error("Error generating character image:", error);
      res.status(500).json({ 
        error: "Failed to generate image", 
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
