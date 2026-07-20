#!/usr/bin/env python3
"""
Génère un fichier d'entraînement Garmin .FIT par séance vélo du plan.

Les cibles sont en WATTS ABSOLUS (convention FIT : valeur = watts + 1000),
donc indépendantes de la FTP réglée sur le compteur.

Sortie : public/workouts/<id>.fit  (servis par l'app + copiables sur l'Edge).

Exécution (nécessite fit-tool, hors dépendances du repo) :
    uv venv /tmp/fitenv && uv pip install --python /tmp/fitenv fit-tool
    /tmp/fitenv/bin/python scripts/gen_workouts.py
"""
import os

from fit_tool.fit_file_builder import FitFileBuilder
from fit_tool.profile.messages.file_id_message import FileIdMessage
from fit_tool.profile.messages.workout_message import WorkoutMessage
from fit_tool.profile.messages.workout_step_message import WorkoutStepMessage
from fit_tool.profile.profile_type import (
    FileType, Manufacturer, Sport, Intensity,
    WorkoutStepDuration, WorkoutStepTarget,
)

OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'workouts')
PW_OFFSET = 1000  # FIT : watts stockés en (watts + 1000)


def step(name, sec, lo, hi, intensity):
    return {'name': name, 'sec': sec, 'lo': lo, 'hi': hi, 'int': intensity}


def wu(mins=10):
    return [step("Échauffement", mins * 60, 120, 145, Intensity.WARMUP)]


def cd(mins=8):
    return [step("Retour au calme", mins * 60, 105, 135, Intensity.COOLDOWN)]


def sweetspot(reps, on, lo, hi, off):
    s = wu()
    for i in range(reps):
        s.append(step(f"Sweet Spot {on}min", on * 60, lo, hi, Intensity.INTERVAL))
        if i < reps - 1:
            s.append(step("Récup", off * 60, 120, 140, Intensity.RECOVERY))
    return s + cd()


def threshold(reps, on, lo, hi, off):
    s = wu()
    for i in range(reps):
        s.append(step(f"Seuil {on}min", on * 60, lo, hi, Intensity.INTERVAL))
        if i < reps - 1:
            s.append(step("Récup", off * 60, 120, 140, Intensity.RECOVERY))
    return s + cd()


def vo2(reps, on, w, off):
    s = wu()
    for i in range(reps):
        s.append(step(f"VO2 {on}min", on * 60, w - 5, w + 5, Intensity.INTERVAL))
        if i < reps - 1:
            s.append(step("Récup", off * 60, 115, 140, Intensity.RECOVERY))
    return s + cd()


def lowcadence(reps, on, lo, hi, off):
    s = wu()
    for i in range(reps):
        s.append(step(f"Force 50-60 rpm {on}min", on * 60, lo, hi, Intensity.INTERVAL))
        if i < reps - 1:
            s.append(step("Récup", off * 60, 115, 135, Intensity.RECOVERY))
    return s + cd()


def overunders(sets, reps, over, ow, under, uw):
    s = wu()
    for j in range(sets):
        for _ in range(reps):
            s.append(step("Over", over * 60, ow - 3, ow + 5, Intensity.INTERVAL))
            s.append(step("Under", under * 60, uw - 5, uw + 3, Intensity.ACTIVE))
        if j < sets - 1:
            s.append(step("Récup", 5 * 60, 120, 140, Intensity.RECOVERY))
    return s + cd()


def endurance(total, lo=120, hi=150):
    body = max(60, (total - 18) * 60)
    return wu() + [step("Endurance Z2", body, lo, hi, Intensity.ACTIVE)] + cd()


def longride(total):
    body = max(60, (total - 10) * 60)
    return wu() + [step("Sortie longue — Z2, cols en tempo/SS", body, 120, 155, Intensity.ACTIVE)]


def ftptest():
    s = wu(15)
    for i in range(3):
        s.append(step("Accélération 1min", 60, 200, 260, Intensity.INTERVAL))
        s.append(step("Récup 1min", 60, 110, 135, Intensity.RECOVERY))
    s.append(step("Récup 5min", 5 * 60, 110, 135, Intensity.RECOVERY))
    # 20 min ALL-OUT : cible ouverte (donne tout, régulier)
    s.append({'name': "TEST 20min ALL-OUT", 'sec': 20 * 60, 'lo': None, 'hi': None, 'int': Intensity.INTERVAL})
    return s + cd(10)


def openers(base, reps, on_sec, lo, hi, off_sec):
    s = wu() + [step("Endurance Z2", base * 60, 120, 150, Intensity.ACTIVE)]
    for i in range(reps):
        s.append(step("Ouverture", on_sec, lo, hi, Intensity.INTERVAL))
        if i < reps - 1:
            s.append(step("Récup", off_sec, 110, 135, Intensity.RECOVERY))
    return s + cd(5)


# id -> (nom lisible affiché sur l'Edge, steps)
PLAN = {
    # S1
    'w1-mar': ("S1 Mar · Sweet Spot", sweetspot(3, 12, 180, 193, 5)),
    'w1-mer': ("S1 Mer · TEST FTP 20min", ftptest()),
    'w1-jeu': ("S1 Jeu · Force basse cadence", lowcadence(5, 5, 175, 190, 3)),
    'w1-sam': ("S1 Sam · Sortie longue 3h", longride(180)),
    'w1-dim': ("S1 Dim · Endurance", endurance(90)),
    # S2
    'w2-mar': ("S2 Mar · Sweet Spot", sweetspot(4, 12, 180, 190, 5)),
    'w2-mer': ("S2 Mer · Endurance Z2", endurance(120)),
    'w2-jeu': ("S2 Jeu · Over-unders", overunders(2, 4, 2, 205, 2, 185)),
    'w2-sam': ("S2 Sam · Sortie longue 3h30", longride(210)),
    'w2-dim': ("S2 Dim · Endurance", endurance(120)),
    # S3
    'w3-mar': ("S3 Mar · Seuil", threshold(3, 10, 200, 210, 5)),
    'w3-mer': ("S3 Mer · Endurance Z2", endurance(120)),
    'w3-jeu': ("S3 Jeu · Over-unders", overunders(3, 4, 2, 205, 2, 185)),
    'w3-sam': ("S3 Sam · Sortie longue 4h (Pilat)", longride(240)),
    'w3-dim': ("S3 Dim · Endurance sur fatigue", endurance(120)),
    # S4
    'w4-mar': ("S4 Mar · Sweet Spot", sweetspot(3, 15, 185, 190, 5)),
    'w4-mer': ("S4 Mer · Endurance Z2", endurance(90)),
    'w4-ven': ("S4 Ven · Ouverture", openers(45, 3, 180, 160, 180, 120)),
    'w4-sam': ("S4 Sam · Sortie longue 3h30", longride(210)),
    'w4-dim': ("S4 Dim · Endurance", endurance(120)),
    # S5
    'w5-mar': ("S5 Mar · Sweet Spot long", sweetspot(3, 20, 185, 192, 5)),
    'w5-mer': ("S5 Mer · Endurance + relances", endurance(120)),
    'w5-jeu': ("S5 Jeu · Over-unders + force", overunders(3, 4, 2, 205, 2, 185)),
    'w5-sam': ("S5 Sam · Sortie longue 4h30 (Vercors)", longride(270)),
    'w5-dim': ("S5 Dim · Endurance", endurance(120)),
    # S6
    'w6-mar': ("S6 Mar · Seuil", threshold(4, 10, 200, 210, 5)),
    'w6-mer': ("S6 Mer · Endurance Z2", endurance(120)),
    'w6-jeu': ("S6 Jeu · Sweet Spot", sweetspot(3, 15, 185, 192, 5)),
    'w6-sam': ("S6 Sam · Sortie longue 5h", longride(300)),
    'w6-dim': ("S6 Dim · Récupération", endurance(90, 110, 140)),
    # S7
    'w7-mar': ("S7 Mar · Seuil", threshold(4, 10, 200, 210, 5)),
    'w7-mer': ("S7 Mer · Endurance facile", endurance(90)),
    'w7-jeu': ("S7 Jeu · Sweet Spot court", sweetspot(3, 12, 185, 192, 5)),
    'w7-sam': ("S7 Sam · SORTIE REINE ~5h30", longride(345)),
    'w7-dim': ("S7 Dim · Récupération", endurance(120, 110, 140)),
    # S8 (affûtage)
    'w8-mar': ("S8 Mar · VO2 court", vo2(5, 3, 230, 3)),
    'w8-mer': ("S8 Mer · Endurance Z2", endurance(90)),
    'w8-jeu': ("S8 Jeu · Sweet Spot léger", sweetspot(2, 12, 185, 192, 5)),
    'w8-sam': ("S8 Sam · Sortie moyenne 3h", longride(180)),
    'w8-dim': ("S8 Dim · Endurance facile", endurance(90)),
    # S9 (course)
    'w9-mar': ("S9 Mar · Rappel", threshold(3, 3, 200, 210, 3)),
    'w9-mer': ("S9 Mer · Endurance facile", endurance(60)),
    'w9-ven': ("S9 Ven · Ouverture", openers(30, 3, 60, 210, 230, 120)),
}


def build(wid, name, steps):
    builder = FitFileBuilder(auto_define=True)

    fid = FileIdMessage()
    fid.type = FileType.WORKOUT
    fid.manufacturer = Manufacturer.GARMIN.value
    fid.product = 0
    fid.time_created = 1784505600000  # 2026-07-20 UTC en ms (date fixe, valide FIT)
    fid.serial_number = 0x10000000
    builder.add(fid)

    wk = WorkoutMessage()
    wk.workout_name = name
    wk.sport = Sport.CYCLING
    wk.num_valid_steps = len(steps)
    builder.add(wk)

    for i, st in enumerate(steps):
        m = WorkoutStepMessage()
        m.message_index = i
        m.workout_step_name = st['name']
        m.intensity = st['int']
        m.duration_type = WorkoutStepDuration.TIME
        m.duration_value = st['sec'] * 1000  # ms
        if st['lo'] is None:
            m.target_type = WorkoutStepTarget.OPEN  # effort libre (ex : test all-out)
        else:
            m.target_type = WorkoutStepTarget.POWER
            m.target_value = 0  # cible custom
            m.custom_target_power_low = st['lo'] + PW_OFFSET
            m.custom_target_power_high = st['hi'] + PW_OFFSET
        builder.add(m)

    out = os.path.join(OUT, f"{wid}.fit")
    builder.build().to_file(out)
    return out, len(steps)


def main():
    os.makedirs(OUT, exist_ok=True)
    total = 0
    for wid, (name, steps) in PLAN.items():
        _, n = build(wid, name, steps)
        total += 1
        print(f"  {wid}.fit  ({n} étapes)  {name}")
    print(f"\n{total} fichiers .FIT générés dans public/workouts/")


if __name__ == '__main__':
    main()
