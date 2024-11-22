import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Files to ignore
const ignoreFiles = [
  'node_modules',
  '.git',
  'dist',
  'package-lock.json',
  'export-for-claude.js'
];

// Get all files recursively
function getAllFiles(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (ignoreFiles.includes(entry.name)) continue;
    
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

// Create formatted output
function formatFileContent(filePath, content) {
  const relativePath = path.relative(__dirname, filePath);
  return `// File: ${relativePath}\n${content}\n\n`;
}

// Main export function
function exportForClaude() {
  const files = getAllFiles(__dirname);
  let output = '// Project Export for Claude\n\n';

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    output += formatFileContent(file, content);
  });

  fs.writeFileSync('claude-export.txt', output);
  console.log('Export complete! File saved as claude-export.txt');
}

exportForClaude();