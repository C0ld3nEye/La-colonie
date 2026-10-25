/**
 * Tests Playwright pour CameraController et boutons du HUD
 */

import { test, expect } from '@playwright/test';
import { startGame, getCamera, clickHudButton, getGameInfo } from './helpers.js';

test.describe('CameraController', () => {
    test('Panoramique (drag) fonctionne', async ({ page }) => {
        await startGame(page);
        const before = await getCamera(page);

        const box = await page.locator('canvas').boundingBox();
        await page.mouse.move(box.x + 100, box.y + 100);
        await page.mouse.down();
        await page.mouse.move(box.x + 250, box.y + 120, { steps: 10 });
        await page.mouse.up();
        await page.waitForTimeout(100);

        const after = await getCamera(page);
        expect(
            Math.abs(after.scrollX - before.scrollX) > 1
            || Math.abs(after.scrollY - before.scrollY) > 1,
        ).toBe(true);
    });

    test('Zoom limité entre MIN et MAX', async ({ page }) => {
        await startGame(page);
        const zoom = await page.evaluate(() => {
            const scene = window.__GAME__.scene.getScene('Game');
            scene.cameraController.zoomTo(1024, 1024, 99);
            return scene.cameras.main.zoom;
        });
        expect(zoom).toBe(3);
    });

    test('Bouton pause fonctionne', async ({ page }) => {
        await startGame(page);
        await clickHudButton(page, 'pauseButton');
        expect((await getGameInfo(page)).speed).toBe(0);

        await clickHudButton(page, 'pauseButton');
        expect((await getGameInfo(page)).speed).toBe(1);
    });

    test('Boutons de vitesse fonctionnent', async ({ page }) => {
        await startGame(page);
        await page.evaluate(() => {
            window.__GAME__.scene.getScene('Game').hud.onSpeedClick(3);
        });
        expect((await getGameInfo(page)).speed).toBe(3);

        await page.evaluate(() => {
            window.__GAME__.scene.getScene('Game').hud.onSpeedClick(1);
        });
        expect((await getGameInfo(page)).speed).toBe(1);
    });

    test('Bouton menu retourne à l écran de titre', async ({ page }) => {
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
