# 🚀 Quick Deploy Script for DataViz Playground (PowerShell)
# This script will commit and push all changes to GitHub

Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Check if we're in a git repository
try {
    $null = git rev-parse --git-dir
} catch {
    Write-Host "❌ Error: Not in a git repository" -ForegroundColor Red
    exit 1
}

# Check if there are any changes to commit
$hasChanges = git diff-index --quiet HEAD --
if ($LASTEXITCODE -ne 0) {
    Write-Host "📝 Staging changes..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m "✨ Add support for 20+ file formats

- Add CSV/TSV, JSON/XML, YAML/TOML, LOG support
- Add Excel (.xlsx/.xls/.xlsm) support  
- Add compressed formats (GZIP, ZIP)
- Add Data Science formats (Parquet, NumPy, etc.)
- Update GitHub Actions workflows
- Add comprehensive documentation
- Add test files and format validation

Total formats supported: 20+ with 30+ extensions"
    
    Write-Host "✅ Changes committed successfully" -ForegroundColor Green
} else {
    Write-Host "📝 No changes to commit" -ForegroundColor Yellow
}

# Check current branch
$currentBranch = git branch --show-current
Write-Host "🌿 Current branch: $currentBranch" -ForegroundColor Cyan

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
git push origin $currentBranch

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Deployment initiated!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Check GitHub Actions in your repository"
    Write-Host "2. Monitor deployment progress"
    Write-Host "3. Check Vercel dashboard for live URL"
    Write-Host ""
    Write-Host "🔧 Vercel credentials are already configured in the workflow"
    Write-Host ""
    Write-Host "📊 Format support test will run automatically"
    Write-Host "📄 Test report will be available in Actions artifacts"
} else {
    Write-Host "❌ Error: Failed to push to GitHub" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Your DataViz Playground with 20+ format support is being deployed!" -ForegroundColor Green
