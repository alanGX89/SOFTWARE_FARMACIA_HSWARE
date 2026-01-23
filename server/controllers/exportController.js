const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { Sale, SaleItem, Product, User, Customer } = require('../models');
const { Op } = require('sequelize');

// Generar ticket de venta en PDF
exports.generateSaleTicket = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [
        { model: SaleItem, as: 'items' },
        { model: User, as: 'cashier', attributes: ['name'] },
        { model: Customer, as: 'customer' }
      ]
    });

    if (!sale) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    const doc = new PDFDocument({ size: [226.77, 800], margin: 10 }); // 80mm width

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${sale.sale_number}.pdf`);

    doc.pipe(res);

    // Encabezado
    doc.fontSize(14).font('Helvetica-Bold').text('PHARMACARE', { align: 'center' });
    doc.fontSize(8).font('Helvetica').text('Sistema de Farmacia', { align: 'center' });
    doc.moveDown(0.5);

    // Línea separadora
    doc.moveTo(10, doc.y).lineTo(216, doc.y).stroke();
    doc.moveDown(0.5);

    // Información de venta
    doc.fontSize(8);
    doc.text(`Ticket: ${sale.sale_number}`);
    doc.text(`Fecha: ${new Date(sale.created_at).toLocaleString('es-MX')}`);
    doc.text(`Cajero: ${sale.cashier?.name || 'N/A'}`);
    if (sale.customer) {
      doc.text(`Cliente: ${sale.customer.name}`);
    } else if (sale.customer_name) {
      doc.text(`Cliente: ${sale.customer_name}`);
    }
    doc.moveDown(0.5);

    // Línea separadora
    doc.moveTo(10, doc.y).lineTo(216, doc.y).stroke();
    doc.moveDown(0.5);

    // Encabezado de productos
    doc.font('Helvetica-Bold');
    doc.text('Cant  Producto', 10, doc.y, { continued: true });
    doc.text('Precio', { align: 'right' });
    doc.font('Helvetica');
    doc.moveDown(0.3);

    // Productos
    for (const item of sale.items) {
      const productName = item.product_name.length > 20
        ? item.product_name.substring(0, 20) + '...'
        : item.product_name;

      doc.text(`${item.quantity}x   ${productName}`, 10, doc.y, { continued: true });
      doc.text(`$${parseFloat(item.subtotal).toFixed(2)}`, { align: 'right' });
    }

    doc.moveDown(0.5);
    doc.moveTo(10, doc.y).lineTo(216, doc.y).stroke();
    doc.moveDown(0.5);

    // Totales
    doc.text(`Subtotal:`, 10, doc.y, { continued: true });
    doc.text(`$${parseFloat(sale.subtotal).toFixed(2)}`, { align: 'right' });

    if (parseFloat(sale.discount) > 0) {
      doc.text(`Descuento:`, 10, doc.y, { continued: true });
      doc.text(`-$${parseFloat(sale.discount).toFixed(2)}`, { align: 'right' });
    }

    if (parseFloat(sale.tax) > 0) {
      doc.text(`IVA:`, 10, doc.y, { continued: true });
      doc.text(`$${parseFloat(sale.tax).toFixed(2)}`, { align: 'right' });
    }

    doc.moveDown(0.3);
    doc.font('Helvetica-Bold').fontSize(10);
    doc.text(`TOTAL:`, 10, doc.y, { continued: true });
    doc.text(`$${parseFloat(sale.total).toFixed(2)}`, { align: 'right' });
    doc.font('Helvetica').fontSize(8);

    doc.moveDown(0.5);
    doc.text(`Método de pago: ${sale.payment_method.toUpperCase()}`);

    if (sale.payment_method === 'efectivo') {
      doc.text(`Pago: $${parseFloat(sale.amount_paid).toFixed(2)}`);
      doc.text(`Cambio: $${parseFloat(sale.change_amount).toFixed(2)}`);
    }

    doc.moveDown();
    doc.moveTo(10, doc.y).lineTo(216, doc.y).stroke();
    doc.moveDown(0.5);

    // Pie de ticket
    doc.fontSize(7).text('¡Gracias por su compra!', { align: 'center' });
    doc.text('Conserve este ticket para cualquier aclaración', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar ticket' });
  }
};

// Exportar ventas a Excel
exports.exportSalesToExcel = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (status) {
      where.status = status;
    }

    const sales = await Sale.findAll({
      where,
      include: [
        { model: User, as: 'cashier', attributes: ['name'] },
        { model: SaleItem, as: 'items' }
      ],
      order: [['created_at', 'DESC']]
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'PharmaCare';
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet('Ventas');

    // Encabezados
    worksheet.columns = [
      { header: 'No. Venta', key: 'sale_number', width: 15 },
      { header: 'Fecha', key: 'date', width: 20 },
      { header: 'Cajero', key: 'cashier', width: 20 },
      { header: 'Cliente', key: 'customer', width: 20 },
      { header: 'Subtotal', key: 'subtotal', width: 12 },
      { header: 'Descuento', key: 'discount', width: 12 },
      { header: 'IVA', key: 'tax', width: 12 },
      { header: 'Total', key: 'total', width: 12 },
      { header: 'Método Pago', key: 'payment_method', width: 15 },
      { header: 'Estado', key: 'status', width: 12 },
      { header: 'Productos', key: 'items_count', width: 10 }
    ];

    // Estilo de encabezados
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1B8B3D' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Datos
    sales.forEach(sale => {
      worksheet.addRow({
        sale_number: sale.sale_number,
        date: new Date(sale.created_at).toLocaleString('es-MX'),
        cashier: sale.cashier?.name || 'N/A',
        customer: sale.customer_name || 'General',
        subtotal: parseFloat(sale.subtotal),
        discount: parseFloat(sale.discount),
        tax: parseFloat(sale.tax),
        total: parseFloat(sale.total),
        payment_method: sale.payment_method,
        status: sale.status,
        items_count: sale.items?.length || 0
      });
    });

    // Formato de moneda
    ['E', 'F', 'G', 'H'].forEach(col => {
      worksheet.getColumn(col).numFmt = '$#,##0.00';
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=ventas-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al exportar ventas' });
  }
};

// Exportar inventario a Excel
exports.exportInventoryToExcel = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { active: true },
      order: [['name', 'ASC']]
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inventario');

    worksheet.columns = [
      { header: 'Código', key: 'barcode', width: 15 },
      { header: 'Producto', key: 'name', width: 35 },
      { header: 'Categoría', key: 'category', width: 18 },
      { header: 'Stock', key: 'stock', width: 10 },
      { header: 'Stock Mín.', key: 'min_stock', width: 10 },
      { header: 'Costo', key: 'cost', width: 12 },
      { header: 'Precio', key: 'price', width: 12 },
      { header: 'Valor Stock', key: 'stock_value', width: 15 },
      { header: 'Vencimiento', key: 'expiration', width: 12 },
      { header: 'Estado', key: 'status', width: 12 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1B8B3D' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    products.forEach(product => {
      const row = worksheet.addRow({
        barcode: product.barcode || 'N/A',
        name: product.name,
        category: product.category,
        stock: product.stock,
        min_stock: product.min_stock,
        cost: parseFloat(product.cost),
        price: parseFloat(product.price),
        stock_value: parseFloat(product.cost) * product.stock,
        expiration: product.expiration_date || 'N/A',
        status: product.stock === 0 ? 'AGOTADO' : product.stock <= product.min_stock ? 'BAJO' : 'OK'
      });

      // Colorear según estado
      if (product.stock === 0) {
        row.getCell('status').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF0000' }
        };
      } else if (product.stock <= product.min_stock) {
        row.getCell('status').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFC107' }
        };
      }
    });

    ['F', 'G', 'H'].forEach(col => {
      worksheet.getColumn(col).numFmt = '$#,##0.00';
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=inventario-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al exportar inventario' });
  }
};

// Exportar reporte de ventas a PDF
exports.exportSalesReportPDF = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = { status: 'completada' };

    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const sales = await Sale.findAll({
      where,
      include: [{ model: User, as: 'cashier', attributes: ['name'] }],
      order: [['created_at', 'DESC']]
    });

    const totalVentas = sales.length;
    const totalMonto = sales.reduce((sum, s) => sum + parseFloat(s.total), 0);

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte-ventas-${Date.now()}.pdf`);

    doc.pipe(res);

    // Título
    doc.fontSize(20).font('Helvetica-Bold').text('REPORTE DE VENTAS', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text('PharmaCare - Sistema de Farmacia', { align: 'center' });
    doc.moveDown();

    // Período
    if (startDate && endDate) {
      doc.text(`Período: ${startDate} al ${endDate}`, { align: 'center' });
    }
    doc.moveDown();

    // Resumen
    doc.fontSize(14).font('Helvetica-Bold').text('Resumen');
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total de ventas: ${totalVentas}`);
    doc.text(`Monto total: $${totalMonto.toFixed(2)}`);
    doc.text(`Ticket promedio: $${totalVentas > 0 ? (totalMonto / totalVentas).toFixed(2) : '0.00'}`);
    doc.moveDown();

    // Tabla de ventas
    doc.fontSize(14).font('Helvetica-Bold').text('Detalle de Ventas');
    doc.moveDown(0.5);

    // Encabezados de tabla
    const tableTop = doc.y;
    doc.fontSize(9).font('Helvetica-Bold');
    doc.text('No. Venta', 50, tableTop);
    doc.text('Fecha', 130, tableTop);
    doc.text('Cajero', 230, tableTop);
    doc.text('Total', 350, tableTop);
    doc.text('Método', 420, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Datos
    let y = tableTop + 20;
    doc.font('Helvetica').fontSize(8);

    sales.slice(0, 30).forEach(sale => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.text(sale.sale_number, 50, y);
      doc.text(new Date(sale.created_at).toLocaleDateString('es-MX'), 130, y);
      doc.text(sale.cashier?.name || 'N/A', 230, y);
      doc.text(`$${parseFloat(sale.total).toFixed(2)}`, 350, y);
      doc.text(sale.payment_method, 420, y);
      y += 15;
    });

    if (sales.length > 30) {
      doc.text(`... y ${sales.length - 30} ventas más`, 50, y + 10);
    }

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al generar reporte PDF' });
  }
};
