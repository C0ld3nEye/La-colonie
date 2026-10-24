/**
 * La Colonie - Les Premiers Feux
 * Point d'entrée principal du jeu
 * 
 * Architecture :
 * - Simulation tick découplée du rendu (60 FPS rendu, 10 ticks/s simulation)
 * - Structure : systems/ entities/ ui/ data/
 * - Sans assets externes : sprites générés par code
 */

import { Game } from './scenes/Game.js';
import { TitleScene } from './scenes/TitleScene.js';

// Configuration Phaser
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    scene: [TitleScene, Game],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    render: {
        antialias: false,
        pixelArt: true
    }
};

// Initialisation du jeu
const game = new Phaser.Game(config);

// Gestion du resize
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});

// Export pour tests
export { game };
