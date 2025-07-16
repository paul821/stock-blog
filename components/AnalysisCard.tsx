import React from 'react';
import Link from 'next/link';
import { Analysis } from '@/lib/content';
import { format } from 'date-fns';

interface AnalysisCardProps {
  analysis: Analysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <Link href={`/analysis/${analysis.slug}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{analysis.company}</h3>
          <p className="text-sm text-gray-500">{analysis.ticker} • {analysis.industry}</p>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{analysis.summary}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {(analysis.date && !isNaN(new Date(analysis.date).getTime()))
              ? format(new Date(analysis.date), 'MMM d, yyyy')
              : 'N/A'}
          </span>
          <div className="text-sm text-gray-500">
            <span>Analysis</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 