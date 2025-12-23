import { ESLintProvider, useESLint } from './context/ESLintContext';
import FileUpload from './components/FileUpload/FileUpload';
import Dashboard from './components/Dashboard/Dashboard';
import { FileJson } from 'lucide-react';

function AppContent() {
  const { rawData, clearData } = useESLint();

  if (!rawData) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <FileJson className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-zinc-900 mb-2">
              ESLint Analyzer
            </h1>
            <p className="text-lg text-zinc-600">
              Upload an ESLint JSON report to analyze errors, warnings, and
              patterns
            </p>
          </div>

          <FileUpload />

          <div className="mt-12 text-center text-sm text-zinc-500">
            <p>Generate an ESLint report with:</p>
            <code className="bg-zinc-800 text-zinc-100 px-3 py-1 rounded mt-2 inline-block">
              eslint . --format json --output-file eslint-report.json
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="bg-white border-b border-zinc-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileJson className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-zinc-900">
              ESLint Analyzer
            </h1>
          </div>
          <button
            onClick={clearData}
            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Upload New File
          </button>
        </div>
      </header>

      <Dashboard />
    </div>
  );
}

export default function App() {
  return (
    <ESLintProvider>
      <AppContent />
    </ESLintProvider>
  );
}
