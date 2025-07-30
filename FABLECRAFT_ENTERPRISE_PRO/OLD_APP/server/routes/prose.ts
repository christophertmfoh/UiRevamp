import { Router } from "express";
import { insertProseDocumentSchema } from "@shared/schema";
import { storage } from "../storage";

export const proseRouter = Router();

// Get prose documents for a project
proseRouter.get("/projects/:projectId/prose", async (req, res) => {
  try {
    const { projectId } = req.params;
    const documents = await storage.getProseDocuments(projectId);
    res.json(documents);
  } catch (error) {
    console.error("Error fetching prose documents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create prose document
proseRouter.post("/prose", async (req, res) => {
  try {
    const validatedData = insertProseDocumentSchema.parse(req.body);
    const document = await storage.createProseDocument(validatedData);
    res.status(201).json(document);
  } catch (error) {
    console.error("Error creating prose document:", error);
    res.status(400).json({ error: "Invalid document data" });
  }
});

// Update prose document
proseRouter.put("/prose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = insertProseDocumentSchema.parse(req.body);
    const document = await storage.updateProseDocument(id, validatedData);
    res.json(document);
  } catch (error) {
    console.error("Error updating prose document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete prose document
proseRouter.delete("/prose/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await storage.deleteProseDocument(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting prose document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});