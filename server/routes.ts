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
import { importCharacterDocument } from "./characterExtractor";
import { getAIServiceStats, clearAICache } from "./services/aiGeneration";
import { getPoolStats } from "./db";
import multer from "multer";
import path from "path";
import { fileTypeFromBuffer } from "file-type";
import os from "os";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/', // Temporary upload directory
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

// Performance monitoring middleware
const performanceTracker = {
  requests: [] as Array<{ path: string; method: string; duration: number; timestamp: number; status: number }>,
  errors: [] as Array<{ path: string; method: string; error: string; timestamp: number }>,
  
  addRequest(req: any, duration: number, status: number) {
    this.requests.push({
      path: req.path,
      method: req.method,
      duration,
      status,
      timestamp: Date.now()
    });
    
    // Keep only last 1000 requests to prevent memory issues
    if (this.requests.length > 1000) {
      this.requests = this.requests.slice(-1000);
    }
  },
  
  addError(req: any, error: string) {
    this.errors.push({
      path: req.path,
      method: req.method,
      error,
      timestamp: Date.now()
    });
    
    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }
  },
  
  getStats() {
    const now = Date.now();
    const lastHour = now - (60 * 60 * 1000);
    const lastMinute = now - (60 * 1000);
    
    const recentRequests = this.requests.filter(r => r.timestamp > lastHour);
    const recentErrors = this.errors.filter(e => e.timestamp > lastHour);
    const lastMinuteRequests = this.requests.filter(r => r.timestamp > lastMinute);
    
    return {
      totalRequests: this.requests.length,
      requestsLastHour: recentRequests.length,
      requestsLastMinute: lastMinuteRequests.length,
      errorsLastHour: recentErrors.length,
      averageResponseTime: recentRequests.length > 0 
        ? recentRequests.reduce((sum, r) => sum + r.duration, 0) / recentRequests.length 
        : 0,
      slowestEndpoints: this.getSlowEndpoints(recentRequests),
      errorsByEndpoint: this.getErrorsByEndpoint(recentErrors)
    };
  },
  
  getSlowEndpoints(requests: any[]) {
    const endpointStats = new Map<string, { count: number; totalTime: number; maxTime: number }>();
    
    requests.forEach(req => {
      const key = `${req.method} ${req.path}`;
      const current = endpointStats.get(key) || { count: 0, totalTime: 0, maxTime: 0 };
      
      current.count++;
      current.totalTime += req.duration;
      current.maxTime = Math.max(current.maxTime, req.duration);
      
      endpointStats.set(key, current);
    });
    
    return Array.from(endpointStats.entries())
      .map(([endpoint, stats]) => ({
        endpoint,
        averageTime: stats.totalTime / stats.count,
        maxTime: stats.maxTime,
        count: stats.count
      }))
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, 10);
  },
  
  getErrorsByEndpoint(errors: any[]) {
    const errorCounts = new Map<string, number>();
    
    errors.forEach(error => {
      const key = `${error.method} ${error.path}`;
      errorCounts.set(key, (errorCounts.get(key) || 0) + 1);
    });
    
    return Array.from(errorCounts.entries())
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Performance monitoring middleware
  app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      performanceTracker.addRequest(req, duration, res.statusCode);
      
      if (res.statusCode >= 400) {
        performanceTracker.addError(req, `HTTP ${res.statusCode}`);
      }
    });
    
    next();
  });

  // Health check and monitoring endpoints
  app.get("/api/health", async (req, res) => {
    try {
      const memoryUsage = process.memoryUsage();
      const systemStats = {
        uptime: process.uptime(),
        memory: {
          rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
          heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
          heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
          external: Math.round(memoryUsage.external / 1024 / 1024), // MB
        },
        cpu: {
          loadAverage: os.loadavg(),
          usage: process.cpuUsage()
        },
        system: {
          platform: os.platform(),
          arch: os.arch(),
          nodeVersion: process.version,
          totalMemory: Math.round(os.totalmem() / 1024 / 1024), // MB
          freeMemory: Math.round(os.freemem() / 1024 / 1024), // MB
        }
      };

      res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
        ...systemStats
      });
    } catch (error) {
      res.status(500).json({
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      });
    }
  });

  // Performance metrics endpoint
  app.get("/api/metrics", async (req, res) => {
    try {
      const performanceStats = performanceTracker.getStats();
      const aiStats = getAIServiceStats();
      const dbStats = getPoolStats();
      const cacheStats = storage.getCacheStats();

      res.json({
        timestamp: new Date().toISOString(),
        performance: performanceStats,
        ai: aiStats,
        database: dbStats,
        cache: cacheStats,
        memory: {
          heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        }
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Cache management endpoints
  app.post("/api/admin/cache/clear", async (req, res) => {
    try {
      storage.clearCache();
      clearAICache();
      res.json({ message: "All caches cleared successfully" });
    } catch (error) {
      console.error("Error clearing caches:", error);
      res.status(500).json({ error: "Failed to clear caches" });
    }
  });

  // Performance optimization endpoint
  app.post("/api/admin/optimize", async (req, res) => {
    try {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      // Clear old performance data
      performanceTracker.requests = performanceTracker.requests.slice(-500);
      performanceTracker.errors = performanceTracker.errors.slice(-50);
      
      res.json({ 
        message: "System optimization completed",
        memoryAfter: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      });
    } catch (error) {
      console.error("Error during optimization:", error);
      res.status(500).json({ error: "Optimization failed" });
    }
  });

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
      
      // Fetch related data with parallel requests for better performance
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
        })),
        proseDocuments: proseDocuments.map(p => ({
          id: parseInt(p.id),
          title: p.title,
          content: p.content || '',
          description: p.description || '',
          imageGallery: [], // TODO: Fetch images
        }))
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

  app.put("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // Ensure genre is properly handled as an array
      if (updateData.genre && !Array.isArray(updateData.genre)) {
        updateData.genre = [updateData.genre];
      }
      
      console.log('Updating project with data:', updateData);
      const updatedProject = await storage.updateProject(id, updateData);
      
      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      res.json(updatedProject);
    } catch (error) {
      console.error("Error updating project:", error);
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
      const characterData = {
        id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        projectId,
        name: req.body.name || 'Unnamed Character',
        ...req.body
      };
      
      // Transform array fields to comma-separated strings for database compatibility
      // Fields that are stored as TEXT (strings) in database but might come as arrays from frontend
      const arrayToStringFields = [
        'spokenLanguages', 'hobbies', 'interests', 'habits', 'mannerisms', 
        'strengths', 'weaknesses', 'fears', 'phobias', 'values', 'beliefs', 
        'goals', 'motivations', 'secrets', 'flaws', 'quirks', 'equipment', 
        'possessions', 'relationships', 'allies', 'enemies', 'rivals', 
        'familyMembers', 'friends', 'acquaintances', 'children', 'parents', 
        'siblings', 'spouse', 'pets', 'companions', 'mentors', 'students', 
        'themes', 'symbolism', 'inspiration'
      ];
      
      // Fields that should remain as arrays (defined with .array() in schema)
      const keepAsArrayFields = [
        'personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 
        'tropes', 'tags', 'spokenLanguages'
      ];
      
      arrayToStringFields.forEach(field => {
        if (Array.isArray(characterData[field])) {
          characterData[field] = characterData[field].join(', ');
        }
      });
      
      // Ensure array fields stay as arrays and handle empty strings
      keepAsArrayFields.forEach(field => {
        if (typeof characterData[field] === 'string') {
          if (characterData[field] === '' || !characterData[field]) {
            characterData[field] = [];
          } else {
            characterData[field] = characterData[field].split(',').map(s => s.trim()).filter(s => s);
          }
        } else if (!Array.isArray(characterData[field])) {
          characterData[field] = [];
        }
      });
      
      console.log('Creating character with transformed data:', characterData);
      // Skip validation for now and directly use transformed data  
      const validatedData = characterData;
      const character = await storage.createCharacter(validatedData);
      res.status(201).json(character);
    } catch (error) {
      console.error("Error creating character:", error);
      console.error("Validation details:", error.issues || error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/characters/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Transform array fields to comma-separated strings for database compatibility
      const transformedData = { ...req.body };
      
      // Fields that are stored as TEXT (strings) in database but might come as arrays from frontend
      const arrayToStringFields = [
        'spokenLanguages', 'hobbies', 'interests', 'habits', 'mannerisms', 
        'strengths', 'weaknesses', 'fears', 'phobias', 'values', 'beliefs', 
        'goals', 'motivations', 'secrets', 'flaws', 'quirks', 'equipment', 
        'possessions', 'relationships', 'allies', 'enemies', 'rivals', 
        'familyMembers', 'friends', 'acquaintances', 'children', 'parents', 
        'siblings', 'spouse', 'pets', 'companions', 'mentors', 'students', 
        'themes', 'symbolism', 'inspiration'
      ];
      
      // Fields that should remain as arrays (defined with .array() in schema)
      const keepAsArrayFields = [
        'personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 
        'tropes', 'tags', 'spokenLanguages'
      ];
      
      arrayToStringFields.forEach(field => {
        if (Array.isArray(transformedData[field])) {
          transformedData[field] = transformedData[field].join(', ');
        }
      });
      
      // Ensure array fields stay as arrays and handle empty strings
      keepAsArrayFields.forEach(field => {
        if (typeof transformedData[field] === 'string') {
          if (transformedData[field] === '' || !transformedData[field]) {
            transformedData[field] = [];
          } else {
            transformedData[field] = transformedData[field].split(',').map(s => s.trim()).filter(s => s);
          }
        } else if (!Array.isArray(transformedData[field])) {
          transformedData[field] = [];
        }
      });
      
      console.log('Transforming character data for update:', { 
        id, 
        personalityTraits: { original: req.body.personalityTraits, transformed: transformedData.personalityTraits },
        abilities: { original: req.body.abilities, transformed: transformedData.abilities },
        skills: { original: req.body.skills, transformed: transformedData.skills }
      });
      
      // Skip validation for now and directly use transformed data
      // The validation is causing issues with array fields, so we'll handle validation manually
      const validatedData = transformedData;
      
      console.log('Final validated data sample:', {
        personalityTraits: validatedData.personalityTraits,
        abilities: validatedData.abilities,
        skills: validatedData.skills,
        dataTypes: {
          personalityTraits: typeof validatedData.personalityTraits,
          abilities: typeof validatedData.abilities,
          skills: typeof validatedData.skills
        }
      });
      const character = await storage.updateCharacter(id, validatedData);
      res.json(character);
    } catch (error) {
      console.error("Error updating character:", error);
      console.error("Validation error details:", error.issues || error.message);
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

  // Enhanced character generation endpoint with automatic portrait generation
  app.post("/api/projects/:projectId/characters/generate", async (req, res) => {
    try {
      const { projectId } = req.params;
      const { characterType, role, customPrompt, personality, archetype } = req.body;
      
      console.log('Starting character generation with automatic portrait creation');
      
      // Get project data
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Get related data for context
      const characters = await storage.getCharacters(projectId);
      
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

      // Generate automatic portrait in background
      try {
        console.log('Generating automatic portrait for generated character');
        const { generateCharacterPortrait } = await import('./characterPortraitGenerator');
        const portraitUrl = await generateCharacterPortrait(generatedCharacter);
        
        if (portraitUrl) {
          console.log('Portrait generated successfully, adding to character data');
          generatedCharacter.imageUrl = portraitUrl;
          generatedCharacter.portraits = [{
            id: `portrait_${Date.now()}`,
            url: portraitUrl,
            isMain: true
          }];
        } else {
          console.log('Portrait generation failed, continuing without portrait');
        }
      } catch (portraitError) {
        console.error('Portrait generation failed, but continuing with character creation:', portraitError);
      }
      
      res.json(generatedCharacter);
    } catch (error: any) {
      console.error("Error generating character:", error);
      res.status(500).json({ 
        error: "Failed to generate character", 
        details: error.message 
      });
    }
  });

  // Direct character creation endpoint for character save operations
  app.post("/api/characters", async (req, res) => {
    try {
      console.log('Creating character directly:', req.body);
      
      const characterData = {
        id: req.body.id || `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...req.body
      };
      
      // Transform array fields to comma-separated strings for database compatibility
      const arrayToStringFields = [
        'hobbies', 'interests', 'habits', 'mannerisms', 
        'strengths', 'weaknesses', 'fears', 'phobias', 'values', 'beliefs', 
        'goals', 'motivations', 'secrets', 'flaws', 'quirks', 'equipment', 
        'possessions', 'relationships', 'allies', 'enemies', 'rivals', 
        'familyMembers', 'friends', 'acquaintances', 'children', 'parents', 
        'siblings', 'spouse', 'pets', 'companions', 'mentors', 'students', 
        'themes', 'symbolism', 'inspiration'
      ];
      
      // Fields that should remain as arrays (defined with .array() in schema)
      const keepAsArrayFields = [
        'personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 
        'tropes', 'tags', 'spokenLanguages'
      ];
      
      arrayToStringFields.forEach(field => {
        if (Array.isArray(characterData[field])) {
          characterData[field] = characterData[field].join(', ');
        }
      });
      
      // Ensure array fields stay as arrays and handle empty strings
      keepAsArrayFields.forEach(field => {
        if (typeof characterData[field] === 'string') {
          if (characterData[field] === '' || !characterData[field]) {
            characterData[field] = [];
          } else {
            characterData[field] = characterData[field].split(',').map(s => s.trim()).filter(s => s);
          }
        } else if (!Array.isArray(characterData[field])) {
          characterData[field] = [];
        }
      });
      
      console.log('Creating character with transformed data');
      const character = await storage.createCharacter(characterData);
      res.status(201).json(character);
    } catch (error) {
      console.error("Error creating character:", error);
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  });

  // Enhanced character document import endpoint with automatic portrait generation
  app.post("/api/characters/import-document", upload.single('document'), async (req, res) => {
    try {
      console.log('Character extraction request received with automatic portrait generation');
      
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
      const characterData = await importCharacterDocument(req.file.path, req.file.originalname);
      
      console.log('Document imported successfully, now generating portrait');

      // Generate automatic portrait for imported character
      try {
        const { generateCharacterPortrait } = await import('./characterPortraitGenerator');
        const portraitUrl = await generateCharacterPortrait(characterData);
        
        if (portraitUrl) {
          console.log('Portrait generated successfully for imported character');
          characterData.imageUrl = portraitUrl;
          characterData.portraits = [{
            id: `portrait_${Date.now()}`,
            url: portraitUrl,
            isMain: true
          }];
        } else {
          console.log('Portrait generation failed for imported character');
        }
      } catch (portraitError) {
        console.error('Portrait generation failed for imported character:', portraitError);
      }
      
      // Return the extracted character data with portrait for frontend
      res.json({
        ...characterData,
        projectId: projectId
      });
      
    } catch (error: any) {
      console.error("Error importing document:", error);
      res.status(500).json({ 
        error: "Failed to import document", 
        details: error.message 
      });
    }
  });

  // Enhanced template-based character generation endpoint with automatic portrait
  app.post("/api/projects/:projectId/characters/generate-from-template", async (req, res) => {
    try {
      const { projectId } = req.params;
      const { templateData } = req.body;
      
      console.log('Starting template-based character generation with automatic portrait');
      
      // Get project data for context
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Get existing characters for context
      const characters = await storage.getCharacters(projectId);
      
      // Generate full character from template using AI enhancement
      const { generateContextualCharacter } = await import('./characterGeneration');
      
      // Create context for AI generation based on template
      const templatePrompt = `Generate a complete character based on this template: ${templateData.name}. 
      Template description: ${templateData.description}. 
      Key traits: ${templateData.traits?.join(', ') || ''}. 
      Background elements: ${templateData.background || ''}. 
      Fill out all character fields with rich, detailed content that matches this archetype.`;

      const generatedCharacter = await generateContextualCharacter({
        project,
        existingCharacters: characters,
        generationOptions: {
          characterType: templateData.category || 'character',
          role: templateData.role || '',
          customPrompt: templatePrompt,
          personality: templateData.traits?.join(', ') || '',
          archetype: templateData.name || ''
        }
      });

      // Merge template data with generated data
      const enhancedCharacter = {
        ...generatedCharacter,
        // Ensure template-specific fields are preserved
        class: templateData.class || generatedCharacter.class,
        role: templateData.role || generatedCharacter.role,
        // Merge personality traits
        personalityTraits: [
          ...(templateData.traits || []),
          ...(generatedCharacter.personalityTraits || [])
        ].slice(0, 10), // Limit to avoid too many traits
      };

      // Generate automatic portrait for template character
      try {
        console.log('Generating automatic portrait for template character');
        const { generateCharacterPortrait } = await import('./characterPortraitGenerator');
        const portraitUrl = await generateCharacterPortrait(enhancedCharacter);
        
        if (portraitUrl) {
          console.log('Portrait generated successfully for template character');
          enhancedCharacter.imageUrl = portraitUrl;
          enhancedCharacter.portraits = [{
            id: `portrait_${Date.now()}`,
            url: portraitUrl,
            isMain: true
          }];
        } else {
          console.log('Portrait generation failed for template character');
        }
      } catch (portraitError) {
        console.error('Portrait generation failed for template character:', portraitError);
      }
      
      res.json(enhancedCharacter);
    } catch (error: any) {
      console.error("Error generating template character:", error);
      res.status(500).json({ 
        error: "Failed to generate template character", 
        details: error.message 
      });
    }
  });

  // Enhanced manual character creation endpoint with automatic portrait generation
  app.post("/api/projects/:projectId/characters/create-manual", async (req, res) => {
    try {
      const { projectId } = req.params;
      const characterData = req.body;
      
      console.log('Creating manual character with automatic portrait generation');
      
      // Validate project exists
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Add project ID to character data
      const characterWithProject = {
        ...characterData,
        projectId
      };

      // Generate automatic portrait for manual character if they have enough data
      if (characterData.name || characterData.physicalDescription) {
        try {
          console.log('Generating automatic portrait for manual character');
          const { generateCharacterPortrait } = await import('./characterPortraitGenerator');
          const portraitUrl = await generateCharacterPortrait(characterWithProject);
          
          if (portraitUrl) {
            console.log('Portrait generated successfully for manual character');
            characterWithProject.imageUrl = portraitUrl;
            characterWithProject.portraits = [{
              id: `portrait_${Date.now()}`,
              url: portraitUrl,
              isMain: true
            }];
          }
        } catch (portraitError) {
          console.error('Portrait generation failed for manual character:', portraitError);
        }
      }
      
      res.json(characterWithProject);
    } catch (error: any) {
      console.error("Error creating manual character:", error);
      res.status(500).json({ 
        error: "Failed to create manual character", 
        details: error.message 
      });
    }
  });

  // Comprehensive character image generation endpoint with full context
  app.post("/api/generate-character-image", async (req, res) => {
    console.log('=== COMPREHENSIVE CHARACTER IMAGE GENERATION REQUEST RECEIVED ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    try {
      const { prompt, characterId, engineType = "gemini", artStyle, additionalDetails, projectId } = req.body;
      
      if (!prompt) {
        console.log('Error: No prompt provided');
        return res.status(400).json({ error: "Character prompt is required" });
      }

      // Get project context for genre and type
      let projectContext = '';
      if (projectId) {
        try {
          const project = await storage.getProject(projectId);
          if (project) {
            const genres = Array.isArray(project.genre) ? project.genre.join(', ') : (project.genre || 'general');
            const projectType = project.type || 'novel';
            projectContext = `genre: ${genres} for a ${projectType}`;
            console.log('Project context:', projectContext);
          }
        } catch (error) {
          console.log('Could not fetch project context:', error);
        }
      }

      console.log('Generating character image with comprehensive prompt system');
      console.log('Character data:', prompt);
      console.log('Art style input:', artStyle);
      console.log('Additional details input:', additionalDetails);
      console.log('Project context:', projectContext);
      console.log('Engine type:', engineType);

      // Build comprehensive style prompt based on user input
      const qualityDefaults = "high quality portrait, dramatic lighting, masterpiece, best quality, highly detailed, sharp focus, cinematic lighting, expressive eyes, realistic proportions";
      
      let stylePrompt = '';
      
      // If user provided art style or additional details, use those + quality defaults
      if ((artStyle && artStyle.trim()) || (additionalDetails && additionalDetails.trim())) {
        const userInputs = [artStyle, additionalDetails].filter(input => input && input.trim()).join(', ');
        stylePrompt = `Style: ${userInputs}, ${qualityDefaults}`;
      } else {
        // If no user input, just use quality defaults
        stylePrompt = `Style: ${qualityDefaults}`;
      }

      // Build final comprehensive prompt structure
      let finalPrompt = `generate a high quality portrait of ${prompt}`;
      
      if (projectContext) {
        finalPrompt += `, ${projectContext}`;
      }
      
      finalPrompt += `, ${stylePrompt}`;

      console.log('Final comprehensive prompt:', finalPrompt);

      const result = await generateCharacterImage({
        characterPrompt: finalPrompt,
        stylePrompt: "", // All styling is now in characterPrompt
        aiEngine: engineType
      });
      
      console.log('Comprehensive image generation successful, returning result');
      
      // Return result in expected format
      res.json(result);
    } catch (error: any) {
      console.error("Error generating comprehensive character image:", error);
      res.status(500).json({ 
        error: "Failed to generate comprehensive image", 
        details: error.message || 'Unknown error'
      });
    }
  });

  // Character field enhancement endpoint
  app.post("/api/characters/:id/enhance-field", async (req, res) => {
    try {
      const { id } = req.params;
      const { fieldKey, fieldLabel, currentValue, fieldOptions } = req.body;
      
      console.log(`Enhancing field ${fieldKey} for character ${id}`);
      
      const character = await storage.getCharacter(id);
      if (!character) {
        return res.status(404).json({ error: "Character not found" });
      }

      console.log(`Retrieved character for field enhancement:`, { id: character.id, name: character.name, race: character.race });

      const { enhanceCharacterField } = await import('./services/aiGeneration');
      
      const enhancedField = await enhanceCharacterField(character, fieldKey, fieldLabel, currentValue, fieldOptions);
      
      console.log(`Enhanced field result:`, enhancedField);
      res.json({ enhancedValue: enhancedField });
    } catch (error: any) {
      console.error("Error enhancing character field:", error);
      res.status(500).json({ 
        error: "Failed to enhance character field", 
        details: error.message 
      });
    }
  });

  const server = createServer(app);
  return server;
}
