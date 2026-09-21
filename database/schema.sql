-- ============================================================
-- BASE DE DATOS: CompraVenta de Café Don Beto
-- Esquema relacional oficial MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS cafe_don_beto_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafe_don_beto_db;

-- ------------------------------------------------------------
-- Tabla: usuarios (Compradores autenticados del sistema)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuarios_cedula (cedula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: vendedores (Personas que venden el café)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vendedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vendedores_cedula (cedula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: compras (Registro principal de compras de café)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_compra VARCHAR(20) NOT NULL UNIQUE,
    usuario_id INT NOT NULL,
    vendedor_id INT NOT NULL,
    kilos DECIMAL(10,2) NOT NULL,
    valor_carga_inicial DECIMAL(12,2) NOT NULL,
    precio_kilo_inicial DECIMAL(10,2) NOT NULL,
    precio_kilo_final DECIMAL(10,2) NOT NULL,
    total_final DECIMAL(12,2) NOT NULL,
    fecha_compra DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'COMPLETADA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_compras_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_compras_vendedor FOREIGN KEY (vendedor_id) REFERENCES vendedores(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_compras_numero (numero_compra),
    INDEX idx_compras_fecha (fecha_compra)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Tabla: vouchers (Comprobantes PDF asociados a las compras)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vouchers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    compra_id INT NOT NULL UNIQUE,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    fecha_generacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vouchers_compra FOREIGN KEY (compra_id) REFERENCES compras(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
