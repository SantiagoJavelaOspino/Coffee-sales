import api from './api';

export const purchaseService = {
  // Crear una nueva compra de café
  createPurchase: async (purchaseData) => {
    const response = await api.post('/compras', purchaseData);
    return response.data;
  },

  // Obtener la lista del historial de compras
  getPurchases: async () => {
    const response = await api.get('/compras');
    return response.data;
  },

  // Obtener el detalle de una compra específica
  getPurchaseById: async (id) => {
    const response = await api.get(`/compras/${id}`);
    return response.data;
  }
};

export default purchaseService;
