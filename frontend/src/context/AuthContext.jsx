import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('don_beto_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('don_beto_token'));
  const [loading, setLoading] = useState(true);

  // Verificar validez del token al cargar la aplicación
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('don_beto_token');
      if (storedToken) {
        try {
          const data = await authService.getMe();
          setUser(data.usuario);
          localStorage.setItem('don_beto_user', JSON.stringify(data.usuario));
        } catch (err) {
          console.warn('Sesión expirada o token inválido:', err.message);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (cedula, password) => {
    try {
      const data = await authService.login(cedula, password);
      
      const { token: newToken, usuario } = data;
      
      setToken(newToken);
      setUser(usuario);
      
      localStorage.setItem('don_beto_token', newToken);
      localStorage.setItem('don_beto_user', JSON.stringify(usuario));
      
      return { success: true, usuario };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'No fue posible conectar con el servidor.';
      return { success: false, error: errorMessage };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('don_beto_token');
    localStorage.removeItem('don_beto_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
