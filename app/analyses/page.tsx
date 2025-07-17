"use client";
import { useState, useEffect } from "react";
import { AnalysisCard } from '@/components/AnalysisCard';
import type { Analysis } from '@/lib/content';

export default function AnalysesPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [sector, setSector] = useState("All");
  const [month, setMonth] = useState("All");

  useEffect(() => {
    fetch("/api/analyses")
      .then((res) => res.json())
      .then(setAnalyses);
  }, []);

  const sectors = ["All", ...Array.from(new Set(analyses.map((a) => a.industry)))];
  const months = ["All", ...Array.from(new Set(analyses.map((a) => a.date.slice(0, 7))))];

  const filtered = analyses.filter(
    (a) =>
      (sector === "All" || a.industry === sector) &&
      (month === "All" || a.date.slice(0, 7) === month)
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">All Stock Analyses</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <span className="mr-2 font-semibold">Sector:</span>
          <select
            value={sector}
            onChange={e => setSector(e.target.value)}
            className="px-3 py-1 rounded border border-gray-300"
          >
            {sectors.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="mr-2 font-semibold">Month:</span>
          <select
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="px-3 py-1 rounded border border-gray-300"
          >
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((analysis) => (
          <AnalysisCard key={analysis.slug} analysis={analysis} />
        ))}
      </div>
    </div>
  );
} 