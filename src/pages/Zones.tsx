import { useState } from 'react'
import { athlete, zoneDefs, zoneWatts } from '../data/plan'

export function Zones() {
  const [ftp, setFtp] = useState(athlete.ftp)

  return (
    <>
      <section className="card">
        <h2>Zones de puissance</h2>
        <p className="small muted">
          Zones de Coggan calculées depuis ta FTP. Change la valeur pour recalculer (local, rien n'est envoyé).
        </p>
        <div className="ftp-row">
          <label htmlFor="ftp">FTP :</label>
          <input
            id="ftp"
            type="number"
            value={ftp}
            min={100}
            max={400}
            onChange={(e) => setFtp(Math.max(50, Math.min(500, Number(e.target.value) || 0)))}
          />
          <span className="muted">W</span>
          <button className="btn" onClick={() => setFtp(athlete.ftp)}>
            Reset ({athlete.ftp} W)
          </button>
        </div>
        <p className="small muted">
          eFTP Intervals.icu : {athlete.eftp} W · {athlete.weight} kg → {(ftp / athlete.weight).toFixed(2)} W/kg
        </p>

        <div className="tablewrap" style={{ marginTop: 10 }}>
          <table>
            <thead>
              <tr>
                <th>Zone</th>
                <th>% FTP</th>
                <th>Watts</th>
                <th>RPE</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              {zoneDefs.map((z) => (
                <tr key={z.key}>
                  <td>
                    <strong>{z.name}</strong>
                  </td>
                  <td>
                    {z.lo === 0 ? `< ${z.hi}%` : `${z.lo}–${z.hi}%`}
                  </td>
                  <td>{zoneWatts(z, ftp)}</td>
                  <td>{z.rpe}</td>
                  <td className="small">{z.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3>Sur les cols : pace au ressenti</h3>
        <p className="small">
          Ne dépasse jamais ~7/10 (Sweet Spot) sur une montée dans les deux premiers tiers d'une sortie longue
          ou le jour J. C'est comme ça qu'on finit fort au lieu de craquer sur Font d'Urle.
        </p>
      </section>
    </>
  )
}
