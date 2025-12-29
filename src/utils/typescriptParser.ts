import type {
  TypeScriptDiagnostic,
  TypeScriptOutput,
} from '../types/typescript';

/**
 * Parse TypeScript compiler text output
 * Handles both --noEmit and --pretty false formats
 *
 * Format examples:
 * - src/App.tsx(10,5): error TS2322: Type 'string' is not assignable to type 'number'.
 * - src/utils/helper.ts(25,10): error TS2304: Cannot find name 'foo'.
 *
 * @param content - Text content from tsc output
 * @returns Array of TypeScript diagnostics
 * @throws Error if content is empty or invalid
 */
export function parseTypeScriptOutput(content: string): TypeScriptOutput {
  if (!content || content.trim().length === 0) {
    throw new Error('TypeScript output is empty');
  }

  const lines = content.split('\n');
  const diagnostics: TypeScriptOutput = [];
  let currentDiagnostic: TypeScriptDiagnostic | null = null;

  for (const line of lines) {
    // Skip empty lines
    if (line.trim().length === 0) {
      continue;
    }

    // Try to parse as a new diagnostic line
    const diagnostic = parseDiagnosticLine(line);

    if (diagnostic) {
      // If we have a current diagnostic, save it
      if (currentDiagnostic) {
        diagnostics.push(currentDiagnostic);
      }
      currentDiagnostic = diagnostic;
    } else if (currentDiagnostic) {
      // This is a continuation line for multi-line error messages
      // Append to the current diagnostic's message
      const trimmedLine = line.trim();
      if (trimmedLine) {
        currentDiagnostic.message += '\n' + trimmedLine;
      }
    }
    // If no current diagnostic and can't parse, skip the line (e.g., summary lines)
  }

  // Don't forget the last diagnostic
  if (currentDiagnostic) {
    diagnostics.push(currentDiagnostic);
  }

  if (diagnostics.length === 0) {
    throw new Error(
      'No TypeScript diagnostics found. Please ensure the file contains tsc error output.'
    );
  }

  return diagnostics;
}

/**
 * Parse a single diagnostic line
 * Pattern: filePath(line,column): error TScode: message
 *
 * @param line - Single line from tsc output
 * @returns Parsed diagnostic or null if line doesn't match pattern
 */
function parseDiagnosticLine(line: string): TypeScriptDiagnostic | null {
  // Regex pattern: filePath(line,column): error TScode: message
  // Example: src/App.tsx(10,5): error TS2322: Type 'string' is not assignable
  const pattern = /^(.+?)\((\d+),(\d+)\):\s+error\s+(TS\d+):\s+(.+)$/;
  const match = line.match(pattern);

  if (!match) {
    return null;
  }

  const [, filePath, lineStr, columnStr, errorCode, message] = match;

  return {
    filePath: filePath.trim(),
    line: parseInt(lineStr, 10),
    column: parseInt(columnStr, 10),
    errorCode: errorCode.trim(),
    severity: 'error',
    message: message.trim(),
  };
}

/**
 * Read file content from File object
 * Reuses the same pattern as the ESLint parser
 *
 * @param file - File object from file input
 * @returns Promise resolving to file content as string
 */
export async function readFileContent(file: File): Promise<string> {
  // Validate file size (max 10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (10MB)`
    );
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
}
