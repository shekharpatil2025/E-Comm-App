import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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

  .up-wrapper {
    background: var(--cream);
    min-height: 100vh;
    padding-top: var(--nav-height);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── HEADER ── */
  .up-header {
    background: var(--ink);
    padding: 52px 48px 40px;
    position: relative;
    overflow: hidden;
  }
  .up-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg, transparent, transparent 40px,
      rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 80px
    );
  }
  .up-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
    position: relative;
  }
  .up-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 4.5vw, 52px);
    font-weight: 900;
    color: var(--cream);
    line-height: 0.95;
    margin: 0;
    position: relative;
  }
  .up-title em { font-style: italic; color: var(--gold); }
  .up-ghost {
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

  /* ── PRODUCT CONTEXT STRIP ── */
  .up-context-strip {
    background: var(--card-bg);
    border-bottom: 1px solid var(--border);
    padding: 14px 48px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .up-context-img {
    width: 44px;
    height: 44px;
    border-radius: 3px;
    object-fit: cover;
    border: 1px solid var(--border);
    background: #f8f6f2;
    flex-shrink: 0;
  }
  .up-context-name {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--ink);
  }
  .up-context-id {
    font-size: 11px;
    color: var(--muted);
    margin-top: 1px;
  }
  .up-context-badge {
    margin-left: auto;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    background: rgba(212,168,83,0.1);
    border: 1px solid rgba(212,168,83,0.25);
    border-radius: 100px;
    padding: 4px 12px;
    flex-shrink: 0;
  }

  /* ── BODY ── */
  .up-body {
    padding: 40px 48px;
    max-width: 900px;
  }

  /* ── SECTION LABEL ── */
  .up-section-label {
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
  .up-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ── GRID ── */
  .up-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 28px;
    margin-bottom: 32px;
  }
  .up-grid.three { grid-template-columns: 1fr 1fr 1fr; }
  .up-field { display: flex; flex-direction: column; gap: 6px; }
  .up-field.span2 { grid-column: span 2; }

  .up-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink);
  }
  .up-input, .up-textarea, .up-select {
    background: var(--card-bg);
    border: 1.5px solid var(--border);
    border-radius: 3px;
    padding: 11px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    width: 100%;
  }
  .up-input:focus, .up-textarea:focus, .up-select:focus {
    border-color: var(--ink);
    box-shadow: 0 0 0 3px rgba(13,13,13,0.06);
  }
  .up-input.changed { border-color: var(--gold); }
  .up-textarea { resize: vertical; min-height: 96px; }
  .up-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230d0d0d' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
    cursor: pointer;
  }
  .up-hint {
    font-size: 11px;
    color: var(--muted);
    margin-top: 2px;
  }

  /* price prefix */
  .up-price-wrap { position: relative; }
  .up-price-prefix {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: var(--muted);
    pointer-events: none;
    font-weight: 500;
  }
  .up-price-wrap .up-input { padding-left: 28px; }

  /* ── TOGGLE ── */
  .toggle-row {
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--card-bg);
    border: 1.5px solid var(--border);
    border-radius: 3px;
    padding: 12px 16px;
    cursor: pointer;
    transition: border-color 0.2s;
    user-select: none;
  }
  .toggle-row:hover { border-color: var(--ink); }
  .toggle-track {
    width: 40px;
    height: 22px;
    border-radius: 100px;
    background: #ddd;
    position: relative;
    flex-shrink: 0;
    transition: background 0.25s;
  }
  .toggle-track.on { background: var(--sage); }
  .toggle-thumb {
    position: absolute;
    top: 3px; left: 3px;
    width: 16px; height: 16px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    transition: transform 0.25s cubic-bezier(0.23,1,0.32,1);
  }
  .toggle-track.on .toggle-thumb { transform: translateX(18px); }
  .toggle-label-text { font-size: 13px; font-weight: 500; color: var(--ink); }
  .toggle-status {
    margin-left: auto;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* ── IMAGE UPLOAD ── */
  .up-image-zone {
    border: 1.5px dashed var(--border);
    border-radius: 4px;
    background: var(--card-bg);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    overflow: hidden;
    position: relative;
  }
  .up-image-zone:hover { border-color: var(--ink); background: #faf8f4; }
  .up-image-zone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  .up-image-with-preview {
    display: grid;
    grid-template-columns: 140px 1fr;
    align-items: center;
  }
  .up-preview-img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    display: block;
  }
  .up-preview-meta { padding: 20px 24px; }
  .up-preview-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--ink);
    margin-bottom: 4px;
    word-break: break-all;
  }
  .up-preview-sub { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
  .up-preview-change {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: underline;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
  }
  .up-preview-change:hover { color: var(--rust); }
  .up-upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 36px 20px;
    text-align: center;
  }
  .up-upload-icon {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: var(--cream);
    border: 1.5px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .up-upload-title { font-size: 13px; font-weight: 600; color: var(--ink); }
  .up-upload-hint { font-size: 11px; color: var(--muted); line-height: 1.5; }
  .up-changed-tag {
    position: absolute;
    top: 10px; right: 10px;
    background: var(--gold);
    color: var(--ink);
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 100px;
    z-index: 1;
    pointer-events: none;
  }

  /* ── SUBMIT ROW ── */
  .up-submit-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 8px;
    border-top: 1px solid var(--border);
    margin-top: 12px;
  }
  .up-btn-cancel {
    background: transparent;
    border: 1.5px solid var(--border);
    color: var(--muted);
    padding: 12px 28px;
    border-radius: 3px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
  }
  .up-btn-cancel:hover { border-color: var(--ink); color: var(--ink); }
  .up-btn-submit {
    background: var(--ink);
    border: none;
    color: var(--cream);
    padding: 13px 36px;
    border-radius: 3px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 160px;
    justify-content: center;
  }
  .up-btn-submit:hover:not(:disabled) {
    background: var(--gold);
    color: var(--ink);
    transform: translateY(-1px);
  }
  .up-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .up-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(245,240,232,0.25);
    border-top-color: var(--cream);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── LOADING ── */
  .up-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - var(--nav-height));
    gap: 16px;
    background: var(--cream);
  }
  .up-loading-ring {
    width: 36px; height: 36px;
    border: 2.5px solid var(--border);
    border-top-color: var(--ink);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  .up-loading-text {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  @media (max-width: 700px) {
    .up-header { padding: 40px 20px 32px; }
    .up-body { padding: 28px 16px; }
    .up-context-strip { padding: 12px 20px; }
    .up-grid, .up-grid.three { grid-template-columns: 1fr; }
    .up-field.span2 { grid-column: span 1; }
    .up-image-with-preview { grid-template-columns: 90px 1fr; }
    .up-preview-img { width: 90px; height: 90px; }
    .up-ghost { display: none; }
  }
`;

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [updateProduct, setUpdateProduct] = useState({
    id: null, name: "", description: "", brand: "",
    price: "", category: "", releaseDate: "",
    productAvailable: false, stockQuantity: "",
  });
  const [imageChanged, setImageChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/product/${id}`);
        setProduct(response.data);
        const responseImage = await axios.get(`${baseUrl}/api/product/${id}/image`, { responseType: "blob" });
        const imageFile = await converUrlToFile(responseImage.data, response.data.imageName);
        setImage(imageFile);
        setImagePreviewUrl(URL.createObjectURL(responseImage.data));
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const converUrlToFile = async (blobData, fileName) => {
    return new File([blobData], fileName, { type: blobData.type });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const updatedProduct = new FormData();
    if (imageChanged && image) {
      updatedProduct.append("imageFile", image);
    } else {
      updatedProduct.append("imageFile", null);
    }
    updatedProduct.append("product", new Blob([JSON.stringify(updateProduct)], { type: "application/json" }));

    axios
      .put(`${baseUrl}/api/product/${id}`, updatedProduct, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => toast.success("Product updated successfully"))
      .catch(() => toast.error("Failed to update product. Please try again."))
      .finally(() => { setLoading(false); navigate('/'); });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({ ...updateProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      setImageChanged(true);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!product.id) {
    return (
      <>
        <style>{styles}</style>
        <div className="up-wrapper">
          <div className="up-loading">
            <div className="up-loading-ring" />
            <span className="up-loading-text">Loading product…</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="up-wrapper">

        {/* ── Header ── */}
        <div className="up-header">
          <div className="up-eyebrow">Inventory · Edit</div>
          <h1 className="up-title">Update <em>product</em></h1>
          <div className="up-ghost">✎</div>
        </div>

        {/* ── Context strip ── */}
        {imagePreviewUrl && (
          <div className="up-context-strip">
            <img className="up-context-img" src={imagePreviewUrl} alt={product.name} />
            <div>
              <div className="up-context-name">{product.name}</div>
              <div className="up-context-id">ID #{id} · {product.category}</div>
            </div>
            <span className="up-context-badge">Editing</span>
          </div>
        )}

        <div className="up-body">
          <form noValidate onSubmit={handleSubmit}>

            {/* ── Basic Info ── */}
            <div className="up-section-label">Basic Information</div>
            <div className="up-grid" style={{ marginBottom: 32 }}>
              <div className="up-field">
                <label className="up-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  className="up-input"
                  value={updateProduct.name}
                  onChange={handleChange}
                  placeholder={product.name}
                  required
                />
              </div>
              <div className="up-field">
                <label className="up-label">Brand</label>
                <input
                  type="text"
                  name="brand"
                  className="up-input"
                  value={updateProduct.brand}
                  onChange={handleChange}
                  placeholder={product.brand}
                  required
                />
              </div>
              <div className="up-field span2">
                <label className="up-label">Description</label>
                <textarea
                  name="description"
                  className="up-textarea"
                  value={updateProduct.description}
                  onChange={handleChange}
                  placeholder={product.description}
                  required
                />
              </div>
            </div>

            {/* ── Pricing & Inventory ── */}
            <div className="up-section-label">Pricing & Inventory</div>
            <div className="up-grid three" style={{ marginBottom: 32 }}>
              <div className="up-field">
                <label className="up-label">Price (₹)</label>
                <div className="up-price-wrap">
                  <span className="up-price-prefix">₹</span>
                  <input
                    type="number"
                    name="price"
                    className="up-input"
                    value={updateProduct.price}
                    onChange={handleChange}
                    placeholder={product.price}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="up-field">
                <label className="up-label">Category</label>
                <select
                  name="category"
                  className="up-select"
                  value={updateProduct.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Headphone">Headphone</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Toys">Toys</option>
                  <option value="Fashion">Fashion</option>
                </select>
              </div>
              <div className="up-field">
                <label className="up-label">Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  className="up-input"
                  value={updateProduct.stockQuantity}
                  onChange={handleChange}
                  placeholder={product.stockQuantity}
                  min="0"
                  required
                />
              </div>
            </div>

            {/* ── Availability ── */}
            <div className="up-section-label">Availability</div>
            <div className="up-grid" style={{ marginBottom: 32 }}>
              <div className="up-field">
                <label className="up-label">Release Date</label>
                <input
                  type="date"
                  name="releaseDate"
                  className="up-input"
                  value={updateProduct.releaseDate ? updateProduct.releaseDate.slice(0, 10) : ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="up-field">
                <label className="up-label">Product Status</label>
                <div
                  className="toggle-row"
                  onClick={() => setUpdateProduct({ ...updateProduct, productAvailable: !updateProduct.productAvailable })}
                >
                  <div className={`toggle-track ${updateProduct.productAvailable ? 'on' : ''}`}>
                    <div className="toggle-thumb" />
                  </div>
                  <span className="toggle-label-text">Mark as Available</span>
                  <span
                    className="toggle-status"
                    style={{ color: updateProduct.productAvailable ? 'var(--sage)' : 'var(--muted)' }}
                  >
                    {updateProduct.productAvailable ? 'Live' : 'Hidden'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  name="productAvailable"
                  checked={updateProduct.productAvailable}
                  onChange={(e) => setUpdateProduct({ ...updateProduct, productAvailable: e.target.checked })}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* ── Image ── */}
            <div className="up-section-label">Product Image</div>
            <div className="up-field" style={{ marginBottom: 36 }}>
              <div className="up-image-zone">
                <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} />
                {imageChanged && <div className="up-changed-tag">New Image</div>}
                {imagePreviewUrl ? (
                  <div className="up-image-with-preview">
                    <img src={imagePreviewUrl} alt="Preview" className="up-preview-img" />
                    <div className="up-preview-meta">
                      <div className="up-preview-name">{image?.name || product.imageName}</div>
                      <div className="up-preview-sub">
                        {imageChanged ? `${formatBytes(image?.size)} · New image selected` : 'Current image · click to replace'}
                      </div>
                      <button type="button" className="up-preview-change">Change image</button>
                    </div>
                  </div>
                ) : (
                  <div className="up-upload-placeholder">
                    <div className="up-upload-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 16 12 12 8 16"/>
                        <line x1="12" y1="12" x2="12" y2="21"/>
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                      </svg>
                    </div>
                    <div className="up-upload-title">Drop a new image or click to browse</div>
                    <div className="up-upload-hint">JPEG or PNG · Max 5 MB · Leave unchanged to keep current</div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="up-submit-row">
              <button type="button" className="up-btn-cancel" onClick={() => navigate('/')}>
                Cancel
              </button>
              <button type="submit" className="up-btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="up-spinner" />
                    Saving…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProduct;