import { NavLink, Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Plan } from './pages/Plan'
import { Zones } from './pages/Zones'
import { Strength } from './pages/Strength'
import { RaceDay } from './pages/RaceDay'
import { Climbs } from './pages/Climbs'
import { SeanceGuidee } from './pages/SeanceGuidee'

const TABS = [
  { to: '/', ico: '🏠', label: 'Accueil', end: true },
  { to: '/plan', ico: '📅', label: 'Plan' },
  { to: '/zones', ico: '⚡', label: 'Zones' },
  { to: '/muscu', ico: '🏋️', label: 'Muscu' },
  { to: '/jour-j', ico: '🏁', label: 'Jour J' },
  { to: '/cols', ico: '⛰️', label: 'Cols' },
]

export default function App() {
  return (
    <>
      <header className="topbar">
        <div>
          <h1>Vercors 130</h1>
          <div className="sub">Plan d'entraînement · 9 semaines</div>
        </div>
      </header>

      <main className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<Plan />} />
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
