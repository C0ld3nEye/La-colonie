/**
 * Tests Playwright pour SaveSystem
 */

import { test, expect } from '@playwright/test';
import { startGame, clickHudButton } from './helpers.js';

test.describe('SaveSystem', () => {
    test('Sauvegarde crée une entrée localStorage', async ({ page }) => {
        await startGame(page);
        await clickHudButton(page, 'saveButton');

        const saved = await page.evaluate(() => localStorage.getItem('laColonieSave'));
        expect(saved).not.toBe(null);

        const state = JSON.parse(saved);
        expect(state.time).toBeDefined();
        expect(state.map).toBeDefined();
    });

    test('Chargement fonctionne', async ({ page }) => {
        await startGame(page);
        await page.evaluate(() => {
            const scene = window.__GAME__.scene.getScene('Game');
            scene.timeSystem.time.day = 12;
        });
        await clickHudButton(page, 'saveButton');
        await page.waitForTimeout(100);

        const loaded = await page.evaluate(() => {
            const scene = window.__GAME__.scene.getScene('Game');
            scene.loadGame();
            return scene.timeSystem.time.day;
        });
        expect(loaded).toBe(12);
    });

    test('Sauvegarde persiste après rechargement', async ({ page }) => {
        await startGame(page);
        await clickHudButton(page, 'saveButton');

        await page.reload();
        await startGame(page);
        await clickHudButton(page, 'loadButton');
        await page.waitForTimeout(200);

        const loaded = await page.evaluate(() => {
            const scene = window.__GAME__.scene.getScene('Game');
            return scene.worldMap.getState().width;
        });
        expect(loaded).toBe(128);
    });
});
