/**
 * SaveSystem - Système de sauvegarde et chargement
 * 
 * Caractéristiques :
 * - Sauvegarde dans localStorage
 * - Export/import via JSON
 * - Auto-save toutes les 5 minutes et à chaque fin de session
 */

export class SaveSystem {
    constructor(scene) {
        this.scene = scene;
        this.saveKey = 'laColonieSave';
        this.lastSaveTime = 0;
        this.autoSaveInterval = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Sauvegarde l'état du jeu
     */
    save(state) {
        try {
            const saveData = this.serialize(state);
            localStorage.setItem(this.saveKey, saveData);
            this.lastSaveTime = Date.now();
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            return false;
        }
    }

    /**
     * Charge l'état du jeu
     */
    load() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (saveData) {
                return this.deserialize(saveData);
            }
            return null;
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            return null;
        }
    }

    /**
     * Sérialise l'état du jeu en JSON
     */
    serialize(state) {
        return JSON.stringify(state);
    }

    /**
     * Désérialise le JSON en état du jeu
     */
    deserialize(data) {
        return JSON.parse(data);
    }

    /**
     * Exporte l'état du jeu comme chaîne JSON
     */
    exportSave(state) {
        return this.serialize(state);
    }

    /**
     * Importe l'état du jeu depuis une chaîne JSON
     */
    importSave(data) {
        return this.deserialize(data);
    }

    /**
     * Vérifie si une sauvegarde existe
     */
    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    /**
     * Supprime la sauvegarde
     */
    deleteSave() {
        localStorage.removeItem(this.saveKey);
    }

    /**
     * Sauvegarde automatique (à appeler régulièrement)
     */
    autoSave(state) {
        const now = Date.now();
        if (now - this.lastSaveTime >= this.autoSaveInterval) {
            return this.save(state);
        }
        return false;
    }

    /**
     * Sauvegarde à la fin de la session
     */
    saveOnExit(state) {
        // Sauvegarder avant de quitter
        this.save(state);
    }

    /**
     * Génère un code de sauvegarde exportable
     */
    generateExportCode(state) {
        const data = this.serialize(state);
        // Compresser légèrement en base64
        return btoa(encodeURIComponent(data));
    }

    /**
     * Importe depuis un code de sauvegarde
     */
    importFromCode(code) {
        try {
            const data = decodeURIComponent(atob(code));
            return this.deserialize(data);
        } catch (error) {
            console.error('Code de sauvegarde invalide:', error);
            return null;
        }
    }
}
