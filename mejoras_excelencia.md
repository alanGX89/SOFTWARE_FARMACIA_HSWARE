# Mejoras para la Excelencia — PharmaCare Pro

Hoja de ruta para convertir el sistema en un producto que genere la reacción:
**"¡Guau, esto necesito — me ahorra tiempo y dinero!"**

---

## Prioridad 1 — Bloquean ventas hoy

### Ticket / Factura imprimible
**Problema que resuelve:** sin ticket, las farmacias no pueden operar legalmente.
- Generar ticket térmico al confirmar venta (80mm)
- Incluir: nombre del negocio, NIT, detalle de productos, total, vuelto
- Compatible con impresoras USB y Bluetooth
- Opción de ticket simplificado o factura completa

**Esfuerzo:** bajo | **Impacto en ventas:** muy alto

---

### Cierre de caja por turno
**Problema que resuelve:** conflictos internos por diferencias de caja no detectadas.
- Cada cajero abre su turno con un monto inicial
- Al cierre genera su propio resumen: ventas, métodos de pago, diferencia
- El dueño ve el historial comparativo de todos los turnos
- Alertas automáticas si hay diferencia mayor al umbral configurado

**Esfuerzo:** medio | **Impacto en ventas:** muy alto

---

## Prioridad 2 — Generan el "guau" en la demo

### Alertas por WhatsApp
**Problema que resuelve:** nadie revisa el sistema todos los días, pero WhatsApp sí lo leen.
- Notificación cuando un producto baja del stock mínimo
- Alerta cuando un producto vence en 7, 15 o 30 días
- Resumen diario de ventas a las 20:00
- Integración con Twilio o WhatsApp Business API

**Esfuerzo:** medio | **Impacto en ventas:** muy alto

---

### Dashboard móvil del dueño
**Problema que resuelve:** el dueño no puede estar en la farmacia todo el tiempo.
- Vista optimizada para celular (PWA)
- Ventas del día en tiempo real
- Qué cajero está en turno activo
- Descuentos aplicados y anulaciones del día
- Sin instalar nada — solo abrir el navegador

**Esfuerzo:** medio | **Impacto en ventas:** alto

---

### Código de barras con lector físico
**Problema que resuelve:** velocidad en caja durante horas pico.
- Compatibilidad con lectores USB HID (plug & play)
- Al escanear: agrega el producto al carrito automáticamente
- Si el producto no existe, abre formulario de registro rápido
- También funciona desde cámara del celular (jsQR)

**Esfuerzo:** bajo | **Impacto en ventas:** alto

---

## Prioridad 3 — Fidelizan al cliente a largo plazo

### Multi-sucursal
**Problema que resuelve:** quien tiene una farmacia quiere tener dos. El sistema debe crecer con el negocio.
- Un solo login para ver todas las sucursales
- Inventario consolidado y por sucursal
- Reportes comparativos entre locales
- Transferencia de stock entre sucursales
- Cada sucursal con sus propios cajeros y accesos

**Esfuerzo:** alto | **Impacto en ventas:** muy alto

---

### Control de recetas médicas
**Problema que resuelve:** requisito legal para medicamentos controlados.
- Registrar si la venta requirió receta
- Datos del médico y número de receta
- Historial de recetas por paciente
- Reporte para auditorías sanitarias

**Esfuerzo:** bajo | **Impacto en ventas:** alto

---

### Precio mayorista / minorista
**Problema que resuelve:** farmacias que también venden a clínicas y consultorios.
- Dos listas de precios por producto
- Aplicación automática según cantidad o tipo de cliente
- Descuentos por volumen configurables

**Esfuerzo:** bajo | **Impacto en ventas:** medio

---

### Historial de auditoría
**Problema que resuelve:** detección de robo interno o errores operativos.
- Registro de cada acción: quién, qué, cuándo
- Anulaciones de venta con motivo obligatorio
- Cambios de precio con registro del usuario
- Eliminaciones de productos o stock

**Esfuerzo:** bajo | **Impacto en ventas:** alto

---

### Backup automático diario
**Problema que resuelve:** el miedo número uno del dueño — perder todos los datos.
- Export automático a las 23:00
- Guardado en carpeta del servidor + descarga opcional
- Log visible del último backup exitoso
- Restauración con un clic desde el panel admin

**Esfuerzo:** bajo | **Impacto en ventas:** alto

---

### Rentabilidad por producto
**Problema que resuelve:** la mayoría de los dueños no saben qué productos les generan dinero realmente.
- Margen bruto por producto, categoría y período
- Top 10 productos más rentables
- Productos con margen negativo (venta a pérdida)
- Comparativo entre períodos

**Esfuerzo:** medio | **Impacto en ventas:** alto

---

## Tabla resumen de prioridades

| # | Feature | Esfuerzo | Impacto |
|---|---------|----------|---------|
| 1 | Ticket/factura imprimible | Bajo | Muy alto |
| 2 | Cierre de caja por turno | Medio | Muy alto |
| 3 | Alertas por WhatsApp | Medio | Muy alto |
| 4 | Dashboard móvil del dueño | Medio | Alto |
| 5 | Código de barras lector físico | Bajo | Alto |
| 6 | Historial de auditoría | Bajo | Alto |
| 7 | Backup automático | Bajo | Alto |
| 8 | Control de recetas | Bajo | Alto |
| 9 | Precio mayorista/minorista | Bajo | Medio |
| 10 | Rentabilidad por producto | Medio | Alto |
| 11 | Multi-sucursal | Alto | Muy alto |
| 12 | App móvil PWA | Medio | Alto |
