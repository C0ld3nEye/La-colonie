/**
 * Tests Playwright pour TitleScene
 * Vérifie l'écran de titre
 */

import { test, expect } from '@playwright/test';

test.describe('TitleScene', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('Écran de titre s affiche', async ({ page }) => {
        // Vérifier que le titre est visible
        const title = page.locator('text=LA COLONIE');
        await expect(title).toBeVisible();
    });

    test('Sous-titre est visible', async ({ page }) => {
        const subtitle = page.locator('text=LES PREMIERS FEUX');
        await expect(subtitle).toBeVisible();
    });

    test('Description est visible', async ({ page }) => {
        const description = page.locator('text=Un jeu de gestion préhistorique');
        await expect(description).toBeVisible();
    });

    test('Bouton COMMENCER est visible', async ({ page }) => {
        const startButton = page.locator('text=COMMENCER');
        await expect(startButton).toBeVisible();
    });

    test('Instructions sont visibles', async ({ page }) => {
        const instructions = page.locator('text=Tap pour démarrer');
        await expect(instructions).toBeVisible();
    });

    test('Cliquer sur COMMENCER lance le jeu', async ({ page }) => {
        const startButton = page.locator('text=COMMENCER');
        await startButton.click();
        
        // Attendre que la scène Game soit chargée
        // On vérifie que le HUD est visible
        await page.waitForSelector('text=/Jour \d+ - (Printemps|Été|Automne|Hiver) - Année \d+/', { timeout: 1000 });
    });

    test('Pas d erreurs console', async ({ page }) => {
        // Capturer les erreurs console
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        await page.waitForTimeout(1000);
        
        // Vérifier qu'il n'y a pas d'erreurs
        expect(errors.length).toBe(0);
    });
});
