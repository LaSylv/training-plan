import { NavLink, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Seances } from './pages/Seances'
import { Zones } from './pages/Zones'
import { Strength } from './pages/Strength'
import { RaceDay } from './pages/RaceDay'
import { Climbs } from './pages/Climbs'
import { SeanceGuidee } from './pages/SeanceGuidee'

const TABS = [
  { to: '/', ico: '🏠', label: 'Accueil', end: true },
  { to: '/seances', ico: '🚴', label: 'Séances' },
  { to: '/zones', ico: '⚡', label: 'Zones' },
  { to: '/muscu', ico: '🏋️', label: 'Salle' },
  { to: '/jour-j', ico: '🏁', label: 'Jour J' },
  { to: '/cols', ico: '⛰️', label: 'Cols' },
]

export default function App() {
  return (
    <>
      <header className="topbar">
        <div>
          <h1>Training LaSylv</h1>
          <div className="sub">Séances à piocher · La Bisou le 27 sept.</div>
        </div>
      </header>

      <main className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/seances" element={<Seances />} />
          <Route path="/zones" element={<Zones />} />
          <Route path="/muscu" element={<Strength />} />
          <Route path="/jour-j" element={<RaceDay />} />
          <Route path="/cols" element={<Climbs />} />
          <Route path="/seance/:id" element={<SeanceGuidee />} />
        </Routes>
      </main>

      <nav className="tabs">
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span className="ico">{t.ico}</span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
