const PDFDocument = require('pdfkit');

/**
 * Formatea valores numéricos a Pesos Colombianos (COP) para el PDF
 */
const formatCOP = (amount) => {
  const num = parseFloat(amount) || 0;
  return `$ ${num.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
};

/**
 * Formatea kilos para el PDF
 */
const formatKilos = (kilos) => {
  const num = parseFloat(kilos) || 0;
  return `${num.toLocaleString('es-CO', { maximumFractionDigits: 2 })} kg`;
};

/**
 * Genera el documento PDF del comprobante de compra y lo transmite a la respuesta HTTP
 * @param {Object} compra - Datos completos de la compra (con vendedor y comprador)
 * @param {Object} res - Objeto Express Response
 */
const generateVoucherPDF = (compra, res) => {
  const doc = new PDFDocument({
    margin: 40,
    size: [400, 650] // Tamaño recibo optimizado para vouchers
  });

  // Configurar encabezados HTTP para streaming de PDF
  const filename = `Voucher_${compra.numero_compra}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

  doc.pipe(res);

  // --------------------------------------------------
  // ENCABEZADO PRINCIPAL
  // --------------------------------------------------
  doc
    .fillColor('#3B2314')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('COMPRA DE CAFÉ DON BETO', { align: 'center' });

  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('#6B7280')
    .text('Punto de Compra de Café - Caserío', { align: 'center' })
    .moveDown(0.5);

  doc
    .moveTo(40, doc.y)
    .lineTo(360, doc.y)
    .strokeColor('#D9A05B')
    .lineWidth(1.5)
    .stroke()
    .moveDown(0.8);

  // --------------------------------------------------
  // INFORMACIÓN GENERAL DE LA COMPRA
  // --------------------------------------------------
  const fechaFormateada = new Date(compra.fecha_compra).toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  doc
    .fillColor('#1F2937')
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(`NÚMERO DE COMPRA: `, { continued: true })
    .font('Helvetica')
    .text(compra.numero_compra);

  doc
    .font('Helvetica-Bold')
    .text(`FECHA Y HORA: `, { continued: true })
    .font('Helvetica')
    .text(fechaFormateada)
    .moveDown(0.8);

  // Linea divisora suave
  doc
    .moveTo(40, doc.y)
    .lineTo(360, doc.y)
    .strokeColor('#E5E7EB')
    .lineWidth(1)
    .stroke()
    .moveDown(0.8);

  // --------------------------------------------------
  // DATOS DEL COMPRADOR (Eberto Rodriguez Diaz - Don Beto)
  // --------------------------------------------------
  doc
    .fillColor('#5C3A21')
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('DATOS DEL COMPRADOR')
    .moveDown(0.3);

  doc
    .fillColor('#1F2937')
    .fontSize(9.5)
    .font('Helvetica')
    .text(`Nombre: ${compra.comprador_nombre || 'Eberto Rodriguez Diaz'}`)
    .text(`Cédula: ${compra.comprador_cedula || '83232744'}`)
    .moveDown(0.8);

  // --------------------------------------------------
  // DATOS DEL VENDEDOR
  // --------------------------------------------------
  doc
    .fillColor('#5C3A21')
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('DATOS DEL VENDEDOR')
    .moveDown(0.3);

  doc
    .fillColor('#1F2937')
    .fontSize(9.5)
    .font('Helvetica')
    .text(`Nombre: ${compra.vendedor_nombre}`)
    .text(`Cédula: ${compra.vendedor_cedula}`)
    .text(`Teléfono: ${compra.vendedor_telefono}`)
    .moveDown(0.8);

  // Linea divisora suave
  doc
    .moveTo(40, doc.y)
    .lineTo(360, doc.y)
    .strokeColor('#E5E7EB')
    .lineWidth(1)
    .stroke()
    .moveDown(0.8);

  // --------------------------------------------------
  // DETALLE DE LA COMPRA
  // --------------------------------------------------
  doc
    .fillColor('#5C3A21')
    .fontSize(11)
    .font('Helvetica-Bold')
    .text('DETALLE DE LA COMPRA')
    .moveDown(0.4);

  // Tabla simple de valores
  const drawRow = (label, value, isBold = false) => {
    const yPos = doc.y;
    doc
      .fontSize(9.5)
      .font(isBold ? 'Helvetica-Bold' : 'Helvetica')
      .fillColor('#1F2937')
      .text(label, 40, yPos);

    doc
      .fontSize(9.5)
      .font(isBold ? 'Helvetica-Bold' : 'Helvetica')
      .fillColor(isBold ? '#15803D' : '#1F2937')
      .text(value, 200, yPos, { width: 160, align: 'right' });

    doc.moveDown(0.4);
  };

  drawRow('Kilos de Café:', formatKilos(compra.kilos));
  drawRow('Valor Inicial Carga:', formatCOP(compra.valor_carga_inicial));
  drawRow('Precio Inicial por Kilo:', `${formatCOP(compra.precio_kilo_inicial)} / kg`);
  drawRow('Precio Final por Kilo:', `${formatCOP(compra.precio_kilo_final)} / kg`);

  doc.moveDown(0.4);

  // Caja para el Total Final
  const totalBoxY = doc.y;
  doc
    .rect(40, totalBoxY, 320, 36)
    .fillAndStroke('#FEF3C7', '#D97706');

  doc
    .fillColor('#92400E')
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('TOTAL A PAGAR:', 50, totalBoxY + 11);

  doc
    .fillColor('#15803D')
    .fontSize(14)
    .font('Helvetica-Bold')
    .text(formatCOP(compra.total_final), 200, totalBoxY + 10, { width: 150, align: 'right' });

  doc.y = totalBoxY + 50;

  // --------------------------------------------------
  // MENSAJE FINAL
  // --------------------------------------------------
  doc
    .fillColor('#6B7280')
    .fontSize(10)
    .font('Helvetica-Oblique')
    .text('¡Gracias por su compra!', 40, doc.y, { align: 'center' });

  doc.end();
};

module.exports = {
  generateVoucherPDF
};
