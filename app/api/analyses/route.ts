export const dynamic = 'force-dynamic';
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
      // Extract metadata or auto-populate
      let meta = nb.metadata || {};
      // Find first markdown cell for title/summary
      let firstMarkdown = nb.cells.find(cell => cell.cell_type === 'markdown' && Array.isArray(cell.source) && cell.source.length > 0);
      let firstLine = firstMarkdown ? firstMarkdown.source[0].replace(/^#\s*/, '').trim() : '';
      let summaryText = firstMarkdown ? firstMarkdown.source.join('').trim() : '';
      // Get file mtime for date fallback
      let fileDate = new Date(fs.statSync(filePath).mtime).toISOString().split('T')[0];
      // Convert notebook cells to markdown/code string for compatibility
      let content = '';
      let skipped = 0;
      for (const cell of nb.cells) {
        if (!Array.isArray(cell.source)) { skipped++; continue; }
        if (cell.cell_type === 'markdown') {
          content += cell.source.join('') + '\n\n';
        } else if (cell.cell_type === 'code') {
          content += '```' + (cell.metadata?.language || 'python') + '\n';
          content += cell.source.join('') + '\n';
          content += '```\n';
          if (cell.metadata?.output === 'chart') {
            content += '<!-- OUTPUT:chart -->\n';
          } else if (cell.metadata?.output === 'table') {
            content += '<!-- OUTPUT:table -->\n';
          }
        }
      }
      // Auto-populate missing metadata fields
      const analysis: Analysis = {
        slug: path.basename(filePath, '.ipynb'),
        title: meta.title || firstLine || 'Untitled Analysis',
        company: meta.company || 'Unknown',
        ticker: meta.ticker || 'UNKNOWN',
        industry: meta.industry || 'Unknown',
        date: meta.date || fileDate,
        summary: meta.summary || summaryText || 'No summary available',
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
    console.log('API route called - checking directory:', analysesDirectory);
    console.log('Directory exists:', fs.existsSync(analysesDirectory));
    
    const filenames = fs.readdirSync(analysesDirectory);
    console.log('Found files:', filenames);
    
    const analyses = filenames
      .filter(name => name.endsWith('.md') || name.endsWith('.ipynb'))
      .map(name => {
        const filePath = path.join(analysesDirectory, name);
        console.log('Processing file:', name);
        const analysis = parseNotebookFile(filePath);
        console.log('Parsed result:', analysis ? analysis.slug : 'null');
        return analysis;
      })
      .filter(Boolean) as Analysis[];
    
    console.log('Total analyses loaded:', analyses.length);
    const sortedAnalyses = analyses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log('Returning analyses:', sortedAnalyses.map(a => a.slug));
    return NextResponse.json(sortedAnalyses);
  } catch (error) {
    console.error('Error reading analyses:', error);
    return NextResponse.json({ error: 'Failed to load analyses' }, { status: 500 });
  }
} 