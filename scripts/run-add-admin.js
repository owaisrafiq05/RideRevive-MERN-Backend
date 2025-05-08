#!/usr/bin/env node

// This script is required because we need to run Node.js with ESM support
// to import ESM modules with the .js extension in our addAdmin.js script

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run the addAdmin.js script with Node.js and ESM support
const childProcess = spawn('node', ['--experimental-specifier-resolution=node', path.join(__dirname, 'addAdmin.js')], {
  stdio: 'inherit'
});

childProcess.on('error', (error) => {
  console.error(`Error running script: ${error.message}`);
  process.exit(1);
});

childProcess.on('close', (code) => {
  process.exit(code);
}); 