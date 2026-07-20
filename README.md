# Vercors 130 — Plan d'entraînement

App statique de consultation du plan d'entraînement pour **Le Vercors — 130 km / ~2 900 m D+** (La Drômoise, samedi 19 septembre 2026).

Plan sur **9 semaines** construit à partir des stats Intervals.icu (athlète i520912) : CTL ~69, eFTP 207 W, 57 kg → ~3,6 W/kg. Objectif : finir fort avec un objectif de temps.

## Fonctionnalités

- **Accueil** — compte à rebours, snapshot fitness, semaine en cours, progression globale
- **Plan** — 9 semaines détaillées (vélo + muscu), cases à cocher persistées en `localStorage`
- **Zones** — table des zones de puissance + calculateur de FTP
- **Muscu** — bloc force (séances A/B, progression, affûtage)
- **Jour J** — pacing, nutrition, checklist, cols du parcours
- **Cols** — où s'entraîner autour de Lyon

Mobile-first, mode sombre/clair.

## Nature statique

Aucun appel réseau, aucune clé API. **Tout le contenu vit dans [`src/data/plan.json`](src/data/plan.json)** (snapshot figé). Pour mettre à jour les stats ou le plan, on édite ce fichier et on rebuild.

### FTP = valeur unique

Les intensités vélo sont exprimées en **% de la FTP** (blocs `steps`), et la FTP est `athlete.ftp`. **Changer uniquement `athlete.ftp`** met à jour tous les watts affichés dans l'app (calcul en direct). Pour recalculer aussi les fichiers Garmin `.FIT`, relancer le générateur :

```bash
uv venv /tmp/fitenv && uv pip install --python /tmp/fitenv fit-tool
/tmp/fitenv/bin/python scripts/gen_workouts.py
```

## Développement

```bash
npm install
npm run dev        # serveur de dev
npm run build      # build de production dans dist/
npm run preview    # prévisualise le build
```

## Déploiement — GitHub Pages

Le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) build et publie sur Pages à chaque push sur `main`.

Après le premier push : **Settings → Pages → Source = GitHub Actions**.

Le site est servi sous `/training-plan/` (voir `base` dans `vite.config.ts`) → https://lasylv.github.io/training-plan/

Stack : React + Vite + TypeScript.
