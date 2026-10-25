/**
 * Tests Playwright pour TimeSystem
 */

import { test, expect } from '@playwright/test';
import { startGame, getGameInfo, clickHudButton } from './helpers.js';

test.describe('TimeSystem', () => {
    test('Affichage du temps dans le HUD', async ({ page }) => {
        await startGame(page);
        const info = await getGameInfo(page);
        expect(info.date).toMatch(/Jour \d+ - (Printemps|Été|Automne|Hiver) - Année \d+/);
    });

    test('Temps s écoule à vitesse 1x', async ({ page }) => {
        await startGame(page);
        const before = (await getGameInfo(page)).day;
        await page.waitForTimeout(2200);
        const after = (await getGameInfo(page)).day;
        expect(after).toBeGreaterThanOrEqual(before + 1);
    });

    test('Pause arrête le temps', async ({ page }) => {
        await startGame(page);
        await clickHudButton(page, 'pauseButton');
        const before = (await getGameInfo(page)).day;
        await page.waitForTimeout(2200);
        const after = (await getGameInfo(page)).day;
        expect(after).toBe(before);
        expect((await getGameInfo(page)).speed).toBe(0);
    });

    test('Vitesse 3x avance plus vite', async ({ page }) => {
        await startGame(page);
        await page.evaluate(() => {
            const scene = window.__GAME__.scene.getScene('Game');
            scene.hud.onSpeedClick(3);
        });
        const before = (await getGameInfo(page)).day;
        await page.waitForTimeout(1200);
        const after = (await getGameInfo(page)).day;
        expect(after).toBeGreaterThanOrEqual(before + 2);
    });

    test('Changement de saison après 30 jours', async ({ page }) => {
        await startGame(page);
        await page.evaluate(() => {
            const scene = window.__GAME__.scene.getScene('Game');
            scene.timeSystem.time.day = 30;
            scene.timeSystem.tick();
        });
        const info = await getGameInfo(page);
        expect(info.day).toBe(1);
        expect(info.season).toBe(1);
    });
});
