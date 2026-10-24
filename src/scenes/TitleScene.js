/**
 * Scène de titre minimal
 * Affichage du titre et bouton pour démarrer
 */

import { PALETTE } from '../systems/graphics.js';

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        // Génération des sprites par code
        this.generateTitleAssets();
    }

    create() {
        // Fond sombre
        this.cameras.main.setBackgroundColor('#1a120b');

        // Titre généré par code
        this.createTitle();

        // Bouton démarrer
        this.createStartButton();

        // Instructions tactiles
        this.createInstructions();
    }

    generateTitleAssets() {
        // Créer texture pour le titre
        const titleTexture = this.textures.add('title-logo', 0, 0, 200, 80);
        const titleCanvas = titleTexture.getSourceImage();
        const ctx = titleCanvas.getContext('2d');

        // Palette de couleurs préhistoriques
        const palette = {
            brown: 0x5a3e2b,
            beige: 0xc4a882,
            orange: 0xd4652b,
            red: 0x8b2613,
            yellow: 0xffd700,
        };

        // Dessiner "LA COLONIE" en pixel art
        this.drawPixelText(ctx, 'LA COLONIE', 10, 10, palette);
        this.drawPixelText(ctx, 'LES PREMIERS FEUX', 10, 40, palette, 0.7);

        titleTexture.refresh();
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
                [1,0,0,1,0,0,0,0],
                [0,1,1,0,0,0,0,0],
                [0,1,1,0,0,0,0,0],
                [1,0,0,1,0,0,0,0],
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
                [1,1,1,1,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0]],
        };

        const def = font[char.toUpperCase()] || font[' '];

        for (let row = 0; row < def.length; row++) {
            for (let col = 0; col < def[row].length; col++) {
                if (def[row][col]) {
                    ctx.fillStyle = `#${palette.orange.toString(16).padStart(6, '0')}`;
                    ctx.fillRect(
                        x + col * pixelSize,
                        y + row * pixelSize,
                        pixelSize,
                        pixelSize,
                    );
                }
            }
        }
    }

    createTitle() {
        // Logo du jeu
        const logo = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            'title-logo',
        );
        logo.setScale(2);
        logo.setOrigin(0.5);

        // Sous-titre
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'Un jeu de gestion préhistorique',
            {
                font: '20px Arial',
                fill: '#c4a882',
                align: 'center',
            },
        ).setOrigin(0.5);
    }

    createStartButton() {
        // Bouton démarrer avec style préhistorique
        const button = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 150,
            200,
            60,
            0x5a3e2b,
        );
        button.setOrigin(0.5);
        button.setStrokeStyle(2, 0xd4652b);

        const text = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 150,
            'COMMENCER',
            {
                font: '24px Arial',
                fill: '#ffd700',
                fontWeight: 'bold',
            },
        );
        text.setOrigin(0.5);

        // Interaction tactile
        button.setInteractive();
        button.on('pointerdown', () => {
            this.tweens.add({
                targets: button,
                scale: 0.95,
                duration: 50,
                yoyo: true,
            });
        });

        button.on('pointerup', () => {
            this.scene.start('Game');
        });

        // Permettre le tap sur le texte aussi
        text.setInteractive();
        text.on('pointerup', () => {
            this.scene.start('Game');
        });
    }

    createInstructions() {
        const instructions = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 50,
            'Tap pour démarrer - Pincez pour zoomer',
            {
                font: '14px Arial',
                fill: '#8b2613',
                align: 'center',
            },
        );
        instructions.setOrigin(0.5);
    }
}
