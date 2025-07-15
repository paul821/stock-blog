import React from 'react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Deep Financial Analysis
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-blue-100">
        Data-driven stock predictions with interactive analysis notebooks
      </p>
      <Link
        href="/analyses"
        className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
      >
        Explore Analyses
      </Link>
    </section>
  );
} 