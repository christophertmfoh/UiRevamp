import { Router } from "express";
import { insertCharacterSchema } from "@shared/schema";
import { storage } from "../storage";
import { transformCharacterData } from "../utils/characterTransformers";
import { generateCharacterWithAI } from "../services/characterGeneration";
import { generateCharacterPortrait } from "../characterPortraitGenerator";
import { generateCharacterImage } from "../imageGeneration";
import { importCharacterDocument } from "../characterExtractor";
import multer from "multer";

export const characterRouter = Router();

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
characterRouter.post("/characters", async (req, res) => {
  try {
    const characterData = {
      projectId: req.body.projectId,
      name: req.body.name || 'Unnamed Character',
      ...req.body
    };
    
    // Transform data using shared utility
    const transformedData = transformCharacterData(characterData);
    
    console.log('Creating character with transformed data:', transformedData);
    const character = await storage.createCharacter(transformedData);
    res.status(201).json(character);
  } catch (error) {
    console.error("Error creating character:", error);
    console.error("Validation details:", error.issues || error.message);
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
  } catch (error) {
    console.error("Error updating character:", error);
    console.error("Validation error details:", error.issues || error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete character
characterRouter.delete("/characters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteCharacter(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting character:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Generate character with AI
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
    
    // Generate character with AI
    const character = await generateCharacterWithAI({
      projectId,
      projectName: project.name,
      projectDescription: project.description,
      characterType,
      role,
      customPrompt,
      personality,
      archetype
    });
    
    // Generate portrait for the character
    if (character.id) {
      try {
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
    
    res.status(201).json(character);
  } catch (error) {
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
    
    const imageUrl = await generateCharacterImage(character, req.body);
    res.json({ imageUrl });
  } catch (error) {
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
    
    const result = await importCharacterDocument(file, projectId);
    res.json({ characters: result.characters });
  } catch (error) {
    console.error("Error importing character document:", error);
    res.status(500).json({ error: "Failed to import document" });
  }
});