import axios from 'axios';
import React, { useEffect, useState } from 'react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink: #0d0d0d;
    --cream: #f5f0e8;
    --rust: #c94b2b;
    --gold: #d4a853;
    --sage: #4a6741;
    --sky: #2a6496;
    --card-bg: #ffffff;
    --muted: #888;
    --border: #e0dbd0;
  }

  .orders-wrapper {
    background: var(--cream);
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    padding-top: 62px;
  }

  /* ── HEADER ── */
  .orders-header {
    background: var(--ink);
    padding: 52px 48px 40px;
    position: relative;
    overflow: hidden;
  }
  .orders-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg, transparent, transparent 40px,
      rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 80px
    );
  }
  .orders-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
  }
  .orders-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(30px, 5vw, 56px);
    font-weight: 900;
    color: var(--cream);
    line-height: 0.95;
    margin: 0;
  }
  .orders-title em { font-style: italic; color: var(--gold); }
  .orders-ghost {
    position: absolute;
    right: 40px;
    bottom: -8px;
    font-family: 'Playfair Display', serif;
    font-size: 100px;
    font-weight: 900;
    color: rgba(255,255,255,0.03);
    user-select: none;
    line-height: 1;
  }

  /* ── STATS ROW ── */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border-bottom: 1px solid var(--border);
    background: var(--card-bg);
  }
  .stat-cell {
    padding: 20px 28px;
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .stat-cell:last-child { border-right: none; }
  .stat-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1;
  }
  .stat-value.gold { color: var(--gold); }

  /* ── BODY ── */
  .orders-body {
    padding: 40px 48px;
  }

  .section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ── ORDER CARDS ── */
  .order-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    margin-bottom: 12px;
    overflow: hidden;
    transition: box-shadow 0.25s;
    animation: fadeUp 0.4s ease both;
  }
  .order-card:hover { box-shadow: 0 8px 32px rgba(13,13,13,0.08); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* stagger */
  .order-card:nth-child(1) { animation-delay: 0.05s; }
  .order-card:nth-child(2) { animation-delay: 0.10s; }
  .order-card:nth-child(3) { animation-delay: 0.15s; }
  .order-card:nth-child(4) { animation-delay: 0.20s; }
  .order-card:nth-child(5) { animation-delay: 0.25s; }

  .order-row {
    display: grid;
    grid-template-columns: 90px 1fr 120px 100px 80px 120px 130px;
    align-items: center;
    gap: 16px;
    padding: 18px 24px;
    cursor: pointer;
    transition: background 0.15s;
  }
  .order-row:hover { background: #faf8f4; }

  .col-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .order-id {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--ink);
  }
  .order-id-sub {
    font-size: 10px;
    color: var(--muted);
    margin-top: 1px;
  }

  .customer-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--ink);
  }
  .customer-email {
    font-size: 11px;
    color: var(--muted);
    margin-top: 2px;
  }

  .order-date {
    font-size: 13px;
    color: var(--ink);
  }

  /* Status badge */
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 100px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .status-PLACED    { background: rgba(42,100,150,0.1);  color: var(--sky);  }
  .status-PLACED .status-dot  { background: var(--sky); }
  .status-SHIPPED   { background: rgba(212,168,83,0.12); color: #a07820; }
  .status-SHIPPED .status-dot { background: var(--gold); }
  .status-DELIVERED { background: rgba(74,103,65,0.12);  color: var(--sage); }
  .status-DELIVERED .status-dot { background: var(--sage); }
  .status-CANCELLED { background: rgba(201,75,43,0.1);   color: var(--rust); }
  .status-CANCELLED .status-dot { background: var(--rust); }
  .status-default   { background: rgba(0,0,0,0.06);      color: var(--muted); }
  .status-default .status-dot { background: var(--muted); }

  .items-count {
    font-size: 13px;
    color: var(--ink);
    font-weight: 500;
  }

  .order-total {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
  }

  .expand-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 7px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .expand-btn:hover, .expand-btn.open {
    border-color: var(--ink);
    color: var(--ink);
    background: #faf8f4;
  }
  .expand-chevron {
    transition: transform 0.25s cubic-bezier(0.23,1,0.32,1);
    flex-shrink: 0;
  }
  .expand-btn.open .expand-chevron { transform: rotate(180deg); }

  /* ── EXPANDED ITEMS ── */
  .order-details {
    border-top: 1px solid var(--border);
    background: #faf8f4;
    padding: 20px 24px 24px;
    animation: expandIn 0.25s cubic-bezier(0.23,1,0.32,1);
  }
  @keyframes expandIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .details-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 14px;
  }

  .items-table {
    width: 100%;
    border-collapse: collapse;
  }
  .items-table th {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 0 0 10px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }
  .items-table th:last-child { text-align: right; }
  .items-table td {
    padding: 12px 0;
    font-size: 13px;
    color: var(--ink);
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }
  .items-table tr:last-of-type td { border-bottom: none; }
  .item-qty {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.06);
    border-radius: 3px;
    width: 28px;
    height: 22px;
    font-size: 12px;
    font-weight: 600;
  }
  .item-price {
    text-align: right;
    font-weight: 600;
    font-size: 14px;
  }
  .total-row td {
    padding-top: 14px !important;
    border-bottom: none !important;
    border-top: 1.5px solid var(--ink);
  }
  .total-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .total-amount {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--ink);
    text-align: right;
  }

  /* ── TABLE HEADER ROW ── */
  .table-header-row {
    display: grid;
    grid-template-columns: 90px 1fr 120px 100px 80px 120px 130px;
    gap: 16px;
    padding: 10px 24px;
    background: var(--cream);
    border-bottom: 1px solid var(--border);
  }

  /* ── EMPTY ── */
  .empty-state {
    text-align: center;
    padding: 80px 20px;
  }
  .empty-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }
  .empty-state h3 {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    color: var(--ink);
    margin-bottom: 8px;
  }
  .empty-state p { font-size: 14px; color: var(--muted); }

  /* ── LOADING ── */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 100px 20px;
  }
  .loading-ring {
    width: 36px;
    height: 36px;
    border: 2.5px solid var(--border);
    border-top-color: var(--ink);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* ── ERROR ── */
  .error-state {
    margin: 0;
    padding: 20px 28px;
    background: rgba(201,75,43,0.07);
    border: 1px solid rgba(201,75,43,0.25);
    border-radius: 4px;
    color: var(--rust);
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  @media (max-width: 900px) {
    .orders-header { padding: 40px 20px 32px; }
    .orders-body { padding: 28px 16px; }
    .stats-row { grid-template-columns: 1fr 1fr; }
    .stat-cell:nth-child(2) { border-right: none; }
    .table-header-row { display: none; }
    .order-row {
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .orders-ghost { display: none; }
  }
`;

const Order = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/orders`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };
    fetchOrders();
  }, [baseUrl]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusClass = (status) => {
    const map = { PLACED: 'PLACED', SHIPPED: 'SHIPPED', DELIVERED: 'DELIVERED', CANCELLED: 'CANCELLED' };
    return map[status] || 'default';
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount);

  const calculateOrderTotal = (items) =>
    items.reduce((total, item) => total + item.totalPrice, 0);

  // Summary stats
  const totalRevenue = orders.reduce((sum, o) => sum + calculateOrderTotal(o.items), 0);
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <style>{styles}</style>
      <div className="orders-wrapper">

        {/* ── Header ── */}
        <div className="orders-header">
          <div className="orders-eyebrow">Dashboard · Orders</div>
          <h1 className="orders-title">Order <em>history</em></h1>
          <div className="orders-ghost">#</div>
        </div>

        {/* ── Stats row ── */}
        {!loading && !error && (
          <div className="stats-row">
            <div className="stat-cell">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{orders.length}</span>
            </div>
            <div className="stat-cell">
              <span className="stat-label">Revenue</span>
              <span className="stat-value gold">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="stat-cell">
              <span className="stat-label">Delivered</span>
              <span className="stat-value">{statusCounts['DELIVERED'] || 0}</span>
            </div>
            <div className="stat-cell">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{(statusCounts['PLACED'] || 0) + (statusCounts['SHIPPED'] || 0)}</span>
            </div>
          </div>
        )}

        <div className="orders-body">
          {loading ? (
            <div className="loading-state">
              <div className="loading-ring" />
              <span className="loading-text">Fetching orders…</span>
            </div>
          ) : error ? (
            <div className="error-state">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          ) : (
            <>
              <div className="section-label">
                All Orders · {orders.length} {orders.length === 1 ? 'entry' : 'entries'}
              </div>

              {/* Column headers */}
              {orders.length > 0 && (
                <div className="table-header-row">
                  <span className="col-label">Order ID</span>
                  <span className="col-label">Customer</span>
                  <span className="col-label">Date</span>
                  <span className="col-label">Status</span>
                  <span className="col-label">Items</span>
                  <span className="col-label">Total</span>
                  <span className="col-label"></span>
                </div>
              )}

              {orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <h3>No orders yet</h3>
                  <p>Orders will appear here once customers start purchasing.</p>
                </div>
              ) : (
                orders.map((order, idx) => {
                  const isOpen = expandedOrder === order.orderId;
                  const statusKey = getStatusClass(order.status);
                  const total = calculateOrderTotal(order.items);

                  return (
                    <div
                      className="order-card"
                      key={order.orderId}
                      style={{ animationDelay: `${Math.min(idx * 0.05, 0.3)}s` }}
                    >
                      <div className="order-row" onClick={() => toggleOrderDetails(order.orderId)}>
                        {/* ID */}
                        <div>
                          <div className="order-id">#{order.orderId}</div>
                          <div className="order-id-sub">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                        </div>

                        {/* Customer */}
                        <div>
                          <div className="customer-name">{order.customerName}</div>
                          <div className="customer-email">{order.email}</div>
                        </div>

                        {/* Date */}
                        <div className="order-date">
                          {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>

                        {/* Status */}
                        <div>
                          <span className={`status-badge status-${statusKey}`}>
                            <span className="status-dot" />
                            {order.status}
                          </span>
                        </div>

                        {/* Items count */}
                        <div className="items-count">{order.items.length}</div>

                        {/* Total */}
                        <div className="order-total">{formatCurrency(total)}</div>

                        {/* Toggle */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <button
                            className={`expand-btn ${isOpen ? 'open' : ''}`}
                            onClick={() => toggleOrderDetails(order.orderId)}
                          >
                            {isOpen ? 'Hide' : 'Details'}
                            <svg className="expand-chevron" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Expanded details */}
                      {isOpen && (
                        <div className="order-details">
                          <div className="details-label">Order Items</div>
                          <table className="items-table">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th style={{ width: 80 }}>Qty</th>
                                <th style={{ width: 120 }}>Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, index) => (
                                <tr key={index}>
                                  <td style={{ fontWeight: 500 }}>{item.productName}</td>
                                  <td><span className="item-qty">×{item.quantity}</span></td>
                                  <td className="item-price">{formatCurrency(item.totalPrice)}</td>
                                </tr>
                              ))}
                              <tr className="total-row">
                                <td colSpan="2" className="total-label">Order Total</td>
                                <td className="total-amount">{formatCurrency(total)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Order;