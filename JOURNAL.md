# JOURNAL.md — Journal de bord du développement

> **Journal de bord** : ce qui a été livré, simplifié, corrigé. À mettre à jour à chaque fin de phase.
> *L'humain peut lire ce fichier pour suivre sans intervenir.*

---

## 📅 24 Octobre 2026 — Phase 0 : Socle technique

### ✅ Livré

**Architecture complète** :
- Projet **Vite 5.4.21 + Phaser 3.80.1** configuré et fonctionnel
- Structure de code respectée : `systems/` `entities/` `ui/` `data/` `scenes/`
- Configuration optimisée pour mobile Android

**Carte procédurale 128×128** :
- Génération par zones cohérentes (16×16 tuiles)
- 4 biomes : herbe (vert #4a7c59), forêt (vert foncé #2a5c3a), eau (bleu #1a3c7c), pierre (gris #6a6a6a)
- Rivières sinueuses et lacs circulaires générés aléatoirement
- Lissage des bords entre biomes pour un rendu naturel
- Rendu visuel avec détails : arbres, rochers, reflets d'eau

**Système de temps découplé** :
- Tick simulation fixe à 1 seconde (1000ms)
- Vitesse réglable : pause (0), 1× (normal), 3× (rapide)
- Cycle complet : 1 an = 4 saisons × 30 jours
- Affichage HUD : "Jour X - Saison - Année Y"

**Caméra tactile** :
- Panoramique au doigt (drag) avec suivi fluide
- Zoom avec pinch (2 doigts) de 1× à 3×
- Limites de caméra basées sur la taille de la carte (2048×2048 pixels)
- Centrage automatique au démarrage

**UI complète** :
- Écran de titre avec logo "LA COLONIE - LES PREMIERS FEUX" en pixel art
- Bouton COMMENCER fonctionnel
- HUD avec bandeau haut (date) et bas (contrôles)
- Boutons : ⏸️ Pause/Play, 1×, 3×, 💾 Sauvegarder, 📂 Charger, ⏏️ Menu
- Notifications basiques (non empilées pour l'instant)

**Sauvegarde** :
- Système localStorage fonctionnel
- Sauvegarde de l'état : carte + temps + vitesse
- Chargement et reprise corrects

**Sans assets externes** :
- Tous les sprites générés par code via `graphics.js`
- Palette limitée à ~20 couleurs (style préhistorique)
- Formes géométriques pour arbres, rochers, eau

### 🔧 Simplifications

1. **Carte** : Génération par zones plutôt que bruit de Perlin pur (plus simple, plus cohérent)
2. **Sprites** : Rectangles colorés + formes géométriques plutôt que vrai pixel art 16×16 (sera amélioré en Phase 1)
3. **HUD** : Notifications non empilées (implémentation simplifiée)
4. **Sauvegarde** : Seule la carte et le temps sont sauvegardés (les villageois viendront en Phase 1)
5. **Performance** : Pas encore de batch rendering ou LOD (optimisations prévues pour Phase 1+)

### 🧪 Tests

**À créer pour valider complètement la Phase 0** :
- [ ] `validate.sh` — Script de validation complet (lint + type-check + tests + build)
- [ ] Tests Vitest pour la logique (WorldMap, TimeSystem, etc.)
- [ ] Tests Playwright headless pour le rendu et l'UI
- [ ] Tests de charge pour 150 entités
- [ ] Tests de performance (60 FPS)

### 📊 Métriques

- **Taille du build** : ~20 Ko (JS) + 0.9 Ko (HTML)
- **Temps de build** : ~150 ms
- **Lignes de code** : ~2 200 lignes (14 fichiers)
- **FPS ciblés** : 60 FPS sur mobile Android (à valider)

---

## 🎯 Prochaine étape : Phase 1

**Objectif** : Les villageois vivants
- Génération de 5 villageois avec identités
- Déplacement pathfinding (A*)
- Système de besoins (faim, repos, moral)
- Comportements automatiques
- Sélection et panneau individuel

---

## 📝 Notes techniques

### Structure des fichiers
```
la-colonie/
├── AGENTS.md          # Mémoire du projet (VERROUILLÉ)
├── PROTOCOLE.md       # Protocole de développement
├── STATUS.md          # État courant
├── PHASES.md          # Phases et critères
├── JOURNAL.md         # Journal de bord
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js
    ├── data/
    │   └── config.js
    ├── scenes/
    │   ├── TitleScene.js
    │   └── Game.js
    ├── systems/
    │   ├── WorldMap.js
    │   ├── TimeSystem.js
    │   ├── CameraController.js
    │   ├── SaveSystem.js
    │   └── graphics.js
    └── ui/
        └── HUD.js
```

### Conventions de code
- **Commentaires en français** obligatoires
- **Noms de fichiers** : kebab-case (`world-map.js`)
- **Noms de classes** : PascalCase (`WorldMap`)
- **Noms de méthodes** : camelCase (`generateMap`)
- **Constantes** : UPPER_SNAKE_CASE (`MAP_WIDTH`)

### Outils utilisés
- **Phaser 3.80.1** — Moteur 2D
- **Vite 5.4.21** — Bundler
- **ESLint** — À configurer (Phase 0)
- **Vitest** — À configurer (Phase 0)
- **Playwright** — À configurer (Phase 0)

---

*Dernière mise à jour : 24 octobre 2026*
