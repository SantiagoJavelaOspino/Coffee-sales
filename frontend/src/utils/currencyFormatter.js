/**
 * Formatea un valor numérico a formato de Pesos Colombianos (COP)
 * Ejemplo: 2000000 -> "$ 2.000.000"
 * @param {number|string} amount
 * @returns {string}
 */
export const formatCOP = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '$ 0';
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(num);
};

/**
 * Formatea kilos con hasta 2 decimales si existen
 * Ejemplo: 125 -> "125 kg", 125.5 -> "125.5 kg"
 * @param {number|string} kilos
 * @returns {string}
 */
export const formatKilos = (kilos) => {
  const num = parseFloat(kilos);
  if (isNaN(num)) return '0 kg';
  return `${num.toLocaleString('es-CO', { maximumFractionDigits: 2 })} kg`;
};

/**
 * Limpia una cadena de texto dejando solo dígitos numéricos
 * @param {string} value
 * @returns {string}
 */
export const cleanNumberInput = (value) => {
  if (!value) return '';
  return value.toString().replace(/[^0-9]/g, '');
};
