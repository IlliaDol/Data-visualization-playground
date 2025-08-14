export default function HomePage() {

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Data Visualization Playground
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your data, create beautiful visualizations with AI assistance, 
            and export code in Python or R. All in one powerful platform.
          </p>
        </div>

        {/* Test Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🚀 GitHub Pages Test
          </h2>
          <p className="text-gray-600 mb-4">
            Якщо ви бачите цю сторінку, значить GitHub Pages працює правильно!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">📊 Data Upload</h3>
              <p className="text-blue-700 text-sm">Support for CSV, Excel, JSON files</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">🤖 AI Assistant</h3>
              <p className="text-green-700 text-sm">Smart chart recommendations</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">💻 Code Export</h3>
              <p className="text-purple-700 text-sm">Python and R code generation</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
            <div>
              <h3 className="font-semibold text-green-900">✅ GitHub Pages Active</h3>
              <p className="text-green-700 text-sm">
                Your Data Visualization Playground is now live on GitHub Pages!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
