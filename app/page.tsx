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
      
      <MarketOverview />
    </div>
  );
}