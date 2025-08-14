# 🚀 Quick Start Guide

## Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm or yarn** - Package managers
- **Git** - Version control

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/data-viz-playground.git
cd data-viz-playground
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables
```bash
cp env.example .env.local
```

Edit `.env.local` and add your API keys:
```env
# Required: AI Providers (at least one)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
DEEPSEEK_API_KEY=your_deepseek_key_here

# Optional: For collaboration features
DATABASE_URL=postgresql://username:password@localhost:5432/dataviz
REDIS_URL=redis://localhost:6379
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

### 5. Open Your Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 First Steps

### 1. Upload Your Data
- Drag and drop a CSV, Excel, or JSON file
- Or try the sample datasets provided
- Watch the automatic data profiling

### 2. Explore Your Data
- View field types and statistics
- Check data quality issues
- See sample data preview

### 3. Create Your First Chart
- Use the AI assistant for recommendations
- Choose from 12+ chart types
- Customize colors, axes, and styling

### 4. Export Your Work
- Download as PNG, SVG, or PDF
- Generate Python code (Plotly/Matplotlib)
- Generate R code (ggplot2/Plotly)

## 🐳 Docker Deployment

### Quick Start with Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### With Collaboration Features
```bash
# Start with PostgreSQL and Redis
docker-compose --profile collaboration up -d
```

## 🔧 Configuration Options

### AI Providers
The platform supports multiple AI providers:

- **OpenAI GPT-4** - Best for general analysis
- **Anthropic Claude** - Excellent for reasoning
- **DeepSeek** - Specialized for data analysis

### Chart Types Available
- **Basic**: Bar, Line, Area, Scatter, Pie, Doughnut
- **Statistical**: Box Plot, Violin Plot, Histogram, Density
- **Advanced**: Heatmap, Treemap, Sankey, Candlestick
- **Geographic**: Choropleth Maps, Point Maps

### Data Formats Supported
- **CSV** - Comma-separated values
- **Excel** - .xlsx and .xls files
- **JSON** - JavaScript Object Notation
- **TSV** - Tab-separated values
- **Parquet** - Columnar storage format
- **Arrow** - Apache Arrow format

## 🚀 Production Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Self-Hosted
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker Production
```bash
# Build production image
docker build -t dataviz-playground .

# Run container
docker run -p 3000:3000 --env-file .env.local dataviz-playground
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Check types
npm run type-check

# Lint code
npm run lint
```

## 📊 Sample Data

Try these sample datasets to get started:

1. **Sales Data** - Monthly sales by region
2. **User Analytics** - User behavior metrics  
3. **Weather Data** - Daily weather records

## 🆘 Troubleshooting

### Common Issues

**Port 3000 already in use**
```bash
# Use different port
npm run dev -- -p 3001
```

**Missing dependencies**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Environment variables not loading**
```bash
# Check file location and format
ls -la .env.local
cat .env.local
```

### Getting Help

- 📖 **Documentation**: [docs.datavizplayground.com](https://docs.datavizplayground.com)
- 💬 **Discord**: [Join our community](https://discord.gg/dataviz)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/data-viz-playground/issues)
- 📧 **Email**: support@datavizplayground.com

## 🎉 What's Next?

After getting started, explore these advanced features:

- **Dashboard Builder** - Create interactive dashboards
- **Story Mode** - Build narrative visualizations
- **Collaboration** - Share and work with teams
- **Advanced Analytics** - Statistical analysis and ML
- **Custom Charts** - Build your own visualizations

---

**Happy visualizing! 🎨📊**
