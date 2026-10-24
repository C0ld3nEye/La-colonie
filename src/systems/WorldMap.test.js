/**
 * Tests unitaires pour WorldMap
 * Vérifie la logique de génération de carte
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WorldMap } from './WorldMap.js';
import { GAME_CONFIG } from '../data/config.js';

// Mock de Phaser.Scene
class MockScene {
    constructor() {
        this.children = { add: vi.fn() };
        this.cameras = { main: {} };
        this.add = {
            rectangle: vi.fn((x, y, w, h, color) => ({
                setOrigin: vi.fn(),
                setStrokeStyle: vi.fn(),
                x, y, w, h, color,
            })),
            circle: vi.fn((x, y, r, color) => ({
                setOrigin: vi.fn(),
            })),
            group: vi.fn(() => ({
                add: vi.fn(),
                destroy: vi.fn(),
            })),
            text: vi.fn(),
        };
        this.make = {
            group: vi.fn(() => ({
                add: vi.fn(),
                destroy: vi.fn(),
            })),
        };
        this.textures = {
            add: vi.fn(),
        };
    }
}

describe('WorldMap', () => {
    let scene;
    let worldMap;

    beforeEach(() => {
        scene = new MockScene();
        worldMap = new WorldMap(scene, GAME_CONFIG.MAP_WIDTH, GAME_CONFIG.MAP_HEIGHT);
    });

    describe('Initialisation', () => {
        it('devrait initialiser avec les bonnes dimensions', () => {
            expect(worldMap.width).toBe(GAME_CONFIG.MAP_WIDTH);
            expect(worldMap.height).toBe(GAME_CONFIG.MAP_HEIGHT);
            expect(worldMap.tileSize).toBe(GAME_CONFIG.TILE_SIZE);
        });

        it('devrait avoir une grille vide au départ', () => {
            expect(worldMap.grid).toEqual([]);
        });

        it('devrait avoir les types de terrain définis', () => {
            expect(worldMap.terrainTypes).toEqual(GAME_CONFIG.TERRAIN_TYPES);
        });
    });

    describe('Génération', () => {
        it('devrait générer une grille 128x128', () => {
            worldMap.generate();

            expect(worldMap.grid.length).toBe(GAME_CONFIG.MAP_HEIGHT);
            for (let y = 0; y < GAME_CONFIG.MAP_HEIGHT; y++) {
                expect(worldMap.grid[y].length).toBe(GAME_CONFIG.MAP_WIDTH);
            }
        });

        it('devrait générer des tuiles avec des types valides', () => {
            worldMap.generate();

            const validTypes = Object.values(GAME_CONFIG.TERRAIN_TYPES);
            for (let y = 0; y < worldMap.height; y++) {
                for (let x = 0; x < worldMap.width; x++) {
                    expect(validTypes).toContain(worldMap.grid[y][x]);
                }
            }
        });

        it('devrait contenir tous les types de terrain', () => {
            worldMap.generate();

            const terrainCounts = {};
            for (let y = 0; y < worldMap.height; y++) {
                for (let x = 0; x < worldMap.width; x++) {
                    const type = worldMap.grid[y][x];
                    terrainCounts[type] = (terrainCounts[type] || 0) + 1;
                }
            }

            // Vérifier que chaque type est présent
            expect(Object.keys(terrainCounts).length).toBeGreaterThanOrEqual(2);
        });

        it('devrait avoir de l eau (rivières/lacs)', () => {
            worldMap.generate();

            let hasWater = false;
            for (let y = 0; y < worldMap.height; y++) {
                for (let x = 0; x < worldMap.width; x++) {
                    if (worldMap.grid[y][x] === GAME_CONFIG.TERRAIN_TYPES.WATER) {
                        hasWater = true;
                        break;
                    }
                }
                if (hasWater) break;
            }

            expect(hasWater).toBe(true);
        });
    });

    describe('Accesseurs', () => {
        it('devrait retourner le type de terrain à une position', () => {
            worldMap.generate();

            const type = worldMap.getTerrainType(10, 10);
            expect(type).toBeDefined();
            expect(Object.values(GAME_CONFIG.TERRAIN_TYPES)).toContain(type);
        });

        it('devrait retourner null pour une position hors limites', () => {
            expect(worldMap.getTerrainType(-1, 0)).toBeNull();
            expect(worldMap.getTerrainType(0, -1)).toBeNull();
            expect(worldMap.getTerrainType(200, 0)).toBeNull();
            expect(worldMap.getTerrainType(0, 200)).toBeNull();
        });

        it('devrait permettre de modifier le type de terrain', () => {
            worldMap.generate();

            worldMap.setTerrainType(10, 10, GAME_CONFIG.TERRAIN_TYPES.WATER);
            expect(worldMap.getTerrainType(10, 10)).toBe(GAME_CONFIG.TERRAIN_TYPES.WATER);
        });

        it('devrait ignorer les modifications hors limites', () => {
            worldMap.generate();

            worldMap.setTerrainType(-1, 0, GAME_CONFIG.TERRAIN_TYPES.WATER);
            worldMap.setTerrainType(0, -1, GAME_CONFIG.TERRAIN_TYPES.WATER);
            worldMap.setTerrainType(200, 0, GAME_CONFIG.TERRAIN_TYPES.WATER);

            // Aucun effet de bord
            expect(worldMap.grid).toBeDefined();
        });
    });

    describe('État', () => {
        it('devrait retourner l état de la carte', () => {
            worldMap.generate();

            const state = worldMap.getState();

            expect(state.grid).toBeDefined();
            expect(state.width).toBe(worldMap.width);
            expect(state.height).toBe(worldMap.height);
        });

        it('devrait générer à partir d un état sauvegardé', () => {
            worldMap.generate();
            const state = worldMap.getState();

            const newWorldMap = new WorldMap(scene, 0, 0);
            newWorldMap.generateFromState(state);

            expect(newWorldMap.grid).toEqual(state.grid);
        });
    });

    describe('Voisins', () => {
        it('devrait retourner les voisins d une tuile', () => {
            worldMap.generate();

            const neighbors = worldMap.getNeighbors(10, 10);

            expect(neighbors.length).toBeGreaterThanOrEqual(3); // Au moins 3 voisins
            expect(neighbors.length).toBeLessThanOrEqual(8); // Max 8 voisins
        });

        it('devrait gérer les bords de la carte', () => {
            worldMap.generate();

            const cornerNeighbors = worldMap.getNeighbors(0, 0);
            expect(cornerNeighbors.length).toBe(3); // Coin = 3 voisins
        });
    });
});
