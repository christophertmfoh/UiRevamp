import type { Express } from "express";
import { createServer, type Server } from "http";
import { projectRouter } from "./routes/projects";
import { characterRouter } from "./routes/characters";
import { outlineRouter } from "./routes/outlines";
import { proseRouter } from "./routes/prose";
import { errorHandler } from "./middleware/errorHandler";
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
  // Mount modular routers
  app.use("/api/projects", projectRouter);
  app.use("/api", characterRouter);
  app.use("/api", outlineRouter);
  app.use("/api", proseRouter);
  
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

      // Transform extracted data to match database schema
      const characterData: any = {
        id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        projectId,
        name: extractedData.name || 'Unnamed Character',
        ...extractedData
      };

      // Create character in database
      const character = await storage.createCharacter(characterData);
      
      // Generate portrait for the character
      if (character.id) {
        try {
          const { generateCharacterPortrait } = await import('./characterPortraitGenerator');
          const portraitUrl = await generateCharacterPortrait(character);
          if (portraitUrl) {
            await storage.updateCharacter(character.id, {
              displayImageId: portraitUrl,
              imageGallery: [portraitUrl]
            });
            character.displayImageId = portraitUrl;
            character.imageGallery = [portraitUrl];
          }
        } catch (portraitError) {
          console.error("Error generating portrait:", portraitError);
        }
      }

      res.json({ character });
    } catch (error: any) {
      console.error("Error importing document:", error);
      res.status(500).json({ error: "Failed to import document", details: error.message });
    }
  });

  // Character image generation route (needs to be moved to character router)
  app.post("/api/generate-character-image", async (req, res) => {
    try {
      console.log('Character image generation request:', req.body);
      const imageUrl = await generateCharacterImage(req.body);
      res.json({ imageUrl });
    } catch (error: any) {
      console.error("Error generating character image:", error);
      res.status(500).json({ 
        error: "Failed to generate character image", 
        details: error.message 
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
      
      // Import enhancement function
      const { enhanceCharacterField } = await import('./fieldEnhancement');
      const enhancedValue = await enhanceCharacterField(character, field, currentValue);
      
      res.json({ enhancedValue });
    } catch (error: any) {
      console.error("Error enhancing field:", error);
      res.status(500).json({ 
        error: "Failed to enhance field", 
        details: error.message 
      });
    }
  });

  // Apply error handler middleware
  app.use(errorHandler);
  
  const httpServer = createServer(app);
  return httpServer;
}