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
git diff-index --quiet HEAD --
if ($LASTEXITCODE -ne 0) {
    Write-Host "📝 Staging changes..." -ForegroundColor Yellow
    git add .
    
    Write-Host "💾 Committing changes..." -ForegroundColor Yellow
    git commit -m "🔧 Fix deployment issues

- Enable static export for GitHub Pages
- Improve format testing robustness
- Update GitHub Actions workflows
- Fix Next.js configuration
- Add better error handling

This should resolve the failed deployments"
    
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
    Write-Host "4. Check GitHub Pages for static deployment"
    Write-Host ""
    Write-Host "🔧 Fixed issues:" -ForegroundColor Green
    Write-Host "- Enabled static export for GitHub Pages"
    Write-Host "- Improved format testing robustness"
    Write-Host "- Updated workflow configurations"
    Write-Host ""
    Write-Host "📊 Format support test should now pass"
    Write-Host "📄 GitHub Pages deployment should work"
} else {
    Write-Host "❌ Error: Failed to push to GitHub" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎯 Your DataViz Playground deployment issues should be resolved!" -ForegroundColor Green
