import express from "express";
import { registerRoutes } from "./routes.ts";

const app = express();
const server = await registerRoutes(app);
console.log(`🚀 React app running on port ${server.address()?.port || 5000}`);