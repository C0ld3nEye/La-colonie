/**
 * Scène principale du jeu
 * Gère la carte, le temps, la caméra et les contrôles
 */

import Phaser from 'phaser';
import { WorldMap } from '../systems/WorldMap.js';
import { TimeSystem } from '../systems/TimeSystem.js';
import { CameraController } from '../systems/CameraController.js';
import { HUD } from '../ui/HUD.js';
import { SaveSystem } from '../systems/SaveSystem.js';
import { GAME_CONFIG } from '../data/config.js';

export class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });

        // Systèmes
        this.worldMap = null;
        this.timeSystem = null;
        this.cameraController = null;
        this.hud = null;
        this.saveSystem = null;

        // État
        this.gameState = {
            map: null,
            time: {
                day: 1,
                season: 0,
                year: 1,
            },
            speed: 1, // 0 = pause, 1 = 1x, 3 = 3x
        };
    }

    preload() {
        // Pré-chargement si nécessaire (ici tout est généré par code)
    }

    create() {
        // Initialisation des systèmes
        this.initSystems();

        // Création de la carte
        this.createMap();

        // Configuration de la caméra
        this.setupCamera();

        // Création du HUD
        this.createHUD();

        // Système de sauvegarde
        this.saveSystem = new SaveSystem(this);

        // Chargement de la sauvegarde si elle existe
        this.loadGame();

        // Contrôles tactiles
        this.setupInput();

        // Gestion du resize
        this.scale.on('resize', this.handleResize, this);
    }

    initSystems() {
        // Système de temps découplé
        this.timeSystem = new TimeSystem(this);

        // Contrôleur de caméra
        this.cameraController = new CameraController(this);
    }

    createMap() {
        this.worldMap = new WorldMap(this, GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT);
        this.worldMap.generate();
        this.worldMap.render();

        // Stocker l'état de la carte
        this.gameState.map = this.worldMap.getState();
    }

    setupCamera() {
        const camera = this.cameras.main;
        const mapWidth = GAME_CONFIG.MAP_WIDTH * GAME_CONFIG.TILE_SIZE;
        const mapHeight = GAME_CONFIG.MAP_HEIGHT * GAME_CONFIG.TILE_SIZE;
        camera.setBounds(0, 0, mapWidth, mapHeight);
        camera.setZoom(GAME_CONFIG.DEFAULT_ZOOM);
        camera.centerOn(
            (GAME_CONFIG.MAP_WIDTH / 2) * GAME_CONFIG.TILE_SIZE,
            (GAME_CONFIG.MAP_HEIGHT / 2) * GAME_CONFIG.TILE_SIZE,
        );
    }

    createHUD() {
        this.hud = new HUD(this, this.timeSystem, this.gameState);
        this.hud.create();
    }

    setupInput() {
        // Contrôles tactiles pour la caméra
        this.cameraController.setupInput();

        // Boutons de vitesse
        this.hud.setupSpeedControls((speed) => {
            this.gameState.speed = speed;
            this.timeSystem.setSpeed(speed);
        });

        // Bouton pause
        this.hud.setupPauseControl(() => {
            this.gameState.speed = this.gameState.speed === 0 ? 1 : 0;
            this.timeSystem.setSpeed(this.gameState.speed);
        });

        // Bouton sauvegarder
        this.hud.setupSaveControl(() => {
            this.saveSystem.save(this.getGameState());
        });

        // Bouton charger
        this.hud.setupLoadControl(() => {
            this.loadGame();
        });

        // Bouton retourner au menu
        this.hud.setupMenuControl(() => {
            this.saveSystem.save(this.getGameState());
            this.scene.start('TitleScene');
        });
    }

    loadGame() {
        const savedState = this.saveSystem.load();
        if (savedState) {
            this.gameState = { ...this.gameState, ...savedState };
            this.timeSystem.setTime(
                savedState.time.day,
                savedState.time.season,
                savedState.time.year,
            );
            this.timeSystem.setSpeed(savedState.speed || 1);
            this.gameState.speed = savedState.speed || 1;

            // Re-générer la carte à partir de l'état sauvegardé
            if (savedState.map) {
                this.worldMap.generateFromState(savedState.map);
                this.worldMap.render();
            }
        }
    }

    handleResize() {
        // Reconfigurer la caméra après resize
        this.setupCamera();

        // Mettre à jour le HUD
        if (this.hud) {
            this.hud.resize(this.cameras.main.width, this.cameras.main.height);
        }
    }

    update(time, delta) {
        // Mise à jour du système de temps
        if (this.timeSystem) {
            this.timeSystem.update(delta, this.gameState.speed);
        }

        // Mise à jour de la caméra
        if (this.cameraController) {
            this.cameraController.update();
        }

        // Mise à jour du HUD
        if (this.hud) {
            this.hud.update(this.timeSystem, this.gameState.speed);
        }
    }

    getGameState() {
        return {
            ...this.gameState,
            map: this.worldMap.getState(),
            time: this.timeSystem.getCurrentTime(),
        };
    }
}
