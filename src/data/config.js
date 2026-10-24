/**
 * config.js - Configuration du jeu
 * 
 * Constantes et paramètres globaux
 */

export const GAME_CONFIG = {
    // Dimensions
    MAP_WIDTH: 128,
    MAP_HEIGHT: 128,
    TILE_SIZE: 16,
    
    // Temps
    TICK_INTERVAL: 1000, // 1 seconde par tick
    DAYS_PER_SEASON: 30,
    SEASONS_PER_YEAR: 4,
    REAL_TIME_PER_DAY: 4 * 60 * 1000, // 4 minutes par jour à 1x
    
    // Vitesse du jeu
    SPEED_PAUSED: 0,
    SPEED_NORMAL: 1,
    SPEED_FAST: 3,
    
    // Caméra
    MIN_ZOOM: 1,
    MAX_ZOOM: 3,
    DEFAULT_ZOOM: 2,
    
    // Biomes
    TERRAIN_TYPES: {
        GRASS: 0,
        FOREST: 1,
        WATER: 2,
        STONE: 3
    },
    
    // Noms des saisons
    SEASON_NAMES: ['Printemps', 'Été', 'Automne', 'Hiver']
};

export default GAME_CONFIG;
