import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, ShieldCheck, LayoutDashboard, ShoppingCart, Package,
  Bell, Truck, Star, Tag, BarChart2, Users, LogOut, ChevronLeft,
  ChevronRight, Pill, ClipboardList, CheckCircle, Info, AlertTriangle,
  ArrowRight, Stethoscope, CreditCard, BarChart, FileText, Download,
  UserPlus, Lock, PlusCircle, Search, ScanBarcode, TrendingUp,
  PackageOpen, Calendar, Phone
} from 'lucide-react';

// ─── Color tokens (verde farmacia) ───────────────────────────────────────────
const C = {
  accent:      '#16a34a',
  accentDark:  '#14532d',
  accentLight: '#f0fdf4',
  accentBorder:'#bbf7d0',
  accentMid:   '#dcfce7',
  text:        '#0f172a',
  textMd:      '#374151',
  textSm:      '#64748b',
  border:      '#e2e8f0',
  bg:          '#f8fafc',
  white:       '#ffffff',
  sidebar:     '#ffffff',
};

// ─── Navegación ───────────────────────────────────────────────────────────────
const NAV = [
  { id: 'intro',        label: 'Introducción',        Icon: BookOpen },
  { id: 'roles',        label: 'Roles y Accesos',     Icon: ShieldCheck },
  { id: 'dashboard',    label: 'Panel Principal',     Icon: LayoutDashboard },
  { id: 'ventas',       label: 'Punto de Venta',      Icon: ShoppingCart },
  { id: 'inventario',   label: 'Inventario',          Icon: Package },
  { id: 'alertas',      label: 'Alertas Inteligentes',Icon: Bell },
  { id: 'proveedores',  label: 'Proveedores',         Icon: Truck },
  { id: 'clientes',     label: 'Clientes y Puntos',   Icon: Star },
  { id: 'promociones',  label: 'Promociones',         Icon: Tag },
  { id: 'consultas',    label: 'Consultas Médicas',   Icon: Stethoscope },
  { id: 'reportes',     label: 'Reportes',            Icon: BarChart2 },
  { id: 'usuarios',     label: 'Gestión de Usuarios', Icon: Users },
];

// ─── Componentes helper ───────────────────────────────────────────────────────
function PageTitle({ Icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 40, height: 40, background: C.accentLight,
          borderRadius: 10, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
          border: `1px solid ${C.accentBorder}`
        }}>
          <Icon size={20} color={C.accent} strokeWidth={2} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>
          {title}
        </h1>
      </div>
      {subtitle && (
        <p style={{ color: C.textSm, marginLeft: 52, fontSize: 14, marginBottom: 0 }}>
          {subtitle}
        </p>
      )}
      <hr style={{ marginTop: 16, borderColor: C.border, borderWidth: '0 0 1px' }} />
    </div>
  );
}

function H2({ children }) {
  return (
    <h2 style={{
      fontSize: 14, fontWeight: 600, color: C.accentDark,
      marginTop: 28, marginBottom: 10, textTransform: 'uppercase',
      letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6
    }}>
      <span style={{
        display: 'inline-block', width: 3, height: 14,
        background: C.accent, borderRadius: 2
      }} />
      {children}
    </h2>
  );
}

function P({ children }) {
  return (
    <p style={{ color: C.textMd, fontSize: 14, lineHeight: 1.75, marginBottom: 12 }}>
      {children}
    </p>
  );
}

function Note({ type = 'info', children }) {
  const configs = {
    info:  { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af', Icon: Info },
    warn:  { bg: '#fffbeb', border: '#fde68a', text: '#92400e', Icon: AlertTriangle },
    ok:    { bg: C.accentLight, border: C.accentBorder, text: '#166534', Icon: CheckCircle },
  };
  const { bg, border, text, Icon: NoteIcon } = configs[type];
  return (
    <div style={{
      background: bg, border: `1px solid ${border}`, color: text,
      borderRadius: 8, padding: '12px 16px', fontSize: 13,
      display: 'flex', gap: 10, margin: '14px 0', alignItems: 'flex-start'
    }}>
      <NoteIcon size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{children}</span>
    </div>
  );
}

function Steps({ items }) {
  return (
    <ol style={{ paddingLeft: 0, listStyle: 'none', margin: '14px 0' }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
          <span style={{
            width: 24, height: 24, borderRadius: '50%', background: C.accent,
            color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0, fontWeight: 700
          }}>{i + 1}</span>
          <span style={{ color: C.textMd, fontSize: 14, lineHeight: 1.65, paddingTop: 2 }}
            dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ol>
  );
}

function Tbl({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto', margin: '16px 0', borderRadius: 8, border: `1px solid ${C.border}` }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{
                textAlign: 'left', padding: '10px 14px',
                background: C.accentLight, borderBottom: `2px solid ${C.accentBorder}`,
                color: C.accentDark, fontWeight: 600, whiteSpace: 'nowrap'
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? C.white : C.bg }}>
              {row.map((cell, j) => (
                <td key={j} style={{
                  padding: '9px 14px', borderBottom: `1px solid ${C.border}`,
                  color: C.textMd, verticalAlign: 'top'
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoleBadge({ role }) {
  const colors = {
    admin:      { bg: '#fee2e2', text: '#dc2626' },
    pharmacist: { bg: '#dbeafe', text: '#2563eb' },
    cashier:    { bg: C.accentMid,  text: '#166534' },
    comercial:  { bg: '#fef3c7', text: '#d97706' },
  };
  const { bg, text } = colors[role] || colors.cashier;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 10px', borderRadius: 20,
      fontSize: 12, fontWeight: 600, background: bg, color: text
    }}>{role}</span>
  );
}

function IconCard({ Icon, title, desc }) {
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 8,
      border: `1px solid ${C.border}`, background: C.white, marginBottom: 8
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 8, background: C.accentLight,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <Icon size={18} color={C.accent} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, color: C.text, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 13, color: C.textSm, lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

// ─── Secciones de contenido ───────────────────────────────────────────────────
function SIntro() {
  return (
    <>
      <PageTitle Icon={BookOpen} title="Bienvenido a PharmaCare Pro"
        subtitle="Sistema integral de gestión para farmacias — Guía de usuario final" />
      <P>
        PharmaCare Pro digitaliza y optimiza todas las operaciones de su farmacia: ventas en
        mostrador, control de inventario, alertas de vencimiento, fidelización de clientes
        y reportes de gestión, todo desde una sola plataforma.
      </P>
      <Note type="ok">
        Diseñado específicamente para farmacias independientes y cadenas pequeñas en Bolivia.
      </Note>
      <H2>¿Qué puede hacer con PharmaCare?</H2>
      <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
        <IconCard Icon={ShoppingCart}   title="Ventas rápidas"         desc="Punto de venta con búsqueda por nombre o código de barras" />
        <IconCard Icon={Package}        title="Control de inventario"  desc="Stock en tiempo real con alertas automáticas de reposición" />
        <IconCard Icon={Bell}           title="Alertas inteligentes"   desc="Notificaciones de stock bajo y productos próximos a vencer" />
        <IconCard Icon={Star}           title="Fidelización"           desc="Acumulación de puntos por compra y canje como descuento" />
        <IconCard Icon={Truck}          title="Gestión de proveedores" desc="Registro de proveedores y trazabilidad de compras" />
        <IconCard Icon={BarChart2}      title="Reportes"               desc="Exportación a PDF y Excel de ventas, inventario y caja" />
        <IconCard Icon={Stethoscope}    title="Consultas médicas"      desc="Registro de consultas, diagnóstico y prescripciones" />
      </div>
      <Note type="info">
        Soporte técnico: HSWare — +591 70488597
      </Note>
    </>
  );
}

function SRoles() {
  return (
    <>
      <PageTitle Icon={ShieldCheck} title="Roles y Accesos"
        subtitle="Cada usuario tiene un nivel de acceso según su función" />
      <Tbl
        headers={['Rol', 'Descripción', 'Acceso']}
        rows={[
          [<RoleBadge role="admin" />,      'Administrador',     'Todo el sistema sin restricciones'],
          [<RoleBadge role="pharmacist" />, 'Farmacéutico',      'Ventas, inventario, proveedores, reportes'],
          [<RoleBadge role="cashier" />,    'Cajero / Vendedor', 'Solo punto de venta y consulta de productos'],
          [<RoleBadge role="comercial" />,  'Demo Comercial',    'Solo este manual de usuario'],
        ]}
      />
      <Note type="warn">
        El usuario comercial solo puede visualizar este manual. No tiene acceso a datos de
        ventas, inventario ni configuración del sistema.
      </Note>
      <H2>Permisos por módulo</H2>
      <Tbl
        headers={['Módulo', 'Admin', 'Farmacéutico', 'Cajero']}
        rows={[
          ['Dashboard',          '✓', '✓', '✓'],
          ['Productos',          '✓', '✓', '✓ (solo ver)'],
          ['Nueva Venta',        '✓', '✓', '✓'],
          ['Historial Ventas',   '✓', '✓', '✓'],
          ['Proveedores',        '✓', '✓', '—'],
          ['Consultas Médicas',  '✓', '✓', '—'],
          ['Reportes',           '✓', '✓', '—'],
          ['Usuarios',           '✓', '—', '—'],
          ['Configuración',      '✓', '—', '—'],
        ]}
      />
    </>
  );
}

function SDashboard() {
  return (
    <>
      <PageTitle Icon={LayoutDashboard} title="Panel Principal"
        subtitle="Vista general en tiempo real de la operación de la farmacia" />
      <P>
        Al iniciar sesión, el sistema muestra el dashboard con las métricas más importantes
        del día. Todos los datos se actualizan automáticamente.
      </P>
      <H2>Tarjetas de resumen</H2>
      <div style={{ display: 'grid', gap: 8 }}>
        <IconCard Icon={TrendingUp}  title="Ventas del día"          desc="Total de ventas realizadas y comparativo porcentual con el día anterior" />
        <IconCard Icon={Package}     title="Productos con stock bajo" desc="Conteo de productos que bajaron del mínimo definido — clic para ver la lista" />
        <IconCard Icon={Calendar}    title="Próximos a vencer"        desc="Cantidad de productos con fecha de vencimiento en los próximos 30 días" />
        <IconCard Icon={ClipboardList} title="Transacciones"         desc="Número total de ventas completadas en el día" />
      </div>
      <H2>Gráficos</H2>
      <Steps items={[
        '<strong>Ventas de los últimos 7 días</strong>: gráfico de barras con la tendencia semanal.',
        '<strong>Top 5 productos</strong>: los más vendidos del mes actual.',
        '<strong>Ventas por método de pago</strong>: distribución entre efectivo, tarjeta y transferencia.',
      ]} />
    </>
  );
}

function SVentas() {
  return (
    <>
      <PageTitle Icon={ShoppingCart} title="Punto de Venta"
        subtitle="Registrar ventas de forma rápida y precisa" />
      <H2>Cómo realizar una venta</H2>
      <Steps items={[
        'Ir al menú lateral y hacer clic en <strong>Nueva Venta</strong>.',
        'Buscar el producto por nombre en el buscador, o escanear su código de barras.',
        'Ajustar la <strong>cantidad</strong> si el cliente solicita más de una unidad.',
        'Si hay una promoción activa, se aplica automáticamente.',
        'Si el cliente está registrado, ingresar su nombre o teléfono para acumular puntos.',
        'Seleccionar el <strong>método de pago</strong>: efectivo, tarjeta o transferencia.',
        'Presionar <strong>Confirmar Venta</strong>. El sistema descuenta el stock automáticamente.',
      ]} />
      <Note type="ok">
        Si el cliente tiene puntos acumulados, puede canjearlos como descuento directamente
        en el paso de confirmación.
      </Note>
      <H2>Historial de ventas</H2>
      <P>
        En la sección <strong>Ventas</strong> puede ver todas las transacciones del día,
        filtrar por fecha, método de pago o cajero, y ver el detalle de cada venta.
      </P>
      <Note type="info">
        Para anular una venta, el cajero debe solicitar autorización al administrador.
        Las devoluciones se gestionan desde el módulo de <strong>Devoluciones</strong>.
      </Note>
    </>
  );
}

function SInventario() {
  return (
    <>
      <PageTitle Icon={Package} title="Inventario"
        subtitle="Control de productos, stock y movimientos de mercadería" />
      <H2>Ver el inventario</H2>
      <P>
        Ir a <strong>Productos</strong> en el menú lateral. Se muestra la lista completa
        con nombre, categoría, precio, stock actual y stock mínimo.
        Los productos en rojo tienen stock bajo el mínimo.
      </P>
      <H2>Registrar un nuevo producto</H2>
      <Steps items={[
        'Clic en <strong>Nuevo Producto</strong>.',
        'Completar: nombre, categoría, código de barras (opcional), precio de costo, precio de venta.',
        'Definir el <strong>stock mínimo</strong>: cuando el stock baje de este número, se genera una alerta.',
        'Guardar. El producto queda disponible inmediatamente en el punto de venta.',
      ]} />
      <H2>Registrar entrada de mercadería</H2>
      <Steps items={[
        'En el listado de productos, buscar el producto a reponer.',
        'Clic en <strong>Movimientos → Entrada de Stock</strong>.',
        'Ingresar la cantidad recibida, el proveedor y la fecha de vencimiento del lote.',
        'El stock se actualiza automáticamente.',
      ]} />
      <H2>Categorías disponibles</H2>
      <Tbl
        headers={['Categoría', 'Descripción']}
        rows={[
          ['Medicamentos',  'Fármacos con o sin receta'],
          ['Suplementos',   'Vitaminas y suplementos nutricionales'],
          ['Higiene',       'Productos de higiene personal'],
          ['Cosméticos',    'Cremas, maquillaje y cuidado facial'],
          ['Otros',         'Artículos varios y accesorios'],
        ]}
      />
    </>
  );
}

function SAlertas() {
  return (
    <>
      <PageTitle Icon={Bell} title="Alertas Inteligentes"
        subtitle="Monitoreo automático del inventario en tiempo real" />
      <P>
        PharmaCare Pro genera alertas automáticas sin necesidad de configuración adicional.
        Aparecen en el panel principal y en la sección <strong>Alertas</strong> del menú.
      </P>
      <Tbl
        headers={['Alerta', 'Descripción', 'Acción recomendada']}
        rows={[
          ['Stock bajo',            'El producto bajó del mínimo definido',        'Hacer pedido al proveedor'],
          ['Próximo a vencer 30d',  'Alerta preventiva amarilla',                  'Aplicar descuento o promoción'],
          ['Próximo a vencer 15d',  'Alerta naranja urgente',                      'Reducir precio para rotar'],
          ['Próximo a vencer 7d',   'Alerta roja crítica',                         'Retirar o liquidar'],
          ['Producto agotado',      'Stock en cero',                               'Reponer de inmediato'],
        ]}
      />
      <Note type="warn">
        Las alertas no resueltas permanecen activas. Marcarlas como leídas no repone el stock
        ni extiende el vencimiento — solo oculta la notificación de la lista.
      </Note>
      <H2>Marcar alertas como leídas</H2>
      <Steps items={[
        'Ir a <strong>Alertas</strong> en el menú.',
        'Revisar cada alerta y tomar la acción indicada (reposición, descuento, etc.).',
        'Clic en <strong>Marcar como leída</strong> para archivarla.',
      ]} />
    </>
  );
}

function SProveedores() {
  return (
    <>
      <PageTitle Icon={Truck} title="Proveedores"
        subtitle="Registro de proveedores y trazabilidad de compras" />
      <H2>Registrar un proveedor</H2>
      <Steps items={[
        'Ir a <strong>Proveedores → Nuevo Proveedor</strong>.',
        'Completar: nombre de la empresa, nombre del contacto, teléfono, email y ciudad.',
        'Opcionalmente agregar los productos o categorías que suministra.',
        'Guardar. El proveedor queda disponible para asociar a entradas de stock.',
      ]} />
      <H2>Asociar proveedor a una compra</H2>
      <P>
        Al registrar una entrada de stock en el módulo de Inventario, se puede seleccionar
        el proveedor correspondiente. Esto permite generar reportes de compras por proveedor
        y calcular el costo de adquisición de cada producto.
      </P>
      <Note type="info">
        Mantener actualizado el catálogo de proveedores facilita la gestión de órdenes de
        compra y la trazabilidad de lotes con fecha de vencimiento.
      </Note>
    </>
  );
}

function SClientes() {
  return (
    <>
      <PageTitle Icon={Star} title="Clientes y Sistema de Puntos"
        subtitle="Fidelización de clientes con puntos por compra" />
      <P>
        PharmaCare Pro incluye un sistema de fidelización que recompensa a los clientes
        frecuentes con puntos canjeables como descuento.
      </P>
      <H2>Registrar un cliente</H2>
      <Steps items={[
        'En el módulo <strong>Clientes</strong>, clic en <strong>Nuevo Cliente</strong>.',
        'Ingresar nombre completo, teléfono y opcionalmente email.',
        'Guardar. El cliente queda asociado a su número de teléfono.',
      ]} />
      <H2>Cómo funcionan los puntos</H2>
      <Tbl
        headers={['Acción', 'Resultado']}
        rows={[
          ['Cada Bs. 10 en compras',     '1 punto acumulado (configurable por admin)'],
          ['Canjear 100 puntos',          'Bs. 5 de descuento en la siguiente compra'],
          ['Consultar puntos del cliente','Buscar por nombre o teléfono en el punto de venta'],
        ]}
      />
      <Note type="ok">
        Los puntos se acumulan automáticamente cada vez que el cliente se identifica al
        momento de la venta. No requiere tarjeta física.
      </Note>
    </>
  );
}

function SPromociones() {
  return (
    <>
      <PageTitle Icon={Tag} title="Promociones y Descuentos"
        subtitle="Gestión de ofertas, descuentos y combos" />
      <H2>Crear una promoción</H2>
      <Steps items={[
        'Ir a <strong>Promociones → Nueva Promoción</strong>.',
        'Seleccionar el tipo: descuento porcentual, precio especial o combo (ej: 2x1).',
        'Seleccionar el producto o categoría a la que aplica.',
        'Definir la fecha de inicio y fecha de vencimiento de la promoción.',
        'Guardar. La promoción se aplica automáticamente en el punto de venta.',
      ]} />
      <Tbl
        headers={['Tipo de promoción', 'Ejemplo']}
        rows={[
          ['Descuento porcentual', '10% de descuento en todos los suplementos'],
          ['Precio especial',      'Paracetamol a Bs. 3,50 (precio habitual Bs. 5)'],
          ['Combo',                'Compra 2 vitaminas y lleva 3'],
        ]}
      />
      <Note type="warn">
        Solo el administrador o farmacéutico pueden crear o modificar promociones.
        El cajero solo las aplica durante la venta.
      </Note>
    </>
  );
}

function SConsultas() {
  return (
    <>
      <PageTitle Icon={Stethoscope} title="Consultas Médicas"
        subtitle="Registro de consultas, diagnósticos y prescripciones" />
      <P>
        PharmaCare Pro incluye un módulo de consultas para farmacias que también ofrecen
        atención médica básica o servicios de farmacéutico clínico.
      </P>
      <H2>Registrar una consulta</H2>
      <Steps items={[
        'Ir a <strong>Consultas → Nueva Consulta</strong>.',
        'Buscar o registrar el paciente (nombre, edad, teléfono).',
        'Seleccionar el tipo de consulta: general, control o urgencia.',
        'Registrar síntomas, diagnóstico, tratamiento indicado y prescripción.',
        'Definir si requiere seguimiento e indicar la fecha de próxima cita.',
        'Guardar. La consulta queda en el historial del paciente.',
      ]} />
      <H2>Campos del formulario</H2>
      <Tbl
        headers={['Campo', 'Descripción']}
        rows={[
          ['Número de consulta',   'Generado automáticamente por el sistema'],
          ['Paciente',             'Nombre completo, edad y teléfono de contacto'],
          ['Tipo',                 'General, control de crónicos, urgencia'],
          ['Signos vitales',       'Presión, temperatura, peso, frecuencia cardíaca'],
          ['Diagnóstico',          'CIE-10 o descripción libre'],
          ['Prescripción',         'Medicamentos indicados con dosis y duración'],
          ['Fecha de seguimiento', 'Próxima cita programada'],
        ]}
      />
      <Note type="info">
        El historial completo de consultas de cada paciente se puede ver desde su ficha
        en el módulo de Clientes.
      </Note>
    </>
  );
}

function SReportes() {
  return (
    <>
      <PageTitle Icon={BarChart2} title="Reportes"
        subtitle="Generación de informes en PDF y Excel" />
      <P>
        Los reportes permiten analizar el desempeño de la farmacia, controlar el inventario
        y preparar la información contable del período.
      </P>
      <Tbl
        headers={['Reporte', 'Contenido', 'Formato']}
        rows={[
          ['Ventas del día',         'Detalle de cada venta, total e ingresos por método de pago',    'PDF / Excel'],
          ['Cierre de caja',         'Resumen de ingresos del día por turno y cajero',                'PDF'],
          ['Inventario actual',      'Stock de todos los productos con valor de inventario',          'Excel'],
          ['Productos por vencer',   'Lista con fechas de vencimiento próximas',                     'PDF'],
          ['Ventas por producto',    'Top productos más vendidos en el período',                      'Excel'],
          ['Compras a proveedores',  'Historial de entradas de stock por proveedor',                  'Excel'],
          ['Clientes y puntos',      'Ranking de clientes por puntos acumulados',                     'Excel'],
        ]}
      />
      <H2>Cómo generar un reporte</H2>
      <Steps items={[
        'Ir a <strong>Reportes</strong> en el menú lateral.',
        'Seleccionar el tipo de reporte de la lista.',
        'Definir el rango de fechas (día, semana, mes o período personalizado).',
        'Clic en <strong>Generar</strong>. El archivo se descarga automáticamente.',
      ]} />
      <Note type="ok">
        Los reportes en PDF están diseñados para impresión directa. Los reportes Excel
        incluyen todas las columnas para análisis avanzado.
      </Note>
    </>
  );
}

function SUsuarios() {
  return (
    <>
      <PageTitle Icon={Users} title="Gestión de Usuarios"
        subtitle="Administración de cuentas y roles del personal" />
      <Note type="warn">
        Esta sección es solo para el Administrador del sistema.
        Los demás roles no tienen acceso al módulo de usuarios.
      </Note>
      <H2>Crear un usuario</H2>
      <Steps items={[
        'Ir a <strong>Usuarios → Nuevo Usuario</strong>.',
        'Completar: nombre completo, email, contraseña temporal y teléfono.',
        'Asignar el rol: <strong>admin</strong>, <strong>pharmacist</strong> o <strong>cashier</strong>.',
        'Guardar. El usuario puede iniciar sesión de inmediato.',
      ]} />
      <H2>Bloquear o desactivar un usuario</H2>
      <Steps items={[
        'Buscar al usuario en la lista.',
        'Clic en <strong>Editar</strong>.',
        'Cambiar el estado a <strong>Inactivo</strong>.',
        'Guardar. El usuario no podrá iniciar sesión hasta ser reactivado.',
      ]} />
      <Note type="info">
        Si un empleado deja de trabajar en la farmacia, desactivar su cuenta inmediatamente
        para evitar accesos no autorizados. No es necesario eliminar la cuenta.
      </Note>
      <H2>Cambiar contraseña</H2>
      <P>
        Desde la edición del usuario, el administrador puede establecer una nueva contraseña
        en cualquier momento. Se recomienda que cada usuario cambie su contraseña temporal
        en el primer acceso.
      </P>
    </>
  );
}

const SECTIONS = {
  intro: SIntro, roles: SRoles, dashboard: SDashboard, ventas: SVentas,
  inventario: SInventario, alertas: SAlertas, proveedores: SProveedores,
  clientes: SClientes, promociones: SPromociones, consultas: SConsultas,
  reportes: SReportes, usuarios: SUsuarios,
};

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ManualPage() {
  const [active, setActive] = useState('intro');
  const { logout } = useAuth();
  const navigate = useNavigate();
  const idx = NAV.findIndex(i => i.id === active);
  const SectionComponent = SECTIONS[active];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'Segoe UI, system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        background: C.white, borderBottom: `1px solid ${C.border}`,
        position: 'sticky', top: 0, zIndex: 20,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 24px',
          height: 56, display: 'flex', alignItems: 'center', gap: 12
        }}>
          <div style={{
            width: 32, height: 32, background: C.accent, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Pill size={17} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 700, color: C.accentDark, fontSize: 15 }}>PharmaCare Pro</span>
          <span style={{ color: C.textSm, margin: '0 2px' }}>/</span>
          <span style={{ color: C.textSm, fontSize: 14 }}>Manual de Usuario</span>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: C.textSm }}>v2.0.0</span>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
            borderRadius: 6, border: `1px solid ${C.border}`, background: C.white,
            color: C.textSm, fontSize: 13, cursor: 'pointer'
          }}>
            <LogOut size={14} strokeWidth={2} />
            Salir
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'flex', flex: 1 }}>

        {/* Sidebar */}
        <aside style={{
          width: 230, background: C.sidebar, borderRight: `1px solid ${C.border}`,
          padding: '16px 0', position: 'sticky', top: 56,
          height: 'calc(100vh - 56px)', overflowY: 'auto', flexShrink: 0
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700, color: C.textSm,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            padding: '0 16px', marginBottom: 8
          }}>Contenido</p>
          {NAV.map(({ id, label, Icon: NavIcon }) => {
            const isActive = active === id;
            return (
              <button key={id} onClick={() => setActive(id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                padding: '8px 16px',
                background: isActive ? C.accentLight : 'transparent',
                color: isActive ? C.accent : C.textMd,
                fontWeight: isActive ? 600 : 400, fontSize: 13,
                border: 'none', cursor: 'pointer', textAlign: 'left',
                borderLeft: isActive ? `3px solid ${C.accent}` : '3px solid transparent',
                transition: 'all 0.15s'
              }}>
                <NavIcon size={15} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </button>
            );
          })}
        </aside>

        {/* Contenido principal */}
        <main style={{ flex: 1, padding: '40px 48px', maxWidth: 820, minWidth: 0 }}>
          <SectionComponent />

          {/* Navegación anterior / siguiente */}
          <div style={{
            marginTop: 48, paddingTop: 24, borderTop: `1px solid ${C.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              {idx > 0 && (
                <button onClick={() => setActive(NAV[idx - 1].id)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 8,
                  border: `1px solid ${C.border}`, background: C.white,
                  color: C.textMd, fontSize: 13, cursor: 'pointer'
                }}>
                  <ChevronLeft size={15} strokeWidth={2} />
                  {NAV[idx - 1].label}
                </button>
              )}
            </div>
            <div>
              {idx < NAV.length - 1 && (
                <button onClick={() => setActive(NAV[idx + 1].id)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 16px', borderRadius: 8,
                  border: 'none', background: C.accent,
                  color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600
                }}>
                  {NAV[idx + 1].label}
                  <ChevronRight size={15} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
