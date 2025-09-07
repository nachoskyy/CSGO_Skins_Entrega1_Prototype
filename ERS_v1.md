
# ERS — Especificación de Requisitos de Software (Versión 1, propuesta previa)
**Proyecto:** K&amp;N Skins — Marketplace educativo de compra/venta de skins CS2 (solo front-end / sin pagos reales)  
**Fecha:** 2025-09-06  
**Autores:** Víctor Hurtado y Ignacio Garcia

## 1. Introducción
### 1.1 Propósito
Definir los requerimientos iniciales para la entrega 1 del proyecto web, alineado con la rúbrica de la asignatura y anexos del docente. Documento dirigido al equipo de desarrollo y al docente evaluador.

### 1.2 Ámbito del Sistema
- El sistema permite listar skins, ver detalle, simular carrito de compras y realizar formularios de contacto, registro e inicio de sesión con validaciones.
- No incluye pasarela de pago ni backend real. Toda la lógica es front-end y almacenamiento local (LocalStorage).
- Se agrega un módulo “Admin” para simular mantenedores de productos y usuarios.

### 1.3 Definiciones
- **Producto**: skin del juego CS2, con `codigo`, `nombre`, `desc`, `precio`, `categoria`, `stock`, `stockCritico`, `img`.
- **Carrito**: arreglo persistido en `localStorage` con `{id, qty}`.
- **RUN**: identificador chileno, validado con módulo 11 (sin puntos ni guion).
- **ERS**: Especificación de Requisitos de Software.

### 1.4 Referencias
- Instrucciones Evaluación Parcial 1, rúbrica y entregables.  
- Detalle de instrucciones adicionales del docente (links, sitemap, validaciones, cifrado, W3C).  
- Plantilla ERS (IEEE 830).

### 1.5 Visión General
Este documento incluye la descripción general del producto y los requisitos funcionales y no funcionales mínimos para la entrega 1.

## 2. Descripción General
### 2.1 Perspectiva del Producto
Producto web estático con múltiples páginas HTML enlazadas, hoja de estilos externa CSS y JS modular. Uso de LocalStorage para persistencia simple (carrito y usuarios demo).

### 2.2 Funciones del Producto
- Navegación entre páginas (Home, Productos, Detalle, Blogs, Nosotros, Contacto, Login, Registro, Sitemap, Admin).
- Listado y detalle de productos con botón “Añadir al carrito”.
- Carrito de compras: agregar, quitar, vaciar y total.
- Formularios con validaciones JS (login, contacto, registro, admin usuario/producto).
- Mantenedores en Admin (listados y altas demo).

### 2.3 Características de los Usuarios
- **Cliente**: navega tienda, usa carrito, contacto, registro y login.
- **Vendedor**: puede visualizar listados en admin (simulado).
- **Administrador**: gestiona productos/usuarios (simulado).

### 2.4 Restricciones
- Sin backend ni pagos reales en la entrega 1.
- Compatibilidad básica con navegadores modernos.
- Validaciones alineadas a requisitos docentes (dominios de correo, RUN, etc.).

### 2.5 Suposiciones y Dependencias
- Productos y regiones/comunas provienen de arreglos JS.
- Evaluación en laboratorio con conexión limitada; sin librerías externas.

### 2.6 Requisitos Futuros
- Persistencia real via API/BD.
- Autenticación/roles reales.
- Operaciones CRUD reales para admin.
- Pasarela de pagos, órdenes, historial.

## 3. Requisitos Específicos
### 3.1 Interfaces
- **UI**: páginas web con menú superior, área de contenido, tarjetas y tablas.
- **Software**: integración con Web Storage (`localStorage`). Sin dependencias externas.
- **Comunicación**: n/a (sin backend).

### 3.2 Requisitos funcionales (RF)
- **RF-01 Navegación**: El sistema debe permitir navegar entre todas las vistas mediante hipervínculos.
- **RF-02 Productos**: Visualizar listado de productos y detalle; cada producto con imagen, nombre y precio.
- **RF-03 Carrito**: Añadir/quitar productos, vaciar carrito y calcular total. Persistir en `localStorage`.
- **RF-04 Login**: Validar correo (dominio permitido) y contraseña (4–10), cifrar contraseña (hash) en el cliente.
- **RF-05 Registro**: Validar RUN (módulo 11), nombres/apellidos, dominio de correo, tipo usuario, región/comuna dependiente, dirección y contraseña (hash).
- **RF-06 Contacto**: Validar nombre (req, max 100), email (dominio permitido, opcional), comentario (req, max 500).
- **RF-07 Admin Productos**: Listado y alta con validaciones (código min 3, nombre max 100, descripción max 500, precio ≥0 decimal, stock entero ≥0, stock crítico entero ≥0 opcional, categoría requerida).
- **RF-08 Admin Usuarios**: Listado y alta con validaciones (RUN, nombre, apellidos, correo dominio permitido, fecha opcional, tipo requerido, región/comuna, dirección).
- **RF-09 Sitemap**: Página con enlaces a todas las vistas.
- **RF-10 Botón de ayuda**: Acceso directo a Contacto.

### 3.3 Requisitos no funcionales (RNF)
- **RNF-01 HTML5/CSS3 válidos**: Cumplir validaciones básicas W3C.
- **RNF-02 Responsivo**: Layout adaptativo móvil-escritorio.
- **RNF-03 Accesibilidad básica**: `alt` en imágenes, labels en formularios, contraste legible.
- **RNF-04 Mantenibilidad**: CSS externo, JS modular (`data`, `cart`, `validations`, `app`, `admin`).

### 3.4 Otros requisitos
- Logo/ícono, mínimo 5 links funcionales, imágenes de productos.
- Footer con dirección, teléfono, mail e íconos sociales.
