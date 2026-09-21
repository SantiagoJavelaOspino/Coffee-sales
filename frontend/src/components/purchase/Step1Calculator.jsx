import React, { useState, useEffect } from 'react';
import { formatCOP, formatKilos } from '../../utils/currencyFormatter';
import { Calculator, Edit3, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';

const Step1Calculator = ({ purchaseData, updatePurchaseData, onNext }) => {
  const [kilos, setKilos] = useState(purchaseData.kilos || '');
  const [valorCarga, setValorCarga] = useState(purchaseData.valorCargaInicial || '');
  const [precioKiloFinal, setPrecioKiloFinal] = useState(purchaseData.precioKiloFinal || '');
  const [isCustomPrice, setIsCustomPrice] = useState(purchaseData.isCustomPrice || false);
  const [error, setError] = useState('');

  // Cálculos automáticos en tiempo real
  const numKilos = parseFloat(kilos) || 0;
  const numValorCarga = parseFloat(valorCarga) || 0;
  
  // Precio inicial calculado automáticamente (RN03)
  const precioKiloInicial = numKilos > 0 ? Math.round(numValorCarga / numKilos) : 0;

  // Precio final por kilo (utiliza el personalizado si está activo, sino el inicial)
  const currentPrecioFinal = isCustomPrice
    ? (parseFloat(precioKiloFinal) || 0)
    : precioKiloInicial;

  // Total final de la compra (RN06)
  const totalFinal = Math.round(numKilos * currentPrecioFinal);

  // Cuando cambie el precio inicial y no sea personalizado, sincronizar precio final
  useEffect(() => {
    if (!isCustomPrice) {
      setPrecioKiloFinal(precioKiloInicial > 0 ? precioKiloInicial.toString() : '');
    }
  }, [precioKiloInicial, isCustomPrice]);

  const handleToggleCustomPrice = () => {
    if (!isCustomPrice) {
      setIsCustomPrice(true);
      if (!precioKiloFinal && precioKiloInicial > 0) {
        setPrecioKiloFinal(precioKiloInicial.toString());
      }
    } else {
      setIsCustomPrice(false);
      setPrecioKiloFinal(precioKiloInicial > 0 ? precioKiloInicial.toString() : '');
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    setError('');

    if (numKilos <= 0) {
      setError('Los kilos deben ser mayores que cero (RN01).');
      return;
    }

    if (numValorCarga <= 0) {
      setError('Debe ingresar el valor inicial de la carga (RN02).');
      return;
    }

    if (currentPrecioFinal <= 0) {
      setError('El precio por kilo no puede ser menor o igual a cero.');
      return;
    }

    // Guardar datos calculados en el estado principal del wizard
    updatePurchaseData({
      kilos: numKilos,
      valorCargaInicial: numValorCarga,
      precioKiloInicial,
      precioKiloFinal: currentPrecioFinal,
      isCustomPrice,
      totalFinal
    });

    onNext();
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
          <Calculator size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Paso 1: Calculadora de Compra</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Ingrese los kilos y el valor inicial de la carga de café
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleContinue}>
        {/* Campo 1: Kilos */}
        <div className="form-group">
          <label className="form-label" htmlFor="kilos">
            1. Cantidad de Kilos de Café:
          </label>
          <input
            id="kilos"
            type="number"
            step="0.01"
            min="0.1"
            className="form-control"
            placeholder="Ejemplo: 125"
            value={kilos}
            onChange={(e) => setKilos(e.target.value)}
            required
            autoFocus
            style={{ fontSize: '1.2rem', fontWeight: 600 }}
          />
        </div>

        {/* Campo 2: Valor Inicial de la Carga */}
        <div className="form-group">
          <label className="form-label" htmlFor="valorCarga">
            2. Valor Inicial de la Carga ($):
          </label>
          <input
            id="valorCarga"
            type="number"
            min="1"
            step="100"
            className="form-control"
            placeholder="Ejemplo: 2000000"
            value={valorCarga}
            onChange={(e) => setValorCarga(e.target.value)}
            required
            style={{ fontSize: '1.2rem', fontWeight: 600 }}
          />
          {numValorCarga > 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-coffee-medium)', marginTop: '0.3rem', fontWeight: 600 }}>
              Formato: {formatCOP(numValorCarga)}
            </p>
          )}
        </div>

        {/* Resumen de Cálculos Automáticos */}
        {numKilos > 0 && numValorCarga > 0 && (
          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1.5px solid #FDE68A',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginTop: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', color: '#92400E', fontWeight: 600 }}>
                Precio inicial por kilo (Calculado):
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-coffee-dark)' }}>
                {formatCOP(precioKiloInicial)} / kg
              </span>
            </div>

            {/* Opción Visual Diferenciada: Cambiar valor por kilo */}
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #FCD34D' }}>
              <button
                type="button"
                onClick={handleToggleCustomPrice}
                style={{
                  background: isCustomPrice ? '#FEF3C7' : '#FFFFFF',
                  border: '1.5px solid var(--color-amber)',
                  color: '#92400E',
                  padding: '0.6rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <Edit3 size={18} />
                <span>{isCustomPrice ? 'Restablecer precio calculado' : '✏️ Cambiar valor por kilo'}</span>
              </button>

              {/* Campo para modificar manualmente el precio por kilo */}
              {isCustomPrice && (
                <div style={{ marginTop: '1rem' }}>
                  <label className="form-label" style={{ color: '#92400E' }}>
                    Ingrese el Nuevo Precio por Kilo ($):
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    className="form-control"
                    placeholder="Ejemplo: 16500"
                    value={precioKiloFinal}
                    onChange={(e) => setPrecioKiloFinal(e.target.value)}
                    style={{
                      borderColor: 'var(--color-amber)',
                      backgroundColor: '#FFFFFF',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--color-coffee-dark)'
                    }}
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Total Recalculado */}
            <div style={{
              marginTop: '1.25rem',
              paddingTop: '0.75rem',
              borderTop: '2px solid #F59E0B',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#92400E', fontWeight: 600 }}>
                  VALOR TOTAL FINAL DE COMPRA:
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ({formatKilos(numKilos)} × {formatCOP(currentPrecioFinal)})
                </span>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-green-success)' }}>
                {formatCOP(totalFinal)}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          style={{ height: '52px', fontSize: '1.1rem', fontWeight: 700, marginTop: '1rem' }}
        >
          <span>CONTINUAR</span>
          <ArrowRight size={20} />
        </button>
      </form>
    </div>
  );
};

export default Step1Calculator;
