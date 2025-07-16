import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
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
  content: string;
  tags: string[];
}

const analysesDirectory = path.join(process.cwd(), 'content/analyses');

function parseNotebookFile(filePath: string): Analysis | null {
  try {
    const ext = path.extname(filePath);
    
    if (ext === '.md') {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        slug: path.basename(filePath, '.md'),
        content,
        ...data,
      } as Analysis;
    } else if (ext === '.ipynb') {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const nb: NotebookJSON = JSON.parse(fileContents);
      
      // Extract metadata
      const meta = nb.metadata || {};
      // Convert notebook cells to markdown/code string for compatibility
      let content = '';
      for (const cell of nb.cells) {
        if (cell.cell_type === 'markdown') {
          content += cell.source.join('') + '\n\n';
        } else if (cell.cell_type === 'code') {
          content += '```' + (cell.metadata?.language || 'python') + '\n';
          content += cell.source.join('') + '\n';
          content += '```\n';
          // Optionally, handle outputs (text, chart, table markers)
          if (cell.metadata?.output === 'chart') {
            content += '<!-- OUTPUT:chart -->\n';
          } else if (cell.metadata?.output === 'table') {
            content += '<!-- OUTPUT:table -->\n';
          }
        }
      }
      
      // Ensure all required fields are present with defaults
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
        content,
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
    // Use API route to get analyses
    const response = await fetch('/api/analyses');
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