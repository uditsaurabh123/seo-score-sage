import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface BlogContent {
  title: string;
  metaDescription: string;
  content: string;
  headings: string[];
  images: Array<{ src: string; alt: string }>;
  wordCount: number;
}

export async function analyzeSeoWithAI(blogContent: BlogContent): Promise<{
  overallScore: number;
  metrics: any;
  recommendations: any[];
  insights: string;
}> {
  try {
    const prompt = `
    You are an expert SEO analyst. Analyze the following blog content and provide a comprehensive SEO analysis in JSON format.

    Blog Content:
    - Title: ${blogContent.title}
    - Meta Description: ${blogContent.metaDescription}
    - Word Count: ${blogContent.wordCount}
    - Content: ${blogContent.content.substring(0, 3000)}...
    - Headings: ${JSON.stringify(blogContent.headings)}
    - Images: ${JSON.stringify(blogContent.images)}

    Please provide analysis in this exact JSON format:
    {
      "overallScore": number (0-100),
      "metrics": {
        "titleTag": {
          "score": number (0-100),
          "description": "string",
          "status": "excellent" | "good" | "needs-work"
        },
        "metaDescription": {
          "score": number (0-100),
          "description": "string",
          "status": "excellent" | "good" | "needs-work"
        },
        "headingStructure": {
          "score": number (0-100),
          "description": "string",
          "status": "excellent" | "good" | "needs-work"
        },
        "keywordDensity": {
          "score": number (0-100),
          "description": "string",
          "status": "excellent" | "good" | "needs-work"
        },
        "contentLength": {
          "score": number (0-100),
          "description": "string",
          "status": "excellent" | "good" | "needs-work"
        },
        "readabilityScore": number (0-100),
        "wordCount": number,
        "sentences": number,
        "topKeywords": [
          {
            "keyword": "string",
            "density": number
          }
        ]
      },
      "recommendations": [
        {
          "title": "string",
          "description": "string",
          "priority": "high" | "medium" | "low",
          "category": "string"
        }
      ],
      "insights": "string - overall AI insight about the content"
    }

    Focus on:
    1. Title tag optimization (length, keywords, readability)
    2. Meta description quality and length
    3. Heading structure (H1, H2, H3 hierarchy)
    4. Keyword density and distribution
    5. Content length and depth
    6. Readability and structure
    7. Image optimization (alt text)
    8. Internal linking opportunities
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert SEO analyst. Provide detailed, actionable SEO analysis in the exact JSON format requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      overallScore: result.overallScore || 0,
      metrics: result.metrics || {},
      recommendations: result.recommendations || [],
      insights: result.insights || ""
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to analyze content with AI: " + (error as Error).message);
  }
}
