import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AppContext from "../../Context/Context";

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

  .sr-wrapper {
    background: var(--cream);
    min-height: 100vh;
    padding-top: var(--nav-height);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── HEADER ── */
  .sr-header {
    background: var(--ink);
    padding: 40px 48px 32px;
    position: relative;
    overflow: hidden;
  }
  .sr-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg, transparent, transparent 40px,
      rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 80px
    );
  }
  .sr-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 10px;
    position: relative;
  }
  .sr-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(24px, 3.5vw, 42px);
    font-weight: 900;
    color: var(--cream);
    margin: 0 0 6px;
    position: relative;
    line-height: 1.05;
  }
  .sr-title em { font-style: italic; color: var(--gold); }
  .sr-count {
    font-size: 13px;
    color: rgba(245,240,232,0.4);
    position: relative;
  }
  .sr-count strong { color: rgba(245,240,232,0.8); }

  /* ── GRID ── */
  .sr-body {
    padding: 40px 48px;
  }
  .sr-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
  }

  /* ── CARD ── */
  .sr-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    cursor: pointer;
  }
  .sr-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.1);
    border-color: rgba(212,168,83,0.3);
  }

  .sr-card-img-wrap {
    position: relative;
    background: #f8f6f2;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-bottom: 1px solid var(--border);
  }
  .sr-card-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 16px;
    transition: transform 0.3s cubic-bezier(0.23,1,0.32,1);
  }
  .sr-card:hover .sr-card-img { transform: scale(1.04); }

  .sr-card-category {
    position: absolute;
    top: 10px;
    left: 10px;
    background: var(--ink);
    color: var(--gold);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
  }
  .sr-card-stock-dot {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .sr-card-stock-dot.in { background: var(--sage); }
  .sr-card-stock-dot.out { background: var(--rust); }

  .sr-card-body {
    padding: 18px 18px 14px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .sr-card-brand {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }
  .sr-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.25;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .sr-card-desc {
    font-size: 12px;
    color: var(--muted);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 14px;
    flex: 1;
  }

  /* ── CARD FOOTER ── */
  .sr-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px;
    border-top: 1px solid var(--border);
    background: #faf8f5;
  }
  .sr-card-price {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 900;
    color: var(--ink);
    line-height: 1;
  }
  .sr-card-price-sym {
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    color: var(--muted);
    vertical-align: super;
    margin-right: 1px;
  }

  .sr-btn-cart {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 3px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, transform 0.15s;
  }
  .sr-btn-cart.available {
    background: var(--ink);
    color: var(--cream);
  }
  .sr-btn-cart.available:hover {
    background: var(--rust);
    transform: translateY(-1px);
  }
  .sr-btn-cart.unavailable {
    background: var(--border);
    color: var(--muted);
    cursor: not-allowed;
  }

  /* ── EMPTY STATE ── */
  .sr-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    text-align: center;
    gap: 16px;
  }
  .sr-empty-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(212,168,83,0.1);
    border: 1.5px solid rgba(212,168,83,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
  }
  .sr-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
    margin: 0;
  }
  .sr-empty-sub {
    font-size: 14px;
    color: var(--muted);
    margin: 0;
  }
  .sr-btn-home {
    margin-top: 8px;
    padding: 11px 28px;
    background: var(--ink);
    color: var(--cream);
    border: none;
    border-radius: 3px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
  }
  .sr-btn-home:hover { background: var(--gold); color: var(--ink); }

  /* ── LOADING ── */
  .sr-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - var(--nav-height));
    gap: 16px;
  }
  .sr-loading-ring {
    width: 36px; height: 36px;
    border: 2.5px solid var(--border);
    border-top-color: var(--ink);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .sr-loading-text {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .sr-header { padding: 32px 20px 24px; }
    .sr-body { padding: 24px 16px; }
    .sr-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
    .sr-card-img-wrap { height: 150px; }
  }
`;

const convertBase64ToDataURL = (imageData, mimeType = "image/jpeg") => {
  if (!imageData) return "";
  if (typeof imageData === "string" && imageData.startsWith("data:"))
    return imageData;
  if (typeof imageData === "string")
    return `data:${mimeType};base64,${imageData}`;
  if (Array.isArray(imageData)) {
    const binaryString = imageData
      .map((byte) => String.fromCharCode(byte))
      .join("");
    return `data:${mimeType};base64,${btoa(binaryString)}`;
  }
  return "";
};

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useContext(AppContext);
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.searchData) {
      setSearchData(location.state.searchData);
      setLoading(false);
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // prevent card click navigation
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="sr-wrapper">
          <div className="sr-loading">
            <div className="sr-loading-ring" />
            <span className="sr-loading-text">Searching…</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="sr-wrapper">
        {/* ── Header ── */}
        <div className="sr-header">
          <div className="sr-eyebrow">Search Results</div>
          <h1 className="sr-title">
            {searchData.length > 0 ? (
              <>
                Found <em>{searchData.length}</em> product
                {searchData.length !== 1 ? "s" : ""}
              </>
            ) : (
              <>
                No <em>results</em> found
              </>
            )}
          </h1>
          {searchData.length > 0 && (
            <p className="sr-count">
              Showing <strong>{searchData.length}</strong> matching product
              {searchData.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="sr-body">
          {searchData.length === 0 ? (
            <div className="sr-empty">
              <div className="sr-empty-icon">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
              <h2 className="sr-empty-title">No products found</h2>
              <p className="sr-empty-sub">
                Try a different keyword or browse all products
              </p>
              <button className="sr-btn-home" onClick={() => navigate("/")}>
                Browse All Products
              </button>
            </div>
          ) : (
            <div className="sr-grid">
              {searchData.map((product) => {
                const isAvailable =
                  product.productAvailable && product.stockQuantity > 0;
                return (
                  <div
                    key={product.id}
                    className="sr-card"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Image */}
                    <div className="sr-card-img-wrap">
                      <img
                        className="sr-card-img"
                        src={convertBase64ToDataURL(product.imageData)}
                        alt={product.name}
                      />
                      <span className="sr-card-category">
                        {product.category}
                      </span>
                      <span
                        className={`sr-card-stock-dot ${isAvailable ? "in" : "out"}`}
                        title={isAvailable ? "In Stock" : "Out of Stock"}
                      />
                    </div>

                    {/* Body */}
                    <div className="sr-card-body">
                      <div className="sr-card-brand">{product.brand}</div>
                      <div className="sr-card-name">{product.name}</div>
                      <p className="sr-card-desc">{product.description}</p>
                    </div>

                    {/* Footer */}
                    <div className="sr-card-footer">
                      <div className="sr-card-price">
                        <span className="sr-card-price-sym">₹</span>
                        {Number(product.price).toLocaleString("en-IN")}
                      </div>
                      <button
                        className={`sr-btn-cart ${isAvailable ? "available" : "unavailable"}`}
                        onClick={(e) =>
                          isAvailable && handleAddToCart(e, product)
                        }
                        disabled={!isAvailable}
                      >
                        {isAvailable ? (
                          <>
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="9" cy="21" r="1" />
                              <circle cx="20" cy="21" r="1" />
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            Add
                          </>
                        ) : (
                          "Out of Stock"
                        )}
                      </button>
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

export default SearchResults;
