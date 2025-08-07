import { notFound } from 'next/navigation';
import { getAnalysis, getAnalyses } from '@/lib/content';
import { NotebookRenderer } from '@/components/NotebookRenderer';
import { AnalysisHeader } from '@/components/AnalysisHeader';
import { NotebookCell } from '@/types/notebook'; // Assuming your type is here

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

  // --- THIS IS THE FIX ---
  // We create a new object that has the exact 'cells' and 'metadata' properties
  // that the NotebookRenderer component expects.
  const notebookForRenderer = {
    metadata: analysis,
    
    // Check if `analysis.content` is an array. If not, provide an empty array.
    // This guarantees that `cells` is always the correct type (NotebookCell[]).
    cells: Array.isArray(analysis.content) ? analysis.content : []
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <AnalysisHeader analysis={analysis} />
      
      {/* Now we pass the correctly shaped and typed object to the renderer */}
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
