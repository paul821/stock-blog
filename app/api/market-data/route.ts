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
    // Try to import yahoo-finance2 dynamically
    let yahooFinance;
    try {
      yahooFinance = await import('yahoo-finance2');
    } catch (error) {
      console.log('yahoo-finance2 not available, using fallback data');
      return NextResponse.json(fallbackMarketData);
    }

    const symbols = ['^GSPC', '^IXIC', '^DJI'];
    const marketData = [];

    for (const symbol of symbols) {
      try {
        const quote = await yahooFinance.default.quote(symbol);
        
        const name = symbol === '^GSPC' ? 'S&P 500' : 
                    symbol === '^IXIC' ? 'NASDAQ' : 'DOW';
        
        const currentPrice = quote.regularMarketPrice || 0;
        const previousClose = quote.regularMarketPreviousClose || currentPrice;
        const change = currentPrice - previousClose;
        const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

        marketData.push({
          symbol,
          name,
          price: currentPrice,
          change,
          changePercent,
          loading: false,
        });
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        // Add fallback data for this symbol
        const fallbackData = {
          symbol,
          name: symbol === '^GSPC' ? 'S&P 500' : 
                symbol === '^IXIC' ? 'NASDAQ' : 'DOW',
          price: 0,
          change: 0,
          changePercent: 0,
          loading: false,
        };
        marketData.push(fallbackData);
      }
    }

    return NextResponse.json(marketData);
  } catch (error) {
    console.error('Error in market data API:', error);
    return NextResponse.json(fallbackMarketData);
  }
} 