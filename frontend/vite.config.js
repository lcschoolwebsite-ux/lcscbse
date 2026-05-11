import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * Recursively collect all .html files in a directory as Vite MPA inputs.
 */
function collectHtmlInputs(dir, base = dir, inputs = {}) {
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    if (statSync(full).isDirectory()) {
      collectHtmlInputs(full, base, inputs);
    } else if (entry.endsWith('.html')) {
      // Use a relative key like "admin/admin-panel"
      const rel = full.replace(base + '/', '').replace(/\.html$/, '').replace(/\//g, '_');
      inputs[rel] = full;
    }
  }
  return inputs;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const apiUrl = env.VITE_API_URL || 'https://lcscbse-production.up.railway.app';

  return {
    root: __dirname,

    // Inject VITE_API_URL as a global constant accessible in any JS file
    define: {
      'window.__VITE_API_URL__': JSON.stringify(apiUrl),
    },

    build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      // Multi-page application: every .html file is an entry point
      rollupOptions: {
        input: collectHtmlInputs(__dirname),
      },
    },

    server: {
      port: 5173,
      proxy: {
        // In dev, proxy /api requests to the backend
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    preview: {
      port: 4173,
    },
  };
});
