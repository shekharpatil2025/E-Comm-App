import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

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

  .home-wrapper {
    background: var(--cream);
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    padding-top: 62px;
  }

  /* ── HERO STRIP*/
  .hero-strip {
    background: var(--ink);
    color: var(--cream);
    padding: 64px 40px 48px;
    position: relative;
    overflow: hidden;
  }
  .hero-strip::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 40px,
      rgba(255,255,255,0.015) 40px,
      rgba(255,255,255,0.015) 80px
    );
  }
  .hero-eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 6vw, 76px);
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -0.02em;
    margin: 0;
  }
  .hero-title em {
    font-style: italic;
    color: var(--gold);
  }
  .hero-sub {
    margin-top: 20px;
    font-size: 15px;
    color: rgba(245,240,232,0.55);
    max-width: 380px;
    line-height: 1.6;
  }
  .hero-count {
    position: absolute;
    bottom: 24px;
    right: 40px;
    font-family: 'Playfair Display', serif;
    font-size: 80px;
    font-weight: 900;
    color: rgba(255,255,255,0.04);
    line-height: 1;
    user-select: none;
  }

  /* ── FILTER CHIPS ── */
  .filter-row {
    padding: 20px 40px;
    background: var(--ink);
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .filter-row::-webkit-scrollbar { display: none; }
  .chip {
    flex-shrink: 0;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(245,240,232,0.6);
    padding: 6px 16px;
    border-radius: 100px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;
  }
  .chip.active, .chip:hover {
    background: var(--gold);
    border-color: var(--gold);
    color: var(--ink);
  }

  /* ── PRODUCT GRID ── */
  .products-section {
    padding: 48px 32px;
  }
  .section-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 32px;
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

  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
  }

  /* ── PRODUCT CARD ── */
  .product-card {
    background: var(--card-bg);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid var(--border);
    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
                box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
    cursor: pointer;
    animation: fadeUp 0.5s ease both;
  }
  .product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(13,13,13,0.12);
  }
  .product-card.unavailable {
    opacity: 0.6;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* staggered animation */
  .product-card:nth-child(1) { animation-delay: 0.05s; }
  .product-card:nth-child(2) { animation-delay: 0.10s; }
  .product-card:nth-child(3) { animation-delay: 0.15s; }
  .product-card:nth-child(4) { animation-delay: 0.20s; }
  .product-card:nth-child(5) { animation-delay: 0.25s; }
  .product-card:nth-child(6) { animation-delay: 0.30s; }
  .product-card:nth-child(7) { animation-delay: 0.35s; }
  .product-card:nth-child(8) { animation-delay: 0.40s; }

  .img-wrapper {
    position: relative;
    height: 200px;
    background: #f8f6f2;
    overflow: hidden;
  }
  .img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .product-card:hover .img-wrapper img {
    transform: scale(1.06);
  }

  .oos-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: var(--ink);
    color: var(--cream);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
  }
  .new-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--rust);
    color: white;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
  }

  .card-body {
    padding: 18px 20px 20px;
  }
  .card-brand {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
  }
  .card-name {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.25;
    margin-bottom: 14px;
    text-decoration: none;
    display: block;
  }
  .card-footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .card-price {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--ink);
  }
  .card-price span {
    font-size: 13px;
    font-weight: 400;
    font-family: 'DM Sans', sans-serif;
  }

  .btn-cart {
    flex-shrink: 0;
    background: var(--ink);
    color: var(--cream);
    border: none;
    padding: 10px 18px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
  }
  .btn-cart:hover:not(:disabled) {
    background: var(--rust);
    transform: scale(1.04);
  }
  .btn-cart:disabled {
    background: #ccc;
    color: #999;
    cursor: not-allowed;
  }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center;
    padding: 100px 20px;
  }
  .empty-state h3 {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    color: var(--ink);
    margin-bottom: 10px;
  }
  .empty-state p {
    color: var(--muted);
    font-size: 15px;
  }

  /* ── ERROR STATE ── */
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: 16px;
    background: var(--cream);
  }
  .error-state h4 {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    color: var(--ink);
  }
  .error-state p {
    color: var(--muted);
    font-size: 14px;
  }

  /* ── TOAST ── */
  .toast-wrapper {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 9999;
    pointer-events: none;
  }
  .toast-pill {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--ink);
    color: var(--cream);
    border-radius: 100px;
    padding: 12px 20px 12px 12px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.25);
    pointer-events: all;
    transform: translateY(80px);
    opacity: 0;
    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), opacity 0.3s;
  }
  .toast-pill.show {
    transform: translateY(0);
    opacity: 1;
  }
  .toast-img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--gold);
    flex-shrink: 0;
  }
  .toast-text-main {
    font-weight: 600;
    font-size: 13px;
  }
  .toast-text-sub {
    font-size: 11px;
    color: rgba(245,240,232,0.55);
    margin-top: 1px;
  }
  .toast-icon {
    width: 20px;
    height: 20px;
    background: var(--sage);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    .hero-strip { padding: 48px 20px 40px; }
    .filter-row { padding: 16px 20px; }
    .products-section { padding: 32px 16px; }
    .products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .toast-wrapper { bottom: 16px; right: 16px; left: 16px; }
    .hero-count { display: none; }
  }
`;

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState(null);

  useEffect(() => {
    if (!isDataFetched) {
      refreshData();
      setIsDataFetched(true);
    }
  }, [refreshData, isDataFetched]);

  useEffect(() => {
    console.log(data, "data from home page");
  }, [data]);

  useEffect(() => {
    let toastTimer;
    if (showToast) {
      toastTimer = setTimeout(() => setShowToast(false), 3000);
    }
    return () => clearTimeout(toastTimer);
  }, [showToast]);

  const convertBase64ToDataURL = (base64String, mimeType = "image/jpeg") => {
    if (!base64String) return unplugged;
    if (base64String.startsWith("data:")) return base64String;
    if (base64String.startsWith("http")) return base64String;
    return `data:${mimeType};base64,${base64String}`;
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    setToastProduct(product);
    setShowToast(true);
  };

  const filteredProducts = selectedCategory
    ? data.filter((product) => product.category === selectedCategory)
    : data;

  if (isError) {
    return (
      <>
        <style>{styles}</style>
        <div className="error-state">
          <img
            src={unplugged}
            alt="Error"
            width="80"
            style={{ opacity: 0.4 }}
          />
          <h4>Something went wrong</h4>
          <p>We couldn't load the products. Please try again.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      {/* ── Toast ── */}
      <div className="toast-wrapper">
        <div className={`toast-pill ${showToast ? "show" : ""}`}>
          {toastProduct && (
            <>
              <img
                src={convertBase64ToDataURL(toastProduct.imageData)}
                alt={toastProduct.name}
                className="toast-img"
                onError={(e) => {
                  e.target.src = unplugged;
                }}
              />
              <div>
                <div className="toast-text-main">{toastProduct.name}</div>
                <div className="toast-text-sub">Added to your cart</div>
              </div>
              <div className="toast-icon">
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                  <path
                    d="M1 4.5L4 7.5L10 1"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="home-wrapper">
        {/* ── Hero ── */}
        <div className="hero-strip">
          <div className="hero-eyebrow">New arrivals · Season 2026</div>
          <h1 className="hero-title">
            Shop <em>the</em>
            <br />
            finest picks
          </h1>
          <p className="hero-sub">
            Curated products, honest prices — everything you need, nothing you
            don't.
          </p>
          <div className="hero-count">{filteredProducts?.length || ""}</div>
        </div>

        {/* ── Products ── */}
        <div className="products-section">
          <div className="section-label">
            {selectedCategory ? selectedCategory : "All Products"}
            {filteredProducts?.length > 0 &&
              ` · ${filteredProducts.length} items`}
          </div>

          {!filteredProducts || filteredProducts.length === 0 ? (
            <div className="empty-state">
              <h3>Nothing here yet</h3>
              <p>
                No products found
                {selectedCategory ? ` in "${selectedCategory}"` : ""}.
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product, idx) => {
                const {
                  id,
                  brand,
                  name,
                  price,
                  productAvailable,
                  imageData,
                  stockQuantity,
                } = product;
                const available = productAvailable && stockQuantity !== 0;

                return (
                  <div
                    className={`product-card ${!available ? "unavailable" : ""}`}
                    key={id}
                    style={{ animationDelay: `${Math.min(idx * 0.05, 0.4)}s` }}
                  >
                    <Link
                      to={`/product/${id}`}
                      className="text-decoration-none"
                    >
                      <div className="img-wrapper">
                        <img
                          src={convertBase64ToDataURL(imageData)}
                          alt={name}
                          onError={(e) => {
                            e.target.src = unplugged;
                          }}
                        />
                        {!available && (
                          <span className="oos-badge">Out of Stock</span>
                        )}
                      </div>
                    </Link>

                    <div className="card-body">
                      <div className="card-brand">{brand}</div>
                      <Link to={`/product/${id}`} className="card-name">
                        {name}
                      </Link>
                      <div className="card-footer-row">
                        <div className="card-price">
                          <span>₹</span>
                          {price}
                        </div>
                        <button
                          className="btn-cart"
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={!available}
                        >
                          {available ? "+ Cart" : "Sold Out"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
