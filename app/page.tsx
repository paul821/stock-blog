import { AnalysisCard } from '@/components/AnalysisCard';
import { HeroSection } from '@/components/HeroSection';
import { MarketOverview } from '@/components/MarketOverview';
import { getAnalyses } from '@/lib/content';
import Link from 'next/link';

export default async function Home() {
  const analyses = await getAnalyses();
  console.log('Analyses:', analyses);
  
  return (
    <div className="space-y-12">
      <HeroSection />
      
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Stock Analyses ({analyses.length})</h2>
        {analyses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No analyses found. Please check the content directory.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {analyses.map((analysis) => (
              <AnalysisCard key={analysis.slug} analysis={analysis} />
            ))}
          </div>
        )}
      </section>
      
      <MarketOverview />
    </div>
  );
}