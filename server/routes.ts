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
import { generateLocation } from "./locationGeneration";

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
      console.log('Creating character with request body:', JSON.stringify(req.body, null, 2));
      const characterData = insertCharacterSchema.parse({ ...req.body, projectId, id: Date.now().toString() + Math.random().toString(36).substr(2, 5) });
      console.log('Parsed character data for insertion:', JSON.stringify(characterData, null, 2));
      const character = await storage.createCharacter(characterData);
      console.log('Character created in database:', JSON.stringify(character, null, 2));
      
      // Check if character is properly returned from database
      if (!character) {
        console.error('No character returned from database');
        return res.status(500).json({ error: 'Failed to create character - no data returned' });
      }
      
      console.log('Raw character from database:', character);
      console.log('Character keys:', Object.keys(character));
      
      // Ensure we return a clean character object without any undefined values that might cause serialization issues
      const cleanCharacter = {
        ...character,
        // Convert any undefined values to null for proper JSON serialization
        imageUrl: character.imageUrl || null,
        portraits: character.portraits || [],
        relationships: character.relationships || '',
      };
      
      console.log('Sending character response:', JSON.stringify(cleanCharacter, null, 2));
      res.status(201).json(cleanCharacter);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Character validation errors:", error.errors);
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating character:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/characters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log('Updating character with data:', JSON.stringify(req.body, null, 2));
      const characterData = insertCharacterSchema.partial().parse(req.body);
      console.log('Parsed character data:', JSON.stringify(characterData, null, 2));
      const character = await storage.updateCharacter(id, characterData);
      
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }
      
      res.json(character);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
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
      const [characters, locations] = await Promise.all([
        storage.getCharacters(projectId),
        storage.getLocations(projectId)
      ]);
      
      // Import the character generation function
      const { generateContextualCharacter } = await import('./characterGeneration');
      
      const generatedCharacter = await generateContextualCharacter({
        project,
        locations,
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

  // Faction image generation endpoint
  app.post("/api/factions/generate-image", async (req, res) => {
    try {
      const { factionPrompt, stylePrompt = "heraldic emblem, clean design, symbol logo", aiEngine = "gemini" } = req.body;
      
      if (!factionPrompt) {
        return res.status(400).json({ error: "Faction prompt is required" });
      }

      const result = await generateCharacterImage({
        characterPrompt: factionPrompt,
        stylePrompt,
        aiEngine
      });
      
      res.json(result);
    } catch (error: any) {
      console.error("Error generating faction image:", error);
      res.status(500).json({ 
        error: "Failed to generate image", 
        details: error.message 
      });
    }
  });

  // Location image generation endpoint
  app.post("/api/locations/generate-image", async (req, res) => {
    try {
      const { locationPrompt, stylePrompt = "landscape photography, scenic view, environmental art", aiEngine = "gemini" } = req.body;
      
      if (!locationPrompt) {
        return res.status(400).json({ error: "Location prompt is required" });
      }

      const result = await generateCharacterImage({
        characterPrompt: locationPrompt,
        stylePrompt,
        aiEngine
      });
      
      res.json(result);
    } catch (error: any) {
      console.error("Error generating location image:", error);
      res.status(500).json({ 
        error: "Failed to generate image", 
        details: error.message 
      });
    }
  });

  // Location routes
  app.get("/api/projects/:projectId/locations", async (req, res) => {
    try {
      const { projectId } = req.params;
      const locations = await storage.getLocations(projectId);
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/locations", async (req, res) => {
    try {
      const { projectId } = req.params;
      const locationData = insertLocationSchema.parse({ 
        ...req.body, 
        projectId,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
      });
      const location = await storage.createLocation(locationData);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating location:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/locations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Updating location with data:", req.body);
      
      // Filter out empty strings and undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
      );
      
      if (Object.keys(cleanedData).length === 0) {
        return res.status(400).json({ error: "No valid data provided for update" });
      }
      
      const locationData = insertLocationSchema.partial().parse(cleanedData);
      const location = await storage.updateLocation(id, locationData);
      
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      
      res.json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating location:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/locations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteLocation(id);
      
      if (!success) {
        return res.status(404).json({ error: "Location not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting location:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Location generation endpoint
  app.post("/api/projects/:projectId/locations/generate", async (req, res) => {
    try {
      const { projectId } = req.params;
      const { locationType, scale, significance, customPrompt } = req.body;
      
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const [locations, characters] = await Promise.all([
        storage.getLocations(projectId),
        storage.getCharacters(projectId)
      ]);
      
      const { generateContextualLocation } = await import('./locationGeneration');
      
      const generatedLocation = await generateContextualLocation({
        project,
        characters,
        existingLocations: locations,
        generationOptions: { locationType, scale, significance, customPrompt }
      });
      
      res.json(generatedLocation);
    } catch (error: any) {
      console.error("Error generating location:", error);
      res.status(500).json({ 
        error: "Failed to generate location", 
        details: error.message 
      });
    }
  });

  // Location image generation endpoint
  app.post("/api/generate-location-image", async (req, res) => {
    try {
      const { locationId, locationName, description } = req.body;
      
      if (!locationId || !locationName) {
        return res.status(400).json({ error: "Location ID and name are required" });
      }

      const result = await generateCharacterImage({
        characterPrompt: `A fantasy location called "${locationName}". ${description}. Create a scenic landscape or architectural view of this location.`,
        stylePrompt: "fantasy landscape, detailed, cinematic, epic",
        aiEngine: "gemini"
      });
      
      if (result.url) {
        // Get the current location and update its image gallery
        const location = await storage.getLocation(locationId);
        if (location) {
          const imageGallery = Array.isArray(location.imageGallery) ? location.imageGallery : [];
          const newImage = {
            id: Date.now().toString(),
            url: result.url,
            prompt: `${locationName}: ${description}`,
            createdAt: new Date().toISOString()
          };
          
          const updatedImageGallery = [...imageGallery, newImage];
          await storage.updateLocation(locationId, {
            ...location,
            imageGallery: updatedImageGallery,
            displayImageId: location.displayImageId || newImage.id
          });
        }
      }
      
      res.json(result);
    } catch (error: any) {
      console.error("Error generating location image:", error);
      res.status(500).json({ 
        error: "Failed to generate location image", 
        details: error.message 
      });
    }
  });

  // Faction routes
  app.get("/api/projects/:projectId/factions", async (req, res) => {
    try {
      const { projectId } = req.params;
      const factions = await storage.getFactions(projectId);
      res.json(factions);
    } catch (error) {
      console.error("Error fetching factions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/factions", async (req, res) => {
    try {
      const { projectId } = req.params;
      const factionData = insertFactionSchema.parse({ 
        ...req.body, 
        projectId,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
      });
      const faction = await storage.createFaction(factionData);
      res.status(201).json(faction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating faction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/factions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Updating faction with data:", req.body);
      
      // Filter out empty strings and undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
      );
      
      if (Object.keys(cleanedData).length === 0) {
        return res.status(400).json({ error: "No valid data provided for update" });
      }
      
      const factionData = insertFactionSchema.partial().parse(cleanedData);
      const faction = await storage.updateFaction(id, factionData);
      
      if (!faction) {
        return res.status(404).json({ error: "Faction not found" });
      }
      
      res.json(faction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating faction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/factions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteFaction(id);
      
      if (!success) {
        return res.status(404).json({ error: "Faction not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting faction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Faction generation endpoint
  app.post("/api/projects/:projectId/factions/generate", async (req, res) => {
    try {
      const { projectId } = req.params;
      const { factionType, role, scale, goals, customPrompt } = req.body;
      
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const [factions, characters] = await Promise.all([
        storage.getFactions(projectId),
        storage.getCharacters(projectId)
      ]);
      
      const { generateContextualFaction } = await import('./factionGeneration');
      
      const generatedFaction = await generateContextualFaction({
        project,
        characters,
        existingFactions: factions,
        generationOptions: { factionType, role, scale, goals, customPrompt }
      });
      
      res.json(generatedFaction);
    } catch (error: any) {
      console.error("Error generating faction:", error);
      res.status(500).json({ 
        error: "Failed to generate faction", 
        details: error.message 
      });
    }
  });

  // Item routes
  app.get("/api/projects/:projectId/items", async (req, res) => {
    try {
      const { projectId } = req.params;
      const items = await storage.getItems(projectId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/items", async (req, res) => {
    try {
      const { projectId } = req.params;
      const itemData = insertItemSchema.parse({ 
        ...req.body, 
        projectId,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
      });
      const item = await storage.createItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Updating item with data:", req.body);
      
      // Filter out empty strings and undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
      );
      
      if (Object.keys(cleanedData).length === 0) {
        return res.status(400).json({ error: "No valid data provided for update" });
      }
      
      const itemData = insertItemSchema.partial().parse(cleanedData);
      const item = await storage.updateItem(id, itemData);
      
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteItem(id);
      
      if (!success) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Organization routes
  app.get("/api/projects/:projectId/organizations", async (req, res) => {
    try {
      const { projectId } = req.params;
      const organizations = await storage.getOrganizations(projectId);
      res.json(organizations);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/organizations", async (req, res) => {
    try {
      const { projectId } = req.params;
      const organizationData = insertOrganizationSchema.parse({ 
        ...req.body, 
        projectId,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
      });
      const organization = await storage.createOrganization(organizationData);
      res.status(201).json(organization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating organization:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/organizations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Updating organization with data:", req.body);
      
      // Filter out empty strings and undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
      );
      
      if (Object.keys(cleanedData).length === 0) {
        return res.status(400).json({ error: "No valid data provided for update" });
      }
      
      const organizationData = insertOrganizationSchema.partial().parse(cleanedData);
      const organization = await storage.updateOrganization(id, organizationData);
      
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }
      
      res.json(organization);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating organization:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/organizations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteOrganization(id);
      
      if (!success) {
        return res.status(404).json({ error: "Organization not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting organization:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Magic System routes
  app.get("/api/projects/:projectId/magic-systems", async (req, res) => {
    try {
      const { projectId } = req.params;
      const magicSystems = await storage.getMagicSystems(projectId);
      res.json(magicSystems);
    } catch (error) {
      console.error("Error fetching magic systems:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/projects/:projectId/magic-systems", async (req, res) => {
    try {
      const { projectId } = req.params;
      const magicSystemData = insertMagicSystemSchema.parse({ 
        ...req.body, 
        projectId,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
      });
      const magicSystem = await storage.createMagicSystem(magicSystemData);
      res.status(201).json(magicSystem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error creating magic system:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/magic-systems/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log("Updating magic system with data:", req.body);
      
      // Filter out empty strings and undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
      );
      
      if (Object.keys(cleanedData).length === 0) {
        return res.status(400).json({ error: "No valid data provided for update" });
      }
      
      const magicSystemData = insertMagicSystemSchema.partial().parse(cleanedData);
      const magicSystem = await storage.updateMagicSystem(id, magicSystemData);
      
      if (!magicSystem) {
        return res.status(404).json({ error: "Magic system not found" });
      }
      
      res.json(magicSystem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Error updating magic system:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/magic-systems/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteMagicSystem(id);
      
      if (!success) {
        return res.status(404).json({ error: "Magic system not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting magic system:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
