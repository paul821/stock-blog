export interface NotebookCell {
  cell_type: 'markdown' | 'code';
  source: string[];
  metadata?: {
    language?: string;
    output?: 'chart' | 'table' | 'text';
    [key: string]: any;
  };
  outputs?: any[];
}

export interface NotebookJSON {
  cells: NotebookCell[];
  metadata: {
    title?: string;
    company?: string;
    ticker?: string;
    industry?: string;
    date?: string;
    summary?: string;
    prediction?: 'bullish' | 'bearish' | 'neutral';
    targetPrice?: number;
    currentPrice?: number;
    tags?: string[];
    [key: string]: any;
  };
  nbformat: number;
  nbformat_minor: number;
} 