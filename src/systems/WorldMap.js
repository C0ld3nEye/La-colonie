/**
 * WorldMap - Système de génération et gestion de la carte procédurale
 *
 * Caractéristiques :
 * - Carte de 128x128 tuiles
 * - Biomes : herbe, forêt, eau, pierre
 * - Génération procédurale avec zones cohérentes
 * - Tuiles de 16x16 pixels dessinées par code
 */

import { GAME_CONFIG } from '../data/config.js';

export class WorldMap {
    constructor(scene, width, height) {
        this.scene = scene;
        this.width = width || GAME_CONFIG.MAP_WIDTH;
        this.height = height || GAME_CONFIG.MAP_HEIGHT;
        this.tileSize = GAME_CONFIG.TILE_SIZE;
        this.grid = [];
        this.layer = null;
        this.terrainTypes = GAME_CONFIG.TERRAIN_TYPES;
        this.terrainColors = {
            0: 0x4a7c59, // Herbe vert
            1: 0x2a5c3a, // Forêt vert foncé
            2: 0x1a3c7c, // Eau bleu
            3: 0x6a6a6a,  // Pierre gris
        };
    }

    /**
     * Génère une carte procédurale
     */
    generate() {
        this.grid = [];

        // Génération par zones pour plus de cohérence
        const zoneSize = 16;
        const zonesWidth = Math.ceil(this.width / zoneSize);
        const zonesHeight = Math.ceil(this.height / zoneSize);

        // Créer des zones avec des biomes principaux
        for (let zy = 0; zy < zonesHeight; zy++) {
            for (let zx = 0; zx < zonesWidth; zx++) {
                const zoneType = this.getZoneType(zx, zy, zonesWidth, zonesHeight);

                // Remplir la zone
                for (let y = 0; y < zoneSize; y++) {
                    for (let x = 0; x < zoneSize; x++) {
                        const gx = zx * zoneSize + x;
                        const gy = zy * zoneSize + y;

                        if (gx >= this.width || gy >= this.height) continue;

                        if (!this.grid[gy]) {
                            this.grid[gy] = [];
                        }

                        // Ajouter de la variation dans la zone
                        const variation = Math.random();
                        if (variation < 0.1) {
                            // 10% de chance d'avoir un type différent
                            this.grid[gy][gx] = this.getRandomTerrainType();
                        } else {
                            this.grid[gy][gx] = zoneType;
                        }
                    }
                }
            }
        }

        // Ajouter des rivières et lacs
        this.addRivers();

        // Lisser les bords
        this.smoothEdges();
    }

    /**
     * Détermine le type de biome pour une zone
     */
    getZoneType(zx, zy, zonesWidth, zonesHeight) {
        const centerX = zonesWidth / 2;
        const centerY = zonesHeight / 2;
        const distFromCenter = Math.sqrt(
            Math.pow(zx - centerX, 2) + Math.pow(zy - centerY, 2),
        );

        // Centre = herbe, bordures = forêt, très loin = pierre
        if (distFromCenter < zonesWidth / 4) {
            return this.terrainTypes.GRASS;
        } else if (distFromCenter < zonesWidth / 2) {
            return this.terrainTypes.FOREST;
        } else if (distFromCenter < zonesWidth * 0.75) {
            return Math.random() < 0.5 ? this.terrainTypes.FOREST : this.terrainTypes.GRASS;
        } else {
            return Math.random() < 0.7 ? this.terrainTypes.STONE : this.terrainTypes.FOREST;
        }
    }

    /**
     * Retourne un type de terrain aléatoire
     */
    getRandomTerrainType() {
        const types = Object.values(this.terrainTypes);
        return types[Math.floor(Math.random() * types.length)];
    }

    /**
     * Ajoute des rivières à la carte
     */
    addRivers() {
        // Créer 2-3 rivières
        const riverCount = 2 + Math.floor(Math.random() * 2);

        for (let r = 0; r < riverCount; r++) {
            const startX = Math.random() < 0.5 ? 0 : this.width - 1;
            const startY = Math.floor(Math.random() * this.height);

            let x = startX;
            let y = startY;
            const direction = startX === 0 ? 1 : -1;

            for (let i = 0; i < this.width / 2; i++) {
                if (x < 0 || x >= this.width || y < 0 || y >= this.height) break;

                this.grid[y][x] = this.terrainTypes.WATER;

                // Courbe aléatoire
                if (Math.random() < 0.3) {
                    y += Math.random() < 0.5 ? -1 : 1;
                }

                x += direction;
            }
        }

        // Ajouter quelques lacs
        for (let l = 0; l < 3; l++) {
            const centerX = Math.floor(Math.random() * (this.width - 10)) + 5;
            const centerY = Math.floor(Math.random() * (this.height - 10)) + 5;
            const radius = 3 + Math.floor(Math.random() * 4);

            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist <= radius) {
                        const gx = centerX + dx;
                        const gy = centerY + dy;
                        if (gx >= 0 && gx < this.width && gy >= 0 && gy < this.height) {
                            this.grid[gy][gx] = this.terrainTypes.WATER;
                        }
                    }
                }
            }
        }
    }

    /**
     * Lisse les bords entre les différents biomes
     */
    smoothEdges() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const current = this.grid[y][x];
                const neighbors = this.getNeighbors(x, y);

                // Si une tuile est entourée majoritairement d'un autre type, la changer
                const counts = {};
                neighbors.forEach(n => {
                    counts[n] = (counts[n] || 0) + 1;
                });

                const maxCount = Math.max(...Object.values(counts));
                const dominantType = Object.keys(counts).find(k => counts[k] === maxCount);

                if (maxCount >= 4 && Math.random() < 0.3) {
                    this.grid[y][x] = parseInt(dominantType);
                }
            }
        }
    }

    /**
     * Récupère les voisins d'une tuile
     */
    getNeighbors(x, y) {
        const neighbors = [];
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                    neighbors.push(this.grid[ny][nx]);
                }
            }
        }
        return neighbors;
    }

    /**
     * Rendu de la carte
     */
    render() {
        // Dessiner toute la carte dans un seul canvas puis l'afficher comme image
        // (un seul Game Object au lieu de ~16 000, et aucun Group ajouté à la DisplayList)
        if (this.layer) {
            this.layer.destroy();
        }

        if (this.scene.textures.exists('world-map')) {
            this.scene.textures.remove('world-map');
        }

        const canvas = this.scene.textures.createCanvas(
            'world-map',
            this.width * this.tileSize,
            this.height * this.tileSize,
        );
        const ctx = canvas.context;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const terrainType = this.grid[y][x];
                const color = this.terrainColors[terrainType] || 0xffffff;

                ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
                ctx.fillRect(
                    x * this.tileSize,
                    y * this.tileSize,
                    this.tileSize,
                    this.tileSize,
                );

                this.addTerrainDetails(ctx, x, y, terrainType);
            }
        }

        canvas.refresh();

        this.layer = this.scene.add.image(
            (this.width * this.tileSize) / 2,
            (this.height * this.tileSize) / 2,
            'world-map',
        );
        this.layer.setOrigin(0.5);
        this.layer.setDepth(0);
    }

    /**
     * Ajoute des détails visuels aux tuiles (dessinés dans le canvas de la carte)
     */
    addTerrainDetails(ctx, x, y, terrainType) {
        const tileSize = this.tileSize;
        const originX = x * tileSize;
        const originY = y * tileSize;

        const rand = (min, max) => min + Math.random() * (max - min);

        switch (terrainType) {
        case this.terrainTypes.GRASS:
            if (Math.random() < 0.08) {
                ctx.fillStyle = Math.random() < 0.5 ? '#ffd700' : '#ff00ff';
                ctx.fillRect(originX + rand(3, 11), originY + rand(3, 11), 2, 2);
            }
            break;
        case this.terrainTypes.FOREST:
            if (Math.random() < 0.3) {
                const treeHeight = rand(8, 14);
                const trunkWidth = rand(2, 4);
                const trunkX = originX + tileSize / 2 - trunkWidth / 2;

                ctx.fillStyle = '#3a2c1a';
                ctx.fillRect(
                    trunkX,
                    originY + tileSize - treeHeight,
                    trunkWidth,
                    treeHeight,
                );

                ctx.fillStyle = '#1a3c2a';
                const leafSize = rand(6, 10);
                ctx.fillRect(
                    originX + tileSize / 2 - leafSize / 2,
                    originY + tileSize - treeHeight - leafSize / 2,
                    leafSize,
                    leafSize,
                );
            }
            break;
        case this.terrainTypes.WATER:
            if (Math.random() < 0.15) {
                ctx.fillStyle = '#8ac4ff';
                ctx.fillRect(originX + rand(2, 8), originY + rand(4, 10), rand(3, 6), 1);
            }
            break;
        case this.terrainTypes.STONE:
            if (Math.random() < 0.15) {
                const size = rand(3, 6);
                ctx.fillStyle = '#4a4a4a';
                ctx.fillRect(
                    originX + rand(2, 10),
                    originY + rand(2, 10),
                    size,
                    size,
                );
            }
            break;
        }
    }

    /**
     * Génère la carte à partir d'un état sauvegardé
     */
    generateFromState(state) {
        this.grid = state.grid || [];
        if (this.grid.length === 0) {
            this.generate();
        }
    }

    /**
     * Retourne l'état de la carte pour la sauvegarde
     */
    getState() {
        return {
            grid: this.grid,
            width: this.width,
            height: this.height,
        };
    }

    /**
     * Retourne le type de terrain à une position
     */
    getTerrainType(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        return this.grid[y][x];
    }

    /**
     * Met à jour une tuile
     */
    setTerrainType(x, y, type) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[y][x] = type;
        }
    }
}
