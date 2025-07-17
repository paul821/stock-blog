import React from 'react';
import Link from 'next/link';
import { Analysis } from '@/lib/content';
import { format } from 'date-fns';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface AnalysisCardProps {
  analysis: Analysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const predictionIcon = {
    bullish: <ArrowUp className="h-5 w-5 text-green-600" />,
    bearish: <ArrowDown className="h-5 w-5 text-red-600" />,
    neutral: <Minus className="h-5 w-5 text-gray-600" />,
  };
  
  const predictionColor = {
    bullish: 'text-green-600',
    bearish: 'text-red-600',
    neutral: 'text-gray-600',
  };
  
  return (
    <Link href={`/analysis/${analysis.slug}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{analysis.company}</h3>
            <p className="text-sm text-gray-500">{analysis.ticker} • {analysis.industry}</p>
          </div>
          <div className="flex items-center space-x-1">
            {predictionIcon[analysis.prediction]}
            <span className={`text-sm font-medium ${predictionColor[analysis.prediction]}`}>
              {analysis.prediction.toUpperCase()}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{analysis.summary}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm text-gray-500">
            {(analysis.date && !isNaN(new Date(analysis.date).getTime()))
              ? format(new Date(analysis.date), 'MMM d, yyyy')
              : 'N/A'}
          </span>
          <div className="text-sm">
            <span className="text-gray-500">Target: </span>
            <span className="font-semibold">${analysis.targetPrice}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 