import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes if needed
  app.get("/api/health", (_req, res) => {
    res.json({ status: "healthy" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
