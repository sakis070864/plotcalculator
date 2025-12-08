import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // ------------------------------------------------------------------
  // INSTRUCTIONS:
  // We have auto-detected your key from the firebase configuration.
  // This ensures the app works immediately.
  // ------------------------------------------------------------------
  const HARDCODED_KEY = "AIzaSyAsoAmOPCduLxMCmxV7akQJDY9njmZSt2s"; 

  // PRIORITIZE: Hardcoded -> Vercel System Var -> Local .env
  const apiKey = HARDCODED_KEY || process.env.API_KEY || env.API_KEY || '';
  const adminEmail = process.env.ADMIN_EMAIL || env.ADMIN_EMAIL || '';
  const adminPassword = process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD || '';

  // Log to the build console (Visible in Vercel Build Logs)
  console.log("--- BUILD CONFIGURATION ---");
  console.log(`API_KEY Source: ${HARDCODED_KEY ? 'Hardcoded in vite.config.ts' : 'Environment Variable'}`);
  console.log(`API_KEY Detected: ${apiKey ? 'YES (Length: ' + apiKey.length + ')' : 'NO - App will fail to fetch AI results'}`);
  console.log("---------------------------");

  return {
    plugins: [react()],
    define: {
      // We explicitly stringify the values to inject them into the client bundle
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.ADMIN_EMAIL': JSON.stringify(adminEmail),
      'process.env.ADMIN_PASSWORD': JSON.stringify(adminPassword),
    },
    build: {
      chunkSizeWarningLimit: 1000, // Increase limit to 1MB to suppress warnings
      rollupOptions: {
        output: {
          manualChunks: {
            // Split external libraries into separate chunks for better caching and smaller main bundle
            vendor: ['react', 'react-dom', 'lucide-react'],
            firebase: ['firebase/app', 'firebase/firestore'],
            charts: ['recharts'],
            ai: ['@google/genai']
          }
        }
      }
    }
  }
})