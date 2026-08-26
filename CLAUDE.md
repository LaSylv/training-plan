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

- **Grimpeur costaud + coureur à pied + ULTRA-DISTANCE** (athlète mixte). Basé à **Lyon**. Accès **salle de muscu**.
- 57 kg · **FTP 230 W** (test 20 min du 25/07, cf. État d'avancement) → **4,04 W/kg**. CTL ~73.
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

#### ⚡ FTP = 230 W (test du 25/07) — remplace les 205 W estimés
Test 20 min au **col de Portes** : **243 W** sur 20 min (HR max 182) → FTP = 95 % = **230 W**, soit **4,04 W/kg** à 57 kg.
Courbe de puissance très plate (259 W à 5' · 252 W à 8' · 250 W à 10' · 245 W à 15' · **243 W à 20'**) = test régulier, bien pacé, chiffre fiable.
Confirmé le lendemain : 218 W sur 20 min *à l'intérieur* d'une sortie de 3h45. `athlete.ftp`/`eftp` = 230, **les `.FIT` ont été régénérés**.

✅ **FTP 230 W VALIDÉE** par la séance Seuil 3×10' du mar. 28/07 (col du Verdun, ~5,3 %) :
**217 → 219 → 220 W**, aucun décrochage, la puissance monte bloc après bloc. On ne redescend pas à 225.
> ⚠️ **Coût cardiaque élevé à surveiller** : HR moy 166 → 166 → 169, max 173 → 177 → **181** sur le 3ᵉ bloc,
> soit quasi le coût du test FTP à 243 W. C'est de la fatigue résiduelle de S1 (630 TSS), pas une FTP fausse.
> Si ce découplage puissance/HR persiste en S3, envisager une semaine de récup anticipée.

#### S1 (20–26 juil) — **terminée et figée** dans `plan.json` (`done: true`)
Réalisé **~630 TSS / 12 h 10 de vélo / ~4 800 m D+**, contre 430 TSS et ~8 h prévus (+47 %). Il a écrasé le plan.
| Jour | Réalisé |
|---|---|
| Mar 21 | SS 3×12 — 36 km / 130 m / 1h17 (185 W en pédalant) + **Muscu A** |
| Mer 22 | 🏔️ Grand Colombier + Biche — 82 km / **2 443 m** / 4h23 (Colombier 187 W sur 84 min = seulement 81 % de la vraie FTP) |
| Jeu 23 | rien (off) — **Muscu B sautée → reportée en S2** |
| Ven 24 | 30 km / 89 m / 1h17 facile + footing Dawex 5,2 km |
| Sam 25 | 🔬 **Test FTP** col de Portes — 31 km / 708 m / 1h29 |
| Dim 26 | Monts du Lyonnais — 88 km / **1 423 m** / 3h45 (au lieu de 1h30 d'endurance) |

#### S2 (27 juil – 2 août) — **semaine de récup**, ~250 TSS (réalisé ~215 + dimanche facultatif)
Prévue à 335 TSS, ramenée à ~250 : **il s'est déclaré « cramé » le vendredi 31/07**. Pas de sortie longue — elle revient en S3.

| Jour | État |
|---|---|
| Mar 28 | ✅ **figé** — Seuil 3×10' col du Verdun, 44 km / 789 m / 2h04 (217/219/220 W) |
| Mer 29 | ✅ **figé** — « à la fraîche » 33,8 km / 195 m / 1h27 à ~101 W moy. **Footing remplacé par du vélo facile** (bon choix au lendemain d'un seuil à 181 de HR) |
| Jeu 30 | ⏭️ **Over-unders sautée** (jour off complet) — reportées en S3 |
| Ven 31 | ✅ **figé** — Monts d'Or + Mont Verdun, 43,8 km / 526 m / 2h11 (113 W moy, HR 121/161). Verdun par Poleymieux : 442 m à **165 W pour 139 de HR** — **pas de dérive cardiaque**. Meilleurs 20 min : 181 W → sortie vraiment facile |
| Sam 1/08 | 🛑 **Repos total** (Sweet Spot 2×12' annulé) |
| Dim 2/08 | 🛑 **Rien fait** — l'heure facultative n'a pas été prise. **Premier week-end 100 % off du bloc** |

**Diagnostic du « cramé » (31/07)** : ce n'est pas la charge de S2 (~5 h 30 / 1 510 m / 215 TSS) mais la dette de S1.
Sur 12 jours : **8 sorties, ~17 h 40, ~6 300 m D+** pour un budget de 8–10 h/sem. Le moteur aérobie va bien
(HR/puissance meilleure vendredi que mardi) → fatigue générale, ça se règle en **jours off**, pas en deload de 2 semaines.

#### S3 (3 – 9 août) — en cours, ~425 TSS
Réécrite de 500 → 430 avant le début (week-end de récup), puis ajustée jeudi 6/08 : **over-unders annulées**.

| Jour | État |
|---|---|
| Lun 3 | ⚠️ **figé** — « Dombes avec le bro » 59 km / 396 m / 2h20 (112 W moy, HR 128/160, meilleurs 20 min 136 W). Sortie facile mais **c'était le jour de repos** |
| Mar 4 | ✅ **figé** — Seuil 2×10' Mont Verdun, 33 km / 506 m / 1h23. **Bloc 1 : 221 W** (HR 167/177) · **Bloc 2 : 207 W** (HR 164/175). Récup à 190 W entre les blocs → ~25 min quasi continues, **208 W sur 30 min**. 3ᵉ bloc non lancé (bon choix) |
| Mer 5 | ✅ Muscu (A supposée) faite « pas trop forcé », décalée du mardi. **Footing sauté** |
| Jeu 6 | ⏭️ **Over-unders annulées** pour protéger le Pilat. **Muscu B reportée en S4**. Jour off franc |
| Ven 7 | Ouverture courte 45 min–1 h + **3 × 30 s à 250–270 W** (au lieu du repos : évite 2 jours plats avant le Pilat) |
| Ven 7 | ⏭️ Ouverture non faite |
| Sam 8 | ⏭️ **Chartreuse annulée** (95 km / 2 617 m) — seulement 19,5 km / 64 m / 49 min le soir |
| Dim 9 | ✅ **Col du Mollard + Lacets de Montvernier** (Maurienne) — 61,5 km / **1 550 m** / 2h55. Mollard 17,6 km/1 531 m en **1h18 à 183 W** (HR 158), puis **Lacets à 195 W / HR 168 en fin de sortie**. Structure Portette exécutée spontanément |

**Total S3 réalisé : ~325 TSS / 7 h 30 de vélo** (contre 485 prévus).

#### S4 (10 – 16 août) — en cours, ~425 TSS
| Jour | État |
|---|---|
| Lun 10 | ✅ Trail Charmieux — 4 km / **585 m D+** au Grand-Bornand (au lieu du vélo facile) |
| Mar 11 | ✅ **Col de la Colombière par Le Reposoir** — 59,3 km / 1 231 m / 2h31. **1h05 à 207 W**, finish à 226 W (cf. FTP ci-dessus) |
| Mer 12 | Repos (retour) |
| Jeu 13 | ⏭️ **Sweet Spot annulé** — la qualité a été faite mardi. Footing + muscu A légère |
| Sam 15 | 🏔️ **Sortie longue remontée de 2h30 à 4 h / ~2 000 m — LA priorité** |
| Dim 16 | Endurance 1h15 |

**Lecture du seuil du 4/08** : 🟢 coût cardiaque en baisse vs 28/07 (HR max 177 contre 181) → le week-end off a payé.
🟠 mais la puissance décroche de 14 W entre les 2 blocs alors qu'elle *montait* le 28/07 — explication : « récup » à 190 W + les 2 h 20 de la veille.

#### ✅ FTP 230 W conservée — la Colombière (11/08) exclut l'hypothèse basse
**1 h 05 à 207 W** (90 % FTP) dans le col de la Colombière, HR 167, **au 3ᵉ jour d'un bloc montagne** — et il
**accélère** à la fin : derniers 2,5 km à **225 W**, dernier km à **226 W** (HR 179, max 183).
Meilleure heure : **208 W** · meilleurs 20 min : **221 W**.
**Raisonnement** : si la FTP était 220, 207 W sur 1 h vaudrait 94 % de FTP, soit un effort horaire quasi maximal —
on ne le termine pas en montant à 103 % pendant 10 min. Donc FTP nettement > 220. ⚠️ **Ce n'est pas un test
contrôlé** : ça exclut 220, ça ne démontre pas 230 au watt près (vraie valeur entre 225 et 235).
La piste « redescendre à 225 » est abandonnée, on garde 230.
> 📌 **Profil diesel confirmé** : il est nettement meilleur sur une longue montée continue (207 W sur 65 min)
> que sur des blocs de seuil courts (207–221 W sur 10 min). Cohérent avec son palmarès ultra.
> **Privilégier les longues montées en tempo aux intervalles courts.**

#### S5 (17 – 23 août) — terminée, ~590 TSS. 🥾 **Week-end trail massif**
Sam 22 : **24,2 km / 2 121 m** (4 h 55 mvt, 7 h 47 écoulées) · Dim 23 : **26,3 km / 1 307 m** (4 h 25 mvt).
**Total : 9 h 20 en mouvement, 3 428 m D+.** Écrins / vallée de la Clarée.
En semaine : mar 18 sortie punchy avec les copains au lieu du tempo long (Mont Thou à 315-341 W, meilleurs
2 min **342 W**, mais meilleurs 20 min seulement 167 W — **HR max 187, nouveau maximum**), jeu 20 roulant 2 h 15.
> ⚠️ Le trail donne l'endurance mais **rien** de la tolérance de position vélo (selle, dos, nuque, mains sur 6 h)
> ni de la spécificité du pédalage. Et 3 428 m de descente à pied = gros dégâts excentriques → lun 24 off,
> mar 25 seulement 50 min.

#### 🚨 LE TROU DU BLOC : la sortie longue (état au 26/08)
**Dernière sortie de plus de 4 h = le Pilat, le 14/07 — cinq semaines.**
S2 aucune · S3 Chartreuse annulée (2 h 55 au Mollard à la place) · **S4 la sortie de 4 h sautée, week-end vide**.
Or le modèle prédit **~6 h 25 pour le Vercors**. L'intensité progresse très bien (207 W sur 1 h dans la
Colombière) — **c'est uniquement la durée qui manque**.
> ⏳ **Il ne reste que DEUX fenêtres : samedi 29/08 et la reine du 5/09.** Si le 29 saute, la reine devient
> un saut de 3 h à 5 h à quinze jours de la course. S6 est entièrement sacrifiée pour le samedi
> (seuil abandonné, Sweet Spot du jeudi ramené à une ouverture, muscu B sautée).

#### S4 (10 – 16 août) — terminée, ~305 TSS (vs 425 prévus)
Bloc Grand-Bornand très bon (trail 585 m lundi, Colombière 1 h 05 à 207 W mardi), jeudi allégé respecté.
❌ Mais **vendredi de repos = 3 h de vélo facile (96 W moy) le soir, puis week-end vide** : la fatigue sans le
stimulus de durée. C'est le pire arbitrage possible la veille d'une sortie longue.

> 🔁 **Tendance confirmée (3 semaines de suite)** : le jour de repos du lundi/vendredi devient systématiquement 2 h de vélo,
> et ça se paie le lendemain sur la séance de qualité. Le levier n'est pas d'ajouter de la charge, c'est de **faire respecter les jours off**.

> 🔁 **Tendance à surveiller** : il fait systématiquement plus que prévu (S1 +47 %) et **rend rarement ses jours de repos**
> (le vendredi 31/07 prévu off = 2 h de vélo). Le facteur limitant est la fraîcheur, pas le foncier.

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
