import React from 'react';

interface StockPriceWidgetProps {
  ticker: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

export function StockPriceWidget({ ticker, currentPrice, change, changePercent }: StockPriceWidgetProps) {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{ticker}</h3>
          <p className="text-2xl font-bold text-gray-900">${currentPrice.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}
          </p>
          <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </p>
        </div>
      </div>
    </div>
  );
} 