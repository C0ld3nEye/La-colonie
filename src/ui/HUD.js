/**
 * HUD - Interface utilisateur du jeu
 *
 * Caractéristiques :
 * - Bandeau en haut : date/saison/météo + vitesse
 * - Boutons principaux en bas
 * - Notifications empilables à gauche
 */

export class HUD {
    constructor(scene, timeSystem, gameState) {
        this.scene = scene;
        this.timeSystem = timeSystem;
        this.gameState = gameState;

        // Éléments UI
        this.dateText = null;
        this.speedText = null;
        this.speedButtons = [];
        this.pauseButton = null;
        this.saveButton = null;
        this.loadButton = null;
        this.menuButton = null;
        this.notifications = [];

        // Configuration
        this.buttonSize = 44; // Taille minimale pour le tactile
        this.padding = 10;
        this.uiColor = 0x2a1e12;
        this.uiBorderColor = 0xd4652b;
        this.textColor = 0xffd700;
    }

    create() {
        this.createTopBar();
        this.createBottomBar();
        this.createNotifications();
    }

    /**
     * Crée la barre du haut (date, saison, vitesse)
     */
    createTopBar() {
        const camera = this.scene.cameras.main;
        const barHeight = 50;

        // Fond semi-transparent
        const bg = this.scene.add.rectangle(
            camera.centerX,
            barHeight / 2,
            camera.width,
            barHeight,
            this.uiColor,
            0.8,
        );
        bg.setOrigin(0.5);
        bg.setDepth(100);

        // Texte de date
        this.dateText = this.scene.add.text(
            camera.centerX,
            barHeight / 2,
            this.timeSystem.formatDate(),
            {
                font: '16px Arial',
                fill: `#${this.textColor.toString(16).padStart(6, '0')}`,
                align: 'center',
            },
        );
        this.dateText.setOrigin(0.5);
        this.dateText.setDepth(101);

        // Indicateur de vitesse
        this.speedText = this.scene.add.text(
            camera.width - 100,
            barHeight / 2,
            '×1',
            {
                font: '20px Arial',
                fill: `#${this.textColor.toString(16).padStart(6, '0')}`,
                fontWeight: 'bold',
            },
        );
        this.speedText.setOrigin(0.5);
        this.speedText.setDepth(101);
    }

    /**
     * Crée la barre du bas (boutons principaux)
     */
    createBottomBar() {
        const camera = this.scene.cameras.main;
        const barHeight = 60;
        const buttonSpacing = 10;

        // Fond semi-transparent
        const bg = this.scene.add.rectangle(
            camera.centerX,
            camera.height - barHeight / 2,
            camera.width,
            barHeight,
            this.uiColor,
            0.8,
        );
        bg.setOrigin(0.5);
        bg.setDepth(100);

        // Bouton Pause/Play
        this.pauseButton = this.createButton(
            camera.centerX - 150,
            camera.height - barHeight / 2,
            '⏸️',
            () => this.onPauseClick(),
        );

        // Boutons de vitesse
        this.speedButtons[0] = this.createButton(
            camera.centerX - 70,
            camera.height - barHeight / 2,
            '1×',
            () => this.onSpeedClick(1),
        );

        this.speedButtons[1] = this.createButton(
            camera.centerX + 10,
            camera.height - barHeight / 2,
            '3×',
            () => this.onSpeedClick(3),
        );

        // Bouton Sauvegarder
        this.saveButton = this.createButton(
            camera.centerX + 90,
            camera.height - barHeight / 2,
            '💾',
            () => this.onSaveClick(),
        );

        // Bouton Charger
        this.loadButton = this.createButton(
            camera.centerX + 170,
            camera.height - barHeight / 2,
            '📂',
            () => this.onLoadClick(),
        );

        // Bouton Menu
        this.menuButton = this.createButton(
            camera.width - 50,
            camera.height - barHeight / 2,
            '⏏️',
            () => this.onMenuClick(),
        );
    }

    /**
     * Crée un bouton
     */
    createButton(x, y, text, callback) {
        const size = this.buttonSize;

        // Fond du bouton
        const button = this.scene.add.rectangle(x, y, size, size, this.uiColor);
        button.setOrigin(0.5);
        button.setStrokeStyle(2, this.uiBorderColor);
        button.setDepth(101);
        button.setInteractive();

        // Texte du bouton
        const textObj = this.scene.add.text(x, y, text, {
            font: '20px Arial',
            fill: `#${this.textColor.toString(16).padStart(6, '0')}`,
        });
        textObj.setOrigin(0.5);
        textObj.setDepth(102);

        // Animation au survol/tap
        button.on('pointerover', () => {
            button.setFillStyle(0x3a2e22);
        });

        button.on('pointerout', () => {
            button.setFillStyle(this.uiColor);
        });

        button.on('pointerdown', () => {
            button.setScale(0.95);
        });

        button.on('pointerup', () => {
            button.setScale(1);
            callback();
        });

        return button;
    }

    /**
     * Crée la zone de notifications
     */
    createNotifications() {
        const camera = this.scene.cameras.main;
        const width = 200;
        const height = camera.height - 120;

        // Zone des notifications (à gauche)
        const zone = this.scene.add.rectangle(
            width / 2,
            camera.centerY,
            width,
            height,
            0x000000,
            0.3,
        );
        zone.setOrigin(0.5);
        zone.setDepth(99);
    }

    /**
     * Met à jour le HUD
     */
    update(time, speed) {
        if (this.dateText) {
            this.dateText.setText(time.formatDate());
        }

        if (this.speedText) {
            const speedText = speed === 0 ? '⏸️' : `×${speed}`;
            this.speedText.setText(speedText);
        }

        // Mettre à jour l'apparence des boutons de vitesse
        this.speedButtons.forEach((button, index) => {
            const targetSpeed = index === 0 ? 1 : 3;
            if (speed === targetSpeed) {
                button.setStrokeStyle(3, 0xffd700);
            } else {
                button.setStrokeStyle(2, this.uiBorderColor);
            }
        });
    }

    /**
     * Configure les contrôles de vitesse
     */
    setupSpeedControls(callback) {
        this.speedCallback = callback;
    }

    /**
     * Configure le contrôle de pause
     */
    setupPauseControl(callback) {
        this.pauseCallback = callback;
    }

    /**
     * Configure le contrôle de sauvegarde
     */
    setupSaveControl(callback) {
        this.saveCallback = callback;
    }

    /**
     * Configure le contrôle de chargement
     */
    setupLoadControl(callback) {
        this.loadCallback = callback;
    }

    /**
     * Configure le contrôle du menu
     */
    setupMenuControl(callback) {
        this.menuCallback = callback;
    }

    /**
     * Gestionnaires d'événements
     */
    onPauseClick() {
        if (this.pauseCallback) {
            this.pauseCallback();
        }
    }

    onSpeedClick(speed) {
        if (this.speedCallback) {
            this.speedCallback(speed);
        }
    }

    onSaveClick() {
        if (this.saveCallback) {
            this.saveCallback();
            this.showNotification('Sauvegardé !', 'success');
        }
    }

    onLoadClick() {
        if (this.loadCallback) {
            this.loadCallback();
            this.showNotification('Chargé !', 'success');
        }
    }

    onMenuClick() {
        if (this.menuCallback) {
            this.menuCallback();
        }
    }

    /**
     * Affiche une notification
     */
    showNotification(message, type = 'info') {
        const camera = this.scene.cameras.main;
        const colors = {
            info: 0x8ac4ff,
            success: 0x00ff00,
            warning: 0xffaa00,
            error: 0xff0000,
        };

        const color = colors[type] || colors.info;
        const startY = camera.height - 200;
        const endY = camera.height - 150;

        // Créer la notification
        const bg = this.scene.add.rectangle(
            camera.centerX,
            startY,
            200,
            40,
            color,
            0.8,
        );
        bg.setOrigin(0.5);
        bg.setDepth(102);

        const text = this.scene.add.text(
            camera.centerX,
            startY,
            message,
            {
                font: '16px Arial',
                fill: '#000',
                align: 'center',
            },
        );
        text.setOrigin(0.5);
        text.setDepth(103);

        // Animation
        this.scene.tweens.add({
            targets: [bg, text],
            y: endY,
            duration: 300,
            ease: 'Back.easeOut',
        });

        // Suppression après délai
        this.scene.time.delayedCall(2000, () => {
            this.scene.tweens.add({
                targets: [bg, text],
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    bg.destroy();
                    text.destroy();
                },
            });
        });
    }

    /**
     * Met à jour la taille du HUD (appelé au resize)
     */
    resize(width, height) {
        // Repositionner les éléments si nécessaire
    }
}
