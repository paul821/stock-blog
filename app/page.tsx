import { AnalysisCard } from '@/components/AnalysisCard';
import { HeroSection } from '@/components/HeroSection';
import { MarketOverview } from '@/components/MarketOverview';
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
      
      <MarketOverview />
    </div>
  );
}