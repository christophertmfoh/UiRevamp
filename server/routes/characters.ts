import { Router } from "express";
// Removed unused insertCharacterSchema import
import { storage } from "../storage";
import { transformCharacterData } from "../utils/characterTransformers";
// AI services removed - UI placeholders remain functional
import multer from "multer";

export const characterRouter = Router();

// DEBUG ROUTE: Test if character router is being hit
characterRouter.post("/projects/:projectId/characters/test-route", async (req, res) => {
  res.json({ 
    message: "Character router is working!", 
    projectId: req.params.projectId, 
    body: req.body,
    env_keys: {
      GEMINI_X: process.env.GEMINI_X?.substring(0, 10) + '...',
      GOOGLE_API_KEY_1: process.env.GOOGLE_API_KEY_1?.substring(0, 10) + '...',
      NODE_ENV: process.env.NODE_ENV
    }
  });
});

// Configure multer for file uploads
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

// Get characters for a project
characterRouter.get("/projects/:projectId/characters", async (req, res) => {
  try {
    const { projectId } = req.params;
    const characters = await storage.getCharacters(projectId);
    res.json(characters);
  } catch (error) {
    console.error("Error fetching characters:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create character
characterRouter.post("/projects/:projectId/characters", async (req, res) => {
  try {
    const { projectId } = req.params;
    const characterData = {
      projectId: projectId,
      name: req.body.name || 'Unnamed Character',
      ...req.body
    };
    
    // Transform data using shared utility
    const transformedData = transformCharacterData(characterData);
    
    // Generate unique ID to prevent collisions
    const generateUniqueId = () => {
      const timestamp = Date.now();
      const randomPart = Math.random().toString(36).substring(2, 15);
      const extraRandom = Math.random().toString(36).substring(2, 9);
      return `char_${timestamp}_${randomPart}_${extraRandom}`;
    };
    
    // Add ID if not present
    if (!transformedData.id) {
      transformedData.id = generateUniqueId();
    }
    
    console.log('Creating character with transformed data:', transformedData);
    const character = await storage.createCharacter(transformedData as any);
    res.status(201).json(character);
  } catch (error: unknown) {
    console.error("Error creating character:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Validation details:", errorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update character
characterRouter.put("/characters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Transform data using shared utility
    const transformedData = transformCharacterData(req.body);
    
    console.log('Updating character with transformed data:', { 
      id, 
      personalityTraits: transformedData.personalityTraits,
      abilities: transformedData.abilities,
      skills: transformedData.skills
    });
    
    const character = await storage.updateCharacter(id, transformedData);
    res.json(character);
  } catch (error: unknown) {
    console.error("Error updating character:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Validation error details:", errorMessage);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete character
characterRouter.delete("/characters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ Server: Attempting to delete character with ID: ${id}`);
    
    const success = await storage.deleteCharacter(id);
    
    if (success) {
      console.log(`✅ Server: Successfully deleted character ${id}`);
      res.status(204).send();
    } else {
      console.log(`❌ Server: Character ${id} not found`);
      res.status(404).json({ error: "Character not found" });
    }
  } catch (error) {
    console.error("❌ Server: Error deleting character:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// REMOVED: Old template endpoint - Templates now use the unified /generate endpoint

// AI Character Generation (backend AI disabled, route functional)
characterRouter.post("/projects/:projectId/characters/generate", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { characterType, role, customPrompt, personality, archetype } = req.body;
    
    console.log('Starting character generation with automatic portrait creation');
    
    // Get project data
    const project = await storage.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    
    // AI generation removed - return placeholder response
    res.status(200).json({ 
      message: "AI generation temporarily disabled - UI placeholder active",
      projectId 
    });
  } catch (error: unknown) {
    console.error("Error generating character:", error);
    res.status(500).json({ error: "Failed to generate character" });
  }
});

// Generate character portrait
characterRouter.post("/characters/:id/generate-image", async (req, res) => {
  try {
    const { id } = req.params;
    const character = await storage.getCharacter(id);
    
    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }
    
    // Image generation removed - UI placeholder remains functional
    res.status(200).json({ message: "Image generation temporarily disabled - UI placeholder active" });
  } catch (error: unknown) {
    console.error("Error generating character image:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Import character from document
characterRouter.post("/projects/:projectId/characters/import", upload.single('file'), async (req, res) => {
  try {
    const { projectId } = req.params;
    const { file } = req;
    
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    // Document import AI functionality removed
    const result = { error: "Document import temporarily disabled - AI functionality removed" };
    
    // Transform array fields to strings as expected by database
    const transformedResult = transformCharacterData(result as Record<string, unknown>);
    
    // Generate a more robust unique ID to prevent collisions
    const generateUniqueId = () => {
      const timestamp = Date.now();
      const randomPart = Math.random().toString(36).substring(2, 15);
      const extraRandom = Math.random().toString(36).substring(2, 9);
      return `char_${timestamp}_${randomPart}_${extraRandom}`;
    };

    const character = await storage.createCharacter({
      id: generateUniqueId(),
      ...transformedResult,
      projectId
    });
    res.json({ character });
  } catch (error: unknown) {
    console.error("Error importing character document:", error);
    res.status(500).json({ error: "Failed to import document" });
  }
});