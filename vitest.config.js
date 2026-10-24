/**
 * Configuration Vitest pour les tests unitaires
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.js'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.js'],
            exclude: ['src/**/*.test.js', 'src/**/*.spec.js']
        },
        // Mock Phaser pour les tests unitaires
        setupFiles: ['./test/setup.js']
    }
});
