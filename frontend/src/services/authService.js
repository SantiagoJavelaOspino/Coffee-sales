import api from './api';

export const authService = {
  // Iniciar sesión
  login: async (cedula, password) => {
    const response = await api.post('/auth/login', { cedula, password });
    return response.data;
  },

  // Obtener perfil del usuario autenticado
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

export default authService;
