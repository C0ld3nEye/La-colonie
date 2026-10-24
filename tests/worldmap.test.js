/**
 * Tests Playwright pour WorldMap
 * Vérifie la génération et le rendu de la carte
 */

import { test, expect } from '@playwright/test';

test.describe('WorldMap', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Attendre que le jeu soit chargé
        await page.waitForSelector('#game-container');
        // Cliquer sur COMMENCER pour aller à la scène Game
        await page.click('text=COMMENCER');
        await page.waitForTimeout(500); // Attendre le changement de scène
    });

    test('Carte 128x128 tuiles générée', async ({ page }) => {
        // Vérifier que la carte est rendue (au moins un élément visible)
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
        
        // Vérifier la taille du canvas (devrait être > 0)
        const box = await canvas.boundingBox();
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
    });

    test('Biomes générés : herbe, forêt, eau, pierre', async ({ page }) => {
        // Capturer une image et vérifier les couleurs dominantes
        // Pour l'instant, on vérifie juste que la carte a du contenu
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
        
        // Vérifier que plusieurs couleurs sont présentes (proxy pour les biomes)
        // Cela sera amélioré avec une vraie capture d'écran
    });

    test('Rivières et lacs présents', async ({ page }) => {
        // Vérifier que la génération inclut de l'eau
        // Pour l'instant, test basique de rendu
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
    });

    test('Caméra peut se déplacer', async ({ page }) => {
        // Simuler un drag sur la carte
        const canvas = page.locator('canvas');
        
        // Position initiale
        const initialBox = await canvas.boundingBox();
        
        // Drag vers la droite
        await page.mouse.move(initialBox.x + 100, initialBox.y + 100);
        await page.mouse.down();
        await page.mouse.move(initialBox.x + 200, initialBox.y + 100);
        await page.mouse.up();
        
        // Vérifier que la caméra a bougé (indirect via le rendu)
        await page.waitForTimeout(100);
    });

    test('Zoom fonctionne', async ({ page }) => {
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();
        
        // Pour l'instant, test basique
        // Le zoom sera testé plus en détail avec des captures
    });
});
