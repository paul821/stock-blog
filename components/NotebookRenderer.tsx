'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { ChartCell } from './ChartCell';
import { MetricsTable } from './MetricsTable';

interface NotebookRendererProps {
  content: string;
}

export function NotebookRenderer({ content }: NotebookRendererProps) {
  // Parse notebook-style content
  const cells = parseNotebookContent(content);
  
  return (
    <div className="space-y-6">
      {cells.map((cell, index) => (
        <div key={index} className="notebook-cell">
          {cell.type === 'markdown' && (
            <div className="p-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose max-w-none"
                components={{
                  h1: ({ children }) => (
                    <h1 className="section-header text-3xl">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="section-header text-2xl">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="section-header text-xl">{children}</h3>
                  ),
                }}
              >
                {cell.content}
              </ReactMarkdown>
            </div>
          )}
          
          {cell.type === 'code' && (
            <>
              <div className="cell-input">
                <CodeBlock language={cell.language || 'python'} code={cell.content} />
              </div>
              {cell.output && (
                <div className="cell-output">
                  {cell.output.type === 'chart' ? (
                    <ChartCell data={cell.output.data} />
                  ) : cell.output.type === 'table' ? (
                    <MetricsTable data={cell.output.data} />
                  ) : (
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                      {cell.output.content}
                    </pre>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

interface NotebookCell {
  type: 'markdown' | 'code';
  content: string;
  language?: string;
  output?: {
    type: 'text' | 'chart' | 'table';
    content?: string;
    data?: any;
  };
}

function parseNotebookContent(content: string): NotebookCell[] {
  const cells: NotebookCell[] = [];
  const lines = content.split('\n');
  let currentCell: NotebookCell | null = null;
  let currentContent: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for code block start
    if (line.startsWith('```')) {
      if (currentCell) {
        currentCell.content = currentContent.join('\n');
        cells.push(currentCell);
      }
      
      const language = line.slice(3) || 'python';
      currentCell = {
        type: 'code',
        content: '',
        language,
      };
      currentContent = [];
      continue;
    }
    
    // Check for code block end
    if (line === '```' && currentCell?.type === 'code') {
      currentCell.content = currentContent.join('\n');
      
      // Look for output markers
      const nextLine = lines[i + 1];
      if (nextLine?.startsWith('<!-- OUTPUT:')) {
        const outputType = nextLine.match(/<!-- OUTPUT:(\w+) -->/)?.[1];
        if (outputType === 'chart') {
          currentCell.output = {
            type: 'chart',
            data: generateSampleChartData(),
          };
        } else if (outputType === 'table') {
          currentCell.output = {
            type: 'table',
            data: generateSampleTableData(),
          };
        }
        i++; // Skip the output marker line
      }
      
      cells.push(currentCell);
      currentCell = null;
      currentContent = [];
      continue;
    }
    
    // Regular content
    if (currentCell) {
      currentContent.push(line);
    } else {
      // Start new markdown cell
      currentCell = {
        type: 'markdown',
        content: '',
      };
      currentContent = [line];
    }
  }
  
  // Add final cell
  if (currentCell) {
    currentCell.content = currentContent.join('\n');
    cells.push(currentCell);
  }
  
  return cells;
}

function generateSampleChartData() {
  return [
    { date: '2024-01', price: 150, volume: 1000000 },
    { date: '2024-02', price: 155, volume: 1200000 },
    { date: '2024-03', price: 148, volume: 950000 },
    { date: '2024-04', price: 162, volume: 1100000 },
    { date: '2024-05', price: 158, volume: 1300000 },
  ];
}

function generateSampleTableData() {
  return [
    { metric: 'P/E Ratio', value: '25.4', change: '+2.1%' },
    { metric: 'Revenue Growth', value: '12.5%', change: '+0.8%' },
    { metric: 'Debt-to-Equity', value: '0.45', change: '-0.02' },
    { metric: 'ROE', value: '18.2%', change: '+1.5%' },
  ];
}