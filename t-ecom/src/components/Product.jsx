import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import { toast } from "react-toastify";

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

  .product-wrapper {
    background: var(--cream);
    min-height: 100vh;
    padding-top: var(--nav-height);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── BREADCRUMB ── */
  .product-breadcrumb {
    padding: 14px 48px;
    background: var(--ink);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .product-breadcrumb a {
    color: rgba(245,240,232,0.4);
    text-decoration: none;
    transition: color 0.2s;
  }
  .product-breadcrumb a:hover { color: var(--gold); }
  .product-breadcrumb-sep { color: rgba(255,255,255,0.15); }
  .product-breadcrumb-current { color: var(--gold); }

  /* ── MAIN LAYOUT ── */
  .product-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: calc(100vh - var(--nav-height) - 42px);
  }

  /* ── IMAGE PANEL ── */
  .product-img-panel {
    background: var(--card-bg);
    border-right: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 40px;
    position: sticky;
    top: calc(var(--nav-height) + 42px);
    height: calc(100vh - var(--nav-height) - 42px);
    overflow: hidden;
  }
  .product-img-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 60% 40%, rgba(212,168,83,0.06) 0%, transparent 65%);
  }
  .product-img-wrap {
    position: relative;
    width: 100%;
    max-width: 380px;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .product-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    animation: imgIn 0.6s cubic-bezier(0.23,1,0.32,1) both;
    position: relative;
    z-index: 1;
  }
  @keyframes imgIn {
    from { opacity: 0; transform: scale(0.94) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* category chip on image */
  .img-category-chip {
    position: absolute;
    top: 0;
    left: 0;
    background: var(--ink);
    color: var(--gold);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 2px;
    z-index: 2;
  }

  /* ── DETAIL PANEL ── */
  .product-detail-panel {
    padding: 52px 52px 60px;
    overflow-y: auto;
    animation: panelIn 0.5s cubic-bezier(0.23,1,0.32,1) both;
    animation-delay: 0.1s;
  }
  @keyframes panelIn {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .product-meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .product-listed {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.05em;
  }

  /* stock badge */
  .stock-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .stock-badge-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .stock-badge.in-stock {
    background: rgba(74,103,65,0.1);
    color: var(--sage);
  }
  .stock-badge.in-stock .stock-badge-dot { background: var(--sage); }
  .stock-badge.out-stock {
    background: rgba(201,75,43,0.1);
    color: var(--rust);
  }
  .stock-badge.out-stock .stock-badge-dot { background: var(--rust); }

  .product-brand {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }
  .product-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 900;
    color: var(--ink);
    line-height: 1.05;
    margin-bottom: 28px;
    letter-spacing: -0.01em;
  }

  /* divider */
  .product-divider {
    height: 1px;
    background: var(--border);
    margin: 24px 0;
  }

  /* description */
  .desc-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .desc-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  .product-description {
    font-size: 14px;
    line-height: 1.75;
    color: #444;
  }

  /* price */
  .product-price-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    margin: 28px 0;
  }
  .product-price-symbol {
    font-size: 18px;
    font-weight: 400;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
  }
  .product-price {
    font-family: 'Playfair Display', serif;
    font-size: 44px;
    font-weight: 900;
    color: var(--ink);
    line-height: 1;
    letter-spacing: -0.02em;
  }

  /* stock count */
  .product-stock-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
    font-size: 13px;
    color: var(--muted);
  }
  .product-stock-num {
    font-weight: 700;
    color: var(--sage);
    font-size: 15px;
  }

  /* CTA */
  .btn-add-cart {
    width: 100%;
    background: var(--ink);
    color: var(--cream);
    border: none;
    border-radius: 3px;
    padding: 16px 24px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.2s, transform 0.15s;
    margin-bottom: 12px;
  }
  .btn-add-cart:hover:not(:disabled) {
    background: var(--rust);
    transform: translateY(-1px);
  }
  .btn-add-cart:disabled {
    background: #ccc;
    color: #999;
    cursor: not-allowed;
    transform: none;
  }

  /* admin row */
  .admin-row {
    display: flex;
    gap: 10px;
    margin-top: 12px;
  }
  .btn-admin {
    flex: 1;
    background: transparent;
    border-radius: 3px;
    padding: 10px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .btn-edit {
    border: 1.5px solid var(--border);
    color: var(--muted);
  }
  .btn-edit:hover {
    border-color: var(--ink);
    color: var(--ink);
    background: rgba(13,13,13,0.04);
  }
  .btn-delete {
    border: 1.5px solid rgba(201,75,43,0.25);
    color: var(--rust);
  }
  .btn-delete:hover {
    border-color: var(--rust);
    background: rgba(201,75,43,0.06);
  }

  /* ── LOADING ── */
  .product-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - var(--nav-height));
    gap: 16px;
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

  /* ── DELETE CONFIRM ── */
  .delete-overlay {
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
  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
  .delete-dialog {
    background: var(--card-bg);
    border-radius: 4px;
    width: 100%;
    max-width: 380px;
    overflow: hidden;
    box-shadow: 0 24px 60px rgba(0,0,0,0.3);
    animation: modalIn 0.3s cubic-bezier(0.23,1,0.32,1);
  }
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .delete-dialog-head {
    background: var(--rust);
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .delete-dialog-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: white;
  }
  .delete-dialog-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    color: white;
    margin: 0;
  }
  .delete-dialog-body {
    padding: 20px 24px;
    font-size: 14px;
    color: var(--muted);
    line-height: 1.6;
  }
  .delete-dialog-body strong { color: var(--ink); }
  .delete-dialog-footer {
    padding: 0 24px 20px;
    display: flex;
    gap: 10px;
  }
  .delete-cancel {
    flex: 1;
    background: transparent;
    border: 1.5px solid var(--border);
    color: var(--muted);
    padding: 10px;
    border-radius: 3px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .delete-cancel:hover { border-color: var(--ink); color: var(--ink); }
  .delete-confirm {
    flex: 1;
    background: var(--rust);
    color: white;
    border: none;
    padding: 10px;
    border-radius: 3px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
  }
  .delete-confirm:hover { background: #a83820; }

  @media (max-width: 860px) {
    .product-body { grid-template-columns: 1fr; }
    .product-img-panel {
      position: static;
      height: 300px;
      padding: 32px 20px;
    }
    .product-detail-panel { padding: 32px 20px 48px; }
    .product-breadcrumb { padding: 12px 20px; }
  }
`;

const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/product/${id}`);
        setProduct(response.data);
        if (response.data.imageName) fetchImage();
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(`${baseUrl}/api/product/${id}/image`, { responseType: "blob" });
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`${baseUrl}/api/product/${id}`);
      removeFromCart(id);
      toast.success("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => navigate(`/product/update/${id}`);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Product added to cart");
  };

  if (!product) {
    return (
      <>
        <style>{styles}</style>
        <div className="product-wrapper">
          <div className="product-loading">
            <div className="loading-ring" />
            <span className="loading-text">Loading product…</span>
          </div>
        </div>
      </>
    );
  }

  const isAvailable = product.productAvailable && product.stockQuantity > 0;

  return (
    <>
      <style>{styles}</style>
      <div className="product-wrapper">

        {/* ── Breadcrumb ── */}
        <div className="product-breadcrumb">
          <a href="/">Home</a>
          <span className="product-breadcrumb-sep">›</span>
          <a href="/">{product.category}</a>
          <span className="product-breadcrumb-sep">›</span>
          <span className="product-breadcrumb-current">{product.name}</span>
        </div>

        <div className="product-body">

          {/* ── Image panel ── */}
          <div className="product-img-panel">
            <div className="product-img-bg" />
            <div className="product-img-wrap">
              <span className="img-category-chip">{product.category}</span>
              {imageUrl && (
                <img
                  className="product-img"
                  src={imageUrl}
                  alt={product.name}
                />
              )}
            </div>
          </div>

          {/* ── Detail panel ── */}
          <div className="product-detail-panel">

            <div className="product-meta-row">
              <span
                className={`stock-badge ${isAvailable ? 'in-stock' : 'out-stock'}`}
              >
                <span className="stock-badge-dot" />
                {isAvailable ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="product-listed">
                Listed {new Date(product.releaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <div className="product-brand">{product.brand}</div>
            <h1 className="product-name">{product.name}</h1>

            <div className="desc-label">Description</div>
            <p className="product-description">{product.description}</p>

            <div className="product-divider" />

            <div className="product-price-row">
              <span className="product-price-symbol">₹</span>
              <span className="product-price">{Number(product.price).toLocaleString('en-IN')}</span>
            </div>

            <div className="product-stock-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <span>
                {product.stockQuantity > 0
                  ? <><span className="product-stock-num">{product.stockQuantity}</span> units available</>
                  : <span style={{ color: 'var(--rust)' }}>No stock remaining</span>
                }
              </span>
            </div>

            <button
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={!isAvailable}
            >
              {isAvailable ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Add to Cart
                </>
              ) : 'Out of Stock'}
            </button>

            <div className="admin-row">
              <button className="btn-admin btn-edit" onClick={handleEditClick}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Product
              </button>
              <button className="btn-admin btn-delete" onClick={() => setShowDeleteConfirm(true)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Delete confirm dialog ── */}
      {showDeleteConfirm && (
        <div className="delete-overlay" onClick={(e) => e.target === e.currentTarget && setShowDeleteConfirm(false)}>
          <div className="delete-dialog">
            <div className="delete-dialog-head">
              <div className="delete-dialog-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/>
                  <path d="M9 6V4h6v2"/>
                </svg>
              </div>
              <h2 className="delete-dialog-title">Delete Product</h2>
            </div>
            <div className="delete-dialog-body">
              Are you sure you want to delete <strong>"{product.name}"</strong>? This action cannot be undone.
            </div>
            <div className="delete-dialog-footer">
              <button className="delete-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="delete-confirm" onClick={deleteProduct}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;