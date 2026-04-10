import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MovieGrid } from './components/MovieGrid';
import { Favorites } from './components/Favorites';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>🍿 Cine-Stream</h1>
            <nav>
              <Link to="/" className="nav-link">Discover</Link>
              <Link to="/favorites" className="nav-link">Favorites</Link>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<MovieGrid />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;