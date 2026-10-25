/**
 * Helpers pour les tests Playwright
 * Le jeu rend tout dans un canvas : les vérifications se font via
 * l'instance Phaser exposée sur window.__GAME__, pas via le DOM.
 */

export async function waitForGame(page) {
    await page.waitForFunction(() => window.__GAME__ !== undefined, null, {
        timeout: 10000,
    });
}

export async function getActiveScene(page, key) {
    return page.evaluate(
        (k) => {
            const scene = window.__GAME__.scene.getScene(k);
            return scene !== undefined;
        },
        key,
    );
}

export async function waitForScene(page, key, timeout = 10000) {
    await page.waitForFunction(
        (k) => {
            if (!window.__GAME__) return false;
            const scene = window.__GAME__.scene.getScene(k);
            return !!(scene && scene.sys && scene.sys.isActive());
        },
        key,
        { timeout },
    );
}

export async function startGame(page) {
    await page.goto('/');
    await waitForGame(page);
    await page.waitForTimeout(300);

    const pos = await page.evaluate(() => {
        const scene = window.__GAME__.scene.getScene('TitleScene');
        return { x: scene.startButton.x, y: scene.startButton.y };
    });
    await page.mouse.click(pos.x, pos.y);
    await waitForScene(page, 'Game');
    await page.waitForTimeout(200);
}

export async function getGameInfo(page) {
    return page.evaluate(() => {
        const scene = window.__GAME__.scene.getScene('Game');
        return {
            date: scene.timeSystem.formatDate(),
            day: scene.timeSystem.time.day,
            season: scene.timeSystem.time.season,
            year: scene.timeSystem.time.year,
            speed: scene.gameState.speed,
            hasMap: !!scene.worldMap && !!scene.worldMap.layer,
            mapW: scene.worldMap.width,
            mapH: scene.worldMap.height,
        };
    });
}

export async function getButtonPos(page, name) {
    return page.evaluate(
        (n) => {
            const scene = window.__GAME__.scene.getScene('Game');
            const hud = scene.hud;
            return { x: hud[n].x, y: hud[n].y };
        },
        name,
    );
}

export async function clickHudButton(page, name) {
    const pos = await getButtonPos(page, name);
    await page.mouse.click(pos.x, pos.y);
}

export async function getCamera(page) {
    return page.evaluate(() => {
        const scene = window.__GAME__.scene.getScene('Game');
        const cam = scene.cameras.main;
        return { scrollX: cam.scrollX, scrollY: cam.scrollY, zoom: cam.zoom };
    });
}

export async function getConsoleErrors(page) {
    const errors = [];
    page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(String(err)));
    return errors;
}
