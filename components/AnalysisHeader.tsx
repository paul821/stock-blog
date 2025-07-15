import React from 'react';
import { Analysis } from '@/lib/content';
import { format } from 'date-fns';

export function AnalysisHeader({ analysis }: { analysis: Analysis }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{analysis.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{analysis.company} ({analysis.ticker})</span>
            <span>•</span>
            <span>{analysis.industry}</span>
            <span>•</span>
            <span>
              {(analysis.date && !isNaN(new Date(analysis.date).getTime()))
                ? format(new Date(analysis.date), 'MMMM d, yyyy')
                : 'N/A'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">${analysis.targetPrice}</div>
          <div className="text-sm text-gray-500">Price Target</div>
        </div>
      </div>
    </div>
  );
} 