import { NextResponse } from 'next/server';

// Fallback market data when API is not available
const fallbackMarketData = [
  {
    symbol: '^GSPC',
    name: 'S&P 500',
    price: 5200.50,
    change: 15.20,
    changePercent: 0.29,
    loading: false,
  },
  {
    symbol: '^IXIC',
    name: 'NASDAQ',
    price: 16500.75,
    change: 45.30,
    changePercent: 0.28,
    loading: false,
  },
  {
    symbol: '^DJI',
    name: 'DOW',
    price: 39500.25,
    change: -25.10,
    changePercent: -0.06,
    loading: false,
  },
];

export async function GET() {
  try {
    // Use a free public API for market data
    const symbols = ['SPY', 'QQQ', 'DIA']; // ETFs that track the major indices
    const marketData = [];

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      try {
        // Using Alpha Vantage API (free tier available)
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=demo`
        );
        
        if (response.ok) {
          const data = await response.json();
          const quote = data['Global Quote'];
          
          if (quote && quote['05. price']) {
            const currentPrice = parseFloat(quote['05. price']);
            const previousClose = parseFloat(quote['08. previous close']);
            const change = currentPrice - previousClose;
            const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

            const name = symbol === 'SPY' ? 'S&P 500' : 
                        symbol === 'QQQ' ? 'NASDAQ' : 'DOW';

            marketData.push({
              symbol: symbol === 'SPY' ? '^GSPC' : 
                     symbol === 'QQQ' ? '^IXIC' : '^DJI',
              name,
              price: currentPrice,
              change,
              changePercent,
              loading: false,
            });
          } else {
            // If API doesn't return data, use fallback
            const name = symbol === 'SPY' ? 'S&P 500' : 
                        symbol === 'QQQ' ? 'NASDAQ' : 'DOW';
            marketData.push({
              symbol: symbol === 'SPY' ? '^GSPC' : 
                     symbol === 'QQQ' ? '^IXIC' : '^DJI',
              name,
              price: fallbackMarketData[i].price,
              change: fallbackMarketData[i].change,
              changePercent: fallbackMarketData[i].changePercent,
              loading: false,
            });
          }
        } else {
          // If API call fails, use fallback
          marketData.push(fallbackMarketData[i]);
        }
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        // Use fallback data for this symbol
        marketData.push(fallbackMarketData[i]);
      }
    }

    return NextResponse.json(marketData);
  } catch (error) {
    console.error('Error in market data API:', error);
    return NextResponse.json(fallbackMarketData);
  }
} 