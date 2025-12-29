import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Code2, AlertCircle } from 'lucide-react';
import {
  parseTypeScriptOutput,
  readFileContent,
} from '../../utils/typescriptParser';
import { useTypeScript } from '../../context/TypeScriptContext';

export default function TypeScriptFileUpload() {
  const { setData } = useTypeScript();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setError(null);
      setIsLoading(true);

      try {
        // Validate file type (accept .txt files)
        if (!file.name.endsWith('.txt')) {
          throw new Error('Please upload a .txt file containing tsc output');
        }

        // Read and parse file
        const content = await readFileContent(file);
        const diagnostics = parseTypeScriptOutput(content);

        // Set data in context
        setData(diagnostics);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file');
      } finally {
        setIsLoading(false);
      }
    },
    [setData]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
    },
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-colors duration-200
          ${
            isDragActive
              ? 'border-purple-500 bg-purple-50'
              : 'border-zinc-300 hover:border-zinc-400 bg-white'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
              <p className="text-zinc-600">Parsing file...</p>
            </>
          ) : (
            <>
              {isDragActive ? (
                <Upload className="w-12 h-12 text-purple-600" />
              ) : (
                <Code2 className="w-12 h-12 text-zinc-400" />
              )}

              <div>
                <p className="text-lg font-medium text-zinc-900 mb-1">
                  {isDragActive
                    ? 'Drop the file here'
                    : 'Drop TypeScript output file here'}
                </p>
                <p className="text-sm text-zinc-500">
                  or click to select a file (max 10MB)
                </p>
              </div>

              <div className="text-xs text-zinc-400 mt-2 space-y-1">
                <p>
                  Generate with:{' '}
                  <code className="bg-zinc-100 px-2 py-1 rounded">
                    tsc --noEmit {'>'} typescript-errors.txt
                  </code>
                </p>
                <p>
                  Or without colors:{' '}
                  <code className="bg-zinc-100 px-2 py-1 rounded">
                    tsc --noEmit --pretty false {'>'} typescript-errors.txt
                  </code>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">Error loading file</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
