import { load } from 'cheerio';
import { BlogContent } from './openai.js';

export async function extractBlogContent(url: string): Promise<BlogContent> {
  try {
    // Validate URL format
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol. Only HTTP and HTTPS are supported.');
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = load(html);

    // Extract title
    const title = $('title').text().trim() || 
                 $('h1').first().text().trim() || 
                 'No title found';

    // Extract meta description
    const metaDescription = $('meta[name="description"]').attr('content') || 
                           $('meta[property="og:description"]').attr('content') || 
                           '';

    // Extract content from common content containers
    const contentSelectors = [
      'article',
      '.post-content',
      '.entry-content',
      '.content',
      '.post-body',
      'main',
      '.container'
    ];

    let content = '';
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length && element.text().trim().length > content.length) {
        content = element.text().trim();
      }
    }

    // Fallback to body if no content found
    if (!content) {
      content = $('body').text().trim();
    }

    // Clean up content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    // Extract headings
    const headings: string[] = [];
    $('h1, h2, h3, h4, h5, h6').each((_: any, element: any) => {
      const text = $(element).text().trim();
      if (text) {
        headings.push(text);
      }
    });

    // Extract images with alt text
    const images: Array<{ src: string; alt: string }> = [];
    $('img').each((_: any, element: any) => {
      const src = $(element).attr('src');
      const alt = $(element).attr('alt') || '';
      if (src) {
        images.push({ src, alt });
      }
    });

    // Calculate word count
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

    return {
      title,
      metaDescription,
      content,
      headings,
      images,
      wordCount
    };
  } catch (error) {
    console.error("Scraping error:", error);
    throw new Error("Failed to extract blog content: " + (error as Error).message);
  }
}
