import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adjuntar el token JWT a cada solicitud si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('don_beto_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globales
api.interceptors.response.use(
  (response) => {
    // Si el servidor respondió con HTML en lugar de JSON (p.ej. redirección 200 de Vercel a index.html)
    if (typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')) {
      return Promise.reject(new Error('Respuesta inesperada del servidor API (HTML en lugar de JSON).'));
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Limpiar token vencido o inválido
      localStorage.removeItem('don_beto_token');
      localStorage.removeItem('don_beto_user');
      
      // Si no está ya en la pantalla de login, redirigir
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
