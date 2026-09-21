import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="navbar">
          <div className="navbar-inner">
            <div className="navbar-brand">
              ☕ <span>CompraVenta de Café Don Beto</span>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
                <h2>Sistema CompraVenta de Café Don Beto</h2>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                  Estructura base del frontend configurada y lista para las siguientes fases.
                </p>
              </div>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
