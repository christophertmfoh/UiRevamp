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

  // Mount modular routers with optional auth
  app.use("/api/projects", optionalAuth, projectRouter);
  app.use("/api", optionalAuth, characterRouter);
  app.use("/api", optionalAuth, outlineRouter);
  app.use("/api", optionalAuth, proseRouter);
  app.use("/api/daily-content", authenticateToken, dailyContentRouter);
  app.use("/api/tasks", authenticateToken, tasksRouter);
  
  // Legacy routes that need migration
  app.get("/api/projects/:projectId/locations", async (req, res) => {
    res.json([]); // Return empty array for now
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

  // Apply error handler middleware
  app.use(errorHandler);
  
  const httpServer = createServer(app);
  return httpServer;
}