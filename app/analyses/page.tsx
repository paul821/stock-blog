import { AnalysisCard } from '@/components/AnalysisCard';
import { getAnalyses } from '@/lib/content';
import Link from 'next/link';

export default async function AnalysesPage() {
  const analyses = await getAnalyses();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">All Stock Analyses</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {analyses.map((analysis) => (
          <Link key={analysis.slug} href={`/analysis/${analysis.slug}`} className="block">
            <AnalysisCard analysis={analysis} />
          </Link>
        ))}
      </div>
    </div>
  );
} 