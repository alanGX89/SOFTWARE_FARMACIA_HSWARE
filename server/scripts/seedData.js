/**
 * Script para poblar la base de datos con datos de ejemplo
 * Ejecutar: node server/scripts/seedData.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const {
  sequelize,
  User,
  Product,
  Supplier,
  Customer,
  Sale,
  SaleItem,
  StockMovement,
  Consultation
} = require('../models');

// Datos de proveedores
const suppliersData = [
  {
    name: 'Farmacéuticos Unidos S.A.',
    contact_name: 'Roberto Méndez',
    email: 'ventas@farmauni.com',
    phone: '555-0101',
    address: 'Av. Industrial 456, Zona Centro',
    rfc: 'FUN890515ABC',
    notes: 'Proveedor principal de medicamentos genéricos'
  },
  {
    name: 'Distribuidora Médica del Norte',
    contact_name: 'María García',
    email: 'contacto@dismednorte.com',
    phone: '555-0202',
    address: 'Calle Comercio 789, Col. Industrial',
    rfc: 'DMN901234DEF',
    notes: 'Especialista en medicamentos de patente'
  },
  {
    name: 'Laboratorios Omega',
    contact_name: 'Carlos Ruiz',
    email: 'pedidos@labomega.com',
    phone: '555-0303',
    address: 'Blvd. Farmacéutico 123',
    rfc: 'LOM850612GHI',
    notes: 'Productos dermatológicos y cosméticos'
  },
  {
    name: 'Suministros Hospitalarios MX',
    contact_name: 'Ana Martínez',
    email: 'ventas@suhomx.com',
    phone: '555-0404',
    address: 'Parque Industrial Las Torres 45',
    rfc: 'SHM920831JKL',
    notes: 'Material de curación y equipo médico'
  }
];

// Datos de productos/medicamentos
const productsData = [
  // Analgésicos
  { name: 'Paracetamol 500mg', generic_name: 'Acetaminofén', barcode: '7501234567001', category: 'Analgésicos', presentation: 'Caja 20 tabletas', purchase_price: 15.00, price: 28.50, stock: 150, min_stock: 30, max_stock: 300, requires_prescription: false, active_ingredient: 'Paracetamol', concentration: '500mg', laboratory: 'Genéricos MX' },
  { name: 'Ibuprofeno 400mg', generic_name: 'Ibuprofeno', barcode: '7501234567002', category: 'Analgésicos', presentation: 'Caja 10 tabletas', purchase_price: 18.00, price: 35.00, stock: 120, min_stock: 25, max_stock: 250, requires_prescription: false, active_ingredient: 'Ibuprofeno', concentration: '400mg', laboratory: 'FarmaGen' },
  { name: 'Naproxeno 250mg', generic_name: 'Naproxeno', barcode: '7501234567003', category: 'Analgésicos', presentation: 'Caja 30 tabletas', purchase_price: 45.00, price: 85.00, stock: 80, min_stock: 20, max_stock: 200, requires_prescription: false, active_ingredient: 'Naproxeno sódico', concentration: '250mg', laboratory: 'Laboratorios Beta' },
  { name: 'Ketorolaco 10mg', generic_name: 'Ketorolaco', barcode: '7501234567004', category: 'Analgésicos', presentation: 'Caja 10 tabletas', purchase_price: 35.00, price: 65.00, stock: 60, min_stock: 15, max_stock: 150, requires_prescription: true, active_ingredient: 'Ketorolaco trometamina', concentration: '10mg', laboratory: 'MediPharma' },

  // Antibióticos
  { name: 'Amoxicilina 500mg', generic_name: 'Amoxicilina', barcode: '7501234567005', category: 'Antibióticos', presentation: 'Caja 21 cápsulas', purchase_price: 55.00, price: 95.00, stock: 90, min_stock: 20, max_stock: 200, requires_prescription: true, active_ingredient: 'Amoxicilina trihidratada', concentration: '500mg', laboratory: 'AntiBioticos SA' },
  { name: 'Azitromicina 500mg', generic_name: 'Azitromicina', barcode: '7501234567006', category: 'Antibióticos', presentation: 'Caja 3 tabletas', purchase_price: 85.00, price: 145.00, stock: 70, min_stock: 15, max_stock: 150, requires_prescription: true, active_ingredient: 'Azitromicina dihidratada', concentration: '500mg', laboratory: 'Zitro Labs' },
  { name: 'Ciprofloxacino 500mg', generic_name: 'Ciprofloxacino', barcode: '7501234567007', category: 'Antibióticos', presentation: 'Caja 14 tabletas', purchase_price: 120.00, price: 195.00, stock: 45, min_stock: 10, max_stock: 100, requires_prescription: true, active_ingredient: 'Ciprofloxacino clorhidrato', concentration: '500mg', laboratory: 'FarmaQuímica' },

  // Antihipertensivos
  { name: 'Losartán 50mg', generic_name: 'Losartán', barcode: '7501234567008', category: 'Antihipertensivos', presentation: 'Caja 30 tabletas', purchase_price: 75.00, price: 135.00, stock: 100, min_stock: 25, max_stock: 250, requires_prescription: true, active_ingredient: 'Losartán potásico', concentration: '50mg', laboratory: 'CardioMed' },
  { name: 'Enalapril 10mg', generic_name: 'Enalapril', barcode: '7501234567009', category: 'Antihipertensivos', presentation: 'Caja 30 tabletas', purchase_price: 45.00, price: 85.00, stock: 85, min_stock: 20, max_stock: 200, requires_prescription: true, active_ingredient: 'Enalapril maleato', concentration: '10mg', laboratory: 'VasoFarma' },
  { name: 'Amlodipino 5mg', generic_name: 'Amlodipino', barcode: '7501234567010', category: 'Antihipertensivos', presentation: 'Caja 30 tabletas', purchase_price: 65.00, price: 115.00, stock: 75, min_stock: 20, max_stock: 180, requires_prescription: true, active_ingredient: 'Amlodipino besilato', concentration: '5mg', laboratory: 'CardioMed' },

  // Antidiabéticos
  { name: 'Metformina 850mg', generic_name: 'Metformina', barcode: '7501234567011', category: 'Antidiabéticos', presentation: 'Caja 30 tabletas', purchase_price: 35.00, price: 65.00, stock: 110, min_stock: 30, max_stock: 300, requires_prescription: true, active_ingredient: 'Metformina clorhidrato', concentration: '850mg', laboratory: 'DiabetiCare' },
  { name: 'Glibenclamida 5mg', generic_name: 'Glibenclamida', barcode: '7501234567012', category: 'Antidiabéticos', presentation: 'Caja 50 tabletas', purchase_price: 55.00, price: 95.00, stock: 65, min_stock: 15, max_stock: 150, requires_prescription: true, active_ingredient: 'Glibenclamida', concentration: '5mg', laboratory: 'GlucoFarma' },

  // Gastrointestinales
  { name: 'Omeprazol 20mg', generic_name: 'Omeprazol', barcode: '7501234567013', category: 'Gastrointestinales', presentation: 'Caja 14 cápsulas', purchase_price: 45.00, price: 85.00, stock: 130, min_stock: 30, max_stock: 300, requires_prescription: false, active_ingredient: 'Omeprazol', concentration: '20mg', laboratory: 'GastroMed' },
  { name: 'Ranitidina 150mg', generic_name: 'Ranitidina', barcode: '7501234567014', category: 'Gastrointestinales', presentation: 'Caja 20 tabletas', purchase_price: 35.00, price: 65.00, stock: 95, min_stock: 25, max_stock: 250, requires_prescription: false, active_ingredient: 'Ranitidina clorhidrato', concentration: '150mg', laboratory: 'DigestiPharma' },
  { name: 'Loperamida 2mg', generic_name: 'Loperamida', barcode: '7501234567015', category: 'Gastrointestinales', presentation: 'Caja 12 tabletas', purchase_price: 25.00, price: 48.00, stock: 80, min_stock: 20, max_stock: 200, requires_prescription: false, active_ingredient: 'Loperamida clorhidrato', concentration: '2mg', laboratory: 'GastroMed' },

  // Antigripales
  { name: 'Antigripal Plus', generic_name: 'Paracetamol/Fenilefrina', barcode: '7501234567016', category: 'Antigripales', presentation: 'Caja 10 sobres', purchase_price: 55.00, price: 95.00, stock: 140, min_stock: 35, max_stock: 350, requires_prescription: false, active_ingredient: 'Paracetamol, Fenilefrina, Clorfeniramina', concentration: '500mg/5mg/2mg', laboratory: 'GripFin' },
  { name: 'Jarabe para Tos', generic_name: 'Dextrometorfano', barcode: '7501234567017', category: 'Antigripales', presentation: 'Frasco 120ml', purchase_price: 65.00, price: 115.00, stock: 60, min_stock: 15, max_stock: 150, requires_prescription: false, active_ingredient: 'Dextrometorfano bromhidrato', concentration: '15mg/5ml', laboratory: 'TosAway' },

  // Vitaminas y Suplementos
  { name: 'Vitamina C 1g', generic_name: 'Ácido Ascórbico', barcode: '7501234567018', category: 'Vitaminas', presentation: 'Tubo 10 tabletas efervescentes', purchase_price: 45.00, price: 85.00, stock: 180, min_stock: 40, max_stock: 400, requires_prescription: false, active_ingredient: 'Ácido ascórbico', concentration: '1g', laboratory: 'VitaPlus' },
  { name: 'Complejo B', generic_name: 'Vitaminas B1, B6, B12', barcode: '7501234567019', category: 'Vitaminas', presentation: 'Caja 30 tabletas', purchase_price: 85.00, price: 145.00, stock: 95, min_stock: 25, max_stock: 250, requires_prescription: false, active_ingredient: 'Tiamina, Piridoxina, Cianocobalamina', concentration: '100mg/5mg/50mcg', laboratory: 'VitaMax' },
  { name: 'Multivitamínico Adulto', generic_name: 'Polivitaminas', barcode: '7501234567020', category: 'Vitaminas', presentation: 'Frasco 60 tabletas', purchase_price: 195.00, price: 345.00, stock: 50, min_stock: 12, max_stock: 120, requires_prescription: false, active_ingredient: 'Vitaminas A,C,D,E,K + Minerales', concentration: 'Variado', laboratory: 'NutriForce' },

  // Dermatológicos
  { name: 'Crema Hidratante', generic_name: 'Urea', barcode: '7501234567021', category: 'Dermatológicos', presentation: 'Tubo 100g', purchase_price: 75.00, price: 135.00, stock: 45, min_stock: 10, max_stock: 100, requires_prescription: false, active_ingredient: 'Urea', concentration: '10%', laboratory: 'DermaCare' },
  { name: 'Protector Solar FPS 50', generic_name: 'Filtros UV', barcode: '7501234567022', category: 'Dermatológicos', presentation: 'Frasco 60ml', purchase_price: 145.00, price: 265.00, stock: 35, min_stock: 10, max_stock: 80, requires_prescription: false, active_ingredient: 'Octinoxato, Avobenzona', concentration: 'FPS 50+', laboratory: 'SunBlock Pro' },

  // Material de Curación
  { name: 'Alcohol 96°', generic_name: 'Alcohol Etílico', barcode: '7501234567023', category: 'Material de Curación', presentation: 'Frasco 500ml', purchase_price: 25.00, price: 45.00, stock: 200, min_stock: 50, max_stock: 500, requires_prescription: false, active_ingredient: 'Alcohol etílico', concentration: '96%', laboratory: 'Antisépticos MX' },
  { name: 'Gasas Estériles', generic_name: 'Gasa de Algodón', barcode: '7501234567024', category: 'Material de Curación', presentation: 'Paquete 10 piezas', purchase_price: 15.00, price: 28.00, stock: 250, min_stock: 60, max_stock: 600, requires_prescription: false, active_ingredient: 'Algodón', concentration: '10x10cm', laboratory: 'MediSupply' },
  { name: 'Vendas Elásticas', generic_name: 'Venda de Algodón', barcode: '7501234567025', category: 'Material de Curación', presentation: 'Rollo 5cm x 5m', purchase_price: 18.00, price: 35.00, stock: 120, min_stock: 30, max_stock: 300, requires_prescription: false, active_ingredient: 'Algodón elástico', concentration: '5cm x 5m', laboratory: 'MediSupply' },
  { name: 'Curitas Adhesivas', generic_name: 'Tiras Adhesivas', barcode: '7501234567026', category: 'Material de Curación', presentation: 'Caja 100 piezas', purchase_price: 35.00, price: 65.00, stock: 80, min_stock: 20, max_stock: 200, requires_prescription: false, active_ingredient: 'Plástico/Tela adhesiva', concentration: 'Variado', laboratory: 'CuraBien' },

  // Antiinflamatorios
  { name: 'Diclofenaco 100mg', generic_name: 'Diclofenaco', barcode: '7501234567027', category: 'Antiinflamatorios', presentation: 'Caja 20 tabletas', purchase_price: 35.00, price: 65.00, stock: 110, min_stock: 25, max_stock: 250, requires_prescription: false, active_ingredient: 'Diclofenaco sódico', concentration: '100mg', laboratory: 'InflamaCero' },
  { name: 'Meloxicam 15mg', generic_name: 'Meloxicam', barcode: '7501234567028', category: 'Antiinflamatorios', presentation: 'Caja 10 tabletas', purchase_price: 85.00, price: 145.00, stock: 55, min_stock: 12, max_stock: 120, requires_prescription: true, active_ingredient: 'Meloxicam', concentration: '15mg', laboratory: 'ArticuFlex' },

  // Antihistamínicos
  { name: 'Loratadina 10mg', generic_name: 'Loratadina', barcode: '7501234567029', category: 'Antihistamínicos', presentation: 'Caja 10 tabletas', purchase_price: 25.00, price: 48.00, stock: 140, min_stock: 35, max_stock: 350, requires_prescription: false, active_ingredient: 'Loratadina', concentration: '10mg', laboratory: 'AlergiFin' },
  { name: 'Cetirizina 10mg', generic_name: 'Cetirizina', barcode: '7501234567030', category: 'Antihistamínicos', presentation: 'Caja 10 tabletas', purchase_price: 28.00, price: 52.00, stock: 120, min_stock: 30, max_stock: 300, requires_prescription: false, active_ingredient: 'Cetirizina diclorhidrato', concentration: '10mg', laboratory: 'AlergiFin' }
];

// Datos de clientes
const customersData = [
  { name: 'María López García', email: 'maria.lopez@email.com', phone: '555-1001', address: 'Calle Flores 123, Col. Centro', rfc: 'LOGM850315ABC', birth_date: '1985-03-15', notes: 'Cliente frecuente, tiene descuento del 5%' },
  { name: 'Juan Hernández Pérez', email: 'juan.hernandez@email.com', phone: '555-1002', address: 'Av. Principal 456, Col. Norte', rfc: 'HEPJ900720DEF', birth_date: '1990-07-20', notes: 'Paciente diabético, compra metformina mensualmente' },
  { name: 'Ana Martínez Ruiz', email: 'ana.martinez@email.com', phone: '555-1003', address: 'Blvd. Las Palmas 789, Fracc. Los Pinos', rfc: 'MARA880410GHI', birth_date: '1988-04-10', notes: 'Tiene niños pequeños, compra vitaminas regularmente' },
  { name: 'Roberto Sánchez López', email: 'roberto.sanchez@email.com', phone: '555-1004', address: 'Calle Roble 234, Col. Jardines', rfc: 'SALR750825JKL', birth_date: '1975-08-25', notes: 'Paciente hipertenso, medicamento mensual: Losartán' },
  { name: 'Carmen Rodríguez Díaz', email: 'carmen.rodriguez@email.com', phone: '555-1005', address: 'Av. Universidad 567, Col. Estudiantes', rfc: 'RODC920115MNO', birth_date: '1992-01-15', notes: 'Trabaja en oficina cercana' },
  { name: 'Pedro García Morales', email: 'pedro.garcia@email.com', phone: '555-1006', address: 'Calle Nogal 890, Fracc. Arboledas', rfc: 'GAMP801230PQR', birth_date: '1980-12-30', notes: 'Compra para toda la familia' },
  { name: 'Laura Torres Vega', email: 'laura.torres@email.com', phone: '555-1007', address: 'Blvd. Central 123, Col. Moderna', rfc: 'TOVL950505STU', birth_date: '1995-05-05', notes: 'Prefiere productos naturales y vitaminas' },
  { name: 'Miguel Ángel Flores', email: 'miguel.flores@email.com', phone: '555-1008', address: 'Av. Libertad 456, Col. Independencia', rfc: 'FLOM700918VWX', birth_date: '1970-09-18', notes: 'Paciente con artritis, compra antiinflamatorios' },
  { name: 'Sofia Mendoza Luna', email: 'sofia.mendoza@email.com', phone: '555-1009', address: 'Calle Luna 789, Fracc. Cielo', rfc: 'MELS880627YZA', birth_date: '1988-06-27', notes: 'Embarazada, compra suplementos prenatales' },
  { name: 'Fernando Jiménez Castro', email: 'fernando.jimenez@email.com', phone: '555-1010', address: 'Av. Sol 012, Col. Aurora', rfc: 'JICF850312BCD', birth_date: '1985-03-12', notes: 'Deportista, compra suplementos y vendas' },
  { name: 'Guadalupe Vargas Reyes', email: 'guadalupe.vargas@email.com', phone: '555-1011', address: 'Calle Estrella 345, Col. Cosmos', rfc: 'VARG650808EFG', birth_date: '1965-08-08', notes: 'Paciente de la tercera edad, múltiples medicamentos' },
  { name: 'Ricardo Moreno Paz', email: 'ricardo.moreno@email.com', phone: '555-1012', address: 'Blvd. Paz 678, Fracc. Tranquilidad', rfc: 'MOPR780214HIJ', birth_date: '1978-02-14', notes: 'Compra frecuente material de curación' }
];

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando población de base de datos...\n');

    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✓ Conectado a la base de datos\n');

    // Verificar si ya hay datos
    const productCount = await Product.count();
    if (productCount > 10) {
      console.log('⚠️  La base de datos ya tiene datos. ¿Desea continuar? (Los datos existentes se mantendrán)');
      console.log('   Continuando con la inserción...\n');
    }

    // Obtener usuario administrador para las operaciones
    let adminUser = await User.findOne({ where: { role: 'admin' } });
    if (!adminUser) {
      console.log('⚠️  No se encontró usuario administrador. Creando uno...');
      adminUser = await User.create({
        name: 'Administrador',
        email: 'admin@farmacia.com',
        password: 'Admin123!',
        role: 'admin',
        phone: '1234567890'
      });
    }

    // 1. Crear Proveedores
    console.log('📦 Creando proveedores...');
    const suppliers = [];
    for (const supplierData of suppliersData) {
      const [supplier] = await Supplier.findOrCreate({
        where: { email: supplierData.email },
        defaults: supplierData
      });
      suppliers.push(supplier);
    }
    console.log(`   ✓ ${suppliers.length} proveedores creados/verificados\n`);

    // 2. Crear Productos
    console.log('💊 Creando productos/medicamentos...');
    const products = [];
    for (let i = 0; i < productsData.length; i++) {
      const productData = {
        ...productsData[i],
        supplier_id: suppliers[i % suppliers.length].id
      };
      const [product] = await Product.findOrCreate({
        where: { barcode: productData.barcode },
        defaults: productData
      });
      products.push(product);
    }
    console.log(`   ✓ ${products.length} productos creados/verificados\n`);

    // 3. Crear Clientes
    console.log('👥 Creando clientes...');
    const customers = [];
    for (const customerData of customersData) {
      const [customer] = await Customer.findOrCreate({
        where: { email: customerData.email },
        defaults: customerData
      });
      customers.push(customer);
    }
    console.log(`   ✓ ${customers.length} clientes creados/verificados\n`);

    // 4. Crear Ventas de ejemplo
    console.log('🛒 Creando ventas de ejemplo...');
    const paymentMethods = ['efectivo', 'tarjeta', 'transferencia'];
    let salesCreated = 0;

    // Crear 15 ventas de ejemplo
    for (let i = 0; i < 15; i++) {
      const saleDate = new Date();
      saleDate.setDate(saleDate.getDate() - Math.floor(Math.random() * 30)); // Últimos 30 días

      const numItems = Math.floor(Math.random() * 4) + 1; // 1-4 items por venta
      const selectedProducts = [];
      let subtotal = 0;

      // Seleccionar productos aleatorios
      for (let j = 0; j < numItems; j++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = parseFloat(randomProduct.price);

        selectedProducts.push({
          product_id: randomProduct.id,
          quantity,
          unit_price: price,
          subtotal: price * quantity
        });
        subtotal += price * quantity;
      }

      const discount = Math.random() < 0.3 ? subtotal * 0.05 : 0; // 30% chance de descuento
      const tax = (subtotal - discount) * 0.16;
      const total = subtotal - discount + tax;

      const sale = await Sale.create({
        sale_number: `V-${Date.now()}-${i}`,
        cashier_id: adminUser.id,
        customer_id: customers[Math.floor(Math.random() * customers.length)].id,
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        payment_status: 'pagado',
        notes: i % 5 === 0 ? 'Venta con factura' : null,
        createdAt: saleDate,
        updatedAt: saleDate
      });

      // Crear items de la venta
      for (const item of selectedProducts) {
        await SaleItem.create({
          sale_id: sale.id,
          ...item
        });
      }

      salesCreated++;
    }
    console.log(`   ✓ ${salesCreated} ventas creadas\n`);

    // 5. Crear Movimientos de Stock
    console.log('📊 Creando movimientos de stock...');
    let movementsCreated = 0;
    const movementTypes = ['entrada', 'salida', 'ajuste'];
    const movementReasons = ['Compra a proveedor', 'Venta', 'Ajuste de inventario', 'Devolución', 'Merma'];

    for (let i = 0; i < 20; i++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const type = movementTypes[Math.floor(Math.random() * movementTypes.length)];
      const quantity = Math.floor(Math.random() * 50) + 1;

      await StockMovement.create({
        product_id: randomProduct.id,
        type,
        quantity,
        reason: movementReasons[Math.floor(Math.random() * movementReasons.length)],
        notes: `Movimiento de ejemplo #${i + 1}`,
        user_id: adminUser.id
      });
      movementsCreated++;
    }
    console.log(`   ✓ ${movementsCreated} movimientos de stock creados\n`);

    // 6. Crear Consultas de ejemplo
    console.log('🏥 Creando consultas médicas de ejemplo...');
    const consultationTypes = ['general', 'presion', 'glucosa', 'inyeccion', 'curacion'];
    const consultationPrices = { general: 50, presion: 30, glucosa: 40, inyeccion: 35, curacion: 60 };
    let consultationsCreated = 0;

    const symptoms = [
      'Dolor de cabeza, fiebre leve',
      'Tos persistente, congestión nasal',
      'Dolor abdominal, náuseas',
      'Dolor muscular, fatiga',
      'Mareos ocasionales',
      'Dolor de garganta',
      'Malestar general'
    ];

    const diagnoses = [
      'Infección viral leve',
      'Resfriado común',
      'Gastritis',
      'Contractura muscular',
      'Tensión arterial elevada',
      'Faringitis',
      'Cuadro gripal'
    ];

    for (let i = 0; i < 12; i++) {
      const consultationType = consultationTypes[Math.floor(Math.random() * consultationTypes.length)];
      const consultDate = new Date();
      consultDate.setDate(consultDate.getDate() - Math.floor(Math.random() * 14)); // Últimos 14 días

      const customer = customers[Math.floor(Math.random() * customers.length)];
      const vitalSigns = JSON.stringify({
        presion: `${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`,
        temperatura: (36 + Math.random() * 2).toFixed(1),
        peso: (55 + Math.floor(Math.random() * 40)),
        glucosa: consultationType === 'glucosa' ? (80 + Math.floor(Math.random() * 60)) : null
      });

      await Consultation.create({
        consultation_number: `C-${Date.now()}-${i}`,
        patient_name: customer.name,
        patient_age: new Date().getFullYear() - new Date(customer.birth_date).getFullYear(),
        patient_phone: customer.phone,
        customer_id: customer.id,
        consultation_type: consultationType,
        symptoms: consultationType === 'general' ? symptoms[Math.floor(Math.random() * symptoms.length)] : null,
        diagnosis: consultationType === 'general' ? diagnoses[Math.floor(Math.random() * diagnoses.length)] : null,
        treatment: consultationType === 'general' ? 'Reposo, hidratación, medicamento recetado' : null,
        prescription: consultationType === 'general' ? 'Paracetamol 500mg c/8hrs por 3 días' : null,
        vital_signs: vitalSigns,
        price: consultationPrices[consultationType],
        payment_status: 'pagado',
        attended_by: adminUser.id,
        status: 'completada',
        createdAt: consultDate,
        updatedAt: consultDate
      });
      consultationsCreated++;
    }
    console.log(`   ✓ ${consultationsCreated} consultas creadas\n`);

    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ BASE DE DATOS POBLADA EXITOSAMENTE');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`   📦 Proveedores: ${suppliers.length}`);
    console.log(`   💊 Productos: ${products.length}`);
    console.log(`   👥 Clientes: ${customers.length}`);
    console.log(`   🛒 Ventas: ${salesCreated}`);
    console.log(`   📊 Movimientos: ${movementsCreated}`);
    console.log(`   🏥 Consultas: ${consultationsCreated}`);
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar
seedDatabase();
