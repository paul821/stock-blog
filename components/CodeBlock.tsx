import React from 'react';
import { Copy, Play } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 uppercase tracking-wide">{language}</span>
        <div className="flex space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
            <Play className="h-4 w-4" />
          </button>
        </div>
      </div>
      <pre className="code-block">
        <code>{code}</code>
      </pre>
    </div>
  );
}
