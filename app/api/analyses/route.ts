import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { NotebookCell, NotebookJSON } from '../../../types/notebook';

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

export async function GET() {
  try {
    const filenames = fs.readdirSync(analysesDirectory);
    
    const analyses = filenames
      .filter(name => name.endsWith('.md') || name.endsWith('.ipynb'))
      .map(name => {
        const filePath = path.join(analysesDirectory, name);
        return parseNotebookFile(filePath);
      })
      .filter(Boolean) as Analysis[];
    
    const sortedAnalyses = analyses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json(sortedAnalyses);
  } catch (error) {
    console.error('Error reading analyses:', error);
    return NextResponse.json({ error: 'Failed to load analyses' }, { status: 500 });
  }
} 