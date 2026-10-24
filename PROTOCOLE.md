# Protocole de développement 100 % autonome

> **Objectif** : le joueur humain n'intervient plus que par une commande : *« Passe à la phase suivante »*. Tout le reste — implémentation, tests, correction, validation, journalisation — est exécuté par l'agent.

---

## 1. Le principe : remplacer l'humain par des tests

L'autonomie totale n'est possible que si **chaque critère d'acceptation devient une vérification mécanique**. On ne « fait confiance » à l'agent : on le met dans une boucle dont il ne peut sortir que par le vert des tests.

- Chaque critère de phase du cahier des charges est traduit en **test automatisé** AVANT d'implémenter la fonctionnalité (TDD strict).
- La phase est validée par la machine, pas par le goût humain.
- Ce qui ne peut pas être testé (le « fun », l'équilibrage subjectif) est **explicitement déclaré** : l'agent applique les valeurs numériques du cahier des charges, et l'humain n'intervient qu'à la fin (voir section 7).

## 2. L'outillage de validation (à créer en Phase 0)

L'agent doit mettre en place dès le départ :

| Outil | Rôle | Exemples concrets |
|---|---|---|
| **Tests unitaires (Vitest)** | Logique de simulation | « un villageois affamé choisit de manger », « la viande pourrit après 3 jours », « l'hiver réduit la température de X » |
| **Tests headless (Playwright)** | Le jeu démarre, pas d'écran blanc, pas d'erreur console | Charger la page, avancer 100 ticks simulation sans exception, vérifier que le HUD affiche jour/saison |
| **Tests de charge automatisés** | Critères de performance | Simuler 150 villageois en headless, mesurer la durée du tick : échec si > 100 ms |
| **Snapshot / smoke visuel** | Le rendu n'est pas cassé | Capture d'écran comparée pixel-à-pixel à une référence, tolérance définie |
| **Script `validate.sh`** | Gagne la phase en une commande | `npm run validate` = type-check + lint + tests + build. Exit 0 = phase validée |

**Règle d'or** : *si un critère d'acceptation n'est pas automatisable, il est soit reformulé en critère automatisable, soit déplacé en section 7 (revue humaine finale).*

## 3. Les fichiers de mémoire du projet

Quatre fichiers, relus au début de chaque session, tenus à jour à chaque fin de phase :

- **`AGENTS.md`** — **La mémoire du projet**, relue automatiquement au début de chaque session. Contient : (a) une section **« Identité du projet » verrouillée** — vision, concept et 4 piliers d'origine, à ne jamais supprimer ni réécrire, pour que l'agent retrouve toujours le projet initial ; (b) les règles stables (structure de code, conventions, interdits) ; (c) une section **« Suivi d'avancement »** que l'agent met à jour à chaque fin de phase (statut, tests verts, valeurs d'équilibrage, blocages). ≤ 100 lignes hors suivi.
- **`STATUS.md`** — L'**état courant** : phase en cours, ce qui est fait, ce qui reste, les valeurs d'équilibrage actuelles, les dettes techniques connues. **Mis à jour à chaque fin de phase** — c'est le fichier le plus important du projet.
- **`PHASES.md`** — Le contenu du cahier des charges décomposé en phases, avec critères → chaque critère annoté du nom du test qui le vérifie.
- **`JOURNAL.md`** — Journal de bord : à chaque phase terminée, l'agent écrit ce qu'il a fait, simplifié, et quels tests l'ont validé. C'est le seul fichier que l'humain peut lire pour suivre sans intervenir.

**Rituel anti-oubli** : chaque session commence par lire `AGENTS.md` + `STATUS.md` + la phase cible dans `PHASES.md`. Chaque session se termine par : tests verts → `git commit` → mise à jour de `STATUS.md` et `JOURNAL.md` → commit des fichiers d'état.

## 4. Le rituel d'une phase autonome

Quand l'agent reçoit *« Passe à la phase suivante »*, il exécute **dans l'ordre, sans exception** :

1. **Contexte** : lire `AGENTS.md`, `STATUS.md`, la phase cible. Vérifier que `validate.sh` est vert sur l'état actuel (sinon : réparer d'abord).
2. **Plan** : écrire un plan court (fichiers touchés, systèmes concernés) dans `JOURNAL.md` avant de coder.
3. **Tests d'abord** : traduire chaque critère d'acceptation de la phase en test rouge (échouant), listé dans `PHASES.md`.
4. **Implémentation** : coder le minimum pour faire passer les tests. Pas de fonctionnalité non testée.
5. **Boucle de correction** : `validate.sh` rouge → corriger → relancer. **Maximum 10 itérations**. Au-delà : arrêter, écrire le blocage dans `STATUS.md` (section « Blocages »), ne jamais improviser de contournement non testé.
6. **Auto-revue** : relire le diff de la phase comme un relecteur externe (respect des piliers, dette technique, code mort). Corriger ce qui est flagré.
7. **Équilibrage** : appliquer les valeurs du cahier des charges (section 4 des fichiers data/), et exécuter une simulation accélérée automatisée (ex. : 2 ans in-game en mode headless) pour vérifier les invariants : « jamais de famine sans alerte préalable », « le premier hiver préparé est survivable ». Ces invariants = tests.
8. **Clôture** : commit git, mise à jour de `STATUS.md` (phase validée, tests associés, valeurs d'équilibrage), entrée de `JOURNAL.md`, **et mise à jour de la section « Suivi d'avancement » de `AGENTS.md`** — sans jamais toucher à la section « Identité du projet » verrouillée.

## 5. Les garde-fous (indispensables en autonomie)

- **Un commit git par étape significative** : toute régression est récupérable par `git revert`. L'humain peut inspecter l'historique quand il veut, sans y être obligé.
- **Budget d'itérations par phase** (10 corrections max, cf. §4.5) : évite les boucles infinies de l'agent qui « répare » en cassant ailleurs.
- **Interdiction de tricher les tests** : jamais modifier un test pour le faire passer ; si un test doit changer, justifier dans `JOURNAL.md` pourquoi le critère a évolué.
- **Blocage > improvisation** : face à un critère non atteignable, l'agent documente et s'arrête. Un `STATUS.md` honnête vaut mieux qu'un jeu faux-vert.
- **Aucune action destructive** : pas de `rm` hors du projet, pas de réécriture de `PHASES.md` (le cahier des charges est en lecture seule pour l'agent).

## 6. Le prompt d'orchestration (le seul que tu tapes)

> Lis `AGENTS.md`, `STATUS.md` et `PHASES.md`. La phase précédente est validée et commmitée. Exécute le **rituel de phase complet** (section 4 du protocole) pour la phase suivante : tests d'abord, implémentation, boucle `validate.sh` (max 10 itérations), auto-revue, simulation d'invariants, commit, mise à jour des fichiers d'état. N'attends aucune confirmation de ma part, sauf blocage documenté. À la fin, écris dans `JOURNAL.md` un résumé en 5 lignes max de ce que tu as livré.

Variantes utiles :
- *« Reprends la phase en cours »* — après un blocage ou une régression.
- *« Ajoute le test manquant : [description] »* — si tu repères une faiblesse en lisant le journal.
- *« Vérifie tout »* — relance `validate.sh` + simulation longue + auto-revue générale.

## 7. Les limites honnêtes (et comment on les contourne)

| Limite | Contournement dans ce protocole |
|---|---|
| Le « fun » ne se teste pas | L'agent applique les valeurs du cahier des charges. **Une seule session humaine de jeu à la fin (Phase 7)** pour ajuster les chiffres dans les fichiers data/ — sans retoucher le code. |
| La performance réelle sur ton téléphone n'est pas mesurable par l'agent | Tests de charge headless (proxy desktop) + une seule mesure réelle sur Android en Phase 0, dont le résultat est consigné comme seuil dans `STATUS.md`. |
| Dérive sur un projet long | Fichiers d'état + git + relecture du `JOURNAL.md` seulement si tu le souhaites. |
| Coût / sessions longues | Phases découpées (déjà fait) + remote agents / sessions en arrière-plan pour éviter de garder un terminal ouvert. |

## 8. Mise en route avec Vibe Code

1. Créer le dépôt, y copier `AGENTS.md` (règles du cahier des charges + ce protocole), `STATUS.md`, `PHASES.md`, `JOURNAL.md`.
2. Premier prompt : *« Exécute le rituel de phase pour la Phase 0 »* (le socle inclut `validate.sh` et les tests headless).
3. Ensuite, un seul message par phase : *« Passe à la phase suivante »*.
4. Options : sessions en arrière-plan / agents distants pour lancer une phase et revenir plus tard ; l'agent reprend le contexte depuis les fichiers d'état.

---

**Ce qu'il faut retenir** : l'autonomie n'est pas « faire confiance à l'IA », c'est **construire une boucle dont l'IA ne peut pas sortir sans livrer du vert**. Les tests remplacent ton œil, git remplace ta vigilance, les fichiers d'état remplacent ta mémoire. Tu ne diriges plus : tu actionnes.
