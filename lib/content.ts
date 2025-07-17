import * as fs from 'fs';
import * as path from 'path';
import * as matter from 'gray-matter';
const grayMatter = (matter as any).default || matter;
import type { NotebookCell, NotebookJSON } from '../types/notebook';

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
  content: string | NotebookCell[];
  tags: string[];
}

const analysesDirectory = path.join(process.cwd(), 'content/analyses');

function parseNotebookFile(filePath: string): Analysis | null {
  try {
    const ext = path.extname(filePath);
    
    if (ext === '.md') {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = grayMatter(fileContents);
      return {
        slug: path.basename(filePath, '.md'),
        content,
        ...data,
      } as Analysis;
    } else if (ext === '.ipynb') {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const nb: NotebookJSON = JSON.parse(fileContents);
      const meta = nb.metadata || {};
      // Pass NBCell[] directly as content
      const content = nb.cells;
      const analysis: Analysis = {
        slug: path.basename(filePath, '.ipynb'),
        title: meta.title || 'Untitled Analysis',
        company: meta.company || 'Unknown Company',
        ticker: meta.ticker || 'UNKNOWN',
        industry: meta.industry || 'Unknown Industry',
        date: meta.date || new Date().toISOString().split('T')[0],
        summary: meta.summary || 'No summary available',
        prediction: meta.prediction || 'neutral',
        targetPrice: meta.targetPrice || 0,
        currentPrice: meta.currentPrice || 0,
        content, // NBCell[] instead of string
        tags: meta.tags || [],
      };
      return analysis;
    }
    return null;
  } catch (error) {
    console.error('Error parsing file:', filePath, error);
    return null;
  }
}

export async function getAnalyses(): Promise<Analysis[]> {
  try {
    console.log('Fetching analyses from API...');
    let apiUrl = '/api/analyses';
    let fetchOptions = {};
    // If running on the server, use absolute URL and no-store cache
    if (typeof window === 'undefined') {
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const host = process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000';
      apiUrl = `${protocol}://${host}/api/analyses`;
      fetchOptions = { cache: 'no-store' };
    }
    const response = await fetch(apiUrl, fetchOptions);
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      throw new Error(`Failed to fetch analyses: ${response.status}`);
    }
    
    const analyses = await response.json();
    console.log('Received analyses:', analyses.length, 'items');
    console.log('Analysis slugs:', analyses.map((a: Analysis) => a.slug));
    
    return analyses;
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return [];
  }
}

export async function getAnalysis(slug: string): Promise<Analysis | null> {
  try {
    // Try .md first, then .ipynb
    let filePath = path.join(analysesDirectory, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      return parseNotebookFile(filePath);
    }
    filePath = path.join(analysesDirectory, `${slug}.ipynb`);
    if (fs.existsSync(filePath)) {
      return parseNotebookFile(filePath);
    }
    return null;
  } catch (error) {
    console.error(`Error reading analysis ${slug}:`, error);
    return null;
  }
}