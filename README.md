# Financial Analysis Blog

A modern, interactive financial analysis platform built with Next.js that presents stock analysis in a Jupyter notebook-style format. Perfect for sharing detailed financial research with interactive charts, code blocks, and data visualizations.

## Features

- 📊 **Interactive Notebook Style**: Present analysis like Jupyter notebooks with code blocks and outputs
- 📈 **Interactive Charts**: Built-in chart components using Recharts
- 💼 **Professional Design**: Clean, modern interface optimized for financial content
- 🚀 **Vercel-Ready**: Optimized for deployment on Vercel
- 📱 **Responsive**: Works perfectly on desktop and mobile
- 🔍 **SEO Optimized**: Built with Next.js 14 for optimal search engine visibility
- 📝 **Markdown Support**: Write analysis in Markdown with frontmatter metadata

## Quick Start

### 1. Project Setup

```bash
# Clone or create your project
npx create-next-app@latest financial-blog
cd financial-blog

# Install dependencies
npm install next@14.0.0 react@^18.2.0 react-dom@^18.2.0 recharts@^2.8.0 lucide-react@^0.263.1 react-markdown@^9.0.0 remark-gfm@^4.0.0 gray-matter@^4.0.3 date-fns@^2.30.0 tailwindcss@^3.3.5

# Install dev dependencies
npm install -D typescript @types/node @types/react @types/react-dom autoprefixer postcss eslint eslint-config-next
```

### 2. Directory Structure

Create the following structure:

```
financial-blog/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── analysis/
│       └── [slug]/
│           └── page.tsx
├── components/
│   ├── Navigation.tsx
│   ├── NotebookRenderer.tsx
│   ├── ChartCell.tsx
│   ├── CodeBlock.tsx
│   └── MetricsTable.tsx
├── content/
│   └── analyses/
│       ├── apple-analysis.md
│       └── tesla-analysis.md
├── lib/
│   └── content.ts
└── public/
    └── images/
```

### 3. Configuration Files

Set up Tailwind CSS:

```bash
npx tailwindcss init -p
```

Copy the configuration files provided in the artifacts above.

### 4. Create Content

Create analysis files in `content/analyses/` directory. Each file should have frontmatter metadata:

```markdown
---
title: "Apple Inc. (AAPL) - Comprehensive Analysis"
company: "Apple Inc."
ticker: "AAPL"
industry: "Technology"
date: "2024-11-15"
summary: "Apple shows strong fundamentals..."
prediction: "bullish"
targetPrice: 195
currentPrice: 175
tags: ["technology", "consumer electronics"]
---

# Your analysis content here...
```

### 5. Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your blog.

## Writing Analysis

### Notebook-Style Format

Your analysis should follow this structure:

```markdown
# Executive Summary
Brief overview of your analysis and recommendation.

## Key Metrics
```python
# Code blocks are automatically formatted
import pandas as pd
stock_data = pd.read_csv('data.csv')
print(stock_data.head())
```
<!-- OUTPUT:chart -->

Charts are automatically generated when you use the OUTPUT:chart comment.

### Code Blocks

Use standard markdown code blocks with language specification:

```python
# Python code for analysis
import yfinance as yf
aapl = yf.Ticker("AAPL")
```

### Interactive Elements

- **Charts**: Use `<!-- OUTPUT:chart -->` after code blocks
- **Tables**: Use `<!-- OUTPUT:table -->` after code blocks
- **Metrics**: Financial ratios are automatically styled

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

Or use Vercel CLI:

```bash
npm install -g vercel
vercel --prod
```

### Environment Variables

Set these in your Vercel dashboard:

- `NEXT_PUBLIC_SITE_URL`: Your site URL
- `NEXT_PUBLIC_ANALYTICS_ID`: Google Analytics (optional)

## Customization

### Adding New Components

Create new components in the `components/` directory:

```typescript
// components/NewComponent.tsx
export function NewComponent() {
  return <div>Your component</div>;
}
```

### Styling

Modify `globals.css` or add new Tailwind classes. The theme uses:

- **Primary**: Blue tones for links and actions
- **Success**: Green for positive metrics
- **Danger**: Red for negative metrics
- **Gray**: Neutral content

### Adding Data Sources

Integrate with financial APIs:

```typescript
// lib/financial-data.ts
export async function getStockData(ticker: string) {
  // Your API integration
}
```

## Best Practices

### Content Structure

1. **Executive Summary**: Start with key findings
2. **Industry Analysis**: Market context
3. **Financial Analysis**: Detailed metrics
4. **Valuation**: DCF models, comparables
5. **Risk Analysis**: Key risks and mitigation
6. **Recommendation**: Clear buy/sell/hold rating

### Performance

- Use Next.js Image component for images
- Implement proper caching for API calls
- Optimize bundle size with dynamic imports

### SEO

- Use descriptive titles and meta descriptions
- Implement structured data for articles
- Add proper canonical URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues or questions:
- Check the GitHub issues
- Review the Next.js documentation
- Consult the Tailwind CSS docs

---

**Disclaimer**: This platform is for educational purposes. Always consult with qualified financial advisors before making investment decisions.