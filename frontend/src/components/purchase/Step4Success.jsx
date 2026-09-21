import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCOP, formatKilos } from '../../utils/currencyFormatter';
import purchaseService from '../../services/purchaseService';
import { CheckCircle, Download, Home } from 'lucide-react';

const Step4Success = ({ completedPurchase }) => {
  const navigate = useNavigate();

  if (!completedPurchase) return null;

  const {
    numero_compra,
    kilos,
    precio_kilo_final,
    total_final,
    vendedor
  } = completedPurchase;

  const handleDownloadVoucher = () => {
    if (completedPurchase.id) {
      purchaseService.downloadVoucher(completedPurchase.id);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '580px', margin: '0 auto', textAlign: 'center', padding: '2.5rem 1.5rem' }}>
      {/* Icono Exitoso */}
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: '#DCFCE7',
        color: 'var(--color-green-success)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem'
      }}>
        <CheckCircle size={44} />
      </div>

      <h2 style={{ fontSize: '1.6rem', color: 'var(--color-green-success)', marginBottom: '0.25rem' }}>
        ¡Compra realizada correctamente!
      </h2>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
        La transacción se ha guardado de forma segura en la base de datos.
      </p>

      {/* Tarjeta de Resumen Rápido */}
      <div style={{
        backgroundColor: '#F9FAFB',
        border: '1.5px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        textAlign: 'left',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '0.75rem',
          marginBottom: '0.75rem'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Número de Compra:</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-coffee-dark)' }}>
            {numero_compra}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.95rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem' }}>Vendedor:</span>
            <strong>{vendedor?.nombre}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem' }}>Kilos:</span>
            <strong>{formatKilos(kilos)}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem' }}>Precio final / kg:</span>
            <strong>{formatCOP(precio_kilo_final)}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem' }}>Total pagado:</span>
            <strong style={{ color: 'var(--color-green-success)', fontSize: '1.1rem' }}>{formatCOP(total_final)}</strong>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <button
          type="button"
          onClick={handleDownloadVoucher}
          className="btn btn-amber"
          style={{ height: '52px', fontSize: '1.1rem', fontWeight: 700 }}
        >
          <Download size={20} />
          <span>DESCARGAR VOUCHER PDF</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="btn btn-secondary"
          style={{ height: '50px' }}
        >
          <Home size={20} />
          <span>VOLVER AL INICIO</span>
        </button>
      </div>
    </div>
  );
};

export default Step4Success;
