import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../Context/Context";
import axios from "../../axios";
import { toast } from "react-toastify";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink: #0d0d0d;
    --cream: #f5f0e8;
    --gold: #d4a853;
    --rust: #c94b2b;
    --sage: #4a6741;
    --card-bg: #ffffff;
    --muted: #888;
    --border: #e0dbd0;
    --nav-height: 62px;
  }

  .home-wrapper {
    background: var(--cream);
    min-height: 100vh;
    padding-top: var(--nav-height);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── HERO ── */
  .home-hero {
    background: var(--ink);
    padding: 48px 48px 36px;
    position: relative;
    overflow: hidden;
  }
  .home-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg, transparent, transparent 40px,
      rgba(255,255,255,0.012) 40px, rgba(255,255,255,0.012) 80px
    );
  }
  .home-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 10px;
    position: relative;
  }
  .home-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4vw, 52px);
    font-weight: 900;
    color: var(--cream);
    margin: 0 0 8px;
    line-height: 1;
    position: relative;
  }
  .home-title em { font-style: italic; color: var(--gold); }
  .home-subtitle {
    font-size: 14px;
    color: rgba(245,240,232,0.4);
    position: relative;
  }
  .home-subtitle strong { color: rgba(245,240,232,0.75); }

  /* ── FILTERS BAR ── */
  .filter-bar {
    background: var(--card-bg);
    border-bottom: 1px solid var(--border);
    padding: 14px 48px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .filter-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-right: 4px;
    flex-shrink: 0;
  }
  .filter-select, .filter-input {
    background: var(--cream);
    border: 1.5px solid var(--border);
    border-radius: 3px;
    padding: 7px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.2s;
    cursor: pointer;
  }
  .filter-select:focus, .filter-input:focus { border-color: var(--ink); }
  .filter-input { width: 110px; }
  .filter-input::placeholder { color: var(--muted); }
  .filter-divider {
    width: 1px;
    height: 20px;
    background: var(--border);
    flex-shrink: 0;
    margin: 0 4px;
  }
  .filter-btn-apply {
    padding: 7px 18px;
    background: var(--ink);
    color: var(--cream);
    border: none;
    border-radius: 3px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
  }
  .filter-btn-apply:hover { background: var(--gold); color: var(--ink); }
  .filter-btn-reset {
    padding: 7px 14px;
    background: transparent;
    color: var(--muted);
    border: 1.5px solid var(--border);
    border-radius: 3px;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .filter-btn-reset:hover { border-color: var(--rust); color: var(--rust); }
  .filter-results-count {
    margin-left: auto;
    font-size: 12px;
    color: var(--muted);
    flex-shrink: 0;
  }
  .filter-results-count strong { color: var(--ink); }

  /* ── GRID ── */
  .home-body { padding: 32px 48px; }
  .home-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
  }

  /* ── CARD ── */
  .h-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    cursor: pointer;
  }
  .h-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.09);
    border-color: rgba(212,168,83,0.3);
  }
  .h-card-img-wrap {
    background: #f8f6f2;
    height: 190px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .h-card-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 14px;
    transition: transform 0.3s cubic-bezier(0.23,1,0.32,1);
  }
  .h-card:hover .h-card-img { transform: scale(1.04); }
  .h-card-cat {
    position: absolute;
    top: 10px; left: 10px;
    background: var(--ink);
    color: var(--gold);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
  }
  .h-card-stock {
    position: absolute;
    top: 10px; right: 10px;
    width: 8px; height: 8px;
    border-radius: 50%;
  }
  .h-card-stock.in { background: var(--sage); }
  .h-card-stock.out { background: var(--rust); }
  .h-card-body {
    padding: 16px 16px 12px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .h-card-brand {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }
  .h-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.25;
    margin-bottom: 6px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }
  .h-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid var(--border);
    background: #faf8f5;
  }
  .h-card-price {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 900;
    color: var(--ink);
  }
  .h-card-price span {
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    color: var(--muted);
    vertical-align: super;
  }
  .h-card-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 12px;
    border-radius: 3px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    background: var(--ink);
    color: var(--cream);
  }
  .h-card-btn:hover { background: var(--rust); transform: translateY(-1px); }
  .h-card-btn.out-stock {
    background: var(--border);
    color: var(--muted);
    cursor: not-allowed;
  }

  /* ── PAGINATION ── */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 16px 0 40px;
    flex-wrap: wrap;
  }
  .page-info {
    font-size: 12px;
    color: var(--muted);
    text-align: center;
    margin-bottom: 14px;
    letter-spacing: 0.05em;
  }
  .page-info strong { color: var(--ink); }
  .page-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    border: 1.5px solid var(--border);
    background: var(--card-bg);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.2s;
  }
  .page-btn:hover:not(:disabled) {
    border-color: var(--ink);
    color: var(--ink);
    background: var(--cream);
  }
  .page-btn.active {
    background: var(--ink);
    border-color: var(--ink);
    color: var(--cream);
    font-weight: 700;
  }
  .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .page-btn.nav {
    width: auto;
    padding: 0 14px;
    gap: 6px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .page-size-select {
    margin-left: 12px;
    background: var(--cream);
    border: 1.5px solid var(--border);
    border-radius: 3px;
    padding: 6px 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: var(--ink);
    outline: none;
    cursor: pointer;
  }

  /* ── EMPTY ── */
  .home-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    gap: 14px;
    text-align: center;
  }
  .home-empty-icon {
    width: 60px; height: 60px;
    border-radius: 50%;
    background: rgba(212,168,83,0.1);
    border: 1.5px solid rgba(212,168,83,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    font-size: 24px;
  }
  .home-empty h3 {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    margin: 0;
    color: var(--ink);
  }
  .home-empty p { font-size: 14px; color: var(--muted); margin: 0; }

  /* ── LOADING ── */
  .home-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 14px;
  }
  .home-spinner {
    width: 32px; height: 32px;
    border: 2.5px solid var(--border);
    border-top-color: var(--ink);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .home-hero, .home-body { padding-left: 20px; padding-right: 20px; }
    .filter-bar { padding: 12px 20px; }
    .home-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; }
    .h-card-img-wrap { height: 150px; }
    .filter-results-count { display: none; }
  }
`;

const CATEGORIES = [
  "",
  "Laptop",
  "Headphone",
  "Mobile",
  "Electronics",
  "Toys",
  "Fashion",
];
const SORT_OPTIONS = [
  { value: "id|asc", label: "Default" },
  { value: "price|asc", label: "Price: Low to High" },
  { value: "price|desc", label: "Price: High to Low" },
  { value: "name|asc", label: "Name: A–Z" },
  { value: "name|desc", label: "Name: Z–A" },
];

const convertBase64ToDataURL = (imageData, mimeType = "image/jpeg") => {
  if (!imageData) return null;
  if (typeof imageData === "string" && imageData.startsWith("data:"))
    return imageData;
  if (typeof imageData === "string")
    return `data:${mimeType};base64,${imageData}`;
  if (Array.isArray(imageData)) {
    const bin = imageData.map((b) => String.fromCharCode(b)).join("");
    return `data:${mimeType};base64,${btoa(bin)}`;
  }
  return null;
};

const Home = ({ selectedCategory }) => {
  const { addToCart, user } = useContext(AppContext);
  const navigate = useNavigate();

  // Pagination state
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortValue, setSortValue] = useState("id|asc");

  // Applied filters (only update when Apply is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "id",
    direction: "asc",
  });

  // Fetch products
  const fetchProducts = async (
    page = 0,
    size = pageSize,
    filters = appliedFilters,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        size,
        sortBy: filters.sortBy,
        direction: filters.direction,
      });
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

      const res = await axios.get(`/api/products/paged?${params}`);
      setProducts(res.data.content);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts(0, pageSize, appliedFilters);
  }, []);

  // When navbar category changes
  useEffect(() => {
    if (selectedCategory !== undefined) {
      const newFilters = { ...appliedFilters, category: selectedCategory };
      setCategory(selectedCategory);
      setAppliedFilters(newFilters);
      fetchProducts(0, pageSize, newFilters);
      setCurrentPage(0);
    }
  }, [selectedCategory]);

  const handleApplyFilters = () => {
    const [sortBy, direction] = sortValue.split("|");
    const newFilters = { category, minPrice, maxPrice, sortBy, direction };
    setAppliedFilters(newFilters);
    setCurrentPage(0);
    fetchProducts(0, pageSize, newFilters);
  };

  const handleReset = () => {
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortValue("id|asc");
    const reset = {
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "id",
      direction: "asc",
    };
    setAppliedFilters(reset);
    setCurrentPage(0);
    fetchProducts(0, pageSize, reset);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchProducts(page, pageSize, appliedFilters);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0);
    fetchProducts(0, newSize, appliedFilters);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  // Build page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(0, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);
    if (left > 0) {
      pages.push(0);
      if (left > 1) pages.push("...");
    }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) {
      if (right < totalPages - 2) pages.push("...");
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="home-wrapper">
        {/* ── Hero ── */}
        <div className="home-hero">
          <div className="home-eyebrow">All Products</div>
          <h1 className="home-title">
            Shop our <em>collection</em>
          </h1>
          <p className="home-subtitle">
            Showing <strong>{totalElements}</strong> products
          </p>
        </div>

        {/* ── Filter Bar ── */}
        <div className="filter-bar">
          <span className="filter-label">Filter</span>

          <select
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c || "All Categories"}
              </option>
            ))}
          </select>

          <div className="filter-divider" />

          <input
            className="filter-input"
            type="number"
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span style={{ color: "var(--muted)", fontSize: 12 }}>–</span>
          <input
            className="filter-input"
            type="number"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <div className="filter-divider" />

          <span className="filter-label">Sort</span>
          <select
            className="filter-select"
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <button className="filter-btn-apply" onClick={handleApplyFilters}>
            Apply
          </button>
          <button className="filter-btn-reset" onClick={handleReset}>
            Reset
          </button>

          <span className="filter-results-count">
            <strong>{totalElements}</strong> results · Page {currentPage + 1} of{" "}
            {totalPages}
          </span>
        </div>

        <div className="home-body">
          {loading ? (
            <div className="home-loading">
              <div className="home-spinner" />
              <span
                style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Loading…
              </span>
            </div>
          ) : products.length === 0 ? (
            <div className="home-empty">
              <div className="home-empty-icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or reset to see all products</p>
              <button
                className="filter-btn-apply"
                style={{ marginTop: 8 }}
                onClick={handleReset}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* ── Product Grid ── */}
              <div className="home-grid">
                {products.map((product) => {
                  const imgSrc = convertBase64ToDataURL(
                    product.imageData,
                    product.imageType,
                  );
                  const inStock =
                    product.productAvailable && product.stockQuantity > 0;
                  return (
                    <div
                      key={product.id}
                      className="h-card"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <div className="h-card-img-wrap">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={product.name}
                            className="h-card-img"
                          />
                        ) : (
                          <div style={{ fontSize: 40, opacity: 0.15 }}>📦</div>
                        )}
                        <span className="h-card-cat">{product.category}</span>
                        <span
                          className={`h-card-stock ${inStock ? "in" : "out"}`}
                        />
                      </div>

                      <div className="h-card-body">
                        <div className="h-card-brand">{product.brand}</div>
                        <div className="h-card-name">{product.name}</div>
                      </div>

                      <div className="h-card-footer">
                        <div className="h-card-price">
                          <span>₹</span>
                          {Number(product.price).toLocaleString("en-IN")}
                        </div>
                        {user?.role === "ADMIN" ? (
                          <button
                            className="h-card-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/update/${product.id}`);
                            }}
                          >
                            Edit
                          </button>
                        ) : (
                          <button
                            className={`h-card-btn ${!inStock ? "out-stock" : ""}`}
                            disabled={!inStock}
                            onClick={(e) =>
                              inStock && handleAddToCart(e, product)
                            }
                          >
                            {inStock ? "Add" : "Sold Out"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Pagination Controls ── */}
              {totalPages > 1 && (
                <>
                  <p className="page-info">
                    Page <strong>{currentPage + 1}</strong> of{" "}
                    <strong>{totalPages}</strong>
                    &nbsp;·&nbsp;
                    <strong>{totalElements}</strong> total products
                  </p>

                  <div className="pagination">
                    {/* Prev */}
                    <button
                      className="page-btn nav"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      ← Prev
                    </button>

                    {/* Page numbers */}
                    {getPageNumbers().map((p, i) =>
                      p === "..." ? (
                        <span
                          key={`dot-${i}`}
                          style={{ color: "var(--muted)", fontSize: 13 }}
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          className={`page-btn ${p === currentPage ? "active" : ""}`}
                          onClick={() => handlePageChange(p)}
                        >
                          {p + 1}
                        </button>
                      ),
                    )}

                    {/* Next */}
                    <button
                      className="page-btn nav"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages - 1}
                    >
                      Next →
                    </button>

                    {/* Page size selector */}
                    <select
                      className="page-size-select"
                      value={pageSize}
                      onChange={handlePageSizeChange}
                    >
                      <option value={4}>4 / page</option>
                      <option value={8}>8 / page</option>
                      <option value={12}>12 / page</option>
                      <option value={20}>20 / page</option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
