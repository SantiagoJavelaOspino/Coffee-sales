import React, { useState } from 'react';
import purchaseService from '../../services/purchaseService';
import { formatCOP, formatKilos } from '../../utils/currencyFormatter';
import { FileText, User, ShoppingBag, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const Step3Summary = ({ purchaseData, onFinish, onBack }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    kilos,
    valorCargaInicial,
    precioKiloInicial,
    precioKiloFinal,
    isCustomPrice,
    totalFinal,
    vendedor
  } = purchaseData;

  const handleConfirmPurchase = async () => {
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        kilos,
        valor_carga_inicial: valorCargaInicial,
        precio_kilo_inicial: precioKiloInicial,
        precio_kilo_final: precioKiloFinal,
        total_final: totalFinal,
        vendedor
      };

      const response = await purchaseService.createPurchase(payload);

      if (response && (response.compra || response.id)) {
        onFinish(response.compra || response);
      } else {
        setError('No fue posible guardar la compra. Respuesta del servidor incompleta.');
      }
    } catch (err) {
      const msg = err.message || err.response?.data?.error || 'No fue posible guardar la compra. Verifique los datos e intente nuevamente.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-light)',
        paddingBottom: '0.75rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: 'var(--color-coffee-primary)',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FileText size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Paso 3: Resumen de Compra</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Revise la información detallada antes de finalizar la transacción
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Sección Vendedor */}
      <div style={{
        backgroundColor: '#F9FAFB',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-coffee-dark)' }}>
          <User size={18} style={{ color: 'var(--color-coffee-medium)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>DATOS DEL VENDEDOR</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.95rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem' }}>Nombre:</span>
            <strong style={{ color: 'var(--text-main)' }}>{vendedor?.nombre}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem' }}>Cédula:</span>
            <strong>{vendedor?.cedula}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.85rem' }}>Teléfono:</span>
            <strong>{vendedor?.telefono}</strong>
          </div>
        </div>
      </div>

      {/* Sección Detalles de Compra */}
      <div style={{
        backgroundColor: '#FDFBF7',
        border: '1.5px solid var(--color-coffee-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--color-coffee-dark)' }}>
          <ShoppingBag size={18} style={{ color: 'var(--color-coffee-medium)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>DETALLE DE LA COMPRA</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.95rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Cantidad de Kilos:</span>
            <strong>{formatKilos(kilos)}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Valor inicial de la carga:</span>
            <span>{formatCOP(valorCargaInicial)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Precio inicial por kilo:</span>
            <span>{formatCOP(precioKiloInicial)} / kg</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px dashed var(--border-light)' }}>
            <span style={{ color: 'var(--color-coffee-dark)', fontWeight: 600 }}>
              Precio final por kilo:
            </span>
            <span style={{
              fontWeight: 700,
              fontSize: '1.05rem',
              color: isCustomPrice ? 'var(--color-amber)' : 'var(--color-coffee-dark)'
            }}>
              {formatCOP(precioKiloFinal)} / kg {isCustomPrice ? '(Modificado)' : ''}
            </span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.75rem',
            paddingTop: '0.75rem',
            borderTop: '2px solid var(--color-coffee-primary)'
          }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-coffee-dark)' }}>
              TOTAL A PAGAR:
            </span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-green-success)' }}>
              {formatCOP(totalFinal)}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          type="button"
          onClick={onBack}
          className="btn btn-secondary"
          disabled={submitting}
          style={{ height: '52px', flex: '1' }}
        >
          <ArrowLeft size={20} />
          <span>MODIFICAR</span>
        </button>

        <button
          type="button"
          onClick={handleConfirmPurchase}
          disabled={submitting}
          className="btn btn-amber"
          style={{ height: '52px', flex: '2', fontWeight: 800, fontSize: '1.15rem' }}
        >
          {submitting ? (
            <span>GUARDANDO COMPRA...</span>
          ) : (
            <>
              <CheckCircle2 size={22} />
              <span>FINALIZAR COMPRA</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step3Summary;
