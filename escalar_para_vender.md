# Escalar para Vender — PharmaCare Pro

Estrategia para vender a farmacias de distintos tamaños
activando y desactivando módulos sin reestructurar todo el código.

---

## El problema de vender talla única

Una farmacia de barrio con 1 cajero no necesita multi-sucursal.
Una cadena con 5 locales no quiere pagar por un sistema básico.

Si vendés el mismo sistema a todos, o cobrás de más al pequeño
o cobrás de menos al grande. La solución es un sistema de **planes por módulos**.

---

## Arquitectura de módulos (Feature Flags)

La idea es simple: cada módulo del sistema tiene un interruptor.
El interruptor se activa o desactiva desde una tabla en la base de datos,
sin tocar el código.

### Tabla en la base de datos

```sql
CREATE TABLE plan_modules (
  id          SERIAL PRIMARY KEY,
  plan        VARCHAR(20) NOT NULL,  -- 'basico', 'profesional', 'empresarial'
  module_key  VARCHAR(50) NOT NULL,  -- 'reportes', 'multi_sucursal', etc.
  enabled     BOOLEAN DEFAULT false
);
```

### En el backend — middleware de módulos

```js
// server/middleware/modules.js
exports.requireModule = (moduleKey) => {
  return async (req, res, next) => {
    const tenant = await Tenant.findByPk(req.user.tenantId);
    const module = await PlanModule.findOne({
      where: { plan: tenant.plan, module_key: moduleKey, enabled: true }
    });
    if (!module) {
      return res.status(403).json({
        message: 'Este módulo no está disponible en tu plan actual.'
      });
    }
    next();
  };
};
```

### En el frontend — hook de módulos

```js
// client/src/hooks/useModule.js
export function useModule(moduleKey) {
  const { user } = useAuth();
  return user?.modules?.includes(moduleKey) ?? false;
}

// Uso en cualquier componente:
const tieneReportes = useModule('reportes');

return tieneReportes ? <Reportes /> : <UpgradePrompt />;
```

### En el login — incluir módulos activos en el token

```js
// Al hacer login, el servidor devuelve los módulos del plan
{
  token: "...",
  user: { id, name, role, plan: "profesional" },
  modules: ["ventas", "inventario", "reportes", "clientes"]
}
```

---

## Los 3 planes recomendados

### Plan Básico — Farmacia de barrio
**Para quién:** 1 local, 1-2 cajeros, dueño que quiere orden básico.
**Precio sugerido:** Bs. 150/mes

| Módulo | Incluido |
|--------|:--------:|
| Punto de venta | ✓ |
| Inventario básico | ✓ |
| Alertas de stock bajo | ✓ |
| Historial de ventas | ✓ |
| 1 usuario cajero | ✓ |
| Reportes avanzados | — |
| Clientes y puntos | — |
| Proveedores | — |
| Promociones | — |
| WhatsApp | — |
| Multi-sucursal | — |

---

### Plan Profesional — Farmacia establecida
**Para quién:** 1 local con flujo alto, dueño que quiere control total.
**Precio sugerido:** Bs. 350/mes

| Módulo | Incluido |
|--------|:--------:|
| Todo el Plan Básico | ✓ |
| Reportes PDF y Excel | ✓ |
| Clientes y puntos de fidelización | ✓ |
| Gestión de proveedores | ✓ |
| Promociones y descuentos | ✓ |
| Consultas médicas | ✓ |
| Cierre de caja por turno | ✓ |
| Alertas por WhatsApp | ✓ |
| Hasta 5 usuarios | ✓ |
| Multi-sucursal | — |
| API de integración | — |

---

### Plan Empresarial — Cadena de farmacias
**Para quién:** 2 o más locales, gerente que necesita visión consolidada.
**Precio sugerido:** Bs. 800/mes por las primeras 3 sucursales + Bs. 200 por cada sucursal adicional

| Módulo | Incluido |
|--------|:--------:|
| Todo el Plan Profesional | ✓ |
| Multi-sucursal ilimitada | ✓ |
| Dashboard ejecutivo consolidado | ✓ |
| Transferencia de stock entre sucursales | ✓ |
| Reportes comparativos entre locales | ✓ |
| Historial de auditoría completo | ✓ |
| Backup automático diario | ✓ |
| Usuarios ilimitados | ✓ |
| Soporte prioritario | ✓ |
| API de integración | ✓ |

---

## Cómo implementarlo sin reestructurar todo

### Paso 1 — Agregar campo `plan` al tenant/negocio

No se toca la tabla `users`. Se crea una tabla `tenants` (negocios):

```sql
CREATE TABLE tenants (
  id      SERIAL PRIMARY KEY,
  name    VARCHAR(100) NOT NULL,
  plan    VARCHAR(20) DEFAULT 'basico',
  active  BOOLEAN DEFAULT true
);
```

Cada usuario pertenece a un tenant:
```sql
ALTER TABLE users ADD COLUMN tenant_id INTEGER REFERENCES tenants(id);
```

### Paso 2 — Envolver rutas con el middleware

```js
// Solo en rutas que requieren módulo específico
router.get('/reports', protect, requireModule('reportes'), getReports);
router.get('/suppliers', protect, requireModule('proveedores'), getSuppliers);

// Rutas básicas sin restricción de módulo
router.post('/sales', protect, createSale);
router.get('/products', protect, getProducts);
```

### Paso 3 — En el frontend, ocultar menú según módulos

```js
// Layout.js — filtrar menú según módulos activos
const menuItems = [
  { path: '/',         label: 'Dashboard',   module: null },
  { path: '/sales',    label: 'Ventas',      module: null },
  { path: '/products', label: 'Productos',   module: null },
  { path: '/reports',  label: 'Reportes',    module: 'reportes' },
  { path: '/suppliers',label: 'Proveedores', module: 'proveedores' },
  { path: '/users',    label: 'Usuarios',    module: null, role: 'admin' },
];

const filteredMenu = menuItems.filter(item => {
  if (item.role && user.role !== item.role) return false;
  if (item.module && !user.modules.includes(item.module)) return false;
  return true;
});
```

### Paso 4 — Panel de administración para activar módulos

Una pantalla solo visible para el super-admin (vos) donde:
- Ves todos los tenants registrados
- Cambiás el plan de un tenant con un clic
- Activás o desactivás módulos individuales manualmente
- Ves la fecha de vencimiento del plan

---

## Estrategia comercial

### Cómo vender la primera farmacia

1. Demo gratuita con el usuario `comercial` — el cliente lo recorre solo
2. Prueba de 15 días del Plan Profesional sin costo
3. Al finalizar la prueba, el sistema sigue funcionando en Plan Básico automáticamente
4. El cliente ya tiene sus datos cargados — migrar a otro sistema tiene un costo implícito

### Cómo subir de plan

- El módulo bloqueado muestra un cartel: *"Disponible en Plan Profesional — Consultá al +591 70488597"*
- No bloquea el sistema, solo ese módulo — el cliente puede seguir trabajando
- Cada módulo bloqueado es un recordatorio de que puede mejorar

### Cómo cobrar

| Modalidad | Ventaja |
|-----------|---------|
| Mensual | Flujo de caja predecible |
| Anual con descuento del 20% | Retención garantizada |
| Implementación única + mensualidad | Cubre el costo de setup |
| Por sucursal adicional | Escala con el crecimiento del cliente |

---

## Módulos identificados en el sistema actual

| Módulo | Clave | Plan mínimo |
|--------|-------|-------------|
| Punto de venta | `ventas` | Básico |
| Inventario | `inventario` | Básico |
| Alertas de stock | `alertas` | Básico |
| Historial de ventas | `historial_ventas` | Básico |
| Clientes y puntos | `clientes` | Profesional |
| Proveedores | `proveedores` | Profesional |
| Promociones | `promociones` | Profesional |
| Reportes | `reportes` | Profesional |
| Consultas médicas | `consultas` | Profesional |
| Cierre de caja | `cierre_caja` | Profesional |
| WhatsApp | `whatsapp` | Profesional |
| Multi-sucursal | `multi_sucursal` | Empresarial |
| Auditoría | `auditoria` | Empresarial |
| Backup automático | `backup` | Empresarial |
| API integración | `api` | Empresarial |

---

## Lo que NO hay que hacer

- No crear tres proyectos separados por plan — es mantenimiento triple
- No hardcodear roles como `if plan === 'basico'` en 50 lugares del código
- No eliminar datos al bajar de plan — solo ocultar el acceso
- No cobrar por usuarios — genera fricción al crecer
