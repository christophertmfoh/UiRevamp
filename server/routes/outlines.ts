import { Router } from "express";
import { insertOutlineSchema } from "@shared/schema";
import { storage } from "../storage";

export const outlineRouter = Router();

// Get outlines for a project
outlineRouter.get("/projects/:projectId/outlines", async (req, res) => {
  try {
    const { projectId } = req.params;
    const outlines = await storage.getOutlines(projectId);
    res.json(outlines);
  } catch (error) {
    console.error("Error fetching outlines:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create outline
outlineRouter.post("/outlines", async (req, res) => {
  try {
    const validatedData = insertOutlineSchema.parse(req.body);
    const outline = await storage.createOutline(validatedData);
    res.status(201).json(outline);
  } catch (error) {
    console.error("Error creating outline:", error);
    res.status(400).json({ error: "Invalid outline data" });
  }
});

// Update outline
outlineRouter.put("/outlines/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = insertOutlineSchema.parse(req.body);
    const outline = await storage.updateOutline(id, validatedData);
    res.json(outline);
  } catch (error) {
    console.error("Error updating outline:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete outline
outlineRouter.delete("/outlines/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteOutline(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting outline:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});