import React from 'react';

interface FinancialRatioCardProps {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
}

export function FinancialRatioCard({ title, value, description, trend }: FinancialRatioCardProps) {
  const trendColor = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };
  
  return (
    <div className="metric-card">
      <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
      <p className={`text-2xl font-bold ${trendColor[trend]}`}>{value}</p>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
} 