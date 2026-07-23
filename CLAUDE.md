# Contexte projet — App plan d'entraînement « Vercors 130 »

> Ce fichier est chargé automatiquement quand on lance `claude` dans ce dossier.
> Il résume tout le contexte pour reprendre le travail sans repartir de zéro.
> Langue de travail : **français**.

## 🎯 Le projet

App web **statique** de consultation d'un plan d'entraînement cycliste, pour l'athlète **LaSylv**.

- **Live** : https://lasylv.github.io/training-plan/
- **Repo GitHub** : `LaSylv/training-plan` (remote SSH `git@github.com:LaSylv/training-plan.git`)
- **Stack** : React + Vite + TypeScript, thème **clair uniquement** (pas de dark mode), mobile-first.
- **Déploiement** : auto via GitHub Actions (`.github/workflows/deploy.yml`) à chaque push sur `main` → GitHub Pages (source = **GitHub Actions**, base `/training-plan/`).

### Fonctionnalités
- Accueil (compte à rebours, snapshot fitness, semaine en cours, progression)
- Plan 9 semaines : séances vélo / muscu / course / repos, cases à cocher (localStorage), repère « aujourd'hui »
- Zones de puissance + calculateur de FTP
- Muscu : détail exact des exos + consignes + démos vidéo + **séance guidée** (`/seance/:id`, chrono, cases) + bascule **🏠 « sans matériel »** (variantes maison) sur toutes les séances
- Fichiers **Garmin `.FIT`** par séance vélo (Edge 530), cibles en watts
- Jour J (pacing/nutrition/checklist), Cols de Lyon

## 🚴 L'athlète (calibration durement acquise — NE PAS sous-estimer)

- **Grimpeur costaud + coureur à pied** (athlète mixte). Basé à **Lyon**. Accès **salle de muscu**.
- 57 kg · **eFTP 207 W** (FTP retenue 205, confirmée 204–207) → ~**3,6 W/kg**. CTL ~69.
- Grosses sorties montagne régulières : **Col de la Loze**, Pilat 7h41/156 km, **~5 800 m D+/semaine**.
  Sortie longue habituelle **1 500–2 500 m**, plafond **~4 000 m**, distances **110–140 km**.
  → Les 2 900 m du Vercors sont une **sortie normale** pour lui, pas un défi.
- Pour CE bloc : **~8–10 h/sem TOTAL (vélo + course)**. Il **réduit** la course à pied mais garde **1–2 footings faciles**.

## 🏔️ L'événement

**Le Vercors — 130 km / ~2 900 m D+** (La Drômoise, CC Die), **samedi 19 septembre 2026**.
Cols : Rousset, Combe Laval, Col de la Portette (raide), Font d'Urle. Objectif : **finir fort, avec un temps**.

## 📅 Le plan (9 semaines, lun 20 juil → sam 19 sept 2026)

- ~8–10 h/sem. Semaine type : Lun repos · Mar qualité vélo + Muscu A · Mer footing 45 min · Jeu qualité vélo + Muscu B · Ven repos · Sam sortie longue · Dim endurance courte.
- Sorties longues : **1 500 m (S1) → reine 5 h / ~3 000 m (S7)** — au-dessus de la course mais réaliste vu le budget temps.
- Muscu : force max en milieu de bloc, dernière séance lourde ~S7 (~13 j avant), rien en S8–9.
- Affûtage S8, semaine de course S9.

### État d'avancement
- **Mar 21/07 : SS 3×12 + Muscu A → FAIT** (analysé : 185 W en pédalant = 90 % FTP, pénalisé par les feux rouges).
- **Mer 22/07 : test FTP 20 min** prévu. ⚠️ **À FAIRE : récupérer le résultat, mettre à jour `athlete.ftp`/`eftp` dans `plan.json`, régénérer les `.FIT`.** Tout se recale ensuite.
- Sortie **Grand Colombier + Col de la Biche** évoquée (à analyser quand dispo sur Intervals).

## 🏗️ Architecture technique

- **`src/data/plan.json` = SOURCE DE VÉRITÉ unique.** Tout le contenu (athlète, event, zones, muscuSeances, weeks/sessions, jour J, cols) y vit. Pour modifier le plan → éditer ce JSON, jamais les composants.
- **FTP = une seule valeur** (`athlete.ftp`). Les intensités vélo sont en **% de FTP** (blocs `steps` : `wu/cd/rec/steady/int/ou/open`, champs `lo/hi/oLo…` en %). Les watts affichés (app, via `formatBlocks`) ET les `.FIT` (via le générateur) sont calculés depuis cette FTP. **Changer `athlete.ftp` → tout suit.**
- `src/data/plan.ts` : types + helpers (`formatBlocks`, `zoneWatts`, `findSession`, `demoUrl`), expose le JSON.
- Types de séance : `velo` | `muscu` | `course` | `repos`. Muscu → `seance` (A/B) + `mainScheme` + `homeOption`. Variantes maison dans `muscuSeances[].home`.
- Pages dans `src/pages/`, composants dans `src/components/`, hooks dans `src/lib/` (`progress.ts` localStorage, `dates.ts`, `useCountdown.ts`).

### Fichiers Garmin .FIT
- Générés par **`scripts/gen_workouts.py`** (lit `plan.json` + `athlete.ftp`), sortie `public/workouts/<id>.fit` (cibles watts absolus). Un `.FIT` par séance **vélo** (pas les footings/muscu).
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

## ⚙️ Workflow pour modifier le plan

1. Éditer `src/data/plan.json` (contenu) — ou un composant/`.ts` (comportement).
2. Si intensités/FTP/durées vélo changées → régénérer les `.FIT` (voir ci-dessus).
3. `npm run build` pour valider (0 erreur TS).
4. Vérifier le rendu (servir `dist/` sous `/training-plan/` + Playwright, ou `npm run preview`).
5. `git add -A && git commit && git push origin main` → déploiement auto.
6. Vérifier le run Actions (build + deploy success) et le live.

Commits : finir le message par
`Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

## 🎛️ Préférences / contraintes utilisateur

- App **non dynamique** (aucun appel réseau à l'exécution ; snapshot Intervals figé, régénéré à la demande).
- **Thème clair uniquement.** Layout **aéré**, pas tassé.
- Débutant en muscu → consignes + démos vidéo utiles, variantes maison sans matériel.
- Calibrer le plan **HAUT** (grimpeur costaud), mais respecter le budget **~8–10 h/sem total**.
- Franc-parler, va droit au but, agis plutôt que sur-demander (mais demander ses chiffres réels plutôt que supposer).
