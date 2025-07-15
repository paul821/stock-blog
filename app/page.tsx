import { AnalysisCard } from '@/components/AnalysisCard';
import { HeroSection } from '@/components/HeroSection';
import { getAnalyses } from '@/lib/content';
import Link from 'next/link';

export default async function Home() {
  const analyses = await getAnalyses();
  
  return (
    <div className="space-y-12">
      <HeroSection />
      
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Stock Analyses</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {analyses.map((analysis) => (
            <Link key={analysis.slug} href={`/analysis/${analysis.slug}`} className="block">
              <AnalysisCard analysis={analysis} />
            </Link>
          ))}
        </div>
      </section>
      
      <section className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Market Overview</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-gray-700">S&P 500</h3>
            <p className="text-2xl font-bold metric-positive">+1.2%</p>
            <p className="text-sm text-gray-500">Today</p>
          </div>
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-gray-700">NASDAQ</h3>
            <p className="text-2xl font-bold metric-positive">+0.8%</p>
            <p className="text-sm text-gray-500">Today</p>
          </div>
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-gray-700">DOW</h3>
            <p className="text-2xl font-bold metric-negative">-0.3%</p>
            <p className="text-sm text-gray-500">Today</p>
          </div>
        </div>
      </section>
    </div>
  );
}