/**
 * CameraController - Contrôleur de caméra tactile
 *
 * Caractéristiques :
 * - Panoramique au doigt (drag)
 * - Zoom avec pinch
 * - 2 niveaux de zoom (1x et 2x)
 * - Limites de caméra basées sur la taille de la carte
 */

import { GAME_CONFIG } from '../data/config.js';
import Phaser from 'phaser';

export class CameraController {
    constructor(scene) {
        this.scene = scene;
        this.camera = scene.cameras.main;
        this.isDragging = false;
        this.startDrag = { x: 0, y: 0 };
        this.startCamera = { x: 0, y: 0 };
        this.touchStart = [];
        this.initialDistance = 0;
        this.minZoom = GAME_CONFIG.MIN_ZOOM;
        this.maxZoom = GAME_CONFIG.MAX_ZOOM;

        // État du toucher
        this.touchIds = [];
    }

    /**
     * Configuration des entrées tactiles
     */
    setupInput() {
        const input = this.scene.input;

        // Désactiver les comportements par défaut
        input.setDefaultCursor('none');

        // Événements tactiles
        input.on('pointerdown', this.onPointerDown.bind(this));
        input.on('pointermove', this.onPointerMove.bind(this));
        input.on('pointerup', this.onPointerUp.bind(this));
        input.on('pointerupoutside', this.onPointerUp.bind(this));

        // Événements multi-touch
        input.on('pointerover', this.onPointerOver.bind(this));
    }

    /**
     * Gère le début d'un toucher
     */
    onPointerDown(pointer) {
        // Ignorer si ce n'est pas le premier toucher
        if (this.touchIds.length >= 2) return;

        this.touchIds.push(pointer.id);

        if (this.touchIds.length === 1) {
            // Début du drag
            this.isDragging = true;
            this.startDrag = { x: pointer.x, y: pointer.y };
            this.startCamera = {
                x: this.camera.scrollX,
                y: this.camera.scrollY,
            };
        } else if (this.touchIds.length === 2) {
            // Début du pinch
            const pointers = this.scene.input.pointers.filter(p => this.touchIds.includes(p.id));
            this.initialDistance = Phaser.Math.Distance.Between(
                pointers[0].x, pointers[0].y,
                pointers[1].x, pointers[1].y,
            );
        }
    }

    /**
     * Gère le mouvement d'un toucher
     */
    onPointerMove(pointer) {
        if (!this.touchIds.includes(pointer.id)) return;

        const pointers = this.scene.input.pointers.filter(p => this.touchIds.includes(p.id));

        if (pointers.length === 1 && this.isDragging) {
            // Drag simple
            const dx = pointer.x - this.startDrag.x;
            const dy = pointer.y - this.startDrag.y;

            this.camera.scrollX = this.startCamera.x - dx;
            this.camera.scrollY = this.startCamera.y - dy;

            // Limiter la caméra aux bords de la carte
            this.clampCamera();
        } else if (pointers.length === 2) {
            // Pinch pour zoom
            const currentDistance = Phaser.Math.Distance.Between(
                pointers[0].x, pointers[0].y,
                pointers[1].x, pointers[1].y,
            );

            const zoomFactor = currentDistance / this.initialDistance;
            const newZoom = this.camera.zoom * zoomFactor;

            // Limiter le zoom
            this.camera.zoom = Phaser.Math.Clamp(newZoom, this.minZoom, this.maxZoom);

            // Mettre à jour la distance initiale
            this.initialDistance = currentDistance;

            // Centrer le zoom sur le point milieu entre les deux doigts
            const midX = (pointers[0].x + pointers[1].x) / 2;
            const midY = (pointers[0].y + pointers[1].y) / 2;
            const worldMid = this.camera.getWorldPoint(midX, midY);

            this.camera.centerOn(worldMid.x, worldMid.y);
        }
    }

    /**
     * Gère la fin d'un toucher
     */
    onPointerUp(pointer) {
        const index = this.touchIds.indexOf(pointer.id);
        if (index !== -1) {
            this.touchIds.splice(index, 1);
        }

        if (this.touchIds.length === 0) {
            this.isDragging = false;
        }
    }

    /**
     * Gère le survol (pour le desktop)
     */
    onPointerOver(pointer) {
        // Ne rien faire pour l'instant
    }

    /**
     * Limite la caméra aux bords de la carte
     */
    clampCamera() {
        const mapWidth = GAME_CONFIG.MAP_WIDTH * GAME_CONFIG.TILE_SIZE;
        const mapHeight = GAME_CONFIG.MAP_HEIGHT * GAME_CONFIG.TILE_SIZE;
        const viewportWidth = this.camera.width;
        const viewportHeight = this.camera.height;

        this.camera.scrollX = Phaser.Math.Clamp(
            this.camera.scrollX,
            0,
            mapWidth - viewportWidth / this.camera.zoom,
        );

        this.camera.scrollY = Phaser.Math.Clamp(
            this.camera.scrollY,
            0,
            mapHeight - viewportHeight / this.camera.zoom,
        );
    }

    /**
     * Met à jour le contrôleur (appelé chaque frame)
     */
    update() {
        // Pour l'instant, rien à faire
        // Cela pourrait être utilisé pour des animations de caméra
    }

    /**
     * Zoom sur une position spécifique
     */
    zoomTo(x, y, zoom) {
        this.camera.zoom = Phaser.Math.Clamp(zoom, this.minZoom, this.maxZoom);
        this.camera.centerOn(x, y);
    }

    /**
     * Réinitialise la caméra
     */
    reset() {
        this.camera.setZoom(GAME_CONFIG.DEFAULT_ZOOM);
        this.camera.centerOn(
            (GAME_CONFIG.MAP_WIDTH / 2) * GAME_CONFIG.TILE_SIZE,
            (GAME_CONFIG.MAP_HEIGHT / 2) * GAME_CONFIG.TILE_SIZE,
        );
        this.camera.scrollX = 0;
        this.camera.scrollY = 0;
    }

    /**
     * Retourne la position de la caméra
     */
    getPosition() {
        return {
            x: this.camera.scrollX,
            y: this.camera.scrollY,
            zoom: this.camera.zoom,
        };
    }

    /**
     * Définit la position de la caméra
     */
    setPosition(x, y, zoom) {
        this.camera.scrollX = x;
        this.camera.scrollY = y;
        if (zoom) {
            this.camera.zoom = zoom;
        }
        this.clampCamera();
    }
}
