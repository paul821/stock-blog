import { notFound } from 'next/navigation';
import { getAnalysis, getAnalyses } from '@/lib/content';
import { NotebookRenderer } from '@/components/NotebookRenderer';
import { AnalysisHeader } from '@/components/AnalysisHeader';
import { NotebookCell } from '@/types/notebook'; // Ensure this path is correct

interface AnalysisPageProps {
  params: {
    slug: string;
  };
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  // 1. Fetch the analysis data as before.
  const analysis = await getAnalysis(params.slug);
  
  if (!analysis) {
    notFound();
  }

  // 2. Create a new object with the exact shape the NotebookRenderer expects.
  // This is the key step that resolves the type errors.
  const notebookForRenderer = {
    // The 'metadata' is the entire top-level analysis object.
    metadata: analysis,
    // The 'cells' are inside `analysis.content`. We ensure it's always an array.
    cells: Array.isArray(analysis.content) ? analysis.content : []
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* AnalysisHeader uses the original `analysis` object */}
      <AnalysisHeader analysis={analysis} />
      
      {/* NotebookRenderer uses the new, correctly shaped object */}
      <NotebookRenderer notebook={notebookForRenderer} />
    </div>
  );
}

export async function generateStaticParams() {
  const analyses = await getAnalyses();
  return analyses.map((analysis) => ({
    slug: analysis.slug,
  }));
}
