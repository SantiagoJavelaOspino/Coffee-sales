import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Coffee, Lock, CreditCard, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!cedula.trim() || !password.trim()) {
      setError('Por favor, ingrese su cédula y contraseña.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await login(cedula.trim(), password);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Las credenciales son incorrectas.');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backgroundColor: 'var(--bg-main)'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '420px',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem 1.5rem'
      }}>
        {/* Encabezado del Formulario */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-coffee-dark)',
            color: '#FFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            <Coffee size={32} style={{ color: 'var(--color-coffee-light)' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>CompraVenta de Café</h1>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--color-coffee-medium)', fontWeight: 600 }}>Don Beto</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Ingrese sus credenciales para acceder al sistema
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="cedula">Cédula de Identidad</label>
            <div style={{ position: 'relative' }}>
              <CreditCard size={20} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="cedula"
                type="text"
                className="form-control"
                placeholder="Ej. 123456789"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                style={{ paddingLeft: '44px' }}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{
              height: '52px',
              fontSize: '1.1rem',
              fontWeight: 700,
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? (
              <span>Iniciando sesión...</span>
            ) : (
              <>
                <LogIn size={20} />
                <span>Iniciar sesión</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
