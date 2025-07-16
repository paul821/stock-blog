'use client';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { ChartCell } from './ChartCell';
import { MetricsTable } from './MetricsTable';
import type { NotebookCell as NBCell } from '../types/notebook';

// Local type for display cells
interface DisplayNotebookCell {
  type: 'markdown' | 'code';
  content: string;
  language?: string;
  output?: {
    type: 'text' | 'chart' | 'table';
    content?: string;
    data?: any;
  };
}

interface NotebookRendererProps {
  content: string | NBCell[];
}

function isNotebookCellArray(content: any): content is NBCell[] {
  return Array.isArray(content) && content.length > 0 && typeof content[0] === 'object' && 'cell_type' in content[0];
}

export function NotebookRenderer({ content }: NotebookRendererProps) {
  let cells: DisplayNotebookCell[] = [];
  
  if (isNotebookCellArray(content)) {
    // Native .ipynb support
    cells = content.map(cell => {
      if (cell.cell_type === 'markdown') {
        return {
          type: 'markdown',
          content: cell.source.join(''),
        };
      } else if (cell.cell_type === 'code') {
        let output: DisplayNotebookCell['output'] = undefined;
        if (cell.metadata?.output === 'chart') {
          output = { type: 'chart' as const, data: generateSampleChartData() };
        } else if (cell.metadata?.output === 'table') {
          output = { type: 'table' as const, data: generateSampleTableData() };
        }
        return {
          type: 'code',
          content: cell.source.join(''),
          language: cell.metadata?.language || 'python',
          output,
        };
      }
      return { type: 'markdown', content: '' };
    });
  } else {
    // Legacy markdown string
    cells = parseNotebookContent(content as string);
  }

  return (
    <div className="space-y-8">
      {cells.map((cell, index) => (
        <div key={index} className="notebook-cell">
          {cell.type === 'markdown' && (
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose max-w-none"
                components={{
                  h1: (props) => (
                    <h1 {...props} className="text-3xl font-bold text-gray-900 mb-4 mt-8 first:mt-0">
                      {props.children}
                    </h1>
                  ),
                  h2: (props) => (
                    <h2 {...props} className="text-2xl font-semibold text-gray-900 mb-3 mt-6">
                      {props.children}
                    </h2>
                  ),
                  h3: (props) => (
                    <h3 {...props} className="text-xl font-semibold text-gray-900 mb-2 mt-4">
                      {props.children}
                    </h3>
                  ),
                  h4: (props) => (
                    <h4 {...props} className="text-lg font-semibold text-gray-900 mb-2 mt-4">
                      {props.children}
                    </h4>
                  ),
                  p: (props) => (
                    <p {...props} className="text-gray-700 mb-4 leading-relaxed">
                      {props.children}
                    </p>
                  ),
                  ul: (props) => (
                    <ul {...props} className="list-disc list-inside space-y-1 mb-4 text-gray-700">
                      {props.children}
                    </ul>
                  ),
                  ol: (props) => (
                    <ol {...props} className="list-decimal list-inside space-y-1 mb-4 text-gray-700">
                      {props.children}
                    </ol>
                  ),
                  li: (props) => (
                    <li {...props} className="text-gray-700">
                      {props.children}
                    </li>
                  ),
                  strong: (props) => (
                    <strong {...props} className="font-semibold text-gray-900">
                      {props.children}
                    </strong>
                  ),
                  em: (props) => (
                    <em {...props} className="italic text-gray-700">
                      {props.children}
                    </em>
                  ),
                  blockquote: (props) => (
                    <blockquote {...props} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
                      {props.children}
                    </blockquote>
                  ),
                }}
              >
                {cell.content}
              </ReactMarkdown>
            </div>
          )}
          {cell.type === 'code' && (
            <>
              <div className="cell-input mb-4">
                <CodeBlock language={cell.language || 'python'} code={cell.content} />
              </div>
              {cell.output && (
                <div className="cell-output mb-6">
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