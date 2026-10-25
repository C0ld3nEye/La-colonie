/**
 * Tests Playwright pour l'écran de titre
 */

import { test, expect } from '@playwright/test';
import { waitForGame, startGame, getConsoleErrors } from './helpers.js';

test.describe('TitleScene', () => {
    test('Écran de titre affiché au démarrage', async ({ page }) => {
        await page.goto('/');
        await waitForGame(page);

        const state = await page.evaluate(() => {
            const scene = window.__GAME__.scene.getScene('TitleScene');
            return {
                active: scene.sys.isActive(),
                title: scene.titleText.text,
                subtitle: scene.subtitleText.text,
            };
        });
        expect(state.active).toBe(true);
        expect(state.title).toBe('LA COLONIE');
        expect(state.subtitle).toBe('LES PREMIERS FEUX');
    });

    test('Bouton COMMENCER est visible et interactif', async ({ page }) => {
        await page.goto('/');
        await waitForGame(page);

        const state = await page.evaluate(() => {
            const scene = window.__GAME__.scene.getScene('TitleScene');
            return {
                visible: scene.startButton.visible,
                text: scene.startText.text,
            };
        });
        expect(state.visible).toBe(true);
        expect(state.text).toBe('COMMENCER');
    });

    test('Cliquer sur COMMENCER lance le jeu', async ({ page }) => {
        await startGame(page);
        const isGame = await page.evaluate(() =>
            window.__GAME__.scene.getScene('Game').sys.isActive(),
        );
        expect(isGame).toBe(true);
    });

    test('Pas d erreurs console', async ({ page }) => {
        const errors = getConsoleErrors(page);
        await page.goto('/');
        await waitForGame(page);
        await page.waitForTimeout(1000);
        expect(errors).toEqual([]);
    });
});
