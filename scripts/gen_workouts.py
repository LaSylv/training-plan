#!/usr/bin/env python3
"""
Génère un fichier Garmin .FIT par séance vélo, À PARTIR de src/data/plan.json.

Source unique : les intensités sont en % de la FTP dans plan.json (blocs `steps`),
et la FTP est `athlete.ftp`. Change UNIQUEMENT athlete.ftp puis relance ce script :
tous les watts des .FIT suivent (et l'app aussi, qui lit la même donnée).

Cibles écrites en watts absolus (convention FIT : watts + 1000).
Sortie : public/workouts/<id>.fit

Exécution (fit-tool hors dépendances du repo) :
    uv venv /tmp/fitenv && uv pip install --python /tmp/fitenv fit-tool
    /tmp/fitenv/bin/python scripts/gen_workouts.py
"""
import json
import os
import re

from fit_tool.fit_file_builder import FitFileBuilder
from fit_tool.profile.messages.file_id_message import FileIdMessage
from fit_tool.profile.messages.workout_message import WorkoutMessage
from fit_tool.profile.messages.workout_step_message import WorkoutStepMessage
from fit_tool.profile.profile_type import (
    FileType, Manufacturer, Sport, Intensity,
    WorkoutStepDuration, WorkoutStepTarget,
)

HERE = os.path.dirname(__file__)
PLAN = os.path.join(HERE, '..', 'src', 'data', 'plan.json')
OUT = os.path.join(HERE, '..', 'public', 'workouts')
PW_OFFSET = 1000

# Défauts d'intensité (% FTP) pour les blocs sans lo/hi explicites.
WU = (58, 71)
CD = (52, 64)
REC = (54, 62)     # récup dédiée / entre séries
OFF = (58, 66)     # récup entre répétitions d'intervalles


def step(name, sec, lo, hi, intensity):
    return {'name': name, 'sec': sec, 'lo': lo, 'hi': hi, 'int': intensity}


def expand(steps, ftp):
    """Convertit les blocs (% FTP) en étapes atomiques (watts absolus)."""
    def w(p):
        return round(p / 100 * ftp)

    out = []
    for b in steps:
        k = b['k']
        if k == 'wu':
            out.append(step("Échauffement", b['min'] * 60, w(WU[0]), w(WU[1]), Intensity.WARMUP))
        elif k == 'cd':
            out.append(step("Retour au calme", b['min'] * 60, w(CD[0]), w(CD[1]), Intensity.COOLDOWN))
        elif k == 'rec':
            out.append(step("Récup", b['min'] * 60, w(REC[0]), w(REC[1]), Intensity.RECOVERY))
        elif k == 'steady':
            out.append(step(b.get('label', 'Endurance'), b['min'] * 60, w(b['lo']), w(b['hi']), Intensity.ACTIVE))
        elif k == 'int':
            label = b.get('label', 'Intervalle')
            if b.get('cad'):
                label = f"{label} ({b['cad']})"
            for i in range(b['reps']):
                out.append(step(label, b['on'] * 60, w(b['lo']), w(b['hi']), Intensity.INTERVAL))
                if i < b['reps'] - 1 and b.get('off'):
                    out.append(step("Récup", b['off'] * 60, w(OFF[0]), w(OFF[1]), Intensity.RECOVERY))
        elif k == 'ou':
            for j in range(b['sets']):
                for _ in range(b['reps']):
                    out.append(step("Over", b['onOver'] * 60, w(b['oLo']), w(b['oHi']), Intensity.INTERVAL))
                    out.append(step("Under", b['onUnder'] * 60, w(b['uLo']), w(b['uHi']), Intensity.ACTIVE))
                if j < b['sets'] - 1 and b.get('rec'):
                    out.append(step("Récup", b['rec'] * 60, w(OFF[0]), w(OFF[1]), Intensity.RECOVERY))
        elif k == 'open':
            out.append({'name': b.get('label', 'Effort libre'), 'sec': b['min'] * 60,
                        'lo': None, 'hi': None, 'int': Intensity.INTERVAL})
    return out


def clean(title):
    return re.sub(r'\s+', ' ', re.sub(r'[^\w\s#·—/+()-]', '', title, flags=re.UNICODE)).strip()


def build(wid, name, atomic):
    builder = FitFileBuilder(auto_define=True)

    fid = FileIdMessage()
    fid.type = FileType.WORKOUT
    fid.manufacturer = Manufacturer.GARMIN.value
    fid.product = 0
    fid.time_created = 1784505600000  # 2026-07-20 UTC (date fixe, valide FIT)
    fid.serial_number = 0x10000000
    builder.add(fid)

    wk = WorkoutMessage()
    wk.workout_name = name
    wk.sport = Sport.CYCLING
    wk.num_valid_steps = len(atomic)
    builder.add(wk)

    for i, st in enumerate(atomic):
        m = WorkoutStepMessage()
        m.message_index = i
        m.workout_step_name = st['name']
        m.intensity = st['int']
        m.duration_type = WorkoutStepDuration.TIME
        m.duration_value = st['sec'] * 1000
        if st['lo'] is None:
            m.target_type = WorkoutStepTarget.OPEN
        else:
            m.target_type = WorkoutStepTarget.POWER
            m.target_value = 0
            m.custom_target_power_low = st['lo'] + PW_OFFSET
            m.custom_target_power_high = st['hi'] + PW_OFFSET
        builder.add(m)

    builder.build().to_file(os.path.join(OUT, f"{wid}.fit"))


def main():
    with open(PLAN, encoding='utf-8') as f:
        data = json.load(f)
    ftp = data['athlete']['ftp']
    os.makedirs(OUT, exist_ok=True)

    n = 0
    for wk in data['weeks']:
        for s in wk['sessions']:
            if s['type'] != 'velo' or not s.get('steps'):
                continue
            name = f"S{wk['n']} {s['day']} · {clean(s['title'])}"
            build(s['id'], name, expand(s['steps'], ftp))
            n += 1
            print(f"  {s['id']}.fit  {name}")
    print(f"\n{n} fichiers .FIT générés (FTP = {ftp} W).")


if __name__ == '__main__':
    main()
