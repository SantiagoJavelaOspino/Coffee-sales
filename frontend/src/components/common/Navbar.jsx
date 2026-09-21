import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Coffee } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <Coffee size={24} style={{ color: 'var(--color-coffee-light)' }} />
          <span>CompraVenta de Café Don Beto</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
            <User size={18} />
            <span style={{ fontWeight: 600 }}>{user?.nombre || 'Comprador'}</span>
          </div>

          <button
            onClick={logout}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#FFF',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
            title="Cerrar sesión"
          >
            <LogOut size={16} />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
