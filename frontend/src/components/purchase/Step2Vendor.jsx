import React, { useState } from 'react';
import vendorService from '../../services/vendorService';
import { User, Phone, CreditCard, ArrowLeft, ArrowRight, AlertCircle, Search, CheckCircle } from 'lucide-react';

const Step2Vendor = ({ purchaseData, updatePurchaseData, onNext, onBack }) => {
  const [cedula, setCedula] = useState(purchaseData.vendedor?.cedula || '');
  const [nombre, setNombre] = useState(purchaseData.vendedor?.nombre || '');
  const [telefono, setTelefono] = useState(purchaseData.vendedor?.telefono || '');
  const [searchingVendor, setSearchingVendor] = useState(false);
  const [vendorFound, setVendorFound] = useState(false);
  const [error, setError] = useState('');

  // Buscar vendedor si ya ha vendido antes a Don Beto
  const handleSearchVendor = async (cedulaToSearch) => {
    const cleanCedula = cedulaToSearch || cedula;
    if (!cleanCedula || cleanCedula.trim().length < 5) return;

    setSearchingVendor(true);
    setVendorFound(false);

    try {
      const data = await vendorService.getVendorByCedula(cleanCedula.trim());
      if (data && data.vendedor) {
        setNombre(data.vendedor.nombre);
        setTelefono(data.vendedor.telefono);
        setVendorFound(true);
      }
    } catch (err) {
      // Vendedor no encontrado (es normal si es la primera vez que vende)
    } finally {
      setSearchingVendor(false);
    }
  };

  const handleCedulaBlur = () => {
    handleSearchVendor(cedula);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!cedula.trim()) {
      setError('La cédula del vendedor es obligatoria.');
      return;
    }

    if (!nombre.trim()) {
      setError('El nombre completo del vendedor es obligatorio.');
      return;
    }

    if (!telefono.trim()) {
      setError('El teléfono del vendedor es obligatorio.');
      return;
    }

    // Actualizar los datos del vendedor en el wizard
    updatePurchaseData({
      vendedor: {
        cedula: cedula.trim(),
        nombre: nombre.trim(),
        telefono: telefono.trim()
      }
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
          <User size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem' }}>Paso 2: Datos del Vendedor</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Ingrese los datos de la persona que entrega el café
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {vendorFound && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <CheckCircle size={20} style={{ flexShrink: 0 }} />
          <span>Vendedor encontrado previamente. Datos autocompletados.</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Cédula del Vendedor */}
        <div className="form-group">
          <label className="form-label" htmlFor="vendorCedula">
            Cédula de Identidad del Vendedor *
          </label>
          <div style={{ position: 'relative' }}>
            <CreditCard size={20} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              id="vendorCedula"
              type="text"
              className="form-control"
              placeholder="Ejemplo: 987654321"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              onBlur={handleCedulaBlur}
              required
              style={{ paddingLeft: '44px' }}
              autoFocus
            />
            {searchingVendor && (
              <Search size={18} style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-amber)',
                animation: 'pulse 1s infinite'
              }} />
            )}
          </div>
        </div>

        {/* Nombre del Vendedor */}
        <div className="form-group">
          <label className="form-label" htmlFor="vendorNombre">
            Nombre Completo del Vendedor *
          </label>
          <div style={{ position: 'relative' }}>
            <User size={20} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              id="vendorNombre"
              type="text"
              className="form-control"
              placeholder="Ejemplo: Carlos Ramírez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={{ paddingLeft: '44px' }}
            />
          </div>
        </div>

        {/* Teléfono del Vendedor */}
        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
          <label className="form-label" htmlFor="vendorTelefono">
            Teléfono de Contacto *
          </label>
          <div style={{ position: 'relative' }}>
            <Phone size={20} style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }} />
            <input
              id="vendorTelefono"
              type="text"
              className="form-control"
              placeholder="Ejemplo: 3101234567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              style={{ paddingLeft: '44px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            onClick={onBack}
            className="btn btn-secondary"
            style={{ height: '52px', flex: '1' }}
          >
            <ArrowLeft size={20} />
            <span>VOLVER</span>
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ height: '52px', flex: '2', fontWeight: 700 }}
          >
            <span>CONTINUAR AL RESUMEN</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2Vendor;
