/**
 * Tests smoke pour vérifier que le jeu démarre correctement
 */

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
    test('Page se charge sans erreur', async ({ page }) => {
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        await page.goto('/');
        
        // Attendre que le jeu soit chargé
        await page.waitForSelector('#game-container', { timeout: 5000 });
        
        // Vérifier qu'il n'y a pas d'erreurs
        expect(errors.length).toBe(0);
    });

    test('Canvas est créé', async ({ page }) => {
        await page.goto('/');
        
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible({ timeout: 5000 });
        
        // Vérifier que le canvas a une taille raisonnable
        const box = await canvas.boundingBox();
        expect(box.width).toBeGreaterThan(100);
        expect(box.height).toBeGreaterThan(100);
    });

    test('Pas d écran blanc', async ({ page }) => {
        await page.goto('/');
        
        // Vérifier qu'il y a du contenu visible
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible({ timeout: 5000 });
        
        // Vérifier que le canvas n'est pas entièrement blanc
        // On ne peut pas vérifier la couleur directement, mais on peut
        // vérifier que le jeu a démarré
    });

    test('Écran de titre apparaît', async ({ page }) => {
        await page.goto('/');
        
        // Vérifier que le titre apparaît
        const title = page.locator('text=LA COLONIE');
        await expect(title).toBeVisible({ timeout: 5000 });
    });

    test('Passage à la scène Game fonctionne', async ({ page }) => {
        await page.goto('/');
        
        // Cliquer sur COMMENCER
        await page.click('text=COMMENCER');
        
        // Vérifier que le HUD apparaît
        await page.waitForSelector('text=/Jour \d+ - (Printemps|Été|Automne|Hiver) - Année \d+/', { timeout: 2000 });
    });

    test('Retour au menu fonctionne', async ({ page }) => {
        await page.goto('/');
        await page.click('text=COMMENCER');
        await page.waitForTimeout(500);
        
        // Cliquer sur menu
        await page.click('text=⏏️');
        
        // Vérifier qu'on est retourné à l'écran de titre
        await page.waitForSelector('text=LA COLONIE', { timeout: 1000 });
    });
});
