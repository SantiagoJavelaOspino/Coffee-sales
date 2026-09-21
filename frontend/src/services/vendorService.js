import api from './api';

export const vendorService = {
  // Buscar vendedor por cédula
  getVendorByCedula: async (cedula) => {
    try {
      const response = await api.get(`/vendedores/cedula/${cedula}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Crear o actualizar vendedor
  createOrUpdateVendor: async (vendorData) => {
    const response = await api.post('/vendedores', vendorData);
    return response.data;
  }
};

export default vendorService;
