import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { extractBlogContent } from "./services/scraper";
import { analyzeSeoWithAI } from "./services/openai";
import { insertSeoAnalysisSchema } from "@shared/schema";
import { z } from "zod";

const analyzeUrlSchema = z.object({
  url: z.string().url("Please provide a valid URL")
});

export async function registerRoutes(app: Express): Promise<Server> {
  // SEO Analysis endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = analyzeUrlSchema.parse(req.body);

      // Extract blog content
      const blogContent = await extractBlogContent(url);

      // Analyze with AI
      const aiAnalysis = await analyzeSeoWithAI(blogContent);

      // Store analysis result
      const analysisData = {
        url,
        title: blogContent.title,
        metaDescription: blogContent.metaDescription,
        content: blogContent.content.substring(0, 5000), // Store first 5000 chars
        overallScore: aiAnalysis.overallScore,
        metrics: aiAnalysis.metrics,
        recommendations: aiAnalysis.recommendations
      };

      const savedAnalysis = await storage.createSeoAnalysis(analysisData);

      res.json({
        success: true,
        analysis: {
          ...savedAnalysis,
          insights: aiAnalysis.insights
        }
      });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Failed to analyze URL"
      });
    }
  });

  // Get analysis by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getSeoAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analysis" });
    }
  });

  // Get analyses by URL
  app.get("/api/analyses", async (req, res) => {
    try {
      const { url } = req.query;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: "URL parameter is required" });
      }

      const analyses = await storage.getSeoAnalysesByUrl(url);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analyses" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
