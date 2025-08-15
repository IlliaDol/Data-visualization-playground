# DataViz AI Playground 🚀

**AI-powered data visualization platform with support for 20+ file formats**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![AI Enhanced](https://img.shields.io/badge/AI-Enhanced-purple?style=for-the-badge&logo=openai)](https://openai.com/)

## ✨ Features

### 🤖 AI-Powered Analysis
- **Intelligent Chart Recommendations**: AI analyzes your data and suggests the best chart types
- **Automatic Field Detection**: Smart detection of numeric, categorical, and temporal data
- **Statistical Insights**: Get recommendations for statistical tests and analysis methods
- **Pattern Recognition**: AI identifies correlations, trends, and data patterns
- **Natural Language Queries**: Ask questions about your data in plain language

### 📁 Universal File Format Support
Support for **20+ file formats**:

#### Text Formats
- **CSV/TSV**: Comma and tab-separated values
- **JSON/JSON-LD**: JavaScript Object Notation
- **XML**: Extensible Markup Language
- **YAML/TOML**: Configuration file formats
- **INI/CFG**: Configuration files
- **LOG**: Log files with automatic parsing

#### Spreadsheet Formats
- **Excel**: .xlsx, .xls, .xlsm files
- **Google Sheets**: Import via CSV export

#### Data Science Formats
- **Parquet**: Columnar data format
- **NumPy**: .npz, .npy files
- **Pickle**: Python serialized objects
- **HDF5**: Hierarchical Data Format
- **Feather**: Fast binary format
- **Arrow**: Apache Arrow format
- **Avro**: Apache Avro format
- **ORC**: Optimized Row Columnar format

#### Compressed Formats
- **GZIP**: .gz, .gzip files
- **ZIP**: Compressed archives

### 📊 Advanced Chart Types
16+ chart types including:
- **Bar Charts**: Vertical, horizontal, stacked
- **Line Charts**: Time series and trends
- **Scatter Plots**: Correlation analysis
- **Pie Charts**: Proportions and distributions
- **Histograms**: Data distributions
- **Box Plots**: Statistical summaries
- **Heatmaps**: Correlation matrices
- **Gauge Charts**: KPIs and metrics
- **Bubble Charts**: 3D scatter plots
- **Waterfall Charts**: Cumulative effects
- **Funnel Charts**: Conversion processes
- **Radar Charts**: Multi-dimensional data
- **Tree Maps**: Hierarchical data
- **Sankey Diagrams**: Flow visualization

### 💻 Code Export
Export your visualizations as production-ready code:
- **Python**: Plotly, Matplotlib
- **R**: ggplot2, Plotly
- **Image Export**: PNG, SVG, PDF

### 🎨 Modern UI/UX
- **Dark/Light Mode**: Automatic theme switching
- **Responsive Design**: Works on all devices
- **Interactive Charts**: Hover effects and animations
- **Real-time Preview**: See changes instantly
- **Drag & Drop**: Easy file upload

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/data-viz-ai-playground.git
cd data-viz-ai-playground
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### 1. Upload Your Data
- Drag & drop files or click to browse
- Supported formats: CSV, TSV, Excel, JSON, XML, YAML, TOML, LOG, Parquet, NumPy, and more
- Files up to 200MB supported

### 2. AI Analysis
- **Automatic Analysis**: AI analyzes your data structure and suggests charts
- **Natural Language**: Ask questions like "Show me trends" or "Find correlations"
- **Quick Actions**: Use preset analysis options
- **Statistical Insights**: Get recommendations for statistical tests

### 3. Create Visualizations
- **AI Suggestions**: Let AI choose the best chart type and fields
- **Manual Control**: Select chart type and fields manually
- **Real-time Preview**: See your chart as you build it
- **Customization**: Adjust colors, titles, and styling

### 4. Export & Share
- **Code Export**: Get Python or R code for your charts
- **Image Export**: Save as PNG, SVG, or PDF
- **Dashboard View**: View all your created charts

## 🤖 AI Features Deep Dive

### Intelligent Data Analysis
The AI agent performs comprehensive data analysis:

1. **Data Structure Analysis**
   - Field type detection (numeric, categorical, temporal)
   - Missing value analysis
   - Data quality assessment
   - Sample size evaluation

2. **Pattern Recognition**
   - Time series detection
   - Geographic data identification
   - Hierarchical data structures
   - Correlation patterns

3. **Chart Recommendations**
   - Optimal chart type selection
   - Field mapping suggestions
   - Color encoding recommendations
   - Statistical test suggestions

### Natural Language Processing
Ask questions in plain language:
- "Show me the distribution of users by name"
- "Find correlations between fields"
- "Display trends over time"
- "Compare categories"
- "Show proportions"

### Statistical Insights
Get recommendations for:
- **Descriptive Statistics**: Mean, median, standard deviation
- **Correlation Analysis**: Pearson, Spearman correlations
- **Hypothesis Testing**: t-tests, ANOVA, chi-square tests
- **Regression Analysis**: Linear, polynomial regression
- **Time Series Analysis**: ARIMA, seasonal decomposition

## 🛠️ Technical Architecture

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Beautiful icon library
- **Recharts**: Chart rendering library

### AI Components
- **AIAgent**: Core AI analysis engine
- **Data Profiling**: Automatic field type detection
- **Pattern Recognition**: Data structure analysis
- **Chart Recommendations**: Intelligent suggestions

### File Processing
- **Universal Parser**: Handles 20+ file formats
- **Format Detection**: Automatic file type recognition
- **Data Validation**: Quality checks and error handling
- **Compression Support**: GZIP and ZIP file handling

## 📁 Project Structure

```
data-viz-ai-playground/
├── app/                    # Next.js App Router
│   ├── dashboards/        # Dashboard pages
│   ├── settings/          # Settings pages
│   ├── stories/           # Story pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components
│   ├── AIAgent.tsx       # AI analysis engine
│   ├── AIAssistant.tsx   # AI chat interface
│   ├── ChartBuilder.tsx  # Chart creation
│   ├── ChartRenderer.tsx # Chart rendering
│   ├── DataProfile.tsx   # Data profiling
│   ├── FileUpload.tsx    # File upload
│   └── Navigation.tsx    # Navigation
├── lib/                  # Utility functions
│   ├── utils.ts          # File parsing & utilities
│   └── i18n.ts           # Internationalization
├── types/                # TypeScript types
│   └── index.ts          # Type definitions
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Optional: AI API (for future enhancements)
AI_API_KEY=your_ai_api_key
```

### Customization
- **Themes**: Modify `tailwind.config.js` for custom colors
- **Charts**: Add new chart types in `ChartRenderer.tsx`
- **File Formats**: Extend parsers in `lib/utils.ts`
- **AI Logic**: Customize analysis in `AIAgent.tsx`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t data-viz-ai .
docker run -p 3000:3000 data-viz-ai
```

### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write comprehensive tests
- Update documentation
- Follow conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Recharts**: For the chart library
- **Lucide**: For the beautiful icons
- **OpenAI**: For AI inspiration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/data-viz-ai-playground/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/data-viz-ai-playground/discussions)
- **Email**: support@dataviz-ai.com

---

**Made with ❤️ by the DataViz AI Team**

*Transform your data into insights with AI-powered visualization!*
