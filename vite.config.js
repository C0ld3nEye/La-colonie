/**
 * Configuration Vite pour La Colonie
 * Build optimisé pour mobile Android
 */
import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    server: {
        port: 3000,
        host: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                manualChunks: undefined,
                inlineDynamicImports: true
            }
        }
    }
});
