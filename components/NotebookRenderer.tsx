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
        // Handle outputs array
        let output: DisplayNotebookCell['output'] = undefined;
        if (cell.outputs && cell.outputs.length > 0) {
          // Prioritize text/plain, then stream, then images/html
          for (const out of cell.outputs) {
            if (out.output_type === 'stream' && out.text) {
              output = {
                type: 'text',
                content: Array.isArray(out.text) ? out.text.join('') : out.text,
              };
              break;
            } else if ((out.output_type === 'execute_result' || out.output_type === 'display_data') && out.data) {
              if (out.data['text/plain']) {
                output = {
                  type: 'text',
                  content: Array.isArray(out.data['text/plain']) ? out.data['text/plain'].join('') : out.data['text/plain'],
                };
                break;
              } else if (out.data['image/png']) {
                output = {
                  type: 'text',
                  content: `<img src="data:image/png;base64,${out.data['image/png']}" />`,
                };
                break;
              } else if (out.data['text/html']) {
                output = {
                  type: 'text',
                  content: Array.isArray(out.data['text/html']) ? out.data['text/html'].join('') : out.data['text/html'],
                };
                break;
              }
            }
          }
        } else if (cell.metadata?.output === 'chart') {
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
    <div className="space-y-6">
      {cells.map((cell, index) => (
        <div key={index} className="notebook-cell">
          {cell.type === 'markdown' && (
            <div className="p-6">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose max-w-none"
                components={{
                  h1: (props) => (
                    <h1 {...props} className="section-header text-3xl">
                      {props.children}
                    </h1>
                  ),
                  h2: (props) => (
                    <h2 {...props} className="section-header text-2xl">
                      {props.children}
                    </h2>
                  ),
                  h3: (props) => (
                    <h3 {...props} className="section-header text-xl">
                      {props.children}
                    </h3>
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
                  ) : cell.output.type === 'text' && cell.output.content?.startsWith('<img') ? (
                    <span dangerouslySetInnerHTML={{ __html: cell.output.content }} />
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