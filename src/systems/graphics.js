/**
 * graphics.js - Génération de sprites et assets par code
 *
 * Tous les visuels sont générés programmatiquement sans assets externes.
 * Style : pixel art 16x16, palette limitée (< 32 couleurs)
 */

// Palette de couleurs limitée pour le style préhistorique
const PALETTE = {
    // Couleurs de base
    transparent: 0x00000000,
    black: 0x000000,
    white: 0xffffff,

    // Terrain
    grassLight: 0x4a7c59,
    grassDark: 0x2a5c3a,
    forest: 0x1a3c2a,
    water: 0x1a3c7c,
    waterLight: 0x8ac4ff,
    stone: 0x6a6a6a,
    stoneDark: 0x4a4a4a,
    sand: 0xc4a882,

    // Personnages
    skinLight: 0xffd7af,
    skinMedium: 0xd4a574,
    skinDark: 0x8b5a2b,
    hairBlack: 0x1a1a1a,
    hairBrown: 0x4a2c1a,
    hairRed: 0x8b2613,
    hairBlonde: 0xffd700,

    // Vêtements
    clothBrown: 0x5a3e2b,
    clothRed: 0x8b2613,
    clothBlue: 0x1a3c7c,
    clothGreen: 0x2a5c3a,

    // UI
    uiBackground: 0x2a1e12,
    uiBorder: 0xd4652b,
    uiText: 0xffd700,
    uiTextDim: 0xc4a882,

    // Effets
    fireOrange: 0xff6600,
    fireYellow: 0xffcc00,
    fireRed: 0xcc3300,
    smokeGray: 0x666666,
};

/**
 * Dessine un personnage en pixel art 16x16
 */
export function drawVillager(ctx, options = {}) {
    const {
        skin = PALETTE.skinMedium,
        hair = PALETTE.hairBrown,
        cloth = PALETTE.clothBrown,
        direction = 'south',
        frame = 0,
    } = options;

    // Corps (8x16)
    ctx.fillStyle = `#${skin.toString(16).padStart(6, '0')}`;
    ctx.fillRect(4, 0, 8, 16);

    // Tête (8x8)
    ctx.fillStyle = `#${skin.toString(16).padStart(6, '0')}`;
    ctx.fillRect(4, 0, 8, 8);

    // Cheveux
    ctx.fillStyle = `#${hair.toString(16).padStart(6, '0')}`;

    // Selon la direction
    switch (direction) {
    case 'south':
        // Cheveux sur le dessus
        ctx.fillRect(4, 0, 8, 2);
        // Yeux
        ctx.fillStyle = `#${PALETTE.black.toString(16).padStart(6, '0')}`;
        ctx.fillRect(6, 3, 2, 1);
        ctx.fillRect(8, 3, 2, 1);
        // Bouche
        ctx.fillRect(7, 5, 2, 1);
        // Vêtement
        ctx.fillStyle = `#${cloth.toString(16).padStart(6, '0')}`;
        ctx.fillRect(4, 8, 8, 8);
        break;
    case 'north':
        // Cheveux en bas de la tête
        ctx.fillRect(4, 6, 8, 2);
        // Yeux
        ctx.fillStyle = `#${PALETTE.black.toString(16).padStart(6, '0')}`;
        ctx.fillRect(6, 3, 2, 1);
        ctx.fillRect(8, 3, 2, 1);
        // Vêtement
        ctx.fillStyle = `#${cloth.toString(16).padStart(6, '0')}`;
        ctx.fillRect(4, 8, 8, 8);
        break;
    case 'east':
        // Cheveux à gauche
        ctx.fillRect(4, 0, 2, 8);
        // Yeux
        ctx.fillStyle = `#${PALETTE.black.toString(16).padStart(6, '0')}`;
        ctx.fillRect(7, 3, 1, 2);
        ctx.fillRect(9, 3, 1, 2);
        // Vêtement
        ctx.fillStyle = `#${cloth.toString(16).padStart(6, '0')}`;
        ctx.fillRect(4, 8, 8, 8);
        break;
    case 'west':
        // Cheveux à droite
        ctx.fillRect(10, 0, 2, 8);
        // Yeux
        ctx.fillStyle = `#${PALETTE.black.toString(16).padStart(6, '0')}`;
        ctx.fillRect(5, 3, 1, 2);
        ctx.fillRect(7, 3, 1, 2);
        // Vêtement
        ctx.fillStyle = `#${cloth.toString(16).padStart(6, '0')}`;
        ctx.fillRect(4, 8, 8, 8);
        break;
    }
}

/**
 * Dessine un arbre en pixel art 16x16
 */
export function drawTree(ctx, variant = 0) {
    // Tronc
    ctx.fillStyle = `#${PALETTE.hairBrown.toString(16).padStart(6, '0')}`;
    ctx.fillRect(7, 8, 2, 8);

    // Feuillage
    ctx.fillStyle = `#${PALETTE.forest.toString(16).padStart(6, '0')}`;

    switch (variant) {
    case 0: // Arbre rond
        ctx.fillRect(4, 4, 8, 4);
        ctx.fillRect(5, 3, 6, 1);
        ctx.fillRect(6, 2, 4, 1);
        break;
    case 1: // Arbre pointu
        ctx.fillRect(6, 2, 4, 6);
        ctx.fillRect(5, 3, 2, 4);
        ctx.fillRect(9, 3, 2, 4);
        break;
    case 2: // Arbre large
        ctx.fillRect(3, 5, 10, 3);
        ctx.fillRect(4, 4, 8, 1);
        ctx.fillRect(5, 3, 6, 1);
        break;
    }
}

/**
 * Dessine un rocher en pixel art 16x16
 */
export function drawStone(ctx) {
    ctx.fillStyle = `#${PALETTE.stone.toString(16).padStart(6, '0')}`;

    // Forme irrégulière
    ctx.fillRect(2, 2, 12, 12);

    // Ombre
    ctx.fillStyle = `#${PALETTE.stoneDark.toString(16).padStart(6, '0')}`;
    ctx.fillRect(4, 4, 8, 2);
    ctx.fillRect(6, 6, 4, 2);

    // Reflet
    ctx.fillStyle = `#${PALETTE.sand.toString(16).padStart(6, '0')}`;
    ctx.fillRect(3, 3, 2, 1);
    ctx.fillRect(11, 5, 2, 1);
}

/**
 * Dessine de l'eau en pixel art 16x16
 */
export function drawWater(ctx, waveFrame = 0) {
    ctx.fillStyle = `#${PALETTE.water.toString(16).padStart(6, '0')}`;
    ctx.fillRect(0, 0, 16, 16);

    // Animation d'ondes
    ctx.fillStyle = `#${PALETTE.waterLight.toString(16).padStart(6, '0')}`;

    const waves = [
        [0, 2, 4, 6, 8, 10, 12, 14],
        [2, 4, 6, 8, 10, 12, 14, 0],
        [4, 6, 8, 10, 12, 14, 0, 2],
    ];

    const frameWaves = waves[waveFrame % waves.length];
    frameWaves.forEach(col => {
        ctx.fillRect(col, 4 + (waveFrame % 2), 2, 1);
    });
}

/**
 * Dessine un feu en pixel art 16x16
 */
export function drawFire(ctx, frame = 0) {
    const frames = [
        // Frame 0
        [
            { x: 6, y: 10, w: 4, h: 2, color: PALETTE.fireRed },
            { x: 5, y: 8, w: 6, h: 2, color: PALETTE.fireOrange },
            { x: 6, y: 6, w: 4, h: 2, color: PALETTE.fireYellow },
        ],
        // Frame 1
        [
            { x: 5, y: 10, w: 6, h: 2, color: PALETTE.fireRed },
            { x: 4, y: 8, w: 8, h: 2, color: PALETTE.fireOrange },
            { x: 5, y: 6, w: 6, h: 2, color: PALETTE.fireYellow },
        ],
        // Frame 2
        [
            { x: 6, y: 10, w: 4, h: 2, color: PALETTE.fireRed },
            { x: 5, y: 8, w: 6, h: 2, color: PALETTE.fireOrange },
            { x: 6, y: 5, w: 4, h: 3, color: PALETTE.fireYellow },
        ],
    ];

    const currentFrame = frames[frame % frames.length];

    currentFrame.forEach(rect => {
        ctx.fillStyle = `#${rect.color.toString(16).padStart(6, '0')}`;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    });
}

/**
 * Palette de couleurs
 */
export { PALETTE };
