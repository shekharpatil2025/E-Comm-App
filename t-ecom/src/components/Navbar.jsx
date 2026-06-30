import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink: #0d0d0d;
    --cream: #f5f0e8;
    --rust: #c94b2b;
    --gold: #d4a853;
    --sage: #4a6741;
    --muted: #888;
    --border: rgba(255,255,255,0.1);
    --nav-height: 62px;
  }

  /* ── NAV SHELL ── */
  .nav-shell {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: var(--ink);
    height: var(--nav-height);
    display: flex;
    align-items: center;
    padding: 0 32px;
    gap: 0;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.3);
  }

  /* ── BRAND ── */
  .nav-brand {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 900;
    color: var(--cream);
    text-decoration: none;
    letter-spacing: -0.02em;
    flex-shrink: 0;
    margin-right: 36px;
    transition: color 0.2s;
  }
  .nav-brand em {
    font-style: italic;
    color: var(--gold);
  }
  .nav-brand:hover { color: var(--gold); }

  /* ── DIVIDER ── */
  .nav-divider {
    width: 1px;
    height: 20px;
    background: var(--border);
    flex-shrink: 0;
    margin-right: 28px;
  }

  /* ── LINKS ── */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;
  }
  .nav-links a {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 13px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(245,240,232,0.55);
    text-decoration: none;
    transition: color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .nav-links a:hover,
  .nav-links a.active {
    color: var(--cream);
    background: rgba(255,255,255,0.06);
  }
  .nav-links a svg { opacity: 0.6; }
  .nav-links a:hover svg, .nav-links a.active svg { opacity: 1; }

  /* ── CATEGORY PILL ── */
  .cat-pill {
    position: relative;
    margin-left: 4px;
  }
  .cat-pill-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 13px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(245,240,232,0.55);
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .cat-pill-btn:hover, .cat-pill-btn.open {
    color: var(--cream);
    background: rgba(255,255,255,0.06);
  }
  .cat-chevron {
    transition: transform 0.25s;
  }
  .cat-pill-btn.open .cat-chevron { transform: rotate(180deg); }

  .cat-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    background: var(--ink);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    padding: 6px;
    min-width: 160px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.4);
    display: none;
    flex-direction: column;
    gap: 2px;
    animation: dropIn 0.2s cubic-bezier(0.23,1,0.32,1);
  }
  .cat-dropdown.show { display: flex; }

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cat-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 3px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(245,240,232,0.6);
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s, color 0.15s;
  }
  .cat-item:hover { background: rgba(255,255,255,0.07); color: var(--cream); }
  .cat-item.selected { color: var(--gold); }
  .cat-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    flex-shrink: 0;
    transition: background 0.15s;
  }
  .cat-item.selected .cat-dot { background: var(--gold); }
  .cat-item:hover .cat-dot { background: rgba(255,255,255,0.4); }

  .cat-reset {
    border-top: 1px solid rgba(255,255,255,0.08);
    margin-top: 4px;
    padding-top: 6px;
  }
  .cat-reset .cat-item { color: var(--muted); font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; }
  .cat-reset .cat-item:hover { color: var(--rust); }

  /* ── RIGHT SIDE ── */
  .nav-right {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
    flex-shrink: 0;
  }

  /* ── CART ── */
  .nav-cart {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: 3px;
    border: 1px solid rgba(255,255,255,0.12);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(245,240,232,0.7);
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .nav-cart:hover {
    border-color: var(--gold);
    color: var(--gold);
    background: rgba(212,168,83,0.07);
  }

  /* ── THEME TOGGLE ── */
  .theme-btn {
    width: 36px;
    height: 36px;
    border-radius: 3px;
    border: 1px solid rgba(255,255,255,0.1);
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(245,240,232,0.5);
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    flex-shrink: 0;
  }
  .theme-btn:hover {
    border-color: rgba(255,255,255,0.3);
    color: var(--cream);
    background: rgba(255,255,255,0.05);
  }

  /* ── SEARCH ── */
  .search-form {
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 3px;
    overflow: hidden;
    transition: border-color 0.2s, background 0.2s;
  }
  .search-form:focus-within {
    border-color: rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.09);
  }
  .search-input {
    background: transparent;
    border: none;
    outline: none;
    padding: 8px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--cream);
    width: 180px;
    transition: width 0.3s cubic-bezier(0.23,1,0.32,1);
  }
  .search-input::placeholder { color: rgba(245,240,232,0.3); }
  .search-input:focus { width: 240px; }
  .search-btn {
    background: none;
    border: none;
    border-left: 1px solid rgba(255,255,255,0.08);
    padding: 8px 12px;
    cursor: pointer;
    color: rgba(245,240,232,0.5);
    display: flex;
    align-items: center;
    transition: color 0.2s, background 0.2s;
    flex-shrink: 0;
  }
  .search-btn:hover { color: var(--cream); background: rgba(255,255,255,0.06); }
  .search-btn:disabled { cursor: not-allowed; opacity: 0.4; }

  /* ── NO RESULTS TOAST ── */
  .no-results-pill {
    position: fixed;
    top: 76px;
    right: 32px;
    background: var(--ink);
    border: 1px solid rgba(201,75,43,0.4);
    color: var(--cream);
    padding: 10px 18px;
    border-radius: 3px;
    font-size: 13px;
    font-weight: 500;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    z-index: 999;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.3s cubic-bezier(0.23,1,0.32,1);
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .no-results-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--rust);
    flex-shrink: 0;
  }

  /* ── MOBILE TOGGLE ── */
  .mobile-toggle {
    display: none;
    background: none;
    border: 1px solid rgba(255,255,255,0.15);
    color: var(--cream);
    width: 36px;
    height: 36px;
    border-radius: 3px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .mobile-toggle:hover { background: rgba(255,255,255,0.07); }

  /* ── MOBILE DRAWER ── */
  .mobile-drawer {
    display: none;
    position: fixed;
    top: var(--nav-height);
    left: 0;
    right: 0;
    background: var(--ink);
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 16px 24px 24px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    z-index: 999;
    flex-direction: column;
    gap: 6px;
    animation: drawerIn 0.25s cubic-bezier(0.23,1,0.32,1);
  }
  @keyframes drawerIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mobile-drawer.open { display: flex; }

  .mobile-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 4px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 14px;
    font-weight: 500;
    color: rgba(245,240,232,0.7);
    text-decoration: none;
    transition: color 0.2s;
  }
  .mobile-link:hover { color: var(--cream); }
  .mobile-link:last-child { border-bottom: none; }

  .mobile-cats-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--muted);
    padding: 12px 4px 8px;
  }
  .mobile-cat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-bottom: 12px;
  }
  .mobile-cat-item {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 3px;
    padding: 9px 8px;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    color: rgba(245,240,232,0.6);
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    font-family: 'DM Sans', sans-serif;
    border: none;
    width: 100%;
  }
  .mobile-cat-item:hover { background: rgba(255,255,255,0.08); color: var(--cream); }
  .mobile-cat-item.selected { background: rgba(212,168,83,0.12); color: var(--gold); border: 1px solid rgba(212,168,83,0.3); }

  .mobile-search-form {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  .mobile-search-input {
    flex: 1;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 3px;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--cream);
    outline: none;
  }
  .mobile-search-input::placeholder { color: rgba(245,240,232,0.3); }
  .mobile-search-btn {
    background: var(--cream);
    color: var(--ink);
    border: none;
    border-radius: 3px;
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }
  .mobile-search-btn:hover { background: var(--gold); }
  .mobile-search-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* spinner */
  .search-spinner {
    width: 13px;
    height: 13px;
    border: 2px solid rgba(245,240,232,0.2);
    border-top-color: var(--cream);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .nav-links, .nav-divider, .search-form, .nav-cart, .theme-btn, .cat-pill {
      display: none !important;
    }
    .mobile-toggle { display: flex; }
    .nav-shell { padding: 0 20px; }
  }
`;

const Navbar = ({ onSelectCategory }) => {
  const getInitialTheme = () => localStorage.getItem("theme") || "light-theme";

  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showNoProductsMessage, setShowNoProductsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [catOpen, setCatOpen] = useState(false);

  const navbarRef = useRef(null);
  const catRef = useRef(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => { fetchInitialData(); }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavCollapsed(true);
      }
      if (catRef.current && !catRef.current.contains(event.target)) {
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // auto-dismiss no-results
  useEffect(() => {
    if (showNoProductsMessage) {
      const t = setTimeout(() => setShowNoProductsMessage(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showNoProductsMessage]);

  const fetchInitialData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/products`);
      console.log(response.data, 'navbar initial data');
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  const handleNavbarToggle = () => setIsNavCollapsed(!isNavCollapsed);
  const handleLinkClick = () => setIsNavCollapsed(true);
  const handleInputChange = (value) => setInput(value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setShowNoProductsMessage(false);
    setIsLoading(true);
    setIsNavCollapsed(true);
    setCatOpen(false);
    try {
      const response = await axios.get(`${baseUrl}/api/products/search?keyword=${input}`);
      setSearchResults(response.data);
      if (response.data.length === 0) {
        setNoResults(true);
        setShowNoProductsMessage(true);
      } else {
        navigate(`/search-results`, { state: { searchData: response.data } });
      }
    } catch (error) {
      console.error("Error searching:", error);
      setShowNoProductsMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
    setIsNavCollapsed(true);
    setCatOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => { document.body.className = theme; }, [theme]);

  const categories = ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  const isDark = theme === "dark-theme";

  return (
    <>
      <style>{styles}</style>

      {/* ── No results pill ── */}
      {showNoProductsMessage && (
        <div className="no-results-pill">
          <div className="no-results-dot" />
          No products found for "{input}"
        </div>
      )}

      <nav className="nav-shell" ref={navbarRef}>
        {/* Brand */}
        <a className="nav-brand" href="/">
          Telu<em>sko</em>
        </a>

        <div className="nav-divider" />

        {/* Desktop links */}
        <ul className="nav-links">
          <li>
            <a href="/" className="active" onClick={handleLinkClick}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Home
            </a>
          </li>
          <li>
            <a href="/add_product" onClick={handleLinkClick}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Product
            </a>
          </li>
          <li>
            <a href="/orders" onClick={handleLinkClick}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Orders
            </a>
          </li>
        </ul>

        {/* Category dropdown */}
        <div className="cat-pill" ref={catRef}>
          <button
            className={`cat-pill-btn ${catOpen ? 'open' : ''}`}
            onClick={() => setCatOpen(!catOpen)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            {selectedCategory || 'Categories'}
            <svg className="cat-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          <div className={`cat-dropdown ${catOpen ? 'show' : ''}`}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-item ${selectedCategory === cat ? 'selected' : ''}`}
                onClick={() => handleCategorySelect(cat)}
              >
                <span className="cat-dot" />
                {cat}
              </button>
            ))}
            {selectedCategory && (
              <div className="cat-reset">
                <button className="cat-item" onClick={() => handleCategorySelect("")}>
                  <span className="cat-dot" />
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="nav-right">
          {/* Cart */}
          <a href="/cart" className="nav-cart" onClick={handleLinkClick}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Cart
          </a>

          {/* Theme toggle */}
          <button className="theme-btn" onClick={toggleTheme} title="Toggle theme">
            {isDark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Search */}
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              className="search-input"
              type="search"
              placeholder="Search products…"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <button className="search-btn" type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="search-spinner" />
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              )}
            </button>
          </form>

          {/* Mobile hamburger */}
          <button className="mobile-toggle" onClick={handleNavbarToggle} aria-label="Toggle menu">
            {isNavCollapsed ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <div className={`mobile-drawer ${!isNavCollapsed ? 'open' : ''}`}>
        <a href="/" className="mobile-link" onClick={handleLinkClick}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Home
        </a>
        <a href="/add_product" className="mobile-link" onClick={handleLinkClick}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Product
        </a>
        <a href="/orders" className="mobile-link" onClick={handleLinkClick}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          Orders
        </a>
        <a href="/cart" className="mobile-link" onClick={handleLinkClick}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Cart
        </a>

        <div className="mobile-cats-label">Browse by Category</div>
        <div className="mobile-cat-grid">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`mobile-cat-item ${selectedCategory === cat ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        {selectedCategory && (
          <button
            className="mobile-cat-item"
            style={{ width: '100%', color: 'var(--muted)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}
            onClick={() => handleCategorySelect("")}
          >
            Clear filter
          </button>
        )}

        <div className="mobile-search-form" style={{ marginTop: 4 }}>
          <input
            className="mobile-search-input"
            type="search"
            placeholder="Search products…"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          />
          <button
            className="mobile-search-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? '…' : 'Go'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;