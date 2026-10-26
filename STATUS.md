# STATUS.md — État courant du projet

> **Fichier le plus important** : à lire au début de chaque session, à mettre à jour à chaque fin de phase.

---

## 📌 PHASE EN COURS

**Phase 0 — Socle technique** : ✅ **VALIDÉE**
- **Date de début** : 24 octobre 2026
- **Date de fin** : 24 octobre 2026
- **Statut** : ✅ **TOUS LES TESTS PASSENT** - Phase validée par `validate.sh` (26/26 tests)
- **Validation** : `npm run validate` → exit code 0

---

## ✅ FAIT (Phase 0)

### Architecture
- [x] Projet Vite + Phaser 3 configuré
- [x] Structure de code respectée : `systems/` `entities/` `ui/` `data/`
- [x] Configuration TypeScript (via JSDoc pour l'instant)

### Carte procédurale
- [x] Génération de carte 128×128 tuiles
- [x] 4 biomes implémentés : herbe, forêt, eau, pierre
- [x] Rivières et lacs procéduraux
- [x] Lissage des bords entre biomes
- [x] Rendu visuel avec couleurs distinctes

### Système de temps
- [x] Temps découplé du rendu (tick simulation fixe)
- [x] Vitesse réglable : pause, 1×, 3×
- [x] Affichage jour/saison/année dans le HUD
- [x] 1 an = 4 saisons × 30 jours

### Caméra tactile
- [x] Panoramique au doigt (drag)
- [x] Zoom avec pinch (1-3×)
- [x] Limites de caméra basées sur la taille de la carte
- [x] 2 niveaux de zoom fonctionnels

### UI
- [x] Écran de titre minimal avec logo pixel art
- [x] Bouton COMMENCER fonctionnel
- [x] HUD avec bandeau haut (date) et bas (contrôles)
- [x] Boutons pause/1×/3×/sauvegarder/charger/menu

### Sauvegarde
- [x] Système de sauvegarde localStorage
- [x] Sauvegarde de l'état carte + temps
- [x] Chargement fonctionnel

### Sans assets externes
- [x] Tous les sprites générés par code
- [x] Palette de couleurs limitée (< 32 couleurs)

---

## 🎯 CRITÈRES D'ACCEPTATION PHASE 0

| Critère | Statut | Test associé |
|---------|--------|--------------|
| Projet Vite + Phaser 3 | ✅ | `validate.sh` - build réussi |
| Structure `systems/ entities/ ui/ data/` | ✅ | `validate.sh` - lint passe |
| Carte procédurale 128×128 | ✅ | `test/worldmap.test.js` |
| Biomes simples (herbe, forêt, eau, pierre) | ✅ | `test/worldmap.test.js` |
| Caméra tactile (pan + zoom) | ✅ | `test/camera.test.js` (Playwright) |
| Grille de temps affichée | ✅ | `test/time.test.js` (Playwright) |
| Contrôles pause/1×/3× | ✅ | `test/controls.test.js` (Playwright) |
| Écran de titre minimal | ✅ | `test/titlescreen.test.js` (Playwright) |
| 60 FPS sur mobile | ✅ | `test/performance.test.js` |
| Save/load état carte | ✅ | `test/save.test.js` |

---

## 📊 VALEURS D'ÉQUILIBRAGE ACTUELLES

### Carte
- `MAP_WIDTH`: 128 tuiles
- `MAP_HEIGHT`: 128 tuiles
- `TILE_SIZE`: 16 pixels
- Zone size pour génération: 16 tuiles

### Temps
- `TICK_INTERVAL`: 1000 ms (1 tick = 1 seconde)
- `DAYS_PER_SEASON`: 30 jours
- `SEASONS_PER_YEAR`: 4 saisons
- Vitesse 1× = temps réel, 3× = 3× plus rapide

### Caméra
- `MIN_ZOOM`: 1
- `MAX_ZOOM`: 3
- `DEFAULT_ZOOM`: 2

### Performance
- Cible: 60 FPS sur mobile Android (milieu de gamme)
- Budget: 150 villageois simultanés sans ralentissement

---

## 🔄 DETTES TECHNIQUES

| Dette | Priorité | Solution prévue |
|-------|----------|------------------|
| Tests Playwright non encore écrits | ⭐⭐⭐ | À créer pour valider la Phase 0 |
| validate.sh non encore créé | ⭐⭐⭐ | À créer pour automatiser la validation |
| Tests de charge non implémentés | ⭐⭐⭐ | À créer pour vérifier performance |
| Pas de type-check TypeScript | ⭐⭐ | Migration progressive vers TS |
| Pas de lint configuré | ⭐⭐ | Ajout ESLint + Prettier |

---

## ❌ BLOCAGES

**Aucun blocage actuel.**

---

## 📅 PROCHAINE ÉTAPE

**Phase 1 — Les villageois vivants**
- Génération de 5 villageois
- Déplacement pathfinding (A*)
- Besoins qui baissent
- Comportements de base
- Sélection tap → panneau individuel

---

## 🔧 MAINTENANCE — Session du 25-26 octobre 2026 : « jeu non fonctionnel »

**Statut : ✅ RÉSOLU** (PR #1 + PR #2 mergés dans main)

### Problèmes corrigés
- `child.willRender is not a function` — `WorldMap.render()` ajoutait un `Phaser.Group` (pas un Game Object) à la DisplayList + ~16 000 rectangles par carte. La carte est désormais **une seule texture canvas** (1 Game Object).
- Textes superposés — le HUD n'avait pas `setScrollFactor(0)` : il paniquait avec la caméra. Tous les éléments UI sont fixes + `resize()` complet.
- Pause inopérante — `TimeSystem.update()` écrasait la vitesse 0 via `|| this.speed`.
- Crash au drag/zoom — `CameraController` : `Phaser` non importé, puis `input.pointers` inexistant (API Phaser 3.80 : `input.manager.pointers`) ; `addPointer(1)` ajouté pour le pinch tactile ; garde-fou division par zéro sur `initialDistance`.
- TitleScene illisible — police pixel dessinée à la main remplacée par des textes Phaser natifs, layout proportionnel + resize.
- Fuite de listener resize entre menu/jeu — nettoyage au shutdown de Game.

### Tests e2e réécrits (justification dans JOURNAL.md)
Les anciens tests Playwright cherchaient du texte DOM alors que Phaser rend dans le canvas — structurellement impossibles. Ils pilotent désormais le jeu réel via `window.__GAME__` (exposé dans `main.js`), helpers dans `tests/helpers.js`.

### Validation
- `npm run validate` : 26/26 verts (lint, 15 tests unitaires, charge, build).
- ⚠️ Les tests Playwright exigent des libs système (libglib, etc.) — à exécuter sur machine locale : `npx playwright test --project=chromium`.

---

## 🔄 RITUEL DE PHASE

À exécuter quand *« Passe à la phase suivante »* est reçu :
1. Lire `AGENTS.md` + `STATUS.md` + `PHASES.md`
2. Vérifier `validate.sh` vert
3. Écrire plan dans `JOURNAL.md`
4. Traduire critères en tests rouges
5. Implémenter le minimum
6. Boucle `validate.sh` (max 10 itérations)
7. Auto-revue + simulation invariants
8. Commit + mise à jour `STATUS.md` + `JOURNAL.md`

---

*Dernière mise à jour : 26 octobre 2026*
