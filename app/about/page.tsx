import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">About Paul Analytics</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          Welcome to Paul Analytics! Hi, I'm Paul Kim - a rising senior at Northwestern University 
          pursuing a double major in Industrial Engineering and Economics, complemented by the 
          Kellogg Certificate in Managerial Analytics.
        </p>

        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          My academic and professional journey centers around one goal: to uncover actionable insights 
          from complex systems - whether that's through econometric modeling, optimization, or machine 
          learning. From consulting on a $9B M&A deal at Monitor Deloitte to conducting stratified 
          analysis of U.S. corporate debt as a research assistant, I've applied quantitative thinking 
          to real-world business, financial, and organizational challenges.
        </p>

        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          I've used Python, SQL, and TensorFlow to predict stock volatility, classify corporate debt 
          structures, and integrate AI into procurement pipelines. Equally comfortable working 
          cross-functionally and communicating findings to stakeholders, I bring a mix of analytical 
          rigor and strategic perspective.
        </p>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">I'm currently exploring roles in:</h2>
          <ul className="list-disc list-inside space-y-2 text-lg text-gray-700 ml-4">
            <li>Consulting (operations, economic)</li>
            <li>Quantitative finance & trading</li>
            <li>Data science & analytics</li>
            <li>Project and product management</li>
          </ul>
        </div>

        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          If you're working at the intersection of data, strategy, and innovation, I'd love to connect.
        </p>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row gap-4 text-lg">
            <a 
              href="mailto:paulkim2024@u.northwestern.edu"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              📧 paulkim2024@u.northwestern.edu
            </a>
            <a 
              href="https://www.linkedin.com/in/paul821"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              💼 LinkedIn Profile
            </a>
            <a 
              href="https://paul821.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              🌐 Personal Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 
