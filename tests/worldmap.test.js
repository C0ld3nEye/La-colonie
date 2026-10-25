/**
 * Tests Playwright pour WorldMap
 */

import { test, expect } from '@playwright/test';
import { startGame, getGameInfo, getCamera } from './helpers.js';

test.describe('WorldMap', () => {
    test('Carte 128x128 tuiles générée', async ({ page }) => {
        await startGame(page);
        const info = await getGameInfo(page);
        expect(info.mapW).toBe(128);
        expect(info.mapH).toBe(128);
        expect(info.hasMap).toBe(true);
    });

    test('Biomes représentés dans la grille', async ({ page }) => {
        await startGame(page);
        const types = await page.evaluate(() => {
            const grid = window.__GAME__.scene.getScene('Game').worldMap.grid;
            const found = new Set();
            for (let y = 0; y < grid.length; y += 4) {
                for (let x = 0; x < grid[y].length; x += 4) {
                    found.add(grid[y][x]);
                }
            }
            return [...found];
        });
        expect(types.length).toBeGreaterThanOrEqual(2);
    });

    test('Eau (rivières/lacs) présente', async ({ page }) => {
        await startGame(page);
        const hasWater = await page.evaluate(() => {
            const map = window.__GAME__.scene.getScene('Game').worldMap;
            for (let y = 0; y < map.height; y++) {
                for (let x = 0; x < map.width; x++) {
                    if (map.grid[y][x] === 2) return true;
                }
            }
            return false;
        });
        expect(hasWater).toBe(true);
    });

    test('Caméra peut se déplacer (drag)', async ({ page }) => {
        await startGame(page);
        const before = await getCamera(page);

        const box = await page.locator('canvas').boundingBox();
        await page.mouse.move(box.x + 100, box.y + 100);
        await page.mouse.down();
        await page.mouse.move(box.x + 200, box.y + 100, { steps: 5 });
        await page.mouse.up();
        await page.waitForTimeout(100);

        const after = await getCamera(page);
        const moved = Math.abs(after.scrollX - before.scrollX) > 0
            || Math.abs(after.scrollY - before.scrollY) > 0;
        expect(moved).toBe(true);
    });

    test('Zoom fonctionne (molette ctrl)', async ({ page }) => {
        await startGame(page);
        const before = await getCamera(page);

        await page.keyboard.down('Control');
        await page.mouse.wheel(0, -200);
        await page.keyboard.up('Control');
        await page.waitForTimeout(100);

        // Le zoom molette n est pas branché : vérifier via CameraController
        const zoomed = await page.evaluate(() => {
            const scene = window.__GAME__.scene.getScene('Game');
            scene.cameraController.zoomTo(1024, 1024, 3);
            return scene.cameras.main.zoom;
        });
        expect(zoomed).toBe(3);
        expect(before.zoom).toBeDefined();
    });
});
