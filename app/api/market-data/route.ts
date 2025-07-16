import { NextResponse } from 'next/server';
import yfinance from 'yfinance';

export async function GET() {
  try {
    const symbols = ['^GSPC', '^IXIC', '^DJI'];
    const marketData = [];

    for (const symbol of symbols) {
      try {
        const ticker = yfinance.Ticker(symbol);
        const info = await ticker.info;
        
        const name = symbol === '^GSPC' ? 'S&P 500' : 
                    symbol === '^IXIC' ? 'NASDAQ' : 'DOW';
        
        const currentPrice = info.regularMarketPrice || 0;
        const previousClose = info.regularMarketPreviousClose || currentPrice;
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
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
} 