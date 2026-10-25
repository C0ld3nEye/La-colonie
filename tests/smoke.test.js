/**
 * Tests smoke : le jeu démarre sans erreur console
 */

import { test, expect } from '@playwright/test';
import { waitForGame, startGame, getGameInfo, getConsoleErrors } from './helpers.js';

test.describe('Smoke Tests', () => {
    test('Page se charge sans erreur', async ({ page }) => {
        const errors = getConsoleErrors(page);
        await page.goto('/');
        await waitForGame(page);
        await page.waitForTimeout(1000);
        expect(errors).toEqual([]);
    });

    test('Canvas est créé et visible', async ({ page }) => {
        await page.goto('/');
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible({ timeout: 5000 });
        const box = await canvas.boundingBox();
        expect(box.width).toBeGreaterThan(100);
        expect(box.height).toBeGreaterThan(100);
    });

    test('Écran de titre apparaît', async ({ page }) => {
        await page.goto('/');
        await waitForGame(page);
        const hasTitle = await page.evaluate(() => {
            const scene = window.__GAME__.scene.getScene('TitleScene');
            return scene.sys.isActive() && scene.titleText.visible;
        });
        expect(hasTitle).toBe(true);
    });

    test('Passage à la scène Game fonctionne', async ({ page }) => {
        await startGame(page);
        const info = await getGameInfo(page);
        expect(info.hasMap).toBe(true);
        expect(info.mapW).toBe(128);
        expect(info.mapH).toBe(128);
    });

    test('HUD affiche la date', async ({ page }) => {
        await startGame(page);
        const info = await getGameInfo(page);
        expect(info.date).toMatch(/Jour \d+ - (Printemps|Été|Automne|Hiver) - Année \d+/);
    });

    test('Retour au menu fonctionne', async ({ page }) => {
        await startGame(page);
        await page.evaluate(() => {
            const scene = window.__GAME__.scene.getScene('Game');
            scene.scene.start('TitleScene');
        });
        await page.waitForTimeout(300);
        const isTitle = await page.evaluate(() =>
            window.__GAME__.scene.getScene('TitleScene').sys.isActive(),
        );
        expect(isTitle).toBe(true);
    });
});
