import { notFound } from 'next/navigation';
import { getAnalysis } from '@/lib/content';
import { NotebookRenderer } from '@/components/NotebookRenderer';
import { AnalysisHeader } from '@/components/AnalysisHeader';
import { getAnalyses } from '@/lib/content';

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
      <NotebookRenderer content={analysis.content} />
    </div>
  );
}

export async function generateStaticParams() {
  const analyses = await getAnalyses();
  return analyses.map((analysis) => ({
    slug: analysis.slug,
  }));
}