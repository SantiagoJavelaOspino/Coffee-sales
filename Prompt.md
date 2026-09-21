# PROMPT MAESTRO — COFFEE-SALES

Actúa como un desarrollador de software full-stack con experiencia en aplicaciones web pequeñas, sistemas de registro de compras y diseño de interfaces sencillas.

Debes desarrollar el proyecto llamado:

COMPRA VENTA DE CAFÉ DON BETO

Repositorio:
Coffee-sales

URL prevista:
compraventadecafedonbeto.vercel.app

--------------------------------------------------
1. OBJETIVO DEL PROYECTO
--------------------------------------------------

Desarrollar una aplicación web para un pequeño punto de compra de café ubicado en un caserío.

El sistema permitirá registrar las compras de café realizadas a los vendedores, calcular automáticamente el precio por kilogramo, permitir modificar dicho precio cuando sea necesario, calcular el valor total de la compra, guardar la información y generar un voucher en PDF.

El sistema debe ser sencillo, rápido, claro y fácil de utilizar.

NO convertir el proyecto en un sistema empresarial complejo.

La prioridad es que el proceso de compra sea rápido y tenga la menor cantidad de pasos posibles.

--------------------------------------------------
2. STACK TECNOLÓGICO
--------------------------------------------------

Frontend:
- React
- JavaScript
- HTML5
- CSS3

Backend:
- Node.js
- Express
- API REST

Base de datos:
- MySQL

Control de versiones:
- Git
- GitHub

Repositorio:
- Coffee-sales

Despliegue:
- Vercel para la aplicación web

Generación:
- Voucher en formato PDF

Utilizar una arquitectura organizada que permita ampliar el sistema posteriormente.

--------------------------------------------------
3. USUARIO PRINCIPAL
--------------------------------------------------

El sistema tendrá inicialmente un único tipo de usuario:

COMPRADOR / USUARIO

Es la persona encargada de recibir el café y registrar las compras.

El vendedor de café NO tendrá una cuenta y NO iniciará sesión.

Sus datos solamente serán registrados durante el proceso de compra.

--------------------------------------------------
4. AUTENTICACIÓN
--------------------------------------------------

Crear una pantalla de inicio de sesión.

Campos:

- Cédula
- Contraseña

Botón:

- Iniciar sesión

El usuario autenticado podrá acceder al panel principal.

Las contraseñas nunca deben almacenarse en texto plano.

Utilizar un mecanismo seguro para almacenar contraseñas.

Proteger las rutas privadas del sistema.

No permitir que un usuario no autenticado acceda directamente al dashboard.

--------------------------------------------------
5. PANEL PRINCIPAL
--------------------------------------------------

Después de iniciar sesión mostrar un dashboard sencillo.

Debe contener:

- Nombre del sistema
- Usuario actualmente autenticado
- Botón "Realizar compra"
- Historial de compras

El historial debe mostrar como mínimo:

- Número de compra
- Nombre del vendedor
- Kilos
- Precio final por kilo
- Total
- Fecha
- Botón "Ver"
- Botón "Descargar voucher"

El diseño debe ser limpio y fácil de entender.

No llenar la pantalla de elementos innecesarios.

--------------------------------------------------
6. PROCESO DE NUEVA COMPRA
--------------------------------------------------

Al seleccionar:

"REALIZAR COMPRA"

mostrar el formulario de cálculo.

Campos:

1. Kilos
2. Valor inicial de la carga

Después de ingresar estos valores calcular automáticamente:

PRECIO INICIAL POR KILO =
VALOR INICIAL DE LA CARGA / KILOS

Ejemplo:

Kilos: 125

Valor inicial:
$2.000.000

Precio inicial por kilo:
$16.000

--------------------------------------------------
7. CAMBIO DEL PRECIO POR KILO
--------------------------------------------------

El sistema debe mostrar claramente una opción:

"Cambiar valor por kilo"

Preferiblemente utilizando un texto o botón visualmente diferenciado.

Cuando el comprador active esta opción debe poder modificar manualmente el precio por kilo.

Ejemplo:

Precio calculado:
$16.000

Nuevo precio:
$16.500

El sistema debe recalcular automáticamente:

TOTAL =
KILOS × PRECIO FINAL POR KILO

Ejemplo:

125 × $16.500

TOTAL:
$2.062.500

Es MUY IMPORTANTE conservar ambos valores:

- precio_kilo_inicial
- precio_kilo_final

No sobrescribir el precio inicial.

--------------------------------------------------
8. CONTINUAR
--------------------------------------------------

Después de revisar el cálculo mostrar:

"CONTINUAR"

Al seleccionarlo pasar al formulario de datos del vendedor.

--------------------------------------------------
9. DATOS DEL VENDEDOR
--------------------------------------------------

Solicitar:

- Nombre completo
- Cédula
- Teléfono

Validar los campos obligatorios.

No permitir finalizar una compra con información obligatoria vacía.

--------------------------------------------------
10. FINALIZAR COMPRA
--------------------------------------------------

Mostrar un resumen antes de finalizar:

VENDEDOR
Nombre
Cédula
Teléfono

COMPRA
Kilos
Valor inicial de la carga
Precio inicial por kilo
Precio final por kilo
Total final

Botón:

"FINALIZAR COMPRA"

Al confirmar:

1. Validar la información.
2. Guardar el vendedor.
3. Guardar la compra.
4. Asociar la compra con el usuario autenticado.
5. Generar número único de compra.
6. Registrar fecha y hora.
7. Generar el voucher PDF.
8. Mostrar pantalla de compra realizada.

--------------------------------------------------
11. PANTALLA DE COMPRA REALIZADA
--------------------------------------------------

Mostrar un mensaje claro:

"Compra realizada correctamente"

Mostrar:

- Número de compra
- Nombre del vendedor
- Kilos
- Precio final por kilo
- Total

Botones:

"DESCARGAR VOUCHER"

"VOLVER AL INICIO"

--------------------------------------------------
12. VOUCHER PDF
--------------------------------------------------

Crear un comprobante sencillo y profesional.

Debe contener:

COMPRA DE CAFÉ DON BETO

Número de compra

Fecha y hora

DATOS DEL COMPRADOR
- Nombre
- Cédula

DATOS DEL VENDEDOR
- Nombre
- Cédula
- Teléfono

DETALLE DE LA COMPRA
- Kilos
- Valor inicial de la carga
- Precio inicial por kilo
- Precio final por kilo
- Total final

Mensaje:

"Gracias por su compra"

El PDF debe ser legible y tener un diseño apropiado para imprimir o guardar digitalmente.

--------------------------------------------------
13. BASE DE DATOS
--------------------------------------------------

Crear una base de datos MySQL.

Tablas principales:

usuarios

Campos:

- id
- cedula
- nombre
- password
- estado
- created_at

vendedores

Campos:

- id
- nombre
- cedula
- telefono
- created_at

compras

Campos:

- id
- numero_compra
- usuario_id
- vendedor_id
- kilos
- valor_carga_inicial
- precio_kilo_inicial
- precio_kilo_final
- total_final
- fecha_compra
- estado

vouchers

Campos:

- id
- compra_id
- nombre_archivo
- ruta_archivo
- fecha_generacion

Crear correctamente las claves primarias y foráneas.

Relaciones:

usuarios 1:N compras

vendedores 1:N compras

compras 1:1 vouchers

--------------------------------------------------
14. REGLAS DE NEGOCIO
--------------------------------------------------

RN01:
Los kilos deben ser mayores que cero.

RN02:
El valor inicial de la carga debe ser mayor que cero.

RN03:
El precio inicial por kilo se calcula:

valor_carga_inicial / kilos

RN04:
El comprador puede modificar el precio por kilo.

RN05:
El precio final por kilo será el utilizado para calcular el pago.

RN06:
El total final se calcula:

kilos × precio_kilo_final

RN07:
Una compra solamente se guarda cuando el comprador confirma la operación.

RN08:
Cada compra debe tener un número único.

RN09:
Cada compra debe estar asociada a un vendedor.

RN10:
Cada compra finalizada debe tener un voucher.

RN11:
Las compras finalizadas deben aparecer en el historial.

RN12:
Una compra finalizada no debe poder modificarse desde el historial en esta primera versión.

--------------------------------------------------
15. API REST
--------------------------------------------------

Crear una API REST organizada.

Endpoints sugeridos:

AUTH

POST /api/auth/login

USUARIOS

GET /api/usuarios/me

VENDEDORES

POST /api/vendedores

GET /api/vendedores/:id

COMPRAS

POST /api/compras

GET /api/compras

GET /api/compras/:id

VOUCHERS

GET /api/compras/:id/voucher

Los nombres pueden ajustarse si existe una mejor estructura, pero no crear endpoints innecesarios.

--------------------------------------------------
16. ESTRUCTURA DEL PROYECTO
--------------------------------------------------

Utilizar una estructura organizada similar a:

Coffee-sales/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── ...
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── ...
│   └── package.json
│
├── database/
│   └── schema.sql
│
├── docs/
│   └── SRS/
│
├── README.md
└── .gitignore

No crear carpetas o capas innecesarias solamente por seguir patrones de arquitectura.

La estructura debe mantenerse comprensible para un proyecto pequeño.

--------------------------------------------------
17. FRONTEND
--------------------------------------------------

Crear componentes reutilizables.

Pantallas mínimas:

- Login
- Dashboard
- Nueva compra
- Datos del vendedor
- Resumen de compra
- Compra realizada
- Detalle de compra

Mantener una navegación clara.

El usuario debe poder volver al dashboard sin perder información accidentalmente.

--------------------------------------------------
18. VALIDACIONES
--------------------------------------------------

Validar tanto en frontend como en backend.

Validar:

- Cédula
- Contraseña
- Kilos
- Valor inicial
- Precio por kilo
- Nombre del vendedor
- Cédula del vendedor
- Teléfono

No confiar únicamente en las validaciones del frontend.

--------------------------------------------------
19. MANEJO DE DINERO
--------------------------------------------------

No utilizar valores monetarios como números de punto flotante sin control.

Los valores monetarios deben manejarse de forma que se eviten errores de precisión.

Mostrar los valores al usuario en formato colombiano:

$2.000.000

$16.500

No almacenar el símbolo "$" dentro de los campos numéricos de la base de datos.

--------------------------------------------------
20. EXPERIENCIA DE USUARIO
--------------------------------------------------

La interfaz debe sentirse como una herramienta de trabajo y no como una página web complicada.

Priorizar:

- Claridad
- Velocidad
- Botones visibles
- Formularios simples
- Poca cantidad de pasos
- Información importante destacada
- Buen funcionamiento en celular

No agregar:

- Animaciones excesivas
- Menús innecesarios
- Gráficos que no aporten
- Funciones que no estén relacionadas con la compra de café

--------------------------------------------------
21. RESPONSIVE
--------------------------------------------------

El sistema debe funcionar correctamente en:

- Computador
- Portátil
- Tablet
- Teléfono

La pantalla de nueva compra debe ser especialmente cómoda para utilizar desde un celular.

--------------------------------------------------
22. MANEJO DE ERRORES
--------------------------------------------------

Mostrar mensajes claros.

Ejemplos:

"Los kilos deben ser mayores que cero."

"Debe ingresar el valor de la carga."

"El precio por kilo no puede ser menor o igual a cero."

"Complete los datos del vendedor."

"Las credenciales son incorrectas."

"No fue posible guardar la compra."

Evitar mostrar errores técnicos directamente al usuario.

--------------------------------------------------
23. SEGURIDAD
--------------------------------------------------

Implementar como mínimo:

- Contraseñas protegidas mediante hashing.
- Autenticación segura.
- Protección de rutas privadas.
- Validación de datos.
- Variables sensibles mediante variables de entorno.
- No subir contraseñas ni credenciales al repositorio.
- Archivo .env incluido en .gitignore.

Nunca colocar:

- Contraseñas de MySQL
- Secretos
- Tokens
- Claves privadas

directamente en el código.

--------------------------------------------------
24. GITHUB
--------------------------------------------------

El repositorio oficial es:

Coffee-sales

Mantener commits claros y organizados.

Ejemplos:

feat: create login

feat: add coffee purchase calculator

feat: add purchase history

feat: generate purchase voucher

fix: validate purchase values

No eliminar información existente del repositorio sin verificar primero su utilidad.

Antes de realizar cambios importantes revisar la estructura actual del proyecto.

--------------------------------------------------
25. VERCEL
--------------------------------------------------

La aplicación deberá quedar preparada para desplegarse en Vercel.

URL deseada:

compraventadecafedonbeto.vercel.app

No asumir que el subdominio está disponible hasta verificarlo en Vercel.

Las variables de entorno deben configurarse correctamente para producción.

--------------------------------------------------
26. DESARROLLO POR ETAPAS
--------------------------------------------------

NO intentar construir todo de manera desordenada en una sola operación.

Trabajar por etapas:

FASE 1:
Analizar el repositorio actual y verificar qué existe.

FASE 2:
Crear estructura del proyecto.

FASE 3:
Configurar frontend.

FASE 4:
Configurar backend.

FASE 5:
Crear base de datos.

FASE 6:
Implementar autenticación.

FASE 7:
Implementar dashboard.

FASE 8:
Implementar calculadora de compra.

FASE 9:
Implementar registro del vendedor.

FASE 10:
Implementar almacenamiento de compras.

FASE 11:
Implementar historial.

FASE 12:
Implementar generación de voucher PDF.

FASE 13:
Realizar validaciones y pruebas.

FASE 14:
Preparar despliegue.

FASE 15:
Revisar el sistema completo.

Después de cada fase verificar que el proyecto siga funcionando.

--------------------------------------------------
27. PRUEBAS
--------------------------------------------------

Realizar como mínimo estas pruebas:

PRUEBA 1:
Login correcto.

PRUEBA 2:
Login incorrecto.

PRUEBA 3:
Kilos en cero.

PRUEBA 4:
Valor de carga en cero.

PRUEBA 5:
Cálculo automático del precio por kilo.

PRUEBA 6:
Cambio manual del precio por kilo.

PRUEBA 7:
Recalculo del total.

PRUEBA 8:
Registro correcto del vendedor.

PRUEBA 9:
Compra finalizada.

PRUEBA 10:
Compra guardada en MySQL.

PRUEBA 11:
Compra visible en historial.

PRUEBA 12:
Generación correcta del PDF.

PRUEBA 13:
Descarga del voucher.

PRUEBA 14:
Acceso no autorizado a rutas privadas.

PRUEBA 15:
Funcionamiento responsive.

--------------------------------------------------
28. REGLA IMPORTANTE PARA EL DESARROLLO
--------------------------------------------------

No inventar requisitos que no estén definidos.

Si existe una decisión técnica que no está especificada:

1. Elegir la solución más sencilla.
2. Mantenerla compatible con el SRS.
3. Evitar sobreingeniería.
4. Documentar la decisión.

No agregar módulos como:

- Inventario
- Contabilidad
- Nómina
- Proveedores
- Facturación electrónica
- Reportes empresariales complejos

hasta que sean solicitados explícitamente.

--------------------------------------------------
29. RESULTADO ESPERADO
--------------------------------------------------

Al terminar, el sistema debe permitir realizar este proceso completo:

LOGIN
↓
DASHBOARD
↓
REALIZAR COMPRA
↓
INGRESAR KILOS
↓
INGRESAR VALOR DE LA CARGA
↓
CALCULAR PRECIO/KILO
↓
CAMBIAR PRECIO/KILO (OPCIONAL)
↓
CALCULAR TOTAL
↓
CONTINUAR
↓
DATOS DEL VENDEDOR
↓
RESUMEN
↓
FINALIZAR COMPRA
↓
GUARDAR EN MYSQL
↓
GENERAR VOUCHER PDF
↓
MOSTRAR COMPRA REALIZADA
↓
VOLVER AL DASHBOARD
↓
CONSULTAR HISTORIAL
↓
DESCARGAR VOUCHER

El sistema debe quedar funcional, organizado, entendible y preparado para futuras mejoras.

Antes de comenzar a escribir código, analiza primero el repositorio Coffee-sales y presenta un breve diagnóstico de su estado actual y cualquier elemento existente que deba conservarse.