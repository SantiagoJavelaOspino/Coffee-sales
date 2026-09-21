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
  },

  // Eliminar una compra por ID
  deletePurchase: async (id) => {
    const response = await api.delete(`/compras/${id}`);
    return response.data;
  },

  // Abrir y descargar el Voucher PDF en una pestaña nueva pasando el token de autenticación
  downloadVoucher: (compraId) => {
    const token = localStorage.getItem('don_beto_token');
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    const url = `${baseUrl}/compras/${compraId}/voucher?token=${encodeURIComponent(token || '')}`;
    window.open(url, '_blank');
  }
};

export default purchaseService;
