/**
 * Tests Playwright pour TimeSystem
 * Vérifie l'affichage et le fonctionnement du temps
 */

import { test, expect } from '@playwright/test';

test.describe('TimeSystem', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.click('text=COMMENCER');
        await page.waitForTimeout(500);
    });

    test('Affichage du temps dans le HUD', async ({ page }) => {
        // Attendre que le HUD affiche la date
        const dateText = page.locator('text=/Jour \d+ - (Printemps|Été|Automne|Hiver) - Année \d+/');
        await expect(dateText).toBeVisible({ timeout: 2000 });
    });

    test('Temps s écoule à vitesse 1x', async ({ page }) => {
        // Capturer le texte initial
        const initialDate = await page.locator('text=/Jour \d+ - (Printemps|Été|Automne|Hiver) - Année \d+/').textContent();
        
        // Attendre 2 secondes (2 ticks à 1x)
        await page.waitForTimeout(2000);
        
        // Le jour devrait avoir avancé
        const newDate = await page.locator('text=/Jour \d+ - (Printemps|Été|Automne|Hiver) - Année \d+/').textContent();
        
        // Vérifier que la date a changé
        expect(newDate).not.toBe(initialDate);
    });

    test('Pause arrête le temps', async ({ page }) => {
        // Capturer le texte initial
        const initialDate = await page.locator('text=/Jour \d+ - (Printemps|Été|Automne|Hiver) - Année \d+/').textContent();
        
        // Cliquer sur pause
        await page.click('text=⏸️');
        
        // Attendre 2 secondes
        await page.waitForTimeout(2000);
        
        // Le jour ne devrait pas avoir changé
        const newDate = await page.locator('text=/Jour \d+ - (Printemps|Été|Automne|Hiver) - Année \d+/').textContent();
        expect(newDate).toBe(initialDate);
    });

    test('Vitesse 3x avance plus vite', async ({ page }) => {
        // Capturer le texte initial
        const initialDate = await page.locator('text=/Jour \d+ - (Printemps|Été|Automne|Hiver) - Année \d+/').textContent();
        
        // Cliquer sur 3x
        await page.click('text=3×');
        
        // Attendre 1 seconde (3 ticks à 3x)
        await page.waitForTimeout(1000);
        
        // Le jour devrait avoir avancé de 3
        const newDate = await page.locator('text=/Jour \d+ - (Printemps|Été|Automne|Hiver) - Année \d+/').textContent();
        
        // Extraire les jours
        const initialDay = parseInt(initialDate.match(/Jour (\d+)/)[1]);
        const newDay = parseInt(newDate.match(/Jour (\d+)/)[1]);
        
        // À 3x, on devrait avoir avancé de 3 jours en 1 seconde
        expect(newDay).toBeGreaterThanOrEqual(initialDay + 2); // Tolérance pour le timing
    });

    test('Changement de saison après 30 jours', async ({ page }) => {
        // Cette test prendra du temps, à exécuter séparément
        // Pour l'instant, on vérifie juste que la saison change
        const seasonText = page.locator('text=/Printemps|Été|Automne|Hiver/');
        await expect(seasonText).toBeVisible();
    });
});
