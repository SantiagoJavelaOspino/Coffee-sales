-- ============================================================
-- BASE DE DATOS: CompraVenta de Café Don Beto
-- Datos iniciales (Seed Data)
-- ============================================================

USE cafe_don_beto_db;

-- ------------------------------------------------------------
-- Usuario Comprador Principal: Eberto Rodriguez Diaz (Don Beto)
-- Cédula: 83232744
-- Contraseña por defecto: admin123
-- Hash bcrypt verificado de "admin123": $2a$10$sDcD5ReyHY0z5U2Xc.ehd.GaT5Q4nChtftBknubF.jlHTiasD8bJq
-- ------------------------------------------------------------
INSERT INTO usuarios (cedula, nombre, password, estado)
VALUES (
    '83232744',
    'Eberto Rodriguez Diaz',
    '$2a$10$sDcD5ReyHY0z5U2Xc.ehd.GaT5Q4nChtftBknubF.jlHTiasD8bJq',
    1
)
ON DUPLICATE KEY UPDATE 
    nombre = VALUES(nombre),
    password = VALUES(password);

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
