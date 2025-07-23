import { 
  users, 
  seoAnalyses,
  type User, 
  type InsertUser,
  type SeoAnalysis,
  type InsertSeoAnalysis
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis>;
  getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined>;
  getSeoAnalysesByUrl(url: string): Promise<SeoAnalysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private seoAnalyses: Map<number, SeoAnalysis>;
  private currentUserId: number;
  private currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.seoAnalyses = new Map();
    this.currentUserId = 1;
    this.currentAnalysisId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSeoAnalysis(insertAnalysis: InsertSeoAnalysis): Promise<SeoAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: SeoAnalysis = {
      id,
      url: insertAnalysis.url,
      title: insertAnalysis.title || null,
      metaDescription: insertAnalysis.metaDescription || null,
      content: insertAnalysis.content || null,
      overallScore: insertAnalysis.overallScore,
      metrics: insertAnalysis.metrics,
      recommendations: insertAnalysis.recommendations,
      createdAt: new Date()
    };
    this.seoAnalyses.set(id, analysis);
    return analysis;
  }

  async getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined> {
    return this.seoAnalyses.get(id);
  }

  async getSeoAnalysesByUrl(url: string): Promise<SeoAnalysis[]> {
    return Array.from(this.seoAnalyses.values()).filter(
      (analysis) => analysis.url === url
    );
  }
}

export const storage = new MemStorage();
