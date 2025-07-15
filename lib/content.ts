import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Analysis {
  slug: string;
  title: string;
  company: string;
  ticker: string;
  industry: string;
  date: string;
  summary: string;
  prediction: 'bullish' | 'bearish' | 'neutral';
  targetPrice: number;
  currentPrice: number;
  content: string;
  tags: string[];
}

const analysesDirectory = path.join(process.cwd(), 'content/analyses');

export async function getAnalyses(): Promise<Analysis[]> {
  try {
    const filenames = fs.readdirSync(analysesDirectory);
    const analyses = filenames
      .filter(name => name.endsWith('.md'))
      .map(name => {
        const filePath = path.join(analysesDirectory, name);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        
        return {
          slug: name.replace('.md', ''),
          content,
          ...data,
        } as Analysis;
      });
    
    return analyses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading analyses:', error);
    return [];
  }
}

export async function getAnalysis(slug: string): Promise<Analysis | null> {
  try {
    const filePath = path.join(analysesDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      content,
      ...data,
    } as Analysis;
  } catch (error) {
    console.error(`Error reading analysis ${slug}:`, error);
    return null;
  }
}