import React, { useContext, useState, useEffect } from "react";
import AppContext from "../../Context/Context";
import axios from "axios";
import CheckoutPopup from "../../components/CheckoutPopup/CheckoutPopup";

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
    --nav-height: 62px;
  }

  .cart-wrapper {
    background: var(--cream);
    min-height: 100vh;
    padding-top: var(--nav-height);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── HEADER ── */
  .cart-header {
    background: var(--ink);
    padding: 52px 48px 40px;
    position: relative;
    overflow: hidden;
  }
  .cart-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg, transparent, transparent 40px,
      rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 80px
    );
  }
  .cart-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
    position: relative;
  }
  .cart-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(30px, 5vw, 56px);
    font-weight: 900;
    color: var(--cream);
    line-height: 0.95;
    margin: 0;
    position: relative;
  }
  .cart-title em { font-style: italic; color: var(--gold); }
  .cart-ghost {
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

  /* ── LAYOUT ── */
  .cart-body {
    padding: 40px 48px;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 28px;
    align-items: start;
  }

  /* ── SECTION LABEL ── */
  .section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 16px;
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

  /* ── CART ITEM CARD ── */
  .cart-item {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    display: grid;
    grid-template-columns: 96px 1fr auto;
    gap: 0;
    overflow: hidden;
    margin-bottom: 10px;
    transition: box-shadow 0.25s;
    animation: fadeUp 0.4s ease both;
  }
  .cart-item:hover { box-shadow: 0 6px 24px rgba(13,13,13,0.08); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cart-item:nth-child(1) { animation-delay: 0.05s; }
  .cart-item:nth-child(2) { animation-delay: 0.10s; }
  .cart-item:nth-child(3) { animation-delay: 0.15s; }
  .cart-item:nth-child(4) { animation-delay: 0.20s; }
  .cart-item:nth-child(5) { animation-delay: 0.25s; }

  .item-img-wrap {
    width: 96px;
    height: 96px;
    flex-shrink: 0;
    overflow: hidden;
    background: #f8f6f2;
  }
  .item-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1);
  }
  .cart-item:hover .item-img-wrap img { transform: scale(1.06); }

  .item-info {
    padding: 14px 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
  }
  .item-brand {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .item-name {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.2;
  }
  .item-unit-price {
    font-size: 12px;
    color: var(--muted);
    margin-top: 2px;
  }

  .item-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    padding: 14px 18px;
    gap: 10px;
    min-width: 160px;
  }
  .item-total {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--ink);
  }

  /* Qty stepper */
  .qty-stepper {
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 3px;
    overflow: hidden;
  }
  .qty-btn {
    width: 30px;
    height: 30px;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ink);
    transition: background 0.15s;
    flex-shrink: 0;
  }
  .qty-btn:hover { background: #f0ece4; }
  .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .qty-value {
    width: 34px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
    height: 30px;
    line-height: 30px;
    user-select: none;
  }

  .remove-btn {
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: var(--muted);
    transition: color 0.2s;
    display: flex;
    align-items: center;
  }
  .remove-btn:hover { color: var(--rust); }

  /* ── ORDER SUMMARY ── */
  .summary-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    position: sticky;
    top: calc(var(--nav-height) + 40px);
  }
  .summary-head {
    background: var(--ink);
    padding: 16px 22px;
  }
  .summary-head-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 2px;
  }
  .summary-head-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--cream);
  }

  .summary-body { padding: 20px 22px; }

  .summary-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
    color: var(--ink);
  }
  .summary-line:last-of-type { border-bottom: none; }
  .summary-line-label { color: var(--muted); font-size: 12px; }
  .summary-line-value { font-weight: 600; }

  .summary-total-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 16px 0 0;
    border-top: 1.5px solid var(--ink);
    margin-top: 8px;
  }
  .summary-total-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .summary-total-value {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--ink);
  }

  .btn-checkout {
    width: 100%;
    margin-top: 20px;
    background: var(--ink);
    color: var(--cream);
    border: none;
    border-radius: 3px;
    padding: 14px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.2s, transform 0.15s;
  }
  .btn-checkout:hover {
    background: var(--rust);
    transform: translateY(-1px);
  }

  .btn-clear {
    width: 100%;
    margin-top: 10px;
    background: transparent;
    color: var(--muted);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }
  .btn-clear:hover { color: var(--rust); border-color: var(--rust); }

  /* ── EMPTY STATE ── */
  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 80px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .empty-icon-ring {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--border);
  }
  .empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--ink);
    margin: 0;
  }
  .empty-sub {
    font-size: 14px;
    color: var(--muted);
    margin: 0;
  }
  .btn-shop {
    margin-top: 8px;
    background: var(--ink);
    color: var(--cream);
    border: none;
    border-radius: 3px;
    padding: 13px 32px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s;
  }
  .btn-shop:hover { background: var(--rust); color: var(--cream); }

  @media (max-width: 860px) {
    .cart-header { padding: 40px 20px 32px; }
    .cart-body { padding: 24px 16px; grid-template-columns: 1fr; }
    .summary-card { position: static; }
    .cart-ghost { display: none; }
    .item-controls { min-width: 120px; }
  }
  @media (max-width: 500px) {
    .cart-item { grid-template-columns: 72px 1fr; }
    .item-controls { grid-column: 1 / -1; flex-direction: row; padding: 10px 14px; border-top: 1px solid var(--border); }
    .item-img-wrap { width: 72px; height: 72px; }
  }
`;

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartImage, setCartImage] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    setCartItems(cart.length ? cart : []);
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    setTotalPrice(total);
  }, [cartItems]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  };

  const handleIncreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        if (item.quantity < item.stockQuantity) {
          return { ...item, quantity: item.quantity + 1 };
        }
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const newCartItems = cartItems.map((item) =>
      item.id === itemId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item,
    );
    setCartItems(newCartItems);
  };

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const { imageUrl, imageName, imageData, imageType, quantity, ...rest } =
          item;
        const updatedStockQuantity = item.stockQuantity - item.quantity;
        const updatedProductData = {
          ...rest,
          stockQuantity: updatedStockQuantity,
        };

        const cartProduct = new FormData();
        cartProduct.append("imageFile", cartImage);
        cartProduct.append(
          "product",
          new Blob([JSON.stringify(updatedProductData)], {
            type: "application/json",
          }),
        );

        await axios
          .put(`${baseUrl}/api/product/${item.id}`, cartProduct, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) =>
            console.log("Product updated successfully:", cartProduct),
          )
          .catch((error) => console.error("Error updating product:", error));
      }
      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (error) {
      console.log("error during checkout", error);
    }
  };

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <style>{styles}</style>
      <div className="cart-wrapper">
        {/* ── Header ── */}
        <div className="cart-header">
          <div className="cart-eyebrow">Shopping · Bag</div>
          <h1 className="cart-title">
            Your <em>cart</em>
          </h1>
          <div className="cart-ghost">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-ring">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <h2 className="empty-title">Your cart is empty</h2>
              <p className="empty-sub">
                Looks like you haven't added anything yet.
              </p>
              <a href="/" className="btn-shop">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Browse Products
              </a>
            </div>
          ) : (
            <>
              {/* ── Items column ── */}
              <div>
                <div className="section-label">
                  Cart Items · {itemCount}{" "}
                  {itemCount === 1 ? "piece" : "pieces"}
                </div>

                {cartItems.map((item, idx) => (
                  <div
                    className="cart-item"
                    key={item.id}
                    style={{ animationDelay: `${Math.min(idx * 0.05, 0.3)}s` }}
                  >
                    {/* Image */}
                    <div className="item-img-wrap">
                      <img
                        src={`${baseUrl}/api/product/${item.id}/image`}
                        alt={item.name}
                        onError={(e) => {
                          e.target.style.opacity = 0.3;
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="item-info">
                      <div className="item-brand">{item.brand}</div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-unit-price">
                        ₹{item.price.toLocaleString("en-IN")} each
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="item-controls">
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveFromCart(item.id)}
                        title="Remove"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </button>

                      <div>
                        <div className="item-total">
                          ₹
                          {(item.price * item.quantity).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                        </div>
                      </div>

                      <div className="qty-stepper">
                        <button
                          className="qty-btn"
                          onClick={() => handleDecreaseQuantity(item.id)}
                          disabled={item.quantity <= 1}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                        <div className="qty-value">{item.quantity}</div>
                        <button
                          className="qty-btn"
                          onClick={() => handleIncreaseQuantity(item.id)}
                          disabled={item.quantity >= item.stockQuantity}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Summary column ── */}
              <div>
                <div className="section-label">Summary</div>
                <div className="summary-card">
                  <div className="summary-head">
                    <div className="summary-head-label">Order Summary</div>
                    <div className="summary-head-title">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </div>
                  </div>
                  <div className="summary-body">
                    {cartItems.map((item) => (
                      <div className="summary-line" key={item.id}>
                        <span className="summary-line-label">
                          {item.name.length > 20
                            ? item.name.slice(0, 20) + "…"
                            : item.name}
                          <span
                            style={{
                              marginLeft: 6,
                              color: "var(--muted)",
                              fontSize: 11,
                            }}
                          >
                            ×{item.quantity}
                          </span>
                        </span>
                        <span className="summary-line-value">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}

                    <div className="summary-total-row">
                      <span className="summary-total-label">Total</span>
                      <span className="summary-total-value">
                        ₹
                        {totalPrice.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <button
                      className="btn-checkout"
                      onClick={() => setShowModal(true)}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                      </svg>
                      Proceed to Checkout
                    </button>
                    <button className="btn-clear" onClick={clearCart}>
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </>
  );
};

export default Cart;
