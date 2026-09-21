import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import purchaseService from '../services/purchaseService';
import { formatCOP, formatKilos } from '../utils/currencyFormatter';
import { ShoppingBag, History, PlusCircle, ArrowRight, Download, Eye, X, Coffee, Calendar, User, Trash2, AlertTriangle } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCompra, setSelectedCompra] = useState(null);

  // Estados para eliminación de compra
  const [compraToDelete, setCompraToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  // Cargar historial de compras
  const fetchPurchases = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await purchaseService.getPurchases();
      if (data && data.compras) {
        setCompras(data.compras);
      }
    } catch (err) {
      console.error('Error al cargar historial de compras:', err);
      setError('No fue posible cargar el historial de compras.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleDownloadVoucher = (compraId) => {
    purchaseService.downloadVoucher(compraId);
  };

  const handleConfirmDelete = async () => {
    if (!compraToDelete) return;
    setDeletingId(compraToDelete.id);
    setDeleteError('');
    try {
      await purchaseService.deletePurchase(compraToDelete.id);
      setCompras((prev) => prev.filter((c) => c.id !== compraToDelete.id));
      if (selectedCompra && selectedCompra.id === compraToDelete.id) {
        setSelectedCompra(null);
      }
      setCompraToDelete(null);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Error al intentar eliminar la compra.';
      setDeleteError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="main-content">
        {/* Banner de Bienvenida */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, var(--color-coffee-dark) 0%, var(--color-coffee-primary) 100%)',
          color: '#FFF',
          padding: '1.75rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div>
            <span style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              Panel Principal
            </span>
            <h1 style={{ color: '#FFF', fontSize: '1.6rem', marginTop: '0.5rem' }}>
              ¡Hola, {user?.nombre || 'Comprador'}! 👋
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Punto de compra de café Don Beto.
            </p>
          </div>

          {/* Botón Destacado: Realizar Compra */}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              onClick={() => navigate('/nueva-compra')}
              className="btn btn-amber"
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                padding: '1rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)'
              }}
            >
              <PlusCircle size={24} />
              <span>REALIZAR COMPRA DE CAFÉ</span>
              <ArrowRight size={20} style={{ marginLeft: 'auto' }} />
            </button>
          </div>
        </div>

        {/* Sección de Historial de Compras */}
        <div className="card">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={22} style={{ color: 'var(--color-coffee-medium)' }} />
              <h2 style={{ fontSize: '1.25rem' }}>Historial de Compras</h2>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {compras.length} {compras.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              Cargando historial de compras...
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : compras.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2.5rem 1rem',
              color: 'var(--text-muted)',
              backgroundColor: '#F9FAFB',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-light)'
            }}>
              <ShoppingBag size={40} style={{ margin: '0 auto 0.75rem auto', opacity: 0.4 }} />
              <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)' }}>
                No hay compras registradas aún
              </p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                Haga clic en "Realizar compra" para registrar la primera transacción.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem' }}># Compra</th>
                    <th style={{ padding: '0.75rem' }}>Vendedor</th>
                    <th style={{ padding: '0.75rem' }}>Kilos</th>
                    <th style={{ padding: '0.75rem' }}>Precio / kg</th>
                    <th style={{ padding: '0.75rem' }}>Total</th>
                    <th style={{ padding: '0.75rem' }}>Fecha</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {compras.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: 'var(--color-coffee-dark)' }}>
                        {c.numero_compra}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        {c.vendedor_nombre}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', fontWeight: 600 }}>
                        {formatKilos(c.kilos)}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem' }}>
                        {formatCOP(c.precio_kilo_final)}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', fontWeight: 700, color: 'var(--color-green-success)' }}>
                        {formatCOP(c.total_final)}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(c.fecha_compra).toLocaleDateString('es-CO')}
                      </td>
                      <td style={{ padding: '0.85rem 0.75rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => setSelectedCompra(c)}
                            style={{
                              background: '#F3F4F6',
                              border: '1px solid var(--border-light)',
                              padding: '0.35rem 0.6rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              fontSize: '0.8rem',
                              fontWeight: 600
                            }}
                            title="Ver detalle"
                          >
                            <Eye size={14} />
                            <span>Ver</span>
                          </button>

                          <button
                            onClick={() => handleDownloadVoucher(c.id)}
                            style={{
                              background: '#FEF3C7',
                              border: '1px solid var(--color-amber)',
                              color: '#92400E',
                              padding: '0.35rem 0.6rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              fontSize: '0.8rem',
                              fontWeight: 600
                            }}
                            title="Descargar voucher PDF"
                          >
                            <Download size={14} />
                            <span>Voucher</span>
                          </button>

                          <button
                            onClick={() => setCompraToDelete(c)}
                            style={{
                              background: '#FEE2E2',
                              border: '1px solid #FCA5A5',
                              color: '#991B1B',
                              padding: '0.35rem 0.6rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem',
                              fontSize: '0.8rem',
                              fontWeight: 600
                            }}
                            title="Eliminar compra"
                          >
                            <Trash2 size={14} />
                            <span>Borrar</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle de Compra */}
      {selectedCompra && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', position: 'relative' }}>
            <button
              onClick={() => setSelectedCompra(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-coffee-dark)' }}>
              Detalle de Compra {selectedCompra.numero_compra}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.95rem' }}>
              <div><strong>Vendedor:</strong> {selectedCompra.vendedor_nombre} ({selectedCompra.vendedor_cedula})</div>
              <div><strong>Teléfono:</strong> {selectedCompra.vendedor_telefono}</div>
              <hr style={{ borderColor: 'var(--border-light)', margin: '0.5rem 0' }} />
              <div><strong>Kilos:</strong> {formatKilos(selectedCompra.kilos)}</div>
              <div><strong>Valor Inicial Carga:</strong> {formatCOP(selectedCompra.valor_carga_inicial)}</div>
              <div><strong>Precio Inicial / kg:</strong> {formatCOP(selectedCompra.precio_kilo_inicial)}</div>
              <div><strong>Precio Final / kg:</strong> {formatCOP(selectedCompra.precio_kilo_final)}</div>
              <div><strong>Total Final:</strong> <span style={{ color: 'var(--color-green-success)', fontWeight: 800 }}>{formatCOP(selectedCompra.total_final)}</span></div>
              <div><strong>Fecha:</strong> {new Date(selectedCompra.fecha_compra).toLocaleString('es-CO')}</div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleDownloadVoucher(selectedCompra.id)}
                className="btn btn-amber"
                style={{ flex: 1 }}
              >
                <Download size={18} />
                <span>Descargar Voucher PDF</span>
              </button>

              <button
                onClick={() => {
                  const comp = selectedCompra;
                  setSelectedCompra(null);
                  setCompraToDelete(comp);
                }}
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.6rem 1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Trash2 size={16} />
                <span>Borrar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {compraToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 1100
        }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2937', marginBottom: '0.5rem' }}>
              ¿Eliminar la compra {compraToDelete.numero_compra}?
            </h3>

            <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Esta acción eliminará permanentemente el registro de <strong>{compraToDelete.vendedor_nombre}</strong> ({formatCOP(compraToDelete.total_final)}) de la base de datos.
            </p>

            {deleteError && (
              <div className="alert alert-danger" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                {deleteError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => { setCompraToDelete(null); setDeleteError(''); }}
                className="btn btn-secondary"
                disabled={!!deletingId}
                style={{ flex: 1 }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={!!deletingId}
                style={{
                  flex: 1,
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0.75rem'
                }}
              >
                {deletingId ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
