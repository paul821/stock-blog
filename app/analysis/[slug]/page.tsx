import { notFound } from 'next/navigation';
import { getAnalysis, getAnalyses } from '@/lib/content'; // Corrected imports
import { NotebookRenderer } from '@/components/NotebookRenderer';
import { AnalysisHeader } from '@/components/AnalysisHeader';

interface AnalysisPageProps {
  params: {
    slug: string;
  };
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const analysis = await getAnalysis(params.slug);
  
  if (!analysis) {
    notFound();
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <AnalysisHeader analysis={analysis} />
      
      {/* --- THIS IS THE FIX --- */}
      {/* We now pass the entire 'analysis' object to the 'notebook' prop. */}
      <NotebookRenderer notebook={analysis} />

    </div>
  );
}

export async function generateStaticParams() {
  const analyses = await getAnalyses();
  return analyses.map((analysis) => ({
    slug: analysis.slug,
  }));
}
