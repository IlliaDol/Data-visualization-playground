#!/bin/bash

# 🚀 Quick Deploy Script for DataViz Playground
# This script will commit and push all changes to GitHub

echo "🚀 Starting deployment process..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if there are any changes to commit
if git diff-index --quiet HEAD --; then
    echo "📝 No changes to commit"
else
    echo "📝 Staging changes..."
    git add .
    
    echo "💾 Committing changes..."
    git commit -m "✨ Add support for 20+ file formats

- Add CSV/TSV, JSON/XML, YAML/TOML, LOG support
- Add Excel (.xlsx/.xls/.xlsm) support  
- Add compressed formats (GZIP, ZIP)
- Add Data Science formats (Parquet, NumPy, etc.)
- Update GitHub Actions workflows
- Add comprehensive documentation
- Add test files and format validation

Total formats supported: 20+ with 30+ extensions"
    
    echo "✅ Changes committed successfully"
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "🌿 Current branch: $CURRENT_BRANCH"

# Push to GitHub
echo "📤 Pushing to GitHub..."
if git push origin $CURRENT_BRANCH; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Deployment initiated!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Check GitHub Actions: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/')/actions"
    echo "2. Monitor deployment progress"
    echo "3. Check Vercel dashboard for live URL"
    echo ""
    echo "🔧 If you haven't set up GitHub Secrets yet:"
    echo "   - Follow GITHUB_SETUP.md for instructions"
    echo "   - Add VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
    echo ""
    echo "📊 Format support test will run automatically"
    echo "📄 Test report will be available in Actions artifacts"
else
    echo "❌ Error: Failed to push to GitHub"
    exit 1
fi

echo ""
echo "🎯 Your DataViz Playground with 20+ format support is being deployed!"
