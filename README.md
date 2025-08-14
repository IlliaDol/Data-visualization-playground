# Data Visualization Playground

🚀 **Universal Data Visualization Platform with AI Assistance and Code Export**

A comprehensive, production-ready data visualization playground that supports multiple data formats, AI-powered insights, interactive dashboards, and code export in Python and R.

## ✨ Features

### 🎯 Core Features
- **Universal Data Import**: CSV, Excel, JSON, TSV, Parquet, Arrow
- **AI-Powered Insights**: Intelligent chart recommendations and data analysis
- **Interactive Charts**: 12+ chart types with real-time customization
- **Code Export**: Generate production-ready code in Python (Plotly, Matplotlib) and R (ggplot2, Plotly)
- **Dashboard Builder**: Create interactive dashboards with filters and cross-filtering
- **Story Mode**: Build narrative visualizations with auto-generated insights
- **Real-time Collaboration**: Share and collaborate on visualizations

### 🎨 Visualization Types
- **Basic Charts**: Bar, Line, Area, Scatter, Bubble, Pie, Doughnut
- **Statistical**: Box Plot, Violin Plot, Histogram, Density Plot
- **Advanced**: Heatmap, Treemap, Sankey Diagram, Candlestick
- **Geographic**: Choropleth Maps, Point Maps, Hexbin Maps
- **Time Series**: Advanced temporal visualizations with seasonality detection

### 🤖 AI Capabilities
- **Smart Chart Recommendations**: AI suggests optimal chart types based on data
- **Natural Language Processing**: "Show me sales trends by region" → automatic chart generation
- **Data Insights**: Automatic correlation analysis, outlier detection, trend identification
- **Code Generation**: AI generates clean, production-ready code for any visualization

### 📊 Data Processing
- **Advanced Profiling**: Automatic type detection, missing value analysis, correlation matrices
- **Data Transformation**: Filter, sort, aggregate, pivot, join operations
- **Data Validation**: Quality checks with customizable rules
- **Real-time Processing**: Handle files up to 200MB with streaming support

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router) with TypeScript
- **React 18** with modern hooks and patterns
- **Tailwind CSS** with custom design system
- **shadcn/ui** components for consistent UI
- **Framer Motion** for smooth animations

### Data Processing
- **DuckDB-WASM** for in-browser SQL processing
- **Apache Arrow** for efficient data handling
- **PapaParse** for CSV parsing
- **SheetJS** for Excel file support

### Visualization Libraries
- **Vega-Lite** for declarative chart specifications
- **Plotly.js** for interactive charts
- **D3.js** for custom visualizations
- **MapLibre GL** for geographic visualizations

### AI Integration
- **OpenAI GPT-4** for natural language processing
- **Anthropic Claude** for advanced reasoning
- **DeepSeek** for specialized data analysis
- **Local LLM** support via OpenAI-compatible APIs

### State Management
- **Zustand** for global state
- **React Query** for server state
- **React Hook Form** for form management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/data-viz-playground.git
cd data-viz-playground
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:
```env
# AI Providers
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
DEEPSEEK_API_KEY=your_deepseek_key

# Optional: Backend services
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### 1. Upload Your Data
- Drag and drop CSV, Excel, or JSON files
- Or use the sample datasets provided
- Files up to 200MB are supported

### 2. Explore Your Data
- View automatic data profiling results
- See field types, missing values, correlations
- Get AI-powered insights about your data

### 3. Create Visualizations
- Choose from 12+ chart types
- Use AI assistance for chart recommendations
- Customize colors, axes, and styling
- Add filters and interactions

### 4. Export and Share
- Export charts as PNG, SVG, or PDF
- Generate Python code (Plotly/Matplotlib)
- Generate R code (ggplot2/Plotly)
- Share interactive dashboards

### 5. Build Dashboards
- Combine multiple charts
- Add interactive filters
- Create cross-filtering relationships
- Share with team members

## 🏗 Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── dashboards/        # Dashboard pages
│   ├── stories/           # Story mode pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── FileUpload.tsx    # File upload component
│   ├── ChartBuilder.tsx  # Chart creation interface
│   ├── Dashboard.tsx     # Dashboard builder
│   └── Navigation.tsx    # Main navigation
├── lib/                  # Utility functions
│   ├── utils.ts          # General utilities
│   ├── ai.ts             # AI integration
│   ├── charts.ts         # Chart processing
│   └── data.ts           # Data processing
├── types/                # TypeScript definitions
├── hooks/                # Custom React hooks
├── store/                # Zustand stores
└── i18n/                 # Internationalization
```

## 🔧 Configuration

### Chart Configuration
Charts are defined using a Vega-Lite inspired specification:

```typescript
interface ChartSpec {
  id: string;
  title: string;
  data: { sourceId: string; transform?: TransformStep[] };
  mark: ChartMark;
  encoding: ChartEncoding;
  config: ChartConfig;
}
```

### AI Configuration
Configure AI providers in your environment:

```env
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-sonnet

# DeepSeek
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-chat
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

### Test Coverage
```bash
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
```bash
# Build image
docker build -t data-viz-playground .

# Run container
docker run -p 3000:3000 data-viz-playground
```

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vega-Lite](https://vega.github.io/vega-lite/) for declarative visualization grammar
- [DuckDB](https://duckdb.org/) for in-browser SQL processing
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS

## 📞 Support

- 📧 Email: support@datavizplayground.com
- 💬 Discord: [Join our community](https://discord.gg/dataviz)
- 📖 Documentation: [docs.datavizplayground.com](https://docs.datavizplayground.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/data-viz-playground/issues)

## 🗺 Roadmap

### v1.1 (Q1 2024)
- [ ] Advanced geographic visualizations
- [ ] Real-time data streaming
- [ ] Custom chart types
- [ ] Advanced AI features

### v1.2 (Q2 2024)
- [ ] Team collaboration features
- [ ] Advanced data transformations
- [ ] Machine learning integration
- [ ] Mobile app

### v2.0 (Q3 2024)
- [ ] Enterprise features
- [ ] Advanced security
- [ ] Custom branding
- [ ] API for developers

---

**Made with ❤️ by the DataViz Playground Team**
