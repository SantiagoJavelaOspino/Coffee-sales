import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Step1Calculator from '../components/purchase/Step1Calculator';
import Step2Vendor from '../components/purchase/Step2Vendor';
import Step3Summary from '../components/purchase/Step3Summary';
import Step4Success from '../components/purchase/Step4Success';
import { Calculator, User, FileText, CheckCircle } from 'lucide-react';

const NewPurchasePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [purchaseData, setPurchaseData] = useState({
    kilos: '',
    valorCargaInicial: '',
    precioKiloInicial: 0,
    precioKiloFinal: 0,
    isCustomPrice: false,
    totalFinal: 0,
    vendedor: {
      nombre: '',
      cedula: '',
      telefono: ''
    }
  });

  const [completedPurchase, setCompletedPurchase] = useState(null);

  const updatePurchaseData = (newData) => {
    setPurchaseData((prev) => ({
      ...prev,
      ...newData
    }));
  };

  const handleFinishPurchase = (compraResult) => {
    setCompletedPurchase(compraResult);
    setCurrentStep(4);
  };

  return (
    <>
      <Navbar />
      <div className="main-content">
        {/* Indicador Visual de Pasos */}
        {currentStep < 4 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '0.75rem',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: currentStep === 1 ? 700 : 500,
              color: currentStep === 1 ? 'var(--color-coffee-primary)' : 'var(--text-muted)'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: currentStep === 1 ? 'var(--color-coffee-primary)' : '#E5E7EB',
                color: currentStep === 1 ? '#FFF' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}>1</div>
              <span className="hide-mobile">Calculadora</span>
            </div>

            <span style={{ color: 'var(--border-light)' }}>—</span>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: currentStep === 2 ? 700 : 500,
              color: currentStep === 2 ? 'var(--color-coffee-primary)' : 'var(--text-muted)'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: currentStep === 2 ? 'var(--color-coffee-primary)' : '#E5E7EB',
                color: currentStep === 2 ? '#FFF' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}>2</div>
              <span className="hide-mobile">Vendedor</span>
            </div>

            <span style={{ color: 'var(--border-light)' }}>—</span>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: currentStep === 3 ? 700 : 500,
              color: currentStep === 3 ? 'var(--color-coffee-primary)' : 'var(--text-muted)'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: currentStep === 3 ? 'var(--color-coffee-primary)' : '#E5E7EB',
                color: currentStep === 3 ? '#FFF' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem'
              }}>3</div>
              <span className="hide-mobile">Resumen</span>
            </div>
          </div>
        )}

        {/* Paso 1: Calculadora */}
        {currentStep === 1 && (
          <Step1Calculator
            purchaseData={purchaseData}
            updatePurchaseData={updatePurchaseData}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {/* Paso 2: Datos Vendedor */}
        {currentStep === 2 && (
          <Step2Vendor
            purchaseData={purchaseData}
            updatePurchaseData={updatePurchaseData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {/* Paso 3: Resumen */}
        {currentStep === 3 && (
          <Step3Summary
            purchaseData={purchaseData}
            onFinish={handleFinishPurchase}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {/* Paso 4: Éxito */}
        {currentStep === 4 && (
          <Step4Success completedPurchase={completedPurchase} />
        )}
      </div>
    </>
  );
};

export default NewPurchasePage;
