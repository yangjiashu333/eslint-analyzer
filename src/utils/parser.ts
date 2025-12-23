import type { ESLintOutput, ESLintResult } from '../types/eslint';

/**
 * Parse and validate ESLint JSON output
 * @param content - JSON string content
 * @returns Parsed and validated ESLint output
 * @throws Error if JSON is invalid or doesn't match ESLint format
 */
export function parseESLintJSON(content: string): ESLintOutput {
  try {
    const parsed = JSON.parse(content);

    // Validate that it's an array
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid ESLint output: expected an array of results');
    }

    // Validate each result object
    for (let i = 0; i < parsed.length; i++) {
      validateESLintResult(parsed[i], i);
    }

    return parsed as ESLintOutput;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format: ' + error.message);
    }
    throw error;
  }
}

/**
 * Validate a single ESLint result object
 */
function validateESLintResult(
  result: unknown,
  index: number
): asserts result is ESLintResult {
  if (typeof result !== 'object' || result === null) {
    throw new Error(`Invalid result at index ${index}: expected an object`);
  }

  const obj = result as Record<string, unknown>;

  // Check required fields
  const requiredFields = ['filePath', 'messages', 'errorCount', 'warningCount'];
  for (const field of requiredFields) {
    if (!(field in obj)) {
      throw new Error(
        `Invalid result at index ${index}: missing required field "${field}"`
      );
    }
  }

  // Validate field types
  if (typeof obj.filePath !== 'string') {
    throw new Error(
      `Invalid result at index ${index}: filePath must be a string`
    );
  }

  if (!Array.isArray(obj.messages)) {
    throw new Error(
      `Invalid result at index ${index}: messages must be an array`
    );
  }

  if (typeof obj.errorCount !== 'number') {
    throw new Error(
      `Invalid result at index ${index}: errorCount must be a number`
    );
  }

  if (typeof obj.warningCount !== 'number') {
    throw new Error(
      `Invalid result at index ${index}: warningCount must be a number`
    );
  }

  // Validate messages array
  for (let j = 0; j < obj.messages.length; j++) {
    validateESLintMessage(obj.messages[j], index, j);
  }
}

/**
 * Validate a single ESLint message object
 */
function validateESLintMessage(
  message: unknown,
  resultIndex: number,
  messageIndex: number
): void {
  if (typeof message !== 'object' || message === null) {
    throw new Error(
      `Invalid message at result ${resultIndex}, message ${messageIndex}: expected an object`
    );
  }

  const msg = message as Record<string, unknown>;

  // Check required message fields
  const requiredFields = ['severity', 'message', 'line', 'column'];
  for (const field of requiredFields) {
    if (!(field in msg)) {
      throw new Error(
        `Invalid message at result ${resultIndex}, message ${messageIndex}: missing field "${field}"`
      );
    }
  }

  // Validate severity (must be 1 or 2)
  if (msg.severity !== 1 && msg.severity !== 2) {
    throw new Error(
      `Invalid message at result ${resultIndex}, message ${messageIndex}: severity must be 1 or 2`
    );
  }
}

/**
 * Read file content from File object
 */
export async function readFileContent(file: File): Promise<string> {
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
