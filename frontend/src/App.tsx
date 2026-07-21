import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { BrandMark } from './components/BrandMark'
import { FavoritesProvider } from './favoritesContext'
import { AtpRankings } from './pages/AtpRankings'
import { WtaRankings } from './pages/WtaRankings'
import { CountryRankings } from './pages/CountryRankings'
import { Favorites } from './pages/Favorites'
import { PlayerProfile } from './pages/PlayerProfile'
import { TournamentResults } from './pages/TournamentResults'
import { FinalMatch } from './pages/FinalMatch'
import './App.css'

function App() {
  return (
    <FavoritesProvider>
      <div className="app-shell">
        <header className="top-nav">
          <div className="brand">
            <BrandMark className="brand-mark" />
            <div>
              <p className="brand-title">Tennis Tracker</p>
              <p className="brand-subtitle">Season snapshot · 15 July 2026</p>
            </div>
          </div>
          <nav className="nav-links" aria-label="Primary">
            <NavLink to="/atp" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              ATP
            </NavLink>
            <NavLink to="/wta" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              WTA
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              Favorites
            </NavLink>
            <NavLink
              to="/countries"
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              Countries
            </NavLink>
            <NavLink to="/results" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Results
            </NavLink>
            <NavLink to="/final" className={({ isActive }) => (isActive ? 'active' : undefined)}>
              Final
            </NavLink>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/atp" replace />} />
            <Route path="/players/:playerId" element={<PlayerProfile />} />
            <Route path="/atp" element={<AtpRankings />} />
            <Route path="/wta" element={<WtaRankings />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/countries" element={<CountryRankings />} />
            <Route path="/results" element={<TournamentResults />} />
            <Route path="/final" element={<FinalMatch />} />
          </Routes>
        </main>
      </div>
    </FavoritesProvider>
  )
}

export default App
