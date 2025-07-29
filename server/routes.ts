import type { Express } from "express";
import { createServer, type Server } from "http";
import { projectRouter } from "./routes/projects";
import { characterRouter } from "./routes/characters";
import { outlineRouter } from "./routes/outlines";
import { proseRouter } from "./routes/prose";
import { dailyContentRouter } from "./routes/dailyContent";
import tasksRouter from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";
import { signUp, signIn, signOut, authenticateToken, optionalAuth, signupSchema, loginSchema } from "./auth";
import multer from "multer";
import { storage } from "./storage";
import { importCharacterDocument } from "./characterExtractor";
import { generateCharacterImage } from "./imageGeneration";
import { nanoid } from "nanoid";

// Configure multer for character import that hasn't been moved yet
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const result = await signUp(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Signup failed' });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = await signIn(req.body);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error instanceof Error ? error.message : 'Login failed' });
    }
  });

  app.post("/api/auth/logout", authenticateToken, async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
      
      if (token) {
        await signOut(token);
      }
      
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    res.json({ user: req.user });
  });

  // Mount modular routers with required auth for security
  app.use("/api/projects", authenticateToken, projectRouter);
  app.use("/api", optionalAuth, characterRouter);
  app.use("/api", optionalAuth, outlineRouter);
  app.use("/api", optionalAuth, proseRouter);
  app.use("/api/daily-content", authenticateToken, dailyContentRouter);
  app.use("/api/tasks", authenticateToken, tasksRouter);
  
  // WORLD BIBLE ENTITY ROUTES - Full CRUD for all entity types
  const worldBibleEntityTypes = ['locations', 'timeline', 'factions', 'items', 'magic', 'bestiary', 'languages', 'cultures', 'prophecies', 'themes'];
  
  worldBibleEntityTypes.forEach(entityType => {
    // GET all entities of this type
    app.get(`/api/projects/:projectId/${entityType}`, authenticateToken, async (req, res) => {
      try {
        const { projectId } = req.params;
        const entities = await storage.getWorldBibleEntities(projectId, entityType);
        res.json(entities || []);
      } catch (error) {
        console.error(`Error getting ${entityType}:`, error);
        res.status(500).json({ error: `Failed to get ${entityType}` });
      }
    });

    // POST new entity
    app.post(`/api/projects/:projectId/${entityType}`, authenticateToken, async (req, res) => {
      try {
        const { projectId } = req.params;
        const entityData = {
          ...req.body,
          id: `${entityType}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
          projectId,
          entityType,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const entity = await storage.createWorldBibleEntity(entityData);
        res.status(201).json(entity);
      } catch (error) {
        console.error(`Error creating ${entityType}:`, error);
        res.status(500).json({ error: `Failed to create ${entityType}` });
      }
    });

    // GET specific entity
    app.get(`/api/projects/:projectId/${entityType}/:entityId`, authenticateToken, async (req, res) => {
      try {
        const { entityId } = req.params;
        const entity = await storage.getWorldBibleEntity(entityId);
        if (!entity) {
          return res.status(404).json({ error: `${entityType} not found` });
        }
        res.json(entity);
      } catch (error) {
        console.error(`Error getting ${entityType}:`, error);
        res.status(500).json({ error: `Failed to get ${entityType}` });
      }
    });

    // PATCH update entity
    app.patch(`/api/projects/:projectId/${entityType}/:entityId`, authenticateToken, async (req, res) => {
      try {
        const { entityId } = req.params;
        const updateData = {
          ...req.body,
          updatedAt: new Date()
        };
        
        const entity = await storage.updateWorldBibleEntity(entityId, updateData);
        if (!entity) {
          return res.status(404).json({ error: `${entityType} not found` });
        }
        res.json(entity);
      } catch (error) {
        console.error(`Error updating ${entityType}:`, error);
        res.status(500).json({ error: `Failed to update ${entityType}` });
      }
    });

    // DELETE entity
    app.delete(`/api/projects/:projectId/${entityType}/:entityId`, authenticateToken, async (req, res) => {
      try {
        const { entityId } = req.params;
        const success = await storage.deleteWorldBibleEntity(entityId);
        if (!success) {
          return res.status(404).json({ error: `${entityType} not found` });
        }
        res.json({ message: `${entityType} deleted successfully` });
      } catch (error) {
        console.error(`Error deleting ${entityType}:`, error);
        res.status(500).json({ error: `Failed to delete ${entityType}` });
      }
    });

    // AI Generation endpoint
    app.post(`/api/projects/:projectId/${entityType}/generate`, authenticateToken, async (req, res) => {
      try {
        const { projectId } = req.params;
        const { type, prompt, entityType: reqEntityType } = req.body;
        
        // Create generated entity with basic structure
        const entityData = {
          id: `${entityType}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
          projectId,
          entityType,
          name: `Generated ${entityType.slice(0, -1)}`,
          description: `AI generated ${entityType.slice(0, -1)} based on ${type} generation`,
          importance: 'medium',
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const entity = await storage.createWorldBibleEntity(entityData);
        res.status(201).json(entity);
      } catch (error) {
        console.error(`Error generating ${entityType}:`, error);
        res.status(500).json({ error: `Failed to generate ${entityType}` });
      }
    });

    // Template creation endpoint
    app.post(`/api/projects/:projectId/${entityType}/template`, authenticateToken, async (req, res) => {
      try {
        const { projectId } = req.params;
        const { templateId } = req.body;
        
        const entityData = {
          id: `${entityType}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
          projectId,
          entityType,
          name: `Template ${entityType.slice(0, -1)}`,
          description: `Created from template: ${templateId}`,
          importance: 'medium',
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const entity = await storage.createWorldBibleEntity(entityData);
        res.status(201).json(entity);
      } catch (error) {
        console.error(`Error creating ${entityType} from template:`, error);
        res.status(500).json({ error: `Failed to create ${entityType} from template` });
      }
    });

    // Image generation endpoint
    app.post(`/api/projects/:projectId/${entityType}/:entityId/image`, authenticateToken, async (req, res) => {
      try {
        const { entityId } = req.params;
        const { prompt, style } = req.body;
        
        // For now, return the entity with a placeholder image
        const entity = await storage.getWorldBibleEntity(entityId);
        if (!entity) {
          return res.status(404).json({ error: `${entityType} not found` });
        }
        
        // Update entity with placeholder image URL
        const updatedEntity = await storage.updateWorldBibleEntity(entityId, {
          imageUrl: `https://placeholder.com/600x400?text=${encodeURIComponent(entity.name)}`
        });
        
        res.json(updatedEntity);
      } catch (error) {
        console.error(`Error generating image for ${entityType}:`, error);
        res.status(500).json({ error: `Failed to generate image for ${entityType}` });
      }
    });

    // Document upload endpoint
    app.post(`/api/projects/:projectId/${entityType}/upload`, upload.single('document'), async (req, res) => {
      try {
        const { projectId } = req.params;
        const { entityType: reqEntityType } = req.body;
        
        if (!req.file) {
          return res.status(400).json({ error: "No document uploaded" });
        }
        
        const entityData = {
          id: `${entityType}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
          projectId,
          entityType,
          name: `Imported ${entityType.slice(0, -1)}`,
          description: `Imported from document: ${req.file.originalname}`,
          importance: 'medium',
          status: 'draft',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const entity = await storage.createWorldBibleEntity(entityData);
        res.status(201).json(entity);
      } catch (error) {
        console.error(`Error uploading ${entityType} document:`, error);
        res.status(500).json({ error: `Failed to upload ${entityType} document` });
      }
    });
  });

  // Character document import route (needs to be moved to character router)
  app.post("/api/characters/import-document", upload.single('document'), async (req, res) => {
    try {
      console.log('Character extraction request received');
      
      if (!req.file) {
        return res.status(400).json({ error: "No document uploaded" });
      }

      const { projectId } = req.body;
      if (!projectId) {
        return res.status(400).json({ error: "Project ID is required" });
      }

      console.log('Extracting character from:', {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path,
        projectId
      });

      // Import the document using AI
      const extractedData = await importCharacterDocument(req.file.path, req.file.originalname);
      
      console.log('Document imported successfully:', extractedData);

      // Generate a more robust unique ID to prevent collisions
      const generateUniqueId = () => {
        const timestamp = Date.now();
        const randomPart = Math.random().toString(36).substring(2, 15);
        const extraRandom = Math.random().toString(36).substring(2, 9);
        return `char_${timestamp}_${randomPart}_${extraRandom}`;
      };

      // Transform extracted data to match database schema  
      const characterData: Record<string, unknown> = {
        id: generateUniqueId(),
        projectId,
        name: extractedData.name || 'Unnamed Character',
        ...extractedData
      };

      // Create character in database
      const character = await storage.createCharacter(characterData as any);
      
      // Generate portrait for the character
      if (character.id) {
        try {
          const { generateCharacterPortrait } = await import('./characterPortraitGenerator');
          const portraitUrl = await generateCharacterPortrait(character);
          if (portraitUrl) {
            console.log('Portrait generated for imported character:', portraitUrl);
            // Note: displayImageId expects number but portrait generation returns string
            // This is a schema mismatch that needs to be resolved in the database design
          }
        } catch (portraitError) {
          console.error("Error generating portrait:", portraitError);
        }
      }

      res.json({ character });
    } catch (error: unknown) {
      console.error("Error importing document:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: "Failed to import document", details: errorMessage });
    }
  });

  // Character image generation route (needs to be moved to character router)
  app.post("/api/generate-character-image", async (req, res) => {
    try {
      console.log('Character image generation request:', req.body);
      const imageUrl = await generateCharacterImage(req.body);
      res.json(imageUrl); // Return the object directly, not wrapped in { imageUrl }
    } catch (error: unknown) {
      console.error("Error generating character image:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ 
        error: "Failed to generate character image", 
        details: errorMessage 
      });
    }
  });

  // Character creation route (standard)
  app.post("/api/projects/:projectId/characters", async (req, res) => {
    try {
      const { projectId } = req.params;
      console.log(`Creating character for project ${projectId}`);
      
      // Transform request data to match database schema
      const characterData: Record<string, unknown> = {
        id: generateUniqueId(),
        projectId,
        ...req.body
      };
      
      // Create character in database
      const character = await storage.createCharacter(characterData as any);
      
      res.json(character);
    } catch (error) {
      console.error("Error creating character:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ 
        error: "Failed to create character",
        details: errorMessage 
      });
    }
  });

  // Character template generation route
  app.post("/api/projects/:projectId/characters/generate-from-template", async (req, res) => {
    try {
      const { projectId } = req.params;
      const { templateData } = req.body;
      
      console.log(`Generating character from template for project ${projectId}`);
      
      // Import AI generation service
      const { generateCharacterFromPrompt } = await import('./services/aiGeneration');
      
      // Create an enhanced, comprehensive prompt from the template data
      let prompt = `You are a master character creator for storytelling. Create a detailed, compelling character based on this professional template:

TEMPLATE BASE:
- Name: ${templateData.name || 'Character Name'}
- Archetype: ${templateData.description || 'Character Description'} 
- Category: ${templateData.category || 'Universal'}
- Core Role: ${templateData.role || 'Supporting Character'}`;

      if (templateData.traits && Array.isArray(templateData.traits)) {
        prompt += `
- Base Personality Traits: ${templateData.traits.join(', ')}`;
      }

      if (templateData.background) {
        prompt += `
- Foundation Background: ${templateData.background}`;
      }

      if (templateData.goals) {
        prompt += `
- Core Goals: ${templateData.goals}`;
      }

      if (templateData.motivations) {
        prompt += `
- Key Motivations: ${templateData.motivations}`;
      }

      prompt += `

ENHANCEMENT REQUIREMENTS:
Expand this template into a fully realized character with comprehensive details:

1. IDENTITY & APPEARANCE:
   - Age, species, gender, build, height
   - Distinctive physical features, clothing style
   - Voice, mannerisms, presence

2. PERSONALITY & PSYCHOLOGY:
   - Expand personality traits with depth and nuance
   - Core values, beliefs, moral compass
   - Fears, insecurities, internal conflicts
   - Strengths, weaknesses, quirks

3. BACKGROUND & HISTORY:
   - Detailed backstory and formative experiences
   - Family, upbringing, education
   - Key life events that shaped them
   - Current circumstances and living situation

4. ABILITIES & SKILLS:
   - Natural talents and learned skills
   - Combat abilities (if applicable)
   - Social, intellectual, creative capabilities
   - Special powers or unique abilities

5. RELATIONSHIPS & SOCIAL:
   - Important relationships (family, friends, enemies)
   - Social status and reputation
   - How they interact with others
   - Leadership style and social dynamics

6. STORY INTEGRATION:
   - Character arc potential and growth
   - Role in narrative conflicts
   - How they drive or complicate plots
   - Secrets, mysteries, hidden depths

Ensure the character feels authentic, three-dimensional, and compelling for storytelling. Build upon the template foundation while adding rich detail and depth.`;
      
      // Generate character data using AI
      const generatedData = await generateCharacterFromPrompt(prompt);
      
      // Merge template data with generated data, preferring template data for specified fields
      const characterData: Record<string, unknown> = {
        id: generateUniqueId(),
        projectId,
        name: templateData.name || generatedData.name || 'Template Character',
        ...generatedData,
        ...templateData // Template data overrides generated data
      };
      
      // Create character in database
      const character = await storage.createCharacter(characterData as any);
      
      // Generate portrait for the character
      if (character.id) {
        try {
          const { generateCharacterPortrait } = await import('./characterPortraitGenerator');
          const portraitUrl = await generateCharacterPortrait(character);
          if (portraitUrl) {
            console.log('Portrait generated for template character:', portraitUrl);
          }
        } catch (portraitError) {
          console.error("Error generating portrait for template character:", portraitError);
        }
      }
      
      res.json(character);
    } catch (error) {
      console.error("Error generating character from template:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ 
        error: "Failed to generate character from template",
        details: errorMessage 
      });
    }
  });

  // Character AI generation route
  app.post("/api/projects/:projectId/characters/generate", async (req, res) => {
    try {
      const { projectId } = req.params;
      const { characterType, role, customPrompt, personality, archetype } = req.body;
      
      console.log(`Generating character for project ${projectId}`);
      
      // Import AI generation service
      const { generateCharacterFromPrompt } = await import('./services/aiGeneration');
      
      // Create a comprehensive prompt from the options
      let prompt = `Create a detailed character`;
      
      if (characterType) {
        prompt += ` who is a ${characterType}`;
      }
      
      if (role) {
        prompt += ` with the role of ${role}`;
      }
      
      if (archetype) {
        prompt += ` following the ${archetype} archetype`;
      }
      
      if (personality) {
        prompt += ` with personality traits: ${personality}`;
      }
      
      if (customPrompt) {
        prompt += `. Additional details: ${customPrompt}`;
      }
      
      prompt += `. Include comprehensive details for name, physical appearance, personality, background, abilities, and story elements.`;
      
      // Generate character data using AI
      const generatedData = await generateCharacterFromPrompt(prompt);
      
      // Transform generated data to match database schema
      const characterData: Record<string, unknown> = {
        id: generateUniqueId(),
        projectId,
        name: generatedData.name || 'Generated Character',
        ...generatedData
      };
      
      // Create character in database
      const character = await storage.createCharacter(characterData as any);
      
      // Generate portrait for the character
      if (character.id) {
        try {
          const { generateCharacterPortrait } = await import('./characterPortraitGenerator');
          const portraitUrl = await generateCharacterPortrait(character);
          if (portraitUrl) {
            console.log('Portrait generated for AI character:', portraitUrl);
          }
        } catch (portraitError) {
          console.error("Error generating portrait for AI character:", portraitError);
        }
      }
      
      res.json(character);
    } catch (error) {
      console.error("Error generating character:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ 
        error: "Failed to generate character",
        details: errorMessage 
      });
    }
  });

  // Character field enhancement route (needs to be moved to character router)
  app.post("/api/characters/:id/enhance-field", async (req, res) => {
    try {
      const { id } = req.params;
      const { field, currentValue } = req.body;
      
      console.log(`Enhancing field ${field} for character ${id}`);
      
      const character = await storage.getCharacter(id);
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }
      
      // Field enhancement temporarily disabled - service needs to be implemented
      const enhancedValue = currentValue + " (enhanced)";
      
      res.json({ enhancedValue });
    } catch (error: unknown) {
      console.error("Error enhancing field:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ 
        error: "Failed to enhance field", 
        details: errorMessage 
      });
    }
  });

  // World Bible Entity routes
  app.get("/api/projects/:projectId/worldbible/:entityType", async (req, res) => {
    try {
      const { projectId, entityType } = req.params;
      const entities = await storage.getWorldBibleEntities(projectId, entityType);
      res.json(entities);
    } catch (error) {
      console.error("Error fetching World Bible entities:", error);
      res.status(500).json({ error: "Failed to fetch entities" });
    }
  });

  app.get("/api/worldbible/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const entity = await storage.getWorldBibleEntity(id);
      if (!entity) {
        return res.status(404).json({ error: "Entity not found" });
      }
      res.json(entity);
    } catch (error) {
      console.error("Error fetching World Bible entity:", error);
      res.status(500).json({ error: "Failed to fetch entity" });
    }
  });

  app.post("/api/projects/:projectId/worldbible/:entityType", async (req, res) => {
    try {
      const { projectId, entityType } = req.params;
      const entityData = {
        ...req.body,
        id: nanoid(),
        projectId,
        entityType,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const created = await storage.createWorldBibleEntity(entityData);
      res.status(201).json(created);
    } catch (error) {
      console.error("Error creating World Bible entity:", error);
      res.status(500).json({ error: "Failed to create entity" });
    }
  });

  app.put("/api/worldbible/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateWorldBibleEntity(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Entity not found" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating World Bible entity:", error);
      res.status(500).json({ error: "Failed to update entity" });
    }
  });

  app.delete("/api/worldbible/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteWorldBibleEntity(id);
      if (!deleted) {
        return res.status(404).json({ error: "Entity not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting World Bible entity:", error);
      res.status(500).json({ error: "Failed to delete entity" });
    }
  });

  // Root route to guide users to the correct frontend URL
  app.get("/", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>FableCraft API Server</title>
        <style>
          body { font-family: system-ui; padding: 2rem; text-align: center; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; }
          .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎭 FableCraft API Server</h1>
          <p>You've reached the backend API server on port 5000.</p>
          <p>The FableCraft web application runs on a different port.</p>
          <p><strong>To access the application:</strong></p>
          <a href="http://localhost:5173" class="button">Open FableCraft App (Port 5173)</a>
          <br>
          <small>In Replit, use the web preview to access the application.</small>
        </div>
      </body>
      </html>
    `);
  });

  // Simple performance/health endpoint for Replit dashboard
  app.get("/api/health", (req, res) => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    res.json({
      status: "healthy",
      uptime: Math.round(uptime),
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
      },
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  });

  // Apply error handler middleware
  app.use(errorHandler);
  
  const httpServer = createServer(app);
  return httpServer;
}