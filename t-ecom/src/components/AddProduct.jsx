import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    --error: #c94b2b;
    --input-focus: #0d0d0d;
  }

  .add-product-wrapper {
    background: var(--cream);
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    padding-top: 62px;
  }

  /* ── HEADER ── */
  .ap-header {
    background: var(--ink);
    padding: 52px 48px 40px;
    position: relative;
    overflow: hidden;
  }
  .ap-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      -45deg,
      transparent, transparent 40px,
      rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 80px
    );
  }
  .ap-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 12px;
  }
  .ap-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(30px, 5vw, 56px);
    font-weight: 900;
    color: var(--cream);
    line-height: 0.95;
    margin: 0;
  }
  .ap-title em {
    font-style: italic;
    color: var(--gold);
  }
  .ap-ghost {
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

  /* ── FORM SHELL ── */
  .ap-body {
    padding: 48px;
    max-width: 900px;
  }

  .ap-section-label {
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
  .ap-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* ── FIELD GROUP ── */
  .ap-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 28px;
    margin-bottom: 32px;
  }
  .ap-grid.three {
    grid-template-columns: 1fr 1fr 1fr;
  }
  .ap-grid.full {
    grid-template-columns: 1fr;
  }

  .ap-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ap-field.span2 {
    grid-column: span 2;
  }

  .ap-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink);
  }

  .ap-input,
  .ap-textarea,
  .ap-select {
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
  .ap-input:focus,
  .ap-textarea:focus,
  .ap-select:focus {
    border-color: var(--ink);
    box-shadow: 0 0 0 3px rgba(13,13,13,0.06);
  }
  .ap-input.has-error,
  .ap-textarea.has-error,
  .ap-select.has-error {
    border-color: var(--error);
  }
  .ap-textarea {
    resize: vertical;
    min-height: 96px;
  }
  .ap-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230d0d0d' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 36px;
    cursor: pointer;
  }

  .ap-error {
    font-size: 11px;
    color: var(--error);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .ap-error::before {
    content: '!';
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--error);
    color: white;
    font-size: 9px;
    font-weight: 800;
    flex-shrink: 0;
  }

  /* ── TOGGLE (availability) ── */
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
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    transition: transform 0.25s cubic-bezier(0.23,1,0.32,1);
  }
  .toggle-track.on .toggle-thumb { transform: translateX(18px); }
  .toggle-label-text {
    font-size: 13px;
    font-weight: 500;
    color: var(--ink);
  }
  .toggle-status {
    margin-left: auto;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .toggle-track.on + * + .toggle-status { color: var(--sage); }

  /* ── IMAGE UPLOAD ── */
  .image-upload-zone {
    border: 1.5px dashed var(--border);
    border-radius: 4px;
    background: var(--card-bg);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    overflow: hidden;
    position: relative;
  }
  .image-upload-zone:hover,
  .image-upload-zone.dragover {
    border-color: var(--ink);
    background: #faf8f4;
  }
  .image-upload-zone.has-error { border-color: var(--error); }
  .image-upload-zone input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
  .upload-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 40px 20px;
    text-align: center;
  }
  .upload-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid var(--border);
  }
  .upload-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--ink);
  }
  .upload-hint {
    font-size: 11px;
    color: var(--muted);
    line-height: 1.5;
  }
  .upload-with-preview {
    display: grid;
    grid-template-columns: 140px 1fr;
    align-items: center;
    gap: 0;
  }
  .preview-img {
    width: 140px;
    height: 140px;
    object-fit: cover;
    display: block;
  }
  .preview-meta {
    padding: 20px 24px;
  }
  .preview-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--ink);
    margin-bottom: 4px;
    word-break: break-all;
  }
  .preview-size {
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 14px;
  }
  .preview-change {
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
  .preview-change:hover { color: var(--rust); }

  /* ── SUBMIT ── */
  .submit-row {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    padding-top: 8px;
    border-top: 1px solid var(--border);
    margin-top: 12px;
  }
  .btn-cancel {
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
  .btn-cancel:hover { border-color: var(--ink); color: var(--ink); }

  .btn-submit {
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
    min-width: 150px;
    justify-content: center;
  }
  .btn-submit:hover:not(:disabled) {
    background: var(--rust);
    transform: translateY(-1px);
  }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(245,240,232,0.3);
    border-top-color: var(--cream);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 700px) {
    .ap-header { padding: 40px 20px 32px; }
    .ap-body { padding: 28px 16px; }
    .ap-grid, .ap-grid.three { grid-template-columns: 1fr; }
    .ap-field.span2 { grid-column: span 1; }
    .upload-with-preview { grid-template-columns: 100px 1fr; }
    .preview-img { width: 100px; height: 100px; }
    .ap-ghost { display: none; }
  }
`;

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });

  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setProduct({ ...product, [name]: fieldValue });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: "Please select a valid image file (JPEG or PNG)" });
      } else if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
      } else {
        setErrors({ ...errors, image: null });
      }
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = "Product name is required";
    if (!product.brand.trim()) newErrors.brand = "Brand is required";
    if (!product.description.trim()) newErrors.description = "Description is required";
    if (!product.price || parseFloat(product.price) <= 0) newErrors.price = "Price must be greater than zero";
    if (!product.category) newErrors.category = "Please select a category";
    if (!product.stockQuantity || parseInt(product.stockQuantity) < 0) newErrors.stockQuantity = "Stock quantity cannot be negative";
    if (!product.releaseDate) newErrors.releaseDate = "Release date is required";
    if (!image) newErrors.image = "Product image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
    if (!validateForm() || !form.checkValidity()) {
      event.stopPropagation();
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));

    axios
      .post(`${baseUrl}/api/product`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        toast.success("Product added successfully");
        setProduct({ name: "", brand: "", description: "", price: "", category: "", stockQuantity: "", releaseDate: "", productAvailable: false });
        setImage(null);
        setImagePreview(null);
        setValidated(false);
        setErrors({});
        navigate("/");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        } else {
          toast.error("Error adding product");
        }
        setLoading(false);
      });
  };

  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="add-product-wrapper">
        {/* ── Header ── */}
        <div className="ap-header">
          <div className="ap-eyebrow">Inventory · Add New</div>
          <h1 className="ap-title">List a <em>new</em><br />product</h1>
          <div className="ap-ghost">+</div>
        </div>

        {/* ── Form ── */}
        <div className="ap-body">
          <form noValidate onSubmit={submitHandler}>

            {/* Basic Info */}
            <div className="ap-section-label">Basic Information</div>
            <div className="ap-grid" style={{ marginBottom: 32 }}>
              <div className="ap-field">
                <label className="ap-label">Product Name</label>
                <input
                  type="text"
                  name="name"
                  className={`ap-input ${errors.name ? 'has-error' : ''}`}
                  value={product.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Wireless Headphones"
                />
                {errors.name && <span className="ap-error">{errors.name}</span>}
              </div>

              <div className="ap-field">
                <label className="ap-label">Brand</label>
                <input
                  type="text"
                  name="brand"
                  className={`ap-input ${errors.brand ? 'has-error' : ''}`}
                  value={product.brand}
                  onChange={handleInputChange}
                  placeholder="e.g. Sony"
                />
                {errors.brand && <span className="ap-error">{errors.brand}</span>}
              </div>

              <div className="ap-field span2">
                <label className="ap-label">Description</label>
                <textarea
                  name="description"
                  className={`ap-textarea ${errors.description ? 'has-error' : ''}`}
                  value={product.description}
                  onChange={handleInputChange}
                  placeholder="Describe the product — features, specifications, what makes it great..."
                />
                {errors.description && <span className="ap-error">{errors.description}</span>}
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="ap-section-label">Pricing & Inventory</div>
            <div className="ap-grid three" style={{ marginBottom: 32 }}>
              <div className="ap-field">
                <label className="ap-label">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  className={`ap-input ${errors.price ? 'has-error' : ''}`}
                  value={product.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                />
                {errors.price && <span className="ap-error">{errors.price}</span>}
              </div>

              <div className="ap-field">
                <label className="ap-label">Category</label>
                <select
                  className={`ap-select ${errors.category ? 'has-error' : ''}`}
                  value={product.category}
                  onChange={handleInputChange}
                  name="category"
                >
                  <option value="">Select category</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Headphone">Headphone</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Toys">Toys</option>
                  <option value="Fashion">Fashion</option>
                </select>
                {errors.category && <span className="ap-error">{errors.category}</span>}
              </div>

              <div className="ap-field">
                <label className="ap-label">Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  className={`ap-input ${errors.stockQuantity ? 'has-error' : ''}`}
                  value={product.stockQuantity}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
                {errors.stockQuantity && <span className="ap-error">{errors.stockQuantity}</span>}
              </div>
            </div>

            {/* Availability & Date */}
            <div className="ap-section-label">Availability</div>
            <div className="ap-grid" style={{ marginBottom: 32 }}>
              <div className="ap-field">
                <label className="ap-label">Release Date</label>
                <input
                  type="date"
                  name="releaseDate"
                  className={`ap-input ${errors.releaseDate ? 'has-error' : ''}`}
                  value={product.releaseDate}
                  onChange={handleInputChange}
                />
                {errors.releaseDate && <span className="ap-error">{errors.releaseDate}</span>}
              </div>

              <div className="ap-field">
                <label className="ap-label">Product Status</label>
                <div
                  className="toggle-row"
                  onClick={() => setProduct({ ...product, productAvailable: !product.productAvailable })}
                >
                  <div className={`toggle-track ${product.productAvailable ? 'on' : ''}`}>
                    <div className="toggle-thumb" />
                  </div>
                  <span className="toggle-label-text">Mark as Available</span>
                  <span className="toggle-status" style={{ color: product.productAvailable ? 'var(--sage)' : 'var(--muted)' }}>
                    {product.productAvailable ? 'Live' : 'Hidden'}
                  </span>
                </div>
                {/* hidden checkbox for form compatibility */}
                <input
                  type="checkbox"
                  name="productAvailable"
                  checked={product.productAvailable}
                  onChange={handleInputChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="ap-section-label">Product Image</div>
            <div className="ap-field" style={{ marginBottom: 36 }}>
              <div className={`image-upload-zone ${errors.image ? 'has-error' : ''}`}>
                <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} />
                {imagePreview && image ? (
                  <div className="upload-with-preview">
                    <img src={imagePreview} alt="Preview" className="preview-img" />
                    <div className="preview-meta">
                      <div className="preview-name">{image.name}</div>
                      <div className="preview-size">{formatBytes(image.size)}</div>
                      <button type="button" className="preview-change">Change image</button>
                    </div>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                      </svg>
                    </div>
                    <div className="upload-title">Drop image here or click to browse</div>
                    <div className="upload-hint">JPEG or PNG · Max 5 MB</div>
                  </div>
                )}
              </div>
              {errors.image && <span className="ap-error">{errors.image}</span>}
            </div>

            {/* Submit */}
            <div className="submit-row">
              <button type="button" className="btn-cancel" onClick={() => navigate("/")}>
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" />
                    Adding…
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Product
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

export default AddProduct;