/**
 * TimeSystem - Système de gestion du temps découplé
 *
 * Caractéristiques :
 * - Temps qui s'écoule indépendamment du rendu
 * - Vitesse réglable : pause, 1x, 3x
 * - Unité : 1 journée in-game ≈ 4 minutes réelles à 1x
 * - 1 an = 4 saisons × 30 jours
 */

import { GAME_CONFIG } from '../data/config.js';

export class TimeSystem {
    constructor(scene) {
        this.scene = scene;
        this.time = {
            day: 1,
            season: 0, // 0 = printemps, 1 = été, 2 = automne, 3 = hiver
            year: 1,
        };
        this.speed = 1; // 0 = pause, 1 = 1x, 3 = 3x
        this.lastUpdate = 0;
        this.accumulator = 0;
        this.tickInterval = GAME_CONFIG.TICK_INTERVAL; // 1 seconde par tick

        // Noms des saisons
        this.seasonNames = GAME_CONFIG.SEASON_NAMES;
    }

    /**
     * Met à jour le système de temps
     * delta = temps écoulé en ms depuis le dernier update
     */
    update(delta, gameSpeed) {
        // Mettre à jour la vitesse
        this.speed = gameSpeed || this.speed;

        // Si en pause, ne rien faire
        if (this.speed === 0) return;

        // Accumuler le temps
        this.accumulator += delta * this.speed;

        // Exécuter des ticks tant qu'on a assez de temps accumulé
        while (this.accumulator >= this.tickInterval) {
            this.tick();
            this.accumulator -= this.tickInterval;
        }
    }

    /**
     * Un tick de simulation
     */
    tick() {
        this.advanceTime();

        // Déclencher des événements si nécessaire
        this.checkTimeEvents();
    }

    /**
     * Avance le temps d'un jour
     */
    advanceTime() {
        this.time.day++;

        // Changer de saison si nécessaire
        if (this.time.day > GAME_CONFIG.DAYS_PER_SEASON) {
            this.time.day = 1;
            this.time.season++;

            if (this.time.season >= GAME_CONFIG.SEASONS_PER_YEAR) {
                this.time.season = 0;
                this.time.year++;
            }
        }
    }

    /**
     * Vérifie et déclenche des événements liés au temps
     */
    checkTimeEvents() {
        // Pour l'instant, juste des notifications de changement de saison
        // Cela sera étendu dans les phases suivantes
    }

    /**
     * Définit la vitesse du temps
     */
    setSpeed(speed) {
        this.speed = speed;
    }

    /**
     * Définit le temps manuellement
     */
    setTime(day, season, year) {
        this.time.day = day || 1;
        this.time.season = season || 0;
        this.time.year = year || 1;
    }

    /**
     * Retourne le temps actuel
     */
    getCurrentTime() {
        return {
            ...this.time,
            seasonName: this.seasonNames[this.time.season],
        };
    }

    /**
     * Retourne le nom de la saison actuelle
     */
    getSeasonName() {
        return this.seasonNames[this.time.season];
    }

    /**
     * Retourne le jour actuel
     */
    getDay() {
        return this.time.day;
    }

    /**
     * Retourne la saison actuelle
     */
    getSeason() {
        return this.time.season;
    }

    /**
     * Retourne l'année actuelle
     */
    getYear() {
        return this.time.year;
    }

    /**
     * Formate la date pour l'affichage
     */
    formatDate() {
        const { day, seasonName, year } = this.getCurrentTime();
        return `Jour ${day} - ${seasonName} - Année ${year}`;
    }

    /**
     * Formate la date courte pour l'affichage
     */
    formatShortDate() {
        const { day, season, year } = this.time;
        return `J${day} S${season + 1} A${year}`;
    }
}
