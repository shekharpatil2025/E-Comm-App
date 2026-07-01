import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink: #0d0d0d;
    --cream: #f5f0e8;
    --rust: #c94b2b;
    --gold: #d4a853;
    --sage: #4a6741;
    --card-bg: #ffffff;
    --muted: #888;
    --border: #e0dbd0;
  }

  /* ── OVERLAY ── */
  .co-overlay {
    position: fixed;
    inset: 0;
    background: rgba(13,13,13,0.65);
    backdrop-filter: blur(4px);
    z-index: 1050;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: overlayIn 0.2s ease;
  }
  @keyframes overlayIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* ── MODAL ── */
  .co-modal {
    background: var(--card-bg);
    border-radius: 4px;
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    font-family: 'DM Sans', sans-serif;
    animation: modalIn 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: 0 32px 80px rgba(0,0,0,0.35);
  }
  @keyframes modalIn {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  /* ── MODAL HEADER ── */
  .co-head {
    background: var(--ink);
    padding: 24px 28px 20px;
    position: relative;
    flex-shrink: 0;
    overflow: hidden;
  }
  .co-head::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg, transparent, transparent 30px,
      rgba(255,255,255,0.015) 30px, rgba(255,255,255,0.015) 60px
    );
  }
  .co-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 6px;
    position: relative;
  }
  .co-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 900;
    color: var(--cream);
    line-height: 1;
    margin: 0;
    position: relative;
  }
  .co-title em { font-style: italic; color: var(--gold); }
  .co-close {
    position: absolute;
    top: 18px;
    right: 20px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.15);
    background: transparent;
    color: rgba(245,240,232,0.5);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s;
    z-index: 1;
  }
  .co-close:hover { background: rgba(255,255,255,0.1); color: var(--cream); }

  /* ── MODAL BODY ── */
  .co-body {
    overflow-y: auto;
    padding: 24px 28px;
    flex: 1;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  /* ── SECTION LABEL ── */
  .co-section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .co-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ── ORDER ITEMS ── */
  .co-item {
    display: grid;
    grid-template-columns: 56px 1fr auto;
    gap: 12px;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .co-item:last-of-type { border-bottom: none; }
  .co-item-img {
    width: 56px;
    height: 56px;
    border-radius: 3px;
    object-fit: cover;
    background: #f8f6f2;
    flex-shrink: 0;
  }
  .co-item-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    line-height: 1.3;
  }
  .co-item-qty {
    font-size: 11px;
    color: var(--muted);
    margin-top: 2px;
  }
  .co-item-price {
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
    white-space: nowrap;
  }

  /* ── TOTAL BAR ── */
  .co-total-bar {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 16px 0 24px;
    padding: 14px 0 0;
    border-top: 1.5px solid var(--ink);
  }
  .co-total-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .co-total-value {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
  }

  /* ── FORM FIELDS ── */
  .co-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 14px;
  }
  .co-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink);
  }
  .co-input {
    background: var(--card-bg);
    border: 1.5px solid var(--border);
    border-radius: 3px;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
  }
  .co-input:focus {
    border-color: var(--ink);
    box-shadow: 0 0 0 3px rgba(13,13,13,0.06);
  }
  .co-input.has-error { border-color: var(--rust); }
  .co-input::placeholder { color: rgba(13,13,13,0.3); }
  .co-error {
    font-size: 11px;
    color: var(--rust);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .co-error::before {
    content: '!';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--rust);
    color: white;
    font-size: 9px;
    font-weight: 800;
    flex-shrink: 0;
  }

  /* ── FOOTER ── */
  .co-footer {
    padding: 16px 28px 24px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 10px;
    flex-shrink: 0;
    background: var(--card-bg);
  }
  .co-btn-cancel {
    flex: 1;
    background: transparent;
    border: 1.5px solid var(--border);
    color: var(--muted);
    padding: 12px 20px;
    border-radius: 3px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .co-btn-cancel:hover:not(:disabled) { border-color: var(--ink); color: var(--ink); }
  .co-btn-cancel:disabled { opacity: 0.4; cursor: not-allowed; }

  .co-btn-confirm {
    flex: 2;
    background: var(--ink);
    color: var(--cream);
    border: none;
    border-radius: 3px;
    padding: 13px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s, transform 0.15s;
  }
  .co-btn-confirm:hover:not(:disabled) {
    background: var(--rust);
    transform: translateY(-1px);
  }
  .co-btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .co-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(245,240,232,0.25);
    border-top-color: var(--cream);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── TOAST PILL ── */
  .co-toast {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 1100;
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--ink);
    color: var(--cream);
    border-radius: 100px;
    padding: 12px 20px 12px 14px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
    transform: translateY(80px);
    opacity: 0;
    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.3s;
    pointer-events: none;
  }
  .co-toast.show {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }
  .co-toast-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .co-toast-icon.success { background: var(--sage); }
  .co-toast-icon.error   { background: var(--rust); }
  .co-toast-text { font-size: 13px; font-weight: 600; }

  /* ── SUCCESS SCREEN ── */
  .co-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 28px;
    text-align: center;
    gap: 12px;
  }
  .co-success-ring {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(74,103,65,0.1);
    border: 1.5px solid rgba(74,103,65,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;
    animation: popIn 0.4s cubic-bezier(0.23,1,0.32,1);
  }
  @keyframes popIn {
    from { transform: scale(0.6); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  .co-success-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
    margin: 0;
  }
  .co-success-sub {
    font-size: 13px;
    color: var(--muted);
    margin: 0;
  }
  .co-success-bar {
    width: 100%;
    height: 3px;
    background: var(--border);
    border-radius: 100px;
    overflow: hidden;
    margin-top: 12px;
  }
  .co-success-bar-fill {
    height: 100%;
    background: var(--sage);
    border-radius: 100px;
    animation: fillBar 2s linear forwards;
  }
  @keyframes fillBar {
    from { width: 0%; }
    to   { width: 100%; }
  }

  @media (max-width: 500px) {
    .co-modal { max-height: 100vh; border-radius: 0; }
    .co-overlay { padding: 0; align-items: flex-end; }
    .co-footer { flex-direction: column; }
    .co-btn-cancel, .co-btn-confirm { flex: none; }
  }
`;

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice }) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  // reset on open/close
  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setName(''); setEmail(''); setErrors({});
        setOrderSuccess(false); setIsSubmitting(false);
      }, 300);
    }
  }, [show]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Please enter your name.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Please enter a valid email address.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const orderItems = cartItems.map(item => ({ productId: item.id, quantity: item.quantity }));
    const data = { customerName: name, email, items: orderItems };

    try {
      const response = await axios.post(`${baseUrl}/api/orders/place`, data);
      console.log(response, 'order placed');
      setOrderSuccess(true);
      localStorage.removeItem('cart');
      setTimeout(() => navigate('/'), 2200);
    } catch (error) {
      console.log(error);
      setToastType('error');
      setToastMessage('Failed to place order. Please try again.');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <style>{styles}</style>

      <div className="co-overlay" onClick={(e) => e.target === e.currentTarget && !isSubmitting && handleClose()}>
        <div className="co-modal">

          {/* Header */}
          <div className="co-head">
            <div className="co-eyebrow">Almost there</div>
            <h2 className="co-title">Confirm <em>order</em></h2>
            <button className="co-close" onClick={handleClose} disabled={isSubmitting}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="co-body">
            {orderSuccess ? (
              <div className="co-success">
                <div className="co-success-ring">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4a6741" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="co-success-title">Order Placed!</h3>
                <p className="co-success-sub">Thanks, {name}. Redirecting you home…</p>
                <div className="co-success-bar"><div className="co-success-bar-fill" /></div>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="co-section-label">Your Items</div>
                {cartItems.map((item) => (
                  <div className="co-item" key={item.id}>
                    <img
                      className="co-item-img"
                      src={`${baseUrl}/api/product/${item.id}/image`}
                      alt={item.name}
                      onError={(e) => { e.target.style.opacity = 0.3; }}
                    />
                    <div>
                      <div className="co-item-name">{item.name}</div>
                      <div className="co-item-qty">×{item.quantity}</div>
                    </div>
                    <div className="co-item-price">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="co-total-bar">
                  <span className="co-total-label">Order Total</span>
                  <span className="co-total-value">
                    ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Form */}
                <div className="co-section-label">Your Details</div>

                <div className="co-field">
                  <label className="co-label">Full Name</label>
                  <input
                    className={`co-input ${errors.name ? 'has-error' : ''}`}
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: null }); }}
                  />
                  {errors.name && <span className="co-error">{errors.name}</span>}
                </div>

                <div className="co-field">
                  <label className="co-label">Email Address</label>
                  <input
                    className={`co-input ${errors.email ? 'has-error' : ''}`}
                    type="email"
                    placeholder="e.g. rahul@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: null }); }}
                  />
                  {errors.email && <span className="co-error">{errors.email}</span>}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!orderSuccess && (
            <div className="co-footer">
              <button className="co-btn-cancel" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button className="co-btn-confirm" onClick={handleConfirm} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="co-spinner" />
                    Processing…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                    </svg>
                    Confirm Purchase
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <div className={`co-toast ${showToast ? 'show' : ''}`}>
        <div className={`co-toast-icon ${toastType}`}>
          {toastType === 'success' ? (
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
              <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          )}
        </div>
        <span className="co-toast-text">{toastMessage}</span>
      </div>
    </>
  );
};

export default CheckoutPopup;