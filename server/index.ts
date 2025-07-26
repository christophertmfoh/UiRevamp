import express from "express";
import { registerRoutes } from "./routes.ts";

const app = express();
await registerRoutes(app);