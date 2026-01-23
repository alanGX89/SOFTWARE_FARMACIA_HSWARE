import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { productService } from '../services/productService';
import { saleService } from '../services/saleService';
import {
  FiShoppingCart,
  FiSearch,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiDollarSign,
  FiCreditCard,
  FiUser,
  FiPhone,
  FiX,
  FiCheck,
  FiPercent,
  FiShoppingBag
} from 'react-icons/fi';
import { RiMedicineBottleLine, RiBarcodeLine } from 'react-icons/ri';
import './NewSale.css';

const NewSale = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [amountPaid, setAmountPaid] = useState('');
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode?.includes(searchTerm)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  const loadProducts = async () => {
    try {
      const { data } = await productService.getAll({ active: true });
      setProducts(data.products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product === product.id);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert('No hay suficiente stock disponible');
        return;
      }
      setCart(cart.map(item =>
        item.product === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (product.stock === 0) {
        alert('Producto sin stock');
        return;
      }
      setCart([...cart, {
        product: product.id,
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1,
        maxStock: product.stock
      }]);
    }

    setSearchTerm('');
    setFilteredProducts([]);
  };

  const updateQuantity = (productId, newQuantity) => {
    const item = cart.find(i => i.product === productId);
    if (newQuantity > item.maxStock) {
      alert('No hay suficiente stock disponible');
      return;
    }
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.product === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product !== productId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.16;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - discount;
  };

  const calculateChange = () => {
    const paid = parseFloat(amountPaid) || 0;
    const total = calculateTotal();
    return paid - total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Agrega al menos un producto');
      return;
    }

    if (paymentMethod === 'efectivo' && calculateChange() < 0) {
      alert('El monto pagado es insuficiente');
      return;
    }

    setLoading(true);

    try {
      const saleData = {
        items: cart.map(item => ({
          product: item.product,
          quantity: item.quantity
        })),
        paymentMethod,
        amountPaid: paymentMethod === 'efectivo' ? parseFloat(amountPaid) : calculateTotal(),
        discount,
        customer: customer.name ? customer : undefined
      };

      await saleService.create(saleData);
      alert('Venta registrada exitosamente');
      navigate('/sales');
    } catch (error) {
      console.error('Error al registrar venta:', error);
      alert(error.response?.data?.message || 'Error al registrar venta');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = () => {
    switch(paymentMethod) {
      case 'efectivo': return <FiDollarSign />;
      case 'tarjeta': return <FiCreditCard />;
      default: return <FiDollarSign />;
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div className="page-header-content">
          <h1>
            <FiShoppingCart className="page-title-icon" />
            Nueva Venta
          </h1>
          <p>Registrar nueva transacción</p>
        </div>
      </div>

      <div className="sale-container">
        <div className="sale-left">
          <div className="card">
            <h2>
              <FiSearch className="section-icon" />
              Buscar Producto
            </h2>
            <div className="search-product">
              <div className="search-input-wrapper">
                <RiBarcodeLine className="search-input-icon" />
                <input
                  type="text"
                  placeholder="Nombre o código de barras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              {filteredProducts.length > 0 && (
                <div className="product-suggestions">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="product-suggestion"
                      onClick={() => addToCart(product)}
                    >
                      <div className="suggestion-icon">
                        <RiMedicineBottleLine />
                      </div>
                      <div className="suggestion-info">
                        <div className="product-suggestion-name">{product.name}</div>
                        <div className="product-suggestion-meta">
                          <span className="suggestion-price">${parseFloat(product.price).toFixed(2)}</span>
                          <span className="suggestion-stock">Stock: {product.stock}</span>
                        </div>
                      </div>
                      <FiPlus className="suggestion-add" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h2>
              <FiShoppingBag className="section-icon" />
              Carrito de Compra
              {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </h2>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <FiShoppingCart className="empty-cart-icon" />
                <p>No hay productos en el carrito</p>
                <span>Busca y agrega productos para comenzar</span>
              </div>
            ) : (
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.product} className="cart-item">
                    <div className="cart-item-icon">
                      <RiMedicineBottleLine />
                    </div>
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">${item.price.toFixed(2)} c/u</div>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        className="btn-qty"
                        onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      >
                        <FiMinus />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product, parseInt(e.target.value))}
                        className="qty-input"
                      />
                      <button
                        className="btn-qty"
                        onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      >
                        <FiPlus />
                      </button>
                    </div>
                    <div className="cart-item-subtotal">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="btn-remove"
                      onClick={() => removeFromCart(item.product)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sale-right">
          <form onSubmit={handleSubmit} className="card summary-card">
            <h2>
              <FiDollarSign className="section-icon" />
              Resumen de Venta
            </h2>

            <div className="summary-lines">
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>IVA (16%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="summary-line discount-line">
                <span>
                  <FiPercent className="line-icon" />
                  Descuento:
                </span>
                <div className="discount-input-wrapper">
                  <span>$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="discount-input"
                  />
                </div>
              </div>
              <div className="summary-line total">
                <span>Total:</span>
                <span className="total-amount">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="payment-section">
              <div className="form-group">
                <label>
                  {getPaymentIcon()}
                  Método de Pago
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="credito">Crédito</option>
                </select>
              </div>

              {paymentMethod === 'efectivo' && (
                <>
                  <div className="form-group">
                    <label>
                      <FiDollarSign />
                      Monto Recibido
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <div className={`change-display ${calculateChange() < 0 ? 'negative' : 'positive'}`}>
                    <span>Cambio:</span>
                    <span className="change-amount">${calculateChange().toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="customer-section">
              <h3>
                <FiUser className="section-icon-small" />
                Datos del Cliente (Opcional)
              </h3>
              <div className="form-group">
                <label>
                  <FiUser />
                  Nombre
                </label>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Nombre del cliente"
                />
              </div>
              <div className="form-group">
                <label>
                  <FiPhone />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="Número de teléfono"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/sales')}
              >
                <FiX />
                <span>Cancelar</span>
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading || cart.length === 0}
              >
                {loading ? (
                  <>Procesando...</>
                ) : (
                  <>
                    <FiCheck />
                    <span>Completar Venta</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewSale;
