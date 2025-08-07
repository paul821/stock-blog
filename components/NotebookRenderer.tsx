'use client';
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { ChartCell } from './ChartCell';
import { MetricsTable } from './MetricsTable';
import type { NotebookCell as NBCell } from '../types/notebook';

// --- TYPE DEFINITIONS ---

// Describes the top-level metadata of a notebook
interface NotebookMetadata {
  title?: string;
  company?: string;
  ticker?: string;
  industry?: string;
  date?: string;
  summary?: string;
  prediction?: 'bullish' | 'bearish' | 'neutral';
  targetPrice?: number;
  [key: string]: any; // Allow other properties
}

// Describes the full notebook structure
interface Notebook {
  cells: NBCell[];
  metadata: NotebookMetadata;
}

// Describes the props for the renderer component
interface NotebookRendererProps {
  notebook: Notebook;
  onMetadataLoad?: (metadata: NotebookMetadata) => void;
}

// Local type for processed cells that will be displayed
interface DisplayNotebookCell {
  type: 'markdown' | 'code';
  content: string;
  language?: string;
  output?: Array<{
    type: 'text' | 'chart' | 'table' | 'html';
    content?: string;
    data?: any;
  }>;
}

// --- DEFAULT METADATA ---

// This object provides fallback values for any missing metadata fields.
const defaultMetadata: NotebookMetadata = {
  title: 'Untitled Analysis',
  company: 'Company Not Available',
  ticker: 'N/A',
  industry: 'N/A',
  date: new Date().toISOString(),
  summary: 'No summary was provided for this analysis. The notebook may be missing top-level metadata.',
  prediction: 'neutral',
  targetPrice: 0,
};


// --- HELPER FUNCTIONS ---

function isNotebookCellArray(content: any): content is NBCell[] {
  return Array.isArray(content) && content.length > 0 && typeof content[0] === 'object' && 'cell_type' in content[0];
}

function isDataFrameTable(htmlContent: string): boolean {
  return htmlContent.includes('dataframe') || (htmlContent.includes('<table') && htmlContent.includes('<th') && htmlContent.includes('<td'));
}

function parseDataFrameHTML(htmlContent: string): any[] {
  try {
    const tableMatch = htmlContent.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
    if (!tableMatch) return [];
    const tableContent = tableMatch[1];
    const headers: string[] = [];
    const headerMatch = tableContent.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i) || tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
    if (headerMatch) {
      const headerContent = headerMatch[1];
      const headerCells = headerContent.match(/<th[^>]*>([\s\S]*?)<\/th>/gi) || headerContent.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
      if (headerCells) {
        headerCells.forEach(cell => {
          const cellText = cell.replace(/<[^>]*>/g, '').trim();
          headers.push(cellText);
        });
      }
    }
    const rows: any[] = [];
    const bodyMatch = tableContent.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : tableContent;
    const rowMatches = bodyContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
    if (rowMatches) {
      const startIndex = headers.length > 0 && !bodyMatch ? 1 : 0;
      for (let i = startIndex; i < rowMatches.length; i++) {
        const rowContent = rowMatches[i];
        const cellMatches = rowContent.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi);
        if (cellMatches) {
          const rowData: any = {};
          cellMatches.forEach((cell, index) => {
            const cellText = cell.replace(/<[^>]*>/g, '').trim();
            const header = headers[index] || `Column ${index + 1}`;
            rowData[header] = cellText;
          });
          if (Object.keys(rowData).length > 0) {
            rows.push(rowData);
          }
        }
      }
    }
    return rows;
  } catch (error) {
    console.warn('Failed to parse DataFrame HTML:', error);
    return [];
  }
}

// --- MAIN RENDERER COMPONENT ---

export function NotebookRenderer({ notebook, onMetadataLoad }: NotebookRendererProps) {
  useEffect(() => {
    if (onMetadataLoad) {
      // Merge default values with actual metadata from the notebook.
      // Any fields present in notebook.metadata will overwrite the defaults.
      const mergedMetadata: NotebookMetadata = {
        ...defaultMetadata,
        ...(notebook.metadata || {}),
      };
      onMetadataLoad(mergedMetadata);
    }
  }, [notebook, onMetadataLoad]);

  // Process cells from the notebook prop
  let cells: DisplayNotebookCell[] = [];
  if (isNotebookCellArray(notebook.cells)) {
    cells = notebook.cells.map(cell => {
      if (cell.cell_type === 'markdown') {
        return {
          type: 'markdown',
          content: Array.isArray(cell.source) ? cell.source.join('') : cell.source,
        };
      } else if (cell.cell_type === 'code') {
        let outputs: DisplayNotebookCell['output'] = [];
        if (cell.outputs && cell.outputs.length > 0) {
          for (const out of cell.outputs) {
            if (out.output_type === 'stream' && out.text) {
              outputs.push({
                type: 'text',
                content: Array.isArray(out.text) ? out.text.join('') : out.text,
              });
            } else if ((out.output_type === 'execute_result' || out.output_type === 'display_data') && out.data) {
              if (out.data['image/png']) {
                outputs.push({
                  type: 'text',
                  content: `<img src="data:image/png;base64,${out.data['image/png']}" />`,
                });
              }
              if (out.data['text/html']) {
                const htmlContent = Array.isArray(out.data['text/html']) ? out.data['text/html'].join('') : out.data['text/html'];
                if (isDataFrameTable(htmlContent)) {
                  const tableData = parseDataFrameHTML(htmlContent);
                  outputs.push({
                    type: 'table',
                    data: tableData,
                  });
                } else {
                  outputs.push({
                    type: 'html',
                    content: htmlContent,
                  });
                }
              }
              if (out.data['text/plain']) {
                outputs.push({
                  type: 'text',
                  content: Array.isArray(out.data['text/plain']) ? out.data['text/plain'].join('') : out.data['text/plain'],
                });
              }
            }
          }
        }
        return {
          type: 'code',
          content: Array.isArray(cell.source) ? cell.source.join('') : cell.source,
          language: (cell.metadata?.language as string) || 'python',
          output: outputs.length > 0 ? outputs : undefined,
        };
      }
      return { type: 'markdown', content: '' }; // Fallback for unknown cell types
    });
  }

  return (
    <div className="space-y-6">
      {cells.map((cell, index) => (
        <div key={index} className="notebook-cell">
          {cell.type === 'markdown' && (
            <div className="p-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose max-w-none">
                {cell.content}
              </ReactMarkdown>
            </div>
          )}
          {cell.type === 'code' && (
            <>
              <div className="cell-input">
                <CodeBlock language={cell.language || 'python'} code={cell.content} />
              </div>
              {Array.isArray(cell.output) && cell.output.length > 0 && (
                <div className="cell-output space-y-2">
                  {cell.output.map((out, i) =>
                    out.type === 'chart' ? (
                      <ChartCell key={i} data={out.data} />
                    ) : out.type === 'table' ? (
                      <div key={i} className="overflow-x-auto">
                        <DataFrameTable data={out.data} />
                      </div>
                    ) : out.type === 'html' ? (
                      <div key={i} className="bg-white p-4 rounded border" dangerouslySetInnerHTML={{ __html: out.content || '' }} />
                    ) : out.type === 'text' && out.content?.startsWith('<img') ? (
                      <span key={i} dangerouslySetInnerHTML={{ __html: out.content }} />
                    ) : (
                      <pre key={i} className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        {out.content}
                      </pre>
                    )
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


// --- DATAFRAME TABLE COMPONENT ---

function DataFrameTable({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;
  const columns = Object.keys(data[0]);
  return (
    <table className="min-w-full divide-y divide-gray-200 border">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th key={column} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, index) => (
          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            {columns.map((column) => (
              <td key={column} className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 border-r">
                {row[column]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
