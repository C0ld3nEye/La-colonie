/**
 * Scène de titre
 * Titre, sous-titre, bouton COMMENCER et instructions, avec texte Phaser natif
 * (plus de superposition : chaque élément a sa propre ligne, repositionnés au resize)
 */

import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#1a120b');

        this.titleText = this.add
            .text(0, 0, 'LA COLONIE', {
                font: 'bold 48px Arial',
                fill: '#c4a882',
            })
            .setOrigin(0.5);

        this.subtitleText = this.add
            .text(0, 0, 'LES PREMIERS FEUX', {
                font: '28px Arial',
                fill: '#d4652b',
            })
            .setOrigin(0.5);

        this.descriptionText = this.add
            .text(0, 0, 'Un jeu de gestion préhistorique', {
                font: '18px Arial',
                fill: '#8a7a5a',
            })
            .setOrigin(0.5);

        this.startButton = this.add
            .rectangle(0, 0, 250, 70, 0x5a3e2b)
            .setOrigin(0.5)
            .setStrokeStyle(3, 0xc4a882)
            .setInteractive();

        this.startText = this.add
            .text(0, 0, 'COMMENCER', {
                font: 'bold 28px Arial',
                fill: '#ffffff',
            })
            .setOrigin(0.5);

        this.instructionsText = this.add
            .text(0, 0, 'Appuyez pour naviguer  |  Pincez pour zoomer', {
                font: '16px Arial',
                fill: '#c4a882',
            })
            .setOrigin(0.5);

        this.startButton.on('pointerover', () => {
            this.startButton.setFillStyle(0x6d4c38);
        });
        this.startButton.on('pointerout', () => {
            this.startButton.setFillStyle(0x5a3e2b);
        });
        this.startButton.on('pointerdown', () => {
            this.startButton.setScale(0.95);
        });
        this.startButton.on('pointerup', () => {
            this.startButton.setScale(1);
            this.startGame();
        });

        this.scale.on('resize', this.layout, this);
        this.layout();
    }

    layout() {
        const { width, height } = this.scale;
        const centerX = width / 2;

        this.titleText.setPosition(centerX, height * 0.25);
        this.subtitleText.setPosition(centerX, height * 0.25 + 60);
        this.descriptionText.setPosition(centerX, height * 0.25 + 110);
        this.startButton.setPosition(centerX, height * 0.55);
        this.startText.setPosition(centerX, height * 0.55);
        this.instructionsText.setPosition(centerX, height - 40);
    }

    startGame() {
        this.scene.start('Game');
    }
}
