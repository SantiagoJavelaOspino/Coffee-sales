-- ============================================================
-- BASE DE DATOS: CompraVenta de Café Don Beto
-- Datos iniciales (Seed Data)
-- ============================================================

USE cafe_don_beto_db;

-- Limpiar tablas si es necesario (descomentar solo en pruebas)
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE vouchers;
-- TRUNCATE TABLE compras;
-- TRUNCATE TABLE vendedores;
-- TRUNCATE TABLE usuarios;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- Usuario Comprador Principal: Don Beto
-- Cédula: 123456789
-- Contraseña por defecto: admin123
-- Hash bcrypt de "admin123": $2b$10$g7E1uR/O./4814d45K50c.h9r8E1fW0g0.4K0H.7e5u8R9N0K2c2S
-- ------------------------------------------------------------
INSERT INTO usuarios (cedula, nombre, password, estado)
VALUES (
    '123456789',
    'Don Beto',
    '$2b$10$g7E1uR/O./4814d45K50c.h9r8E1fW0g0.4K0H.7e5u8R9N0K2c2S',
    1
)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- ------------------------------------------------------------
-- Vendedor de prueba inicial
-- Cédula: 987654321
-- ------------------------------------------------------------
INSERT INTO vendedores (nombre, cedula, telefono)
VALUES (
    'Carlos Ramírez',
    '987654321',
    '3101234567'
)
ON DUPLICATE KEY UPDATE telefono = VALUES(telefono);
