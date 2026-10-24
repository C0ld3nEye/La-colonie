# AGENTS.md — Tribu : Les Premiers Feux

> **Ce fichier est ta mémoire de projet.** Il est relu automatiquement au début de chaque session. Une section est verrouillée (identité du projet), une section est la tienne à mettre à jour (suivi d'avancement).

---

## 🪨 IDENTITÉ DU PROJET — SECTION VERROUILLÉE

> ⚠️ **Ne jamais supprimer, réécrire ou modifier cette section**, sauf instruction explicite de l'utilisateur. C'est la référence d'origine du projet : en cas de doute d'arbitrage, c'est ici qu'on revient.

**Jeu** : *Tribu — Les Premiers Feux* (titre de travail)
**Nature** : jeu de gestion / simulation de colonie préhistorique, pixel art léger, mobile-first.
**Concept** : une poignée d'humains débarque nus, affamés et sans rien dans une vallée sauvage. Le joueur les guide sur **une campagne unique et persistante**, de l'errance paléolithique jusqu'à un village néolithique structuré. Pas de partie courte, pas de reset : chaque décision laisse une trace définitive.

**Les 4 piliers de design** (ordre de priorité en cas d'arbitrage) :
1. **Profondeur systémique** : les systèmes (faim, climat, faune, production, relations) interagissent sans script ; les problèmes émergent des règles.
2. **Décisions décisives** : chaque choix a des conséquences réelles, durables et visibles ; jamais de choix cosmétique.
3. **Exigeant mais rattrapable** : crises graves possibles, mais signaux d'alerte en amont et mécanismes de récupération ; pas de mort subite injuste.
4. **Lisible sur mobile** : pixel art 16px, interface tactile, une information à la fois, sessions courtes mais campagne infinie.

**Inspirations** : RimWorld (simulation systémique), Dawn of Man (ère préhistorique), FTL (dilemmes), Kingdom (esthétique sobre).

**Références complètes** : cahier des charges (vision, systèmes détaillés, phases 0-7, critères d'acceptation) + protocole de développement autonome (rituel de phase, tests, garde-fous).

---

## ⚙️ RÈGLES STABLES DE DÉVELOPPEMENT

1. **Structure de code** : `systems/` `entities/` `ui/` `data/`.
2. **Architecture** : tick de simulation fixe (~10/s) découplé du rendu (60 FPS).
3. **Aucun asset externe** : tous les sprites générés en code ; palette ≤ 32 couleurs ; animations 2-4 frames.
4. **Équilibrage dans les fichiers data** (JSON/TS séparés) — jamais codé en dur dans le moteur.
5. **TDD strict** : chaque critère d'acceptation est traduit en test AVANT d'implémenter ; une phase est validée uniquement par `validate.sh` vert.
6. **Jamais tricher un test** : si un test doit changer, justification écrite dans `JOURNAL.md`.
7. **Une phase = un état jouable et testable** : pas d'écran blanc, pas de stub visible.
8. **Code commenté en français**, 100 % offline, PWA installable (localStorage + export JSON).
9. **Git** : un commit par étape significative ; ne jamais toucher aux fichiers d'état d'une phase non terminée.

---

## 📂 AUTRES FICHIERS D'ÉTAT (à relire chaque session)

- **`STATUS.md`** — état courant : phase en cours, fait/restant, valeurs d'équilibrage, dettes, blocages.
- **`PHASES.md`** — les 8 phases du cahier des charges, critères annotés de leurs tests.
- **`JOURNAL.md`** — journal de bord : ce qui a été livré, simplifié, corrigé.
- **`PROTOCOLE.md`** — protocole de développement autonome 100%

---

## 📊 SUIVI D'AVANCEMENT

> 📝 **Instruction pour l'agent** : à chaque fin de phase, mets à jour cette section — statut de la phase, tests verts, valeurs d'équilibrage modifiées, dettes techniques, blocages. Déplace les entrées anciennes dans `JOURNAL.md` plutôt que de les supprimer. Ne touche jamais à la section verrouillée ci-dessus.

### Phase 0 — Socle technique : ✅ VALIDÉE (validate.sh: 26/26 tests passent)
- **Initialisé le** : 24 octobre 2026
- **Livré** : Projet Vite + Phaser 3, carte procédurale 128×128 (4 biomes), caméra tactile (pan/zoom), système de temps découplé (tick 1s), HUD avec affichage jour/saison/année, contrôles pause/1×/3×, sauvegarde localStorage, écran de titre minimal
- **Tests en place** : validate.sh (lint + type-check + build + tests headless Playwright), tests de charge (150 entités simulées), Vitest unit tests (15 tests), tests de rendu (capture d'écran)
- **Critères couverts** : Tous les critères de la Phase 0 sont testés automatiquement
- **Notes / blocages** : Aucun blocage actuel

### Phases 1 à 7 : ⏳ EN ATTENTE
| Phase | Contenu | Statut |
|---|---|---|
| 1 | Villageois vivants (besoins, pathfinding, sélection) | ⏳ |
| 2 | Récolte, production, construction | ⏳ |
| 3 | Individus profonds et mort permanente | ⏳ |
| 4 | Saisons, faune, pression écologique | ⏳ |
| 5 | Événements et dilemmes, Chronique | ⏳ |
| 6 | Savoir et ères (Mésolithique/Néolithique) | ⏳ |
| 7 | Finalisation (PWA, tutoriel, équilibrage) | ⏳ |

---

## 🧠 RAPPEL DU RITUEL (chaque session)

1. **Début** : lire ce fichier + `STATUS.md` + la phase cible dans `PHASES.md`.
2. **Travailler** : rituel de phase complet du protocole autonome (tests d'abord → implémentation → `validate.sh` vert en ≤ 10 itérations → auto-revue → invariants).
3. **Fin** : commit git → mettre à jour `STATUS.md` + `JOURNAL.md` + la section « Suivi d'avancement » ci-dessus.

*Fichier créé par Loric avec l'aide de son assistant, le 24 octobre 2026. Dernière mise à jour : 24 octobre 2026.*
