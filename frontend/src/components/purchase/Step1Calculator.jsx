import React, { useState } from 'react';
import { formatCOP, formatKilos } from '../../utils/currencyFormatter';
import { Calculator, ArrowRight, AlertCircle } from 'lucide-react';

const Step1Calculator = ({ purchaseData, updatePurchaseData, onNext }) => {
  const [kilos, setKilos] = useState(purchaseData.kilos ? purchaseData.kilos.toString() : '');
  const [valorCarga, setValorCarga] = useState(
    purchaseData.valorCargaInicial ? purchaseData.valorCargaInicial.toString() : ''
  );
  const [precioKilo, setPrecioKilo] = useState(
    purchaseData.precioKiloFinal ? purchaseData.precioKiloFinal.toString() : ''
  );
  const [error, setError] = useState('');

  // 1. Manejar cambio en Kilos: SOLO actualiza los kilos (NO altera el valor de la carga)
  const handleKilosChange = (val) => {
    setKilos(val);
  };

  // 2. Manejar cambio en Valor de la Carga: Calcula el precio por kilo
  const handleValorCargaChange = (val) => {
    setValorCarga(val);
    const numCarga = parseFloat(val) || 0;
    const numKilos = parseFloat(kilos) || 0;

    if (numKilos > 0 && numCarga > 0) {
      setPrecioKilo(Math.round(numCarga / numKilos).toString());
    }
  };

  // 3. Manejar cambio en Precio por Kilo: Actualiza el valor de la carga sola
  const handlePrecioKiloChange = (val) => {
    setPrecioKilo(val);
    const numPrecio = parseFloat(val) || 0;
    const numKilos = parseFloat(kilos) || 0;

    if (numKilos > 0 && numPrecio > 0) {
      setValorCarga(Math.round(numKilos * numPrecio).toString());
    }
  };

  const numKilos = parseFloat(kilos) || 0;
  const numValorCarga = parseFloat(valorCarga) || 0;
  const numPrecioKilo = parseFloat(precioKilo) || (numKilos > 0 && numValorCarga > 0 ? Math.round(numValorCarga / numKilos) : 0);

  // Total Final = Kilos * Precio por Kilo
  const totalFinal = Math.round(numKilos * (numPrecioKilo || (numValorCarga / (numKilos || 1))));

  const handleContinue = (e) => {
    e.preventDefault();
    setError('');

    if (numKilos <= 0) {
      setError('Los kilos deben ser mayores que cero.');
      return;
    }

    if (numValorCarga <= 0 && numPrecioKilo <= 0) {
      setError('Debe ingresar el valor de la carga o el precio por kilo.');
      return;
    }

    const finalPrecioKilo = numPrecioKilo > 0 ? numPrecioKilo : Math.round(numValorCarga / numKilos);
    const finalValorCarga = numValorCarga > 0 ? numValorCarga : Math.round(numKilos * finalPrecioKilo);
    const finalTotal = Math.round(numKilos * finalPrecioKilo);

    // Guardar datos calculados en el wizard
    updatePurchaseData({
      kilos: numKilos,
      valorCargaInicial: finalValorCarga,
      precioKiloInicial: finalPrecioKilo,
      precioKiloFinal: finalPrecioKilo,
      isCustomPrice: true,
      totalFinal: finalTotal
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
            Ingrese los kilos y el precio por kilo o valor de la carga
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
        {/* Campo 1: Cantidad de Kilos (NO altera el valor de la carga al escribir) */}
        <div className="form-group">
          <label className="form-label" htmlFor="kilos">
            1. Cantidad de Kilos de Café:
          </label>
          <input
            id="kilos"
            type="number"
            step="any"
            className="form-control"
            placeholder="Ejemplo: 125"
            value={kilos}
            onChange={(e) => handleKilosChange(e.target.value)}
            required
            autoFocus
            style={{ fontSize: '1.2rem', fontWeight: 600 }}
          />
        </div>

        {/* Campo 2: Precio por Kilo */}
        <div className="form-group">
          <label className="form-label" htmlFor="precioKilo" style={{ color: 'var(--color-coffee-dark)' }}>
            2. Precio por Kilo ($):
          </label>
          <input
            id="precioKilo"
            type="number"
            step="any"
            className="form-control"
            placeholder="Ejemplo: 16000"
            value={precioKilo}
            onChange={(e) => handlePrecioKiloChange(e.target.value)}
            style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              borderColor: 'var(--color-amber)',
              backgroundColor: '#FFFBEB'
            }}
          />
          {numPrecioKilo > 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-amber)', marginTop: '0.3rem', fontWeight: 600 }}>
              Formato: {formatCOP(numPrecioKilo)} / kg
            </p>
          )}
        </div>

        {/* Campo 3: Valor de la Carga */}
        <div className="form-group">
          <label className="form-label" htmlFor="valorCarga">
            3. Valor de la Carga ($):
          </label>
          <input
            id="valorCarga"
            type="number"
            step="any"
            className="form-control"
            placeholder="Ejemplo: 2000000"
            value={valorCarga}
            onChange={(e) => handleValorCargaChange(e.target.value)}
            style={{ fontSize: '1.2rem', fontWeight: 600 }}
          />
          {numValorCarga > 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-coffee-medium)', marginTop: '0.3rem', fontWeight: 600 }}>
              Formato Carga: {formatCOP(numValorCarga)}
            </p>
          )}
        </div>

        {/* Resumen de Total Final */}
        {numKilos > 0 && (numPrecioKilo > 0 || numValorCarga > 0) && (
          <div style={{
            backgroundColor: '#FDFBF7',
            border: '2px solid var(--color-coffee-light)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginTop: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--color-coffee-dark)', fontWeight: 700 }}>
                  VALOR TOTAL FINAL DE COMPRA:
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ({formatKilos(numKilos)} × {formatCOP(numPrecioKilo || (numValorCarga / numKilos))})
                </span>
              </div>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-green-success)' }}>
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
