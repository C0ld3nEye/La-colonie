# PHASES.md — Phases de développement

> **Cahier des charges décomposé en phases** avec critères d'acceptation et tests associés.
> *Chaque critère est annoté du nom du test qui le vérifie.*

---

## 📋 LÉGENDE

| Symbole | Signification |
|---------|---------------|
| ✅ | Critère implémenté et testé |
| ⏳ | Critère à implémenter |
| 🔴 | Critère en échec |
| 📝 | Test écrit mais non implémenté |

---

## Phase 0 — Socle technique ✅ **VALIDÉE**

### Architecture
| Critère | Test | Statut |
|---------|------|--------|
| Projet Vite + Phaser 3 | `validate.sh` - build réussi | ✅ |
| Structure `systems/ entities/ ui/ data/` | `validate.sh` - lint passe | ✅ |
| Code propre et commenté en français | `validate.sh` - lint passe | ✅ |

### Carte procédurale
| Critère | Test | Statut |
|---------|------|--------|
| Carte 128×128 tuiles | `test/worldmap.test.js` - `testMapDimensions` | ✅ |
| Biomes : herbe, forêt, eau, pierre | `test/worldmap.test.js` - `testBiomeGeneration` | ✅ |
| Génération procédurale cohérente | `test/worldmap.test.js` - `testProceduralGeneration` | ✅ |
| Rivières et lacs | `test/worldmap.test.js` - `testRiversAndLakes` | ✅ |
| Rendu visuel sans assets externes | `test/worldmap.test.js` - `testVisualRendering` | ✅ |

### Système de temps
| Critère | Test | Statut |
|---------|------|--------|
| Temps découplé du rendu | `test/time.test.js` - `testDecoupledTime` | ✅ |
| Vitesse réglable (pause/1×/3×) | `test/time.test.js` - `testTimeSpeed` | ✅ |
| Affichage jour/saison/année | `test/time.test.js` - `testTimeDisplay` (Playwright) | ✅ |
| 1 an = 4 saisons × 30 jours | `test/time.test.js` - `testSeasonCycle` | ✅ |

### Caméra tactile
| Critère | Test | Statut |
|---------|------|--------|
| Panoramique au doigt (drag) | `test/camera.test.js` - `testPan` (Playwright) | ✅ |
| Zoom avec pinch | `test/camera.test.js` - `testZoom` (Playwright) | ✅ |
| Limites de caméra | `test/camera.test.js` - `testCameraBounds` | ✅ |
| 2 niveaux de zoom (1x, 2x, 3x) | `test/camera.test.js` - `testZoomLevels` | ✅ |

### UI
| Critère | Test | Statut |
|---------|------|--------|
| Écran de titre minimal | `test/titlescreen.test.js` - `testTitleScreen` (Playwright) | ✅ |
| Bouton COMMENCER | `test/titlescreen.test.js` - `testStartButton` (Playwright) | ✅ |
| HUD avec date/saison | `test/hud.test.js` - `testHUDDate` (Playwright) | ✅ |
| Boutons pause/1×/3× | `test/controls.test.js` - `testControls` (Playwright) | ✅ |
| Notifications empilables | `test/hud.test.js` - `testNotifications` | ✅ |

### Sauvegarde
| Critère | Test | Statut |
|---------|------|--------|
| Save/load état carte | `test/save.test.js` - `testSaveLoad` | ✅ |
| localStorage fonctionnel | `test/save.test.js` - `testLocalStorage` | ✅ |

### Performance
| Critère | Test | Statut |
|---------|------|--------|
| 60 FPS sur mobile | `test/performance.test.js` - `testFPS` | ✅ |
| Pas d'écran blanc | `test/smoke.test.js` - `testNoBlankScreen` (Playwright) | ✅ |

---

## Phase 1 — Les villageois vivants ⏳

### Génération
| Critère | Test | Statut |
|---------|------|--------|
| Génération de 5 villageois | `test/villagers.test.js` - `testVillagerGeneration` | ⏳ |
| Identités (prénom, âge, sexe) | `test/villagers.test.js` - `testVillagerIdentity` | ⏳ |
| Apparence (sprite modulaire) | `test/villagers.test.js` - `testVillagerAppearance` | ⏳ |
| 5 compétences (0-20) | `test/villagers.test.js` - `testVillagerSkills` | ⏳ |
| 3-4 traits de caractère | `test/villagers.test.js` - `testVillagerTraits` | ⏳ |

### Comportements
| Critère | Test | Statut |
|---------|------|--------|
| Déplacement pathfinding (A*) | `test/pathfinding.test.js` - `testPathfinding` | ⏳ |
| Besoins qui baissent (faim, repos) | `test/needs.test.js` - `testNeedsDecrease` | ⏳ |
| Comportement : manger quand affamé | `test/behavior.test.js` - `testEatWhenHungry` | ⏳ |
| Comportement : dormir au camp | `test/behavior.test.js` - `testSleepAtCamp` | ⏳ |

### UI
| Critère | Test | Statut |
|---------|------|--------|
| Sélection tap → panneau individuel | `test/ui.test.js` - `testVillagerSelection` (Playwright) | ⏳ |
| Panneau montre stats + traits | `test/ui.test.js` - `testVillagerPanel` (Playwright) | ⏳ |
| Notifications besoins critiques | `test/ui.test.js` - `testNeedNotifications` | ⏳ |

### Performance
| Critère | Test | Statut |
|---------|------|--------|
| 20 villageois simulés sans chute FPS | `test/performance.test.js` - `test20VillagersFPS` | ⏳ |

---

## Phase 2 — Récolte, production, construction ⏳

### Ressources
| Critère | Test | Statut |
|---------|------|--------|
| Ressources de base (baies, viande, bois, etc.) | `test/resources.test.js` - `testBaseResources` | ⏳ |
| Ordres de récolte | `test/harvest.test.js` - `testHarvestOrders` | ⏳ |
| Désignation de zones | `test/harvest.test.js` - `testZoneDesignation` | ⏳ |

### Construction
| Critère | Test | Statut |
|---------|------|--------|
| Chantiers de construction | `test/construction.test.js` - `testConstruction` | ⏳ |
| Feu, grenier, hutte, séchoir | `test/construction.test.js` - `testBuildings` | ⏳ |
| Stocks avec capacité | `test/storage.test.js` - `testStorageCapacity` | ⏳ |

### Chaînes de production
| Critère | Test | Statut |
|---------|------|--------|
| Viande → séchage | `test/production.test.js` - `testMeatDrying` | ⏳ |
| Silex → outils | `test/production.test.js` - `testFlintTools` | ⏳ |
| Écran "Ressources" récapitulatif | `test/ui.test.js` - `testResourcesScreen` | ⏳ |

### Tensions
| Critère | Test | Statut |
|---------|------|--------|
| Viande pourrit en 3 jours | `test/food.test.js` - `testMeatSpoilage` | ⏳ |
| Signaux de crise (paliers 1-2) | `test/crisis.test.js` - `testCrisisSignals` | ⏳ |

---

## Phase 3 — Individus profonds et mort permanente ⏳

### Cycle de vie
| Critère | Test | Statut |
|---------|------|--------|
| Vieillissement réel | `test/lifecycle.test.js` - `testAging` | ⏳ |
| Enfants, adultes, anciens | `test/lifecycle.test.js` - `testLifeStages` | ⏳ |
| Grossesse et naissances | `test/lifecycle.test.js` - `testPregnancy` | ⏳ |

### Santé
| Critère | Test | Statut |
|---------|------|--------|
| HP globaux + états | `test/health.test.js` - `testHealth` | ⏳ |
| Blessures → infection → mort | `test/health.test.js` - `testInfection` | ⏳ |
| Infirmités permanentes | `test/health.test.js` - `testPermanentDisability` | ⏳ |

### Relations
| Critère | Test | Statut |
|---------|------|--------|
| Liens familiaux | `test/relations.test.js` - `testFamilyLinks` | ⏳ |
| Amitiés et inimitiés | `test/relations.test.js` - `testRelationships` | ⏳ |
| Deuil (chute de moral) | `test/relations.test.js` - `testGrief` | ⏳ |

### Mémorial
| Critère | Test | Statut |
|---------|------|--------|
| Mémorial des morts | `test/memorial.test.js` - `testMemorial` | ⏳ |
| Histoire visible en 2 taps | `test/memorial.test.js` - `testHistoryDisplay` | ⏳ |

### Performance
| Critère | Test | Statut |
|---------|------|--------|
| Lignée visible sur 3 générations | `test/lifecycle.test.js` - `testThreeGenerations` | ⏳ |

---

## Phase 4 — Saisons, faune et pression écologique ⏳

### Environnement
| Critère | Test | Statut |
|---------|------|--------|
| 4 saisons | `test/seasons.test.js` - `testSeasons` | ⏳ |
| Météo (pluie, neige, etc.) | `test/weather.test.js` - `testWeather` | ⏳ |
| Hiver meurtrier (froid) | `test/seasons.test.js` - `testWinter` | ⏳ |

### Faune
| Critère | Test | Statut |
|---------|------|--------|
| Proies migratrices | `test/fauna.test.js` - `testMigrations` | ⏳ |
| Prédateurs | `test/fauna.test.js` - `testPredators` | ⏳ |
| Surexploitation des zones | `test/fauna.test.js` - `testOverhunting` | ⏳ |

### Survival
| Critère | Test | Statut |
|---------|------|--------|
| Vêtements | `test/items.test.js` - `testClothing` | ⏳ |
| Feux à maintenir | `test/items.test.js` - `testFire` | ⏳ |
| Rationnement | `test/food.test.js` - `testRationing` | ⏳ |

### Invariants
| Critère | Test | Statut |
|---------|------|--------|
| Premier hiver bien préparé se survit | `test/seasons.test.js` - `testSurvivePreparedWinter` | ⏳ |
| Hiver improvisé fait des morts | `test/seasons.test.js` - `testMortsImprovisedWinter` | ⏳ |
| Alertes reçues en amont | `test/crisis.test.js` - `testWinterAlerts` | ⏳ |

---

## Phase 5 — Événements et dilemmes ⏳

### Framework
| Critère | Test | Statut |
|---------|------|--------|
| Événements pondérés par contexte | `test/events.test.js` - `testEventWeighting` | ⏳ |
| 15 dilemmes écrits | `test/events.test.js` - `testDilemmas` | ⏳ |
| Pause automatique | `test/events.test.js` - `testAutoPause` | ⏳ |

### Conséquences
| Critère | Test | Statut |
|---------|------|--------|
| Effet immédiat + suite différée | `test/events.test.js` - `testConsequences` | ⏳ |
| Conséquences persistantes | `test/events.test.js` - `testPersistentConsequences` | ⏳ |
| Aucune répétition < 30 jours | `test/events.test.js` - `testNoRepeat` | ⏳ |

### Chronique
| Critère | Test | Statut |
|---------|------|--------|
| Chronique retrace fidèlement | `test/chronicle.test.js` - `testChronicle` | ⏳ |

---

## Phase 6 — Ères et progression longue ⏳

### Savoir
| Critère | Test | Statut |
|---------|------|--------|
| Système de Savoir | `test/knowledge.test.js` - `testKnowledge` | ⏳ |
| Découvertes | `test/knowledge.test.js` - `testDiscoveries` | ⏳ |
| Ères (Paléolithique → Néolithique) | `test/knowledge.test.js` - `testEras` | ⏳ |

### Progression
| Critère | Test | Statut |
|---------|------|--------|
| Agriculture, domestication, poterie | `test/progression.test.js` - `testTechnologies` | ⏳ |
| Jalons narratifs | `test/progression.test.js` - `testMilestones` | ⏳ |

### Invariants
| Critère | Test | Statut |
|---------|------|--------|
| Partie test atteint Néolithique en ~4h | `test/progression.test.js` - `testReachNeolithic` | ⏳ |
| Chaque découverte modifie options | `test/progression.test.js` - `testDiscoveryImpact` | ⏳ |

---

## Phase 7 — Finalisation ⏳

### PWA
| Critère | Test | Statut |
|---------|------|--------|
| Offline fonctionnel | `test/pwa.test.js` - `testOffline` | ⏳ |
| Installation écran d'accueil | `test/pwa.test.js` - `testInstall` | ⏳ |

### Sauvegarde
| Critère | Test | Statut |
|---------|------|--------|
| Auto-save 5 min + fin de session | `test/save.test.js` - `testAutoSave` | ⏳ |
| Export/import JSON | `test/save.test.js` - `testExportImport` | ⏳ |
| Reprise après fermeture brutale | `test/save.test.js` - `testCrashRecovery` | ⏳ |

### UX
| Critère | Test | Statut |
|---------|------|--------|
| Tutoriel guidé 3 premiers jours | `test/tutorial.test.js` - `testTutorial` | ⏳ |
| Modes de difficulté | `test/difficulty.test.js` - `testDifficulty` | ⏳ |
| Fin de campagne | `test/endgame.test.js` - `testEndgame` | ⏳ |

---

## 📊 RÉCAPITULATIF

| Phase | Statut | Tests | Couverture |
|-------|--------|-------|------------|
| 0 | ✅ VALIDÉE | 15+ | 100% |
| 1 | ⏳ | 10+ | 0% |
| 2 | ⏳ | 12+ | 0% |
| 3 | ⏳ | 10+ | 0% |
| 4 | ⏳ | 10+ | 0% |
| 5 | ⏳ | 8+ | 0% |
| 6 | ⏳ | 6+ | 0% |
| 7 | ⏳ | 8+ | 0% |

---

*Dernière mise à jour : 24 octobre 2026*
