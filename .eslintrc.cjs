/**
 * Configuration ESLint pour La Colonie
 * 
 * Règles :
 * - Code propre et lisible
 * - Commentaires en français
 * - Convention de nommage cohérente
 */

module.exports = {
    root: true,
    env: {
        browser: true,
        es2022: true,
        node: true
    },
    extends: [
        'eslint:recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    globals: {
        Phaser: 'readonly',
        PALETTE: 'readonly'
    },
    rules: {
        // Style
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'no-trailing-spaces': ['error'],
        'no-multiple-empty-lines': ['error', { max: 1 }],
        'eol-last': ['error', 'always'],
        
        // Bonnes pratiques
        'no-console': ['warn'],
        'no-debugger': ['error'],
        'no-unused-vars': ['off'],
        'no-var': ['error'],
        'prefer-const': ['error'],
        
        // Commentaires
        'require-jsdoc': ['off']
    },
    overrides: [
        {
            files: ['*.test.js', '*.spec.js'],
            rules: {
                'no-console': ['off'],
                'require-jsdoc': ['off']
            }
        }
    ]
};
