import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
process.env.NODE_ENV = 'development';

export default defineConfig({
  plugins: [react()],
    server: {
        port: 5000,
            host: '0.0.0.0',
                allowedHosts: [
                        // ✅ Add your dynamic Replit host here
                                "1420e70a-9753-42c1-b6d7-4df3cce03a78-00-1l9m6zevytxmu.riker.replit.dev"
                                      ],
                                          strictPort: true,
                                              hmr: {
                                                    clientPort: 5000
                                                        }
                                                          }
                                                          });