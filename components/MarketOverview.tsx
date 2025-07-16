'use client';
import React, { useEffect, useState } from 'react';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  loading: boolean;
}

export function MarketOverview() {
  const [marketData, setMarketData] = useState<MarketData[]>([
    { symbol: '^GSPC', name: 'S&P 500', price: 0, change: 0, changePercent: 0, loading: true },
    { symbol: '^IXIC', name: 'NASDAQ', price: 0, change: 0, changePercent: 0, loading: true },
    { symbol: '^DJI', name: 'DOW', price: 0, change: 0, changePercent: 0, loading: true },
  ]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Using a proxy or API route to avoid CORS issues
        const response = await fetch('/api/market-data');
        if (response.ok) {
          const data = await response.json();
          setMarketData(data);
        } else {
          // Fallback to static data if API fails
          setMarketData([
            { symbol: '^GSPC', name: 'S&P 500', price: 5200.50, change: 15.20, changePercent: 0.29, loading: false },
            { symbol: '^IXIC', name: 'NASDAQ', price: 16500.75, change: 45.30, changePercent: 0.28, loading: false },
            { symbol: '^DJI', name: 'DOW', price: 39500.25, change: -25.10, changePercent: -0.06, loading: false },
          ]);
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
        // Fallback to static data
        setMarketData([
          { symbol: '^GSPC', name: 'S&P 500', price: 5200.50, change: 15.20, changePercent: 0.29, loading: false },
          { symbol: '^IXIC', name: 'NASDAQ', price: 16500.75, change: 45.30, changePercent: 0.28, loading: false },
          { symbol: '^DJI', name: 'DOW', price: 39500.25, change: -25.10, changePercent: -0.06, loading: false },
        ]);
      }
    };

    fetchMarketData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Overview</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {marketData.map((market) => (
          <div key={market.symbol} className="metric-card">
            <h3 className="text-lg font-semibold text-gray-700">{market.name}</h3>
            {market.loading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ) : (
              <>
                <p className={`text-2xl font-bold ${market.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-500">
                  ${market.price.toFixed(2)} ({market.change >= 0 ? '+' : ''}{market.change.toFixed(2)})
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 