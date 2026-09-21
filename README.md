# ☕ CompraVenta de Café Don Beto

Aplicación web rápida, clara y sencilla para el registro de compras de café en punto de acopio rural.

---

## 🚀 Stack Tecnológico

- **Frontend:** React 18, Vite, React Router DOM v6, Axios, Lucide Icons, CSS3 Responsive.
- **Backend:** Node.js, Express, JWT Authentication, bcryptjs, PDFKit, MySQL2.
- **Base de Datos:** MySQL.
- **Despliegue:** Vercel / Cloud.

---

## 📂 Estructura del Proyecto

```
Coffee-sales/
├── frontend/           # Aplicación cliente en React + Vite
│   ├── src/
│   │   ├── components/ # Componentes del Wizard (Calculadora, Vendedor, Resumen, Éxito)
│   │   ├── context/    # AuthContext para sesión con JWT
│   │   ├── pages/      # Login, Dashboard e Historial, Nueva Compra
│   │   ├── services/   # Cliente API REST (auth, compras, vendedores)
│   │   └── utils/      # Formateadores monetarios ($ COP) y validadores
├── backend/            # API REST Express
│   ├── src/
│   │   ├── config/     # Conexión Pool MySQL
│   │   ├── controllers/# Lógica de negocio (Auth, Compras, Vendedores)
│   │   ├── middleware/ # Autenticación JWT y validación
│   │   ├── routes/     # Endpoints REST
│   │   └── services/   # Generador de Vouchers PDF (PDFKit)
│   └── server.js
├── database/           # Scripts SQL (schema.sql y seed.sql)
├── docs/               # SRS y Prompt Maestro oficial
└── vercel.json         # Configuración de despliegue en Vercel
```

---

## 🗄️ Base de Datos MySQL

Para inicializar la base de datos localmente:

```bash
# 1. Crear estructura de tablas
mysql -u root -p < database/schema.sql

# 2. Insertar datos iniciales (Usuario Don Beto)
mysql -u root -p < database/seed.sql
```

### Credenciales de Prueba por Defecto
- **Cédula:** `123456789`
- **Contraseña:** `admin123`

---

## ⚙️ Instalación y Ejecución Local

### 1. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurar las variables en .env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
npm run dev
```
Servidor Express disponible en: `http://localhost:5000`

### 2. Configurar Frontend
```bash
cd frontend
npm install
npm run dev
```
Aplicación React disponible en: `http://localhost:3000`

---

## 📋 Reglas de Negocio Implementadas

- **RN01:** Kilos mayores que cero.
- **RN02:** Valor inicial de la carga mayor que cero.
- **RN03:** Cálculo automático de `precio_kilo_inicial = valor_carga / kilos`.
- **RN04:** Opción diferenciada para modificar el precio por kilo.
- **RN05/RN06:** Recálculo del total `total = kilos * precio_kilo_final`, conservando siempre el precio inicial por separado.
- **RN08:** Número único secuencial de compra (`COMP-2026-0001`).
- **RN10:** Generación de comprobante voucher en formato PDF.

---

## 📄 Licencia

MIT - CompraVenta de Café Don Beto 2026.