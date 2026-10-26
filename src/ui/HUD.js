/**
 * HUD - Interface utilisateur du jeu
 *
 * Caractéristiques :
 * - Bandeau en haut : date/saison + vitesse
 * - Boutons principaux en bas
 * - Notifications empilables à gauche
 * - Tous les éléments ont scrollFactor 0 : ils restent fixes à l'écran
 *   même quand la caméra bouge (sinon l'UI se superpose à la carte)
 */

export class HUD {
    constructor(scene, timeSystem, gameState) {
        this.scene = scene;
        this.timeSystem = timeSystem;
        this.gameState = gameState;

        this.dateText = null;
        this.speedText = null;
        this.speedButtons = [];
        this.pauseButton = null;
        this.saveButton = null;
        this.loadButton = null;
        this.menuButton = null;
        this.notifications = [];

        this.buttonSize = 44;
        this.padding = 10;
        this.topBarHeight = 50;
        this.bottomBarHeight = 60;
        this.uiColor = 0x2a1e12;
        this.uiBorderColor = 0xd4652b;
        this.textColor = 0xffd700;

        this.topBarBg = null;
        this.bottomBarBg = null;
    }

    hex(color) {
        return `#${color.toString(16).padStart(6, '0')}`;
    }

    makeFixed(obj, depth) {
        obj.setDepth(depth);
        return obj;
    }

    getChildren() {
        const objs = [
            this.topBarBg,
            this.bottomBarBg,
            this.dateText,
            this.speedText,
            this.pauseButton,
            this.menuButton,
        ];
        this.speedButtons.forEach(b => objs.push(b));
        if (this.saveButton) objs.push(this.saveButton);
        if (this.loadButton) objs.push(this.loadButton);
        const buttons = [
            this.pauseButton,
            this.saveButton,
            this.loadButton,
            this.menuButton,
            ...this.speedButtons,
        ];
        buttons.forEach(b => {
            if (b && b.hudText) objs.push(b.hudText);
        });
        this.notifications.forEach(n => objs.push(n.bg, n.text));
        return objs.filter(o => o);
    }

    create() {
        this.createTopBar();
        this.createBottomBar();
    }

    createTopBar() {
        const camera = this.scene.cameras.main;

        this.topBarBg = this.makeFixed(
            this.scene.add.rectangle(
                camera.width / 2,
                this.topBarHeight / 2,
                camera.width,
                this.topBarHeight,
                this.uiColor,
                0.8,
            ),
            100,
        );
        this.topBarBg.setOrigin(0.5);

        this.dateText = this.makeFixed(
            this.scene.add.text(
                this.padding,
                this.topBarHeight / 2,
                this.timeSystem.formatDate(),
                {
                    font: '16px Arial',
                    fill: this.hex(this.textColor),
                },
            ),
            101,
        );
        this.dateText.setOrigin(0, 0.5);

        this.speedText = this.makeFixed(
            this.scene.add.text(
                camera.width - this.padding,
                this.topBarHeight / 2,
                '×1',
                {
                    font: '20px Arial',
                    fill: this.hex(this.textColor),
                    fontStyle: 'bold',
                },
            ),
            101,
        );
        this.speedText.setOrigin(1, 0.5);
    }

    createBottomBar() {
        const camera = this.scene.cameras.main;

        this.bottomBarBg = this.makeFixed(
            this.scene.add.rectangle(
                camera.width / 2,
                camera.height - this.bottomBarHeight / 2,
                camera.width,
                this.bottomBarHeight,
                this.uiColor,
                0.8,
            ),
            100,
        );
        this.bottomBarBg.setOrigin(0.5);

        this.pauseButton = this.createButton(
            camera.width / 2 - 150,
            camera.height - this.bottomBarHeight / 2,
            '⏸',
            () => this.onPauseClick(),
        );

        this.speedButtons[0] = this.createButton(
            camera.width / 2 - 70,
            camera.height - this.bottomBarHeight / 2,
            '1×',
            () => this.onSpeedClick(1),
        );

        this.speedButtons[1] = this.createButton(
            camera.width / 2 + 10,
            camera.height - this.bottomBarHeight / 2,
            '3×',
            () => this.onSpeedClick(3),
        );

        this.saveButton = this.createButton(
            camera.width / 2 + 90,
            camera.height - this.bottomBarHeight / 2,
            '💾',
            () => this.onSaveClick(),
        );

        this.loadButton = this.createButton(
            camera.width / 2 + 170,
            camera.height - this.bottomBarHeight / 2,
            '📂',
            () => this.onLoadClick(),
        );

        this.menuButton = this.createButton(
            camera.width - 50,
            camera.height - this.bottomBarHeight / 2,
            '⏏',
            () => this.onMenuClick(),
        );
    }

    createButton(x, y, text, callback) {
        const size = this.buttonSize;

        const button = this.makeFixed(
            this.scene.add.rectangle(x, y, size, size, this.uiColor),
            101,
        );
        button.setOrigin(0.5);
        button.setStrokeStyle(2, this.uiBorderColor);
        button.setInteractive();

        const textObj = this.makeFixed(
            this.scene.add.text(x, y, text, {
                font: '20px Arial',
                fill: this.hex(this.textColor),
            }),
            102,
        );
        textObj.setOrigin(0.5);

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

        button.hudText = textObj;
        return button;
    }

    update(timeObj, speed) {
        if (this.dateText && this.timeSystem) {
            this.dateText.setText(this.timeSystem.formatDate());
        }

        if (this.speedText) {
            this.speedText.setText(speed === 0 ? '⏸' : `×${speed}`);
        }

        this.speedButtons.forEach((button, index) => {
            const targetSpeed = index === 0 ? 1 : 3;
            if (speed === targetSpeed) {
                button.setStrokeStyle(3, 0xffd700);
            } else {
                button.setStrokeStyle(2, this.uiBorderColor);
            }
        });
    }

    setupSpeedControls(callback) {
        this.speedCallback = callback;
    }

    setupPauseControl(callback) {
        this.pauseCallback = callback;
    }

    setupSaveControl(callback) {
        this.saveCallback = callback;
    }

    setupLoadControl(callback) {
        this.loadCallback = callback;
    }

    setupMenuControl(callback) {
        this.menuCallback = callback;
    }

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

    showNotification(message, type = 'info') {
        const camera = this.scene.cameras.main;
        const colors = {
            info: 0x8ac4ff,
            success: 0x00ff00,
            warning: 0xffaa00,
            error: 0xff0000,
        };

        const color = colors[type] || colors.info;
        const y = this.topBarHeight + 40;

        const bg = this.makeFixed(
            this.scene.add.rectangle(camera.width / 2, y, 200, 36, color, 0.9),
            102,
        );
        bg.setOrigin(0.5);

        const text = this.makeFixed(
            this.scene.add.text(camera.width / 2, y, message, {
                font: '16px Arial',
                fill: '#000',
            }),
            103,
        );
        text.setOrigin(0.5);

        this.notifications.push({ bg, text });

        this.scene.tweens.add({
            targets: [bg, text],
            y: y - 10,
            duration: 300,
            ease: 'Back.easeOut',
        });

        this.scene.time.delayedCall(2000, () => {
            this.scene.tweens.add({
                targets: [bg, text],
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    bg.destroy();
                    text.destroy();
                    this.notifications = this.notifications.filter(
                        n => n.bg !== bg,
                    );
                },
            });
        });
    }

    resize(width, height) {
        const camera = this.scene.cameras.main;
        width = width || camera.width;
        height = height || camera.height;

        this.topBarBg.setSize(width, this.topBarHeight);
        this.topBarBg.setPosition(width / 2, this.topBarHeight / 2);
        this.dateText.setPosition(this.padding, this.topBarHeight / 2);

        this.speedText.setPosition(width - this.padding, this.topBarHeight / 2);

        this.bottomBarBg.setSize(width, this.bottomBarHeight);
        this.bottomBarBg.setPosition(
            width / 2,
            height - this.bottomBarHeight / 2,
        );

        const buttons = [
            this.pauseButton,
            this.speedButtons[0],
            this.speedButtons[1],
            this.saveButton,
            this.loadButton,
            this.menuButton,
        ];

        buttons.forEach((button) => {
            if (button && button.hudText) {
                button.hudText.setPosition(button.x, button.y);
            }
        });

        this.pauseButton.setPosition(width / 2 - 150, height - this.bottomBarHeight / 2);
        this.speedButtons[0].setPosition(width / 2 - 70, height - this.bottomBarHeight / 2);
        this.speedButtons[1].setPosition(width / 2 + 10, height - this.bottomBarHeight / 2);
        this.saveButton.setPosition(width / 2 + 90, height - this.bottomBarHeight / 2);
        this.loadButton.setPosition(width / 2 + 170, height - this.bottomBarHeight / 2);
        this.menuButton.setPosition(width - 50, height - this.bottomBarHeight / 2);

        buttons.forEach((button) => {
            if (button && button.hudText) {
                button.hudText.setPosition(button.x, button.y);
            }
        });
    }
}
