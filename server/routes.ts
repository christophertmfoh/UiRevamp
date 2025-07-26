import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { 
  insertProjectSchema, 
  insertCharacterSchema, 
  insertCreatureSchema,
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
      const [characters, creatures, outlines, proseDocuments] = await Promise.all([
        storage.getCharacters(id),
        storage.getCreatures(id),
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
        creatures: creatures.map(c => ({
          id: c.id,
          name: c.name,
          description: c.description || '',
          species: c.species || '',
          habitat: c.habitat || '',
          behavior: c.behavior || '',
          abilities: c.abilities || [],
          tags: c.tags || []
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
      const projectData = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        name: req.body.name || 'Untitled Project',
        type: req.body.type || 'novel',
        genre: req.body.genre || [],
        description: req.body.description || '',
        manuscriptNovel: '',
        manuscriptScreenplay: ''
      };

      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Updating project with data:", req.body);

      // Clean up the request body to remove any undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(req.body).filter(([key, value]) => {
          return value !== undefined && value !== null && value !== '';
        })
      );

      const projectData = insertProjectSchema.partial().parse(cleanedData);

      // Add updatedAt timestamp to track when the project was last modified
      const projectDataWithTimestamp = {
        ...projectData,
        lastModified: new Date().toISOString()
      };

      const project = await storage.updateProject(id, projectDataWithTimestamp);

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
      const characterData = insertCharacterSchema.parse({ 
        ...req.body, 
        projectId,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
      });

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
      console.log("Updating character with data:", req.body);

      // Clean up the request body to remove any undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(req.body).filter(([key, value]) => {
          return value !== undefined && value !== null && value !== '';
        })
      );

      const characterData = insertCharacterSchema.partial().parse(cleanedData);

      // Add updatedAt timestamp to track when the character was last modified
      const characterDataWithTimestamp = {
        ...characterData,
        lastModified: new Date().toISOString()
      };

      const character = await storage.updateCharacter(id, characterDataWithTimestamp);

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

  // Character generation endpoint
  app.post("/api/projects/:projectId/characters/generate", async (req, res) => {
    try {
      const { projectId } = req.params;
      const { characterType, role, customPrompt, personality, archetype } = req.body;
      
      // Get project data
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Get related data for context
      const [characters] = await Promise.all([
        storage.getCharacters(projectId)
      ]);
      
      // Import the character generation function
      const { generateContextualCharacter } = await import('./characterGeneration');
      
      const generatedCharacter = await generateContextualCharacter({
        project,
        existingCharacters: characters,
        generationOptions: {
          characterType,
          role,
          customPrompt,
          personality,
          archetype
        }
      });
      
      res.json(generatedCharacter);
    } catch (error: any) {
      console.error("Error generating character:", error);
      res.status(500).json({ 
        error: "Failed to generate character", 
        details: error.message 
      });
    }
  });

  // Character image generation endpoint (correct route for frontend)
  app.post("/api/generate-character-image", async (req, res) => {
    console.log('=== CHARACTER IMAGE GENERATION REQUEST RECEIVED ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    try {
      const { prompt, characterId, engineType = "gemini" } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const result = await generateCharacterImage({
        characterPrompt: prompt,
        stylePrompt: "character portrait, fantasy art, digital painting",
        aiEngine: engineType
      });
      
      console.log('=== IMAGE GENERATION RESULT ===');
      console.log('Result:', JSON.stringify(result, null, 2));
      
      if (characterId && result.success && result.imageUrl) {
        // Get the current character and update its image gallery
        const character = await storage.getCharacter(characterId);
        if (character) {
          const imageGallery = Array.isArray(character.imageGallery) ? character.imageGallery : [];
          
          // Add new image to gallery
          const newImage = {
            id: Date.now().toString(),
            url: result.imageUrl,
            prompt: prompt,
            createdAt: new Date().toISOString()
          };
          
          await storage.updateCharacter(characterId, {
            ...character,
            imageGallery: [...imageGallery, newImage],
            displayImageId: character.displayImageId || newImage.id
          });
        }
      }
      
      res.json(result);
    } catch (error: any) {
      console.error("Error generating character image:", error);
      res.status(500).json({ 
        error: "Failed to generate character image", 
        details: error.message 
      });
    }
  });





  // Creature routes
  app.get("/api/projects/:projectId/creatures", async (req, res) => {
    try {
      const { projectId } = req.params;
      const creatures = await storage.getCreatures(projectId);
      res.json(creatures);
    } catch (error) {
      console.error("Error fetching creatures:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/creatures", async (req, res) => {
    try {
      const { projectId } = req.params;
      const creatureData = insertCreatureSchema.parse({ 
        ...req.body, 
        projectId,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
      });

      const creature = await storage.createCreature(creatureData);
      res.status(201).json(creature);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating creature:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/creatures/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const creatureData = insertCreatureSchema.partial().parse(req.body);
      const creature = await storage.updateCreature(id, creatureData);

      if (!creature) {
        return res.status(404).json({ error: "Creature not found" });
      }

      res.json(creature);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating creature:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/creatures/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCreature(id);

      if (!success) {
        return res.status(404).json({ error: "Creature not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting creature:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Outline routes
  app.get("/api/projects/:projectId/outlines", async (req, res) => {
    try {
      const { projectId } = req.params;
      const outlines = await storage.getOutlines(projectId);
      res.json(outlines);
    } catch (error) {
      console.error("Error fetching outlines:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/outlines", async (req, res) => {
    try {
      const { projectId } = req.params;
      const outlineData = insertOutlineSchema.parse({ 
        ...req.body, 
        projectId,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
      });

      const outline = await storage.createOutline(outlineData);
      res.status(201).json(outline);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating outline:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/outlines/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const outlineData = insertOutlineSchema.partial().parse(req.body);
      const outline = await storage.updateOutline(id, outlineData);

      if (!outline) {
        return res.status(404).json({ error: "Outline not found" });
      }

      res.json(outline);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating outline:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/outlines/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteOutline(id);

      if (!success) {
        return res.status(404).json({ error: "Outline not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting outline:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Prose Document routes
  app.get("/api/projects/:projectId/prose-documents", async (req, res) => {
    try {
      const { projectId } = req.params;
      const proseDocuments = await storage.getProseDocuments(projectId);
      res.json(proseDocuments);
    } catch (error) {
      console.error("Error fetching prose documents:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/prose-documents", async (req, res) => {
    try {
      const { projectId } = req.params;
      const proseDocumentData = insertProseDocumentSchema.parse({ 
        ...req.body, 
        projectId,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
      });

      const proseDocument = await storage.createProseDocument(proseDocumentData);
      res.status(201).json(proseDocument);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating prose document:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/prose-documents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const proseDocumentData = insertProseDocumentSchema.partial().parse(req.body);
      const proseDocument = await storage.updateProseDocument(id, proseDocumentData);

      if (!proseDocument) {
        return res.status(404).json({ error: "Prose document not found" });
      }

      res.json(proseDocument);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating prose document:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/prose-documents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteProseDocument(id);

      if (!success) {
        return res.status(404).json({ error: "Prose document not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting prose document:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const server = createServer(app);
  return server;
}