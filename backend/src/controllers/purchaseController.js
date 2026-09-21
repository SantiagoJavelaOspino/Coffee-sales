const { pool, query } = require('../config/db');
const { generatePurchaseNumber } = require('../utils/purchaseNumberGenerator');
const { generateVoucherPDF } = require('../services/pdfService');

// Registrar una nueva compra de café (POST /api/compras)
const createPurchase = async (req, res, next) => {
  let connection;
  try {
    const {
      kilos,
      valor_carga_inicial,
      precio_kilo_inicial,
      precio_kilo_final,
      total_final,
      vendedor
    } = req.body;

    const usuario_id = req.user.id;

    // 1. Validaciones de Reglas de Negocio (RN01, RN02, RN05)
    const numKilos = parseFloat(kilos);
    const numValorCarga = parseFloat(valor_carga_inicial);
    const numPrecioInicial = parseFloat(precio_kilo_inicial);
    const numPrecioFinal = parseFloat(precio_kilo_final);
    const numTotalFinal = parseFloat(total_final);

    if (isNaN(numKilos) || numKilos <= 0) {
      return res.status(400).json({ error: 'Los kilos deben ser mayores que cero.' });
    }

    if (isNaN(numValorCarga) || numValorCarga <= 0) {
      return res.status(400).json({ error: 'Debe ingresar el valor inicial de la carga.' });
    }

    if (isNaN(numPrecioFinal) || numPrecioFinal <= 0) {
      return res.status(400).json({ error: 'El precio por kilo no puede ser menor o igual a cero.' });
    }

    if (!vendedor || !vendedor.nombre || !vendedor.cedula || !vendedor.telefono) {
      return res.status(400).json({ error: 'Complete los datos del vendedor.' });
    }

    // 2. Iniciar Transacción MySQL
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 2.1 Guardar o actualizar vendedor
    const upsertVendorSql = `
      INSERT INTO vendedores (nombre, cedula, telefono)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        nombre = VALUES(nombre),
        telefono = VALUES(telefono)
    `;
    await connection.execute(upsertVendorSql, [
      vendedor.nombre.trim(),
      vendedor.cedula.trim(),
      vendedor.telefono.trim()
    ]);

    const [vendorRows] = await connection.execute(
      'SELECT id FROM vendedores WHERE cedula = ?',
      [vendedor.cedula.trim()]
    );
    const vendedor_id = vendorRows[0].id;

    // 2.2 Obtener último ID para número de compra secuencial único
    const [maxIdRows] = await connection.execute('SELECT MAX(id) as maxId FROM compras');
    const lastId = maxIdRows[0].maxId || 0;
    const numero_compra = generatePurchaseNumber(lastId);

    // 2.3 Insertar registro de compra
    const insertPurchaseSql = `
      INSERT INTO compras (
        numero_compra, usuario_id, vendedor_id, kilos,
        valor_carga_inicial, precio_kilo_inicial, precio_kilo_final,
        total_final, fecha_compra, estado
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'COMPLETADA')
    `;

    const [insertResult] = await connection.execute(insertPurchaseSql, [
      numero_compra,
      usuario_id,
      vendedor_id,
      numKilos,
      numValorCarga,
      numPrecioInicial,
      numPrecioFinal,
      numTotalFinal
    ]);

    const compra_id = insertResult.insertId;

    // 2.4 Registrar voucher en la tabla vouchers (RN10)
    const nombreArchivo = `Voucher_${numero_compra}.pdf`;
    const rutaArchivo = `/api/compras/${compra_id}/voucher`;

    await connection.execute(
      `INSERT INTO vouchers (compra_id, nombre_archivo, ruta_archivo, fecha_generacion)
       VALUES (?, ?, ?, NOW())`,
      [compra_id, nombreArchivo, rutaArchivo]
    );

    // 2.5 Confirmar transacción
    await connection.commit();

    return res.status(201).json({
      message: 'Compra realizada correctamente',
      compra: {
        id: compra_id,
        numero_compra,
        kilos: numKilos,
        valor_carga_inicial: numValorCarga,
        precio_kilo_inicial: numPrecioInicial,
        precio_kilo_final: numPrecioFinal,
        total_final: numTotalFinal,
        fecha_compra: new Date(),
        vendedor: {
          id: vendedor_id,
          nombre: vendedor.nombre.trim(),
          cedula: vendedor.cedula.trim(),
          telefono: vendedor.telefono.trim()
        }
      }
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    next(error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Obtener todas las compras registradas (GET /api/compras)
const getPurchases = async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        c.id,
        c.numero_compra,
        c.kilos,
        c.valor_carga_inicial,
        c.precio_kilo_inicial,
        c.precio_kilo_final,
        c.total_final,
        c.fecha_compra,
        c.estado,
        v.nombre AS vendedor_nombre,
        v.cedula AS vendedor_cedula,
        v.telefono AS vendedor_telefono,
        u.nombre AS comprador_nombre
      FROM compras c
      INNER JOIN vendedores v ON c.vendedor_id = v.id
      INNER JOIN usuarios u ON c.usuario_id = u.id
      ORDER BY c.fecha_compra DESC
    `;

    const compras = await query(sql);

    return res.status(200).json({
      compras
    });
  } catch (error) {
    next(error);
  }
};

// Obtener detalle de una compra específica (GET /api/compras/:id)
const getPurchaseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        c.id,
        c.numero_compra,
        c.kilos,
        c.valor_carga_inicial,
        c.precio_kilo_inicial,
        c.precio_kilo_final,
        c.total_final,
        c.fecha_compra,
        c.estado,
        v.nombre AS vendedor_nombre,
        v.cedula AS vendedor_cedula,
        v.telefono AS vendedor_telefono,
        u.nombre AS comprador_nombre,
        u.cedula AS comprador_cedula
      FROM compras c
      INNER JOIN vendedores v ON c.vendedor_id = v.id
      INNER JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.id = ?
    `;

    const compras = await query(sql, [id]);

    if (!compras || compras.length === 0) {
      return res.status(404).json({ error: 'Compra no encontrada.' });
    }

    return res.status(200).json({
      compra: compras[0]
    });
  } catch (error) {
    next(error);
  }
};

// Descargar o visualizar voucher PDF de una compra (GET /api/compras/:id/voucher)
const downloadVoucher = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        c.id,
        c.numero_compra,
        c.kilos,
        c.valor_carga_inicial,
        c.precio_kilo_inicial,
        c.precio_kilo_final,
        c.total_final,
        c.fecha_compra,
        c.estado,
        v.nombre AS vendedor_nombre,
        v.cedula AS vendedor_cedula,
        v.telefono AS vendedor_telefono,
        u.nombre AS comprador_nombre,
        u.cedula AS comprador_cedula
      FROM compras c
      INNER JOIN vendedores v ON c.vendedor_id = v.id
      INNER JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.id = ?
    `;

    const compras = await query(sql, [id]);

    if (!compras || compras.length === 0) {
      return res.status(404).json({ error: 'Compra no encontrada.' });
    }

    generateVoucherPDF(compras[0], res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPurchase,
  getPurchases,
  getPurchaseById,
  downloadVoucher
};
