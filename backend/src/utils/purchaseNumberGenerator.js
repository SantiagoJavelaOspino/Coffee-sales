/**
 * Genera un número único secuencial de compra.
 * Formato: COMP-AAAA-XXXX (Ejemplo: COMP-2026-0001)
 * @param {number} lastId - Último ID registrado en la tabla compras
 * @returns {string} - Número de compra único formateado
 */
const generatePurchaseNumber = (lastId = 0) => {
  const year = new Date().getFullYear();
  const nextNumber = (lastId + 1).toString().padStart(4, '0');
  return `COMP-${year}-${nextNumber}`;
};

module.exports = {
  generatePurchaseNumber
};
