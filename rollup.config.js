import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import terser from '@rollup/plugin-terser';

export default {
  input: 'main.js', // Update this to your entry point
  output: {
    file: 'public/bundle.js', // Output file
    format: 'iife', // Immediately-Invoked Function Expression format for browser
    sourcemap: true,
  },
  plugins: [
    resolve(), // Resolves node_modules
    commonjs(), // Converts CommonJS to ES modules
    json(), // Allows importing JSON files
    terser()
  ]
};