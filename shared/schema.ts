import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const seoAnalyses = pgTable("seo_analyses", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  metaDescription: text("meta_description"),
  content: text("content"),
  overallScore: integer("overall_score").notNull(),
  metrics: jsonb("metrics").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSeoAnalysisSchema = createInsertSchema(seoAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type SeoAnalysis = typeof seoAnalyses.$inferSelect;

export interface SeoMetrics {
  titleTag: { score: number; description: string; status: 'excellent' | 'good' | 'needs-work' };
  metaDescription: { score: number; description: string; status: 'excellent' | 'good' | 'needs-work' };
  headingStructure: { score: number; description: string; status: 'excellent' | 'good' | 'needs-work' };
  keywordDensity: { score: number; description: string; status: 'excellent' | 'good' | 'needs-work' };
  contentLength: { score: number; description: string; status: 'excellent' | 'good' | 'needs-work' };
  readabilityScore: number;
  wordCount: number;
  sentences: number;
  topKeywords: Array<{ keyword: string; density: number }>;
}

export interface SeoRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
}
