import React, { useState } from 'react';
import { useApp } from '../context/AppProvider';
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Checkout() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart, user } = useApp();
  const navigate = useNavigate();
  
  const [agreed, setAgreed] = useState(false);
  const [permit, setPermit] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = getCartTotal();
  const fee = total > 0 ? 415.00 : 0;
  const tax = total * 0.08;
  const grandTotal = total + fee + tax;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!agreed) {
      alert("Please confirm you are 21+.");
      return;
    }
    if (!permit) {
      alert("Please declare your permit state.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      clearCart();
      navigate('/store');
    }, 3000);
  };

  if (success) {
    return (
      <div className="container animate-fade-in checkout-success-screen">
        <div className="checkout-success-icon">
          <ShieldCheck size={64} />
        </div>
        <h1 className="checkout-success-title">Order Confirmed!</h1>
        <p className="checkout-success-subtitle">Your order has been placed and will be delivered shortly.</p>
        <p className="checkout-success-note">Please have your physical ID ready upon delivery.</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      
      <div className="checkout-grid">
        {/* Left Column: Cart & Compliance */}
        <div className="checkout-left-col">
          <div className="glass-panel checkout-card">
            <h2 className="checkout-section-title">Your Cart</h2>
            
            {cart.length === 0 ? (
              <div className="empty-cart-state">
                <ShoppingBag size={48} className="empty-cart-icon" />
                <p className="empty-cart-text">Your cart is empty.</p>
                <Link to="/store" className="btn-primary empty-cart-btn">
                  Browse Collection
                </Link>
              </div>
            ) : (
              <div className="cart-items-list">
                {cart.map(item => (
                  <div key={item.product.id} className="cart-item-card">
                    <div className="cart-item-image-wrapper">
                      <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                    </div>

                    <div className="cart-item-details">
                      <h4 className="cart-item-name">{item.product.name}</h4>
                      <p className="cart-item-price">₹{item.product.price.toFixed(2)}</p>
                    </div>

                    <div className="cart-item-actions">
                      <div className="cart-qty-picker">
                        <button 
                          onClick={() => updateQuantity(item.product.id, -1)} 
                          className="cart-qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="cart-qty-val">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, 1)} 
                          className="cart-qty-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.product.id)} 
                        className="cart-remove-btn"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Compliance & Summary */}
        <div className="checkout-right-col">
          <div className="glass-panel checkout-card">
            <h2 className="checkout-section-title compliance-title">
              <ShieldCheck size={20} color="var(--accent)" /> Compliance
            </h2>
            
            <label className="checkbox-container">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <div className="checkbox-text">
                <span className="checkbox-heading">I am 21 years of age or older.</span>
                <span className="checkbox-subtext">I understand I must present a valid government-issued ID upon delivery.</span>
              </div>
            </label>
            
            <label className="checkbox-container">
              <input type="checkbox" checked={permit} onChange={(e) => setPermit(e.target.checked)} />
              <div className="checkbox-text">
                <span className="checkbox-heading">Permit Declaration</span>
                <span className="checkbox-subtext">I possess the necessary permits to purchase alcohol in this jurisdiction if required by local law.</span>
              </div>
            </label>
          </div>

          <div className="glass-panel checkout-card">
            <h2 className="checkout-section-title">Summary</h2>
            
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{fee.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Taxes & Fees</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="summary-total-row">
              <span>Total</span>
              <span className="summary-total-price">₹{grandTotal.toFixed(2)}</span>
            </div>
            
            <button 
              className="btn-primary checkout-submit-btn" 
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              Checkout <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

