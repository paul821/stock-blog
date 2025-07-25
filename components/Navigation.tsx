// Navigation Component
import Link from 'next/link';
import { TrendingUp, Search, Menu } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-gray-900 text-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">Paul Analytics</span>
            </Link>
          </div>
          {/* Center: Analyses */}
          <div className="flex justify-center">
            <Link href="/analyses" className="text-gray-300 hover:text-white text-lg font-semibold">Analyses</Link>
          </div>
          {/* Right: About */}
          <div className="flex items-center justify-end space-x-4">
            <Link href="/about" className="text-gray-300 hover:text-white text-lg font-semibold">About</Link>
            <Menu className="h-5 w-5 text-white md:hidden" />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Hero Section Component
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

// Analysis Header Component
import { Analysis } from '@/lib/content';
import { format } from 'date-fns';

export function AnalysisHeader({ analysis }: { analysis: Analysis }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{analysis.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>{analysis.company} ({analysis.ticker})</span>
            <span>•</span>
            <span>{analysis.industry}</span>
            <span>•</span>
            <span>{format(new Date(analysis.date), 'MMMM d, yyyy')}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">${analysis.targetPrice}</div>
          <div className="text-sm text-gray-500">Price Target</div>
        </div>
      </div>
    </div>
  );
}

// Footer Component
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="h-6 w-6" />
              <span className="text-lg font-bold">FinAnalytics</span>
            </div>
            <p className="text-gray-400">
              Professional stock analysis and predictions powered by data science.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Analysis</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/analyses" className="hover:text-white">All Analyses</Link></li>
              <li><Link href="/sectors" className="hover:text-white">By Sector</Link></li>
              <li><Link href="/methodology" className="hover:text-white">Methodology</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest analysis delivered to your inbox.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 text-white px-3 py-2 rounded-l-lg flex-1"
              />
              <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 FinAnalytics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}