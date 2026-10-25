/**
 * Scène de titre minimal
 * Affichage du titre et bouton pour démarrer
 */

import Phaser from 'phaser';
import { PALETTE } from '../systems/graphics.js';

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        // Rien à preloader - tout est généré par code
    }

    create() {
        // Fond sombre
        this.cameras.main.setBackgroundColor('#1a120b');

        // Générer et afficher le titre
        this.createTitle();

        // Bouton démarrer
        this.createStartButton();

        // Instructions tactiles
        this.createInstructions();
    }

    createTitle() {
        // Créer un canvas pour le titre
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');

        // Palette de couleurs préhistoriques
        const palette = {
            brown: '#5a3e2b',
            beige: '#c4a882',
            orange: '#d4652b',
            red: '#8b2613',
            yellow: '#ffd700',
        };

        // Dessiner le titre
        this.drawPixelText(ctx, 'LA COLONIE', 20, 15, palette, 2);
        this.drawPixelText(ctx, 'LES PREMIERS FEUX', 20, 50, palette, 1.5);

        // Ajouter le canvas comme texture
        const texture = this.textures.addCanvas('title-logo', canvas);

        // Afficher la texture
        const sprite = this.add.sprite(
            this.cameras.main.centerX,
            100,
            'title-logo'
        );
        sprite.setOrigin(0.5);
        sprite.setScale(0.8);
    }

    drawPixelText(ctx, text, x, y, palette, scale = 1) {
        const pixelSize = 4 * scale;
        const spacing = 2 * scale;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charX = x + i * (8 * scale + spacing);

            // Dessiner chaque caractère en pixel art
            this.drawCharacter(ctx, char, charX, y, pixelSize, palette);
        }
    }

    drawCharacter(ctx, char, x, y, pixelSize, palette) {
        // Définitions des caractères en pixel art 8x8
        const font = {
            'L': [[1,1,1,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,1,1,1,1,1,1,1]],
            'A': [[0,1,1,0,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,1,1,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0]],
            'C': [[0,1,1,1,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [0,1,1,1,0,0,0,0]],
            'O': [[0,1,1,0,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [0,1,1,0,0,0,0,0]],
            'N': [[1,0,0,1,0,0,0,0],
                [1,1,0,1,0,0,0,0],
                [1,0,1,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0]],
            'I': [[1,1,1,0,0,0,0,0],
                [0,1,0,0,0,0,0,0],
                [0,1,0,0,0,0,0,0],
                [0,1,0,0,0,0,0,0],
                [0,1,0,0,0,0,0,0],
                [0,1,0,0,0,0,0,0],
                [1,1,1,0,0,0,0,0]],
            'E': [[1,1,1,1,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,1,1,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,1,1,1,0,0,0,0]],
            'S': [[0,1,1,1,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [0,1,1,0,0,0,0,0],
                [0,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [0,1,1,0,0,0,0,0]],
            'P': [[1,1,1,0,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,1,1,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0]],
            'R': [[1,1,1,0,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,1,1,0,0,0,0,0],
                [1,0,1,0,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0]],
            'U': [[1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [0,1,1,0,0,0,0,0]],
            'F': [[1,1,1,1,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,1,1,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0]],
            'X': [[1,0,0,1,0,0,0,0],
                [0,1,0,1,0,0,0,0],
                [0,0,1,1,0,0,0,0],
                [0,0,1,1,0,0,0,0],
                [0,1,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0],
                [1,0,0,1,0,0,0,0]],
            ' ': [[0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0]],
            '-': [[0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [1,1,1,1,1,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0]],
        };

        // Si le caractère n'est pas dans la font, utiliser un carré
        const charDef = font[char] || font['O'];

        for (let row = 0; row < charDef.length; row++) {
            for (let col = 0; col < charDef[row].length; col++) {
                if (charDef[row][col] === 1) {
                    ctx.fillStyle = palette.beige;
                    ctx.fillRect(
                        x + col * pixelSize,
                        y + row * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }
    }

    createStartButton() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY + 80;

        // Créer le bouton
        const button = this.add.rectangle(
            centerX,
            centerY,
            200,
            60,
            0x5a3e2b
        );
        button.setOrigin(0.5);
        button.setStrokeStyle(3, 0xc4a882);
        button.setInteractive();

        // Texte du bouton
        const text = this.add.text(
            centerX,
            centerY,
            'COMMENCER',
            {
                font: '24px Arial',
                fill: '#ffffff',
                fontWeight: 'bold'
            }
        );
        text.setOrigin(0.5);

        // Effets hover
        button.on('pointerover', () => {
            button.setFillStyle(0x6d4c38);
        });
        button.on('pointerout', () => {
            button.setFillStyle(0x5a3e2b);
        });
        button.on('pointerdown', () => {
            button.setScale(0.95);
        });
        button.on('pointerup', () => {
            button.setScale(1);
            this.startGame();
        });
    }

    createInstructions() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.height - 50;

        const text = this.add.text(
            centerX,
            centerY,
            'Appuyez pour naviguer  |  Pincez pour zoomer',
            {
                font: '14px Arial',
                fill: '#c4a882'
            }
        );
        text.setOrigin(0.5);
    }

    startGame() {
        this.scene.start('Game');
    }
}
