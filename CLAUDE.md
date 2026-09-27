# Contexte projet — « Training LaSylv » (séances à piocher + plan de course)

> Ce fichier est chargé automatiquement quand on lance `claude` dans ce dossier.
> Langue de travail : **français**.

## 🎯 Le projet

App web **statique** pour l'athlète **LaSylv** : **plus de programme hebdomadaire** (supprimé le 26/09/2026 à sa demande).
C'est une **bibliothèque de séances à piocher** quand il en a envie + le **plan de course** de l'objectif en cours.

- **Live** : https://lasylv.github.io/training-plan/
- **Repo GitHub** : `LaSylv/training-plan` (remote SSH `git@github.com:LaSylv/training-plan.git`)
- **Stack** : React + Vite + TypeScript, thème **clair uniquement**, mobile-first.
- **Déploiement** : auto via GitHub Actions à chaque push sur `main` → GitHub Pages (base `/training-plan/`).

### Pages
- Accueil (compte à rebours de l'objectif, profil, raccourcis catégories)
- **Séances** (`/seances`) : catalogue vélo par catégorie (facile, tempo/SS, seuil, VO2/rampes, sorties longues, avant course) + salle — chaque séance vélo a son **`.FIT`**
- **Salle** (`/muscu`) : séances A/B + **séance guidée** (`/seance/muscu-a|muscu-b`, chrono, bascule 🏠 sans matériel)
- Zones + calculateur FTP · **Jour J** (plan de course tronçon par tronçon) · Cols de Lyon

## 🚴 L'athlète (calibration durement acquise — NE PAS sous-estimer)

- **Grimpeur costaud + coureur à pied + ULTRA-DISTANCE** (athlète mixte). Basé à **Lyon**. Accès **salle de muscu**.
- 57 kg · **FTP 230 W** (test 20 min du 25/07) → **4,04 W/kg**. CTL ~73.
- ⚠️ **Palmarès ultra 2026 — NE JAMAIS sous-estimer sa durabilité** :
  **Race Across France** (24/06) = **862 km / 14 713 m / 45 h 44** en mouvement ·
  **Grande Traversée du Jura** (29/05) = **348 km / 5 332 m / 17 h 22**.
  → Une sortie de 5–6 h n'est PAS un territoire inconnu pour lui. Son facteur limitant est
  la **W/kg pure** et les **230 W en absolu** (il décroche des groupes lourds sur le plat), **pas l'endurance**.
- Grosses sorties montagne régulières : **Col de la Loze**, Pilat 7h41/156 km, **~5 800 m D+/semaine**.
  Sortie longue habituelle **1 500–2 500 m**, plafond **~4 000 m**, distances **110–140 km**.
  → Les 2 900 m du Vercors sont une **sortie normale** pour lui, pas un défi.
- 🗺️ **Terrains déjà faits** (vérifier avant de proposer du « neuf ») : Vercors/Combe Laval (5/04, 137 km/2 055 m),
  **col d'Évosges & Bugey** (1/03, 105 km/2 046 m), Grand Colombier ×2, Col de la Loze, Pilat, Majorque
  (Sa Calobra, Soller, Formentor), Chartreuse à venir.

### 📐 Modèle de durée (régression sur 18 sorties montagne, mars→août 2026)
**T(h) = km / 29,9 + D+ / 1 401** — vitesse « à plat » 29,9 km/h, **vitesse ascensionnelle 1 401 m/h**.
Erreur moyenne 18 min, max 61 min. Utiliser ça pour estimer une durée, **pas une sortie de référence unique**.
> Application : Vercors 130 km / 2 900 m → **~6 h 25 en mouvement**.

## 🏁 Objectif en cours

**La Bisou Aventure — 94 km / 1 452 m D+**, Péronnas (01), **dimanche 27 septembre 2026**, départ 9h00.
Parcours décodé depuis l'Openrunner officiel : Ramasse km 15 (4,4 km à 5,9 %), Esses km 31, Corveissiat km 40,
vallée de l'Ain vent de face km 46–70 (vent de S prévu), Saint-Martin-du-Mont km 70, retour plat vent dans le dos.
Plan de course complet dans `raceDay` (plan.json).

✅ **Résultat (27/09)** : **3 h 02'14, 216ᵉ / 770** (212ᵉ homme / 703, 63ᵉ / 184 cat. D), 30,95 km/h.
NP 209 W · IF 0,91 · ~250 TSS · HR moy 168, **max 188 (nouveau max)**. Records en course : 245 W sur 5', 234 W sur 10', 228 W sur 15' → FTP 230 confirmée (plutôt 230–235).
Ramasse pile dans la cible (224 W / 15'42), Esses et Corveissiat au-dessus (221–226 W), puis Saint-Martin sous la cible (204 W) : il a payé l'excès du milieu de course.
1ʳᵉ féminine : 2 h 31'40 (22ᵉ scratch) ; il finit devant la 5ᵉ. Vainqueur 2 h 24'55 (38,9 km/h) : la course se joue dans les groupes à 37–39 km/h.

> Le Vercors (19/09) n'a pas été couru : il a fait la **Madeleine** ce jour-là (113 km / 2 263 m, 1 h 38 à 179 W dans le col).

## 📌 Enseignements du bloc été 2026 (juil. → sept.)
- **FTP 230 W** : test 20' du 25/07 (243 W), confirmée par la Colombière (11/08 : 1 h 05 à 207 W, finish à 226 W). Vraie valeur 225–235.
- **Profil diesel** : bien meilleur sur longues montées en tempo que sur blocs courts → privilégier tempo/SS longs.
- **Endurance hors norme** : 5–6/09 = 170 km/3 095 m + 159 km/2 697 m (Alpe d'Huez 1 h 20 à 160 W le 2ᵉ jour).
- Forme récente : 209 W sur 17' au Mont Thou (15/09), 199 W sur 20' (25/09).
- **Tendance** : fait plus que prévu et rend rarement ses jours de repos ; le facteur limitant est la fraîcheur, pas le foncier.
- Données : **Strava MCP** (`list_activities` / `get_activity_performance`) marche bien ; Intervals via Playwright en secours.

## 🏗️ Architecture technique

- **`src/data/plan.json` = SOURCE DE VÉRITÉ unique.** Tout le contenu (athlète, event, zones, muscuSeances, **`library`** (catégories → séances), `raceDay`, cols) y vit. Pour ajouter/modifier une séance ou changer d'objectif → éditer ce JSON, jamais les composants.
- **FTP = une seule valeur** (`athlete.ftp`). Les intensités vélo sont en **% de FTP** (blocs `steps` : `wu/cd/rec/steady/int/ou/open`, champs `lo/hi/oLo…` en %). Les watts affichés (app, via `formatBlocks`) ET les `.FIT` (via le générateur) sont calculés depuis cette FTP. **Changer `athlete.ftp` → tout suit.**
- `src/data/plan.ts` : types + helpers (`formatBlocks`, `zoneWatts`, `findWorkout`, `demoUrl`), expose le JSON.
- Types de séance : `velo` | `muscu`. Muscu → `seance` (A/B) + `mainScheme` + `homeOption`. Variantes maison dans `muscuSeances[].home`.
- Nouvel objectif → remplacer `event` + `raceDay` (la page Jour J et le compte à rebours suivent).
- Pages dans `src/pages/`, composants dans `src/components/` (`WorkoutCard`, `MuscuDetail`), hooks dans `src/lib/` (`dates.ts`, `useCountdown.ts`).

### Fichiers Garmin .FIT
- Générés par **`scripts/gen_workouts.py`** (lit `library` + `athlete.ftp`), sortie `public/workouts/<id>.fit` (cibles watts absolus, anciens `.fit` purgés). Un `.FIT` par séance **vélo** de la bibliothèque.
- Nécessite `fit-tool` (hors deps du repo) :
  ```bash
  uv venv /tmp/fitenv && uv pip install --python /tmp/fitenv fit-tool fitparse
  /tmp/fitenv/bin/python scripts/gen_workouts.py   # après avoir changé la FTP ou une séance
  ```
- Charger sur l'Edge 530 : copier le `.fit` dans `Garmin/NewFiles/`.

### Commandes
```bash
npm install
npm run dev       # dev
npm run build     # build prod dans dist/ (tsc + vite)
```

## 📊 Accès aux données Intervals.icu (⚠️ important)

- Athlète **i520912**. MCP `intervals-icu` configuré (scope local dans `~/sandbox`), mais…
- **Ses activités viennent de Strava → l'API publique `/api/v1` (clé API) renvoie les champs masqués (distance/D+/puissance/streams = null).** **NE PAS utiliser la clé API** (demande explicite de l'utilisateur).
- ✅ **Méthode qui marche = Playwright + session connectée** :
  1. Ouvrir `https://intervals.icu/login` dans le navigateur Playwright, l'utilisateur se connecte lui-même (« Connect with Strava »).
  2. `fetch('/api/activity/{id}', {credentials:'include'})` renvoie les **174 champs complets** (pas de blocage Strava).
  3. Le endpoint **liste** `/api/athlete/{id}/activities` renvoie `[]` dans cette session → récupérer l'ID autrement : demander l'URL/ID à l'utilisateur, ou scraper les tuiles du calendrier (`/activities/{id}`).
- Sinon, analyser une séance depuis son **fichier `.FIT`** (le parser avec `fitparse` — cf. exemples de scripts d'analyse déjà utilisés).

## ⚙️ Workflow pour modifier le contenu

1. Éditer `src/data/plan.json` (contenu) — ou un composant/`.ts` (comportement).
2. Si intensités/FTP/durées vélo changées → régénérer les `.FIT` (voir ci-dessus).
3. `npm run build` pour valider (0 erreur TS).
4. Vérifier le rendu (servir `dist/` sous `/training-plan/` + Playwright, ou `npm run preview`).
5. `git add -A && git commit && git push origin main` → déploiement auto.
6. Vérifier le run Actions (build + deploy success) et le live.

Commits : finir le message par
`Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`

## 🎛️ Préférences / contraintes utilisateur

- App **non dynamique** (aucun appel réseau à l'exécution ; snapshot Intervals figé, régénéré à la demande).
- **Thème clair uniquement.** Layout **aéré**, pas tassé.
- Débutant en muscu → consignes + démos vidéo utiles, variantes maison sans matériel.
- Calibrer **HAUT** (grimpeur costaud). Pas de programme imposé : il pioche.
- Franc-parler, va droit au but, agis plutôt que sur-demander (mais demander ses chiffres réels plutôt que supposer).
