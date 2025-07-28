import { Router } from "express";
import { z } from "zod";
import { insertProjectSchema } from "@shared/schema";
import { storage } from "../storage";

export const projectRouter = Router();

// Get all projects
projectRouter.get("/", async (req, res) => {
  try {
    const projects = await storage.getProjects();
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single project with related data
projectRouter.get("/:id", async (req, res) => {
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
      synopsis: project.synopsis || '',
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
        type: 'prose' as const,
        createdAt: doc.createdAt
      })),
      settings: { aiCraftConfig: { 'story-structure': true, 'character-development': true, 'world-building': true } }
    };
    
    res.json(transformedProject);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new project
projectRouter.post("/", async (req, res) => {
  try {
    // Extract userId from authenticated user (req.user should be set by auth middleware)
    const userId = req.user?.id || 'demo-user-1'; // Fallback for development
    
    // Prepare project data with generated ID and user ID
    const projectData = {
      ...req.body,
      userId,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const validatedData = insertProjectSchema.parse(projectData);
    const project = await storage.createProject(validatedData);
    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(400).json({ error: "Invalid project data" });
  }
});

// Update project
projectRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Transform genre to proper array format if needed
    let transformedData = { ...req.body };
    if (transformedData.genre && typeof transformedData.genre === 'string') {
      transformedData.genre = transformedData.genre.split(',').map((g: string) => g.trim()).filter(Boolean);
    }
    
    const project = await storage.updateProject(id, transformedData);
    res.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete project
projectRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteProject(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});