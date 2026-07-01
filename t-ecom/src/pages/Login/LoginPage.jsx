import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../../Context/Context";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .auth-page {
    min-height: 100vh;
    background: #0d0d0d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 24px;
  }
  .auth-card {
    background: #161616;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
    padding: 48px 44px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  }
  .auth-brand {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 900;
    color: #f5f0e8;
    text-decoration: none;
    display: block;
    margin-bottom: 32px;
  }
  .auth-brand em { font-style: italic; color: #d4a853; }
  .auth-title {
    font-size: 22px;
    font-weight: 600;
    color: #f5f0e8;
    margin-bottom: 6px;
  }
  .auth-sub {
    font-size: 13px;
    color: rgba(245,240,232,0.45);
    margin-bottom: 32px;
  }
  .auth-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(245,240,232,0.5);
    margin-bottom: 8px;
  }
  .auth-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 4px;
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #f5f0e8;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    box-sizing: border-box;
    margin-bottom: 20px;
  }
  .auth-input:focus {
    border-color: rgba(212,168,83,0.5);
    background: rgba(255,255,255,0.07);
  }
  .auth-input::placeholder { color: rgba(245,240,232,0.2); }
  .auth-btn {
    width: 100%;
    padding: 13px;
    background: #d4a853;
    color: #0d0d0d;
    border: none;
    border-radius: 4px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
    margin-top: 4px;
  }
  .auth-btn:hover { background: #e0b96a; }
  .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .auth-error {
    background: rgba(201,75,43,0.12);
    border: 1px solid rgba(201,75,43,0.3);
    color: #e07a5f;
    padding: 12px 16px;
    border-radius: 4px;
    font-size: 13px;
    margin-bottom: 20px;
  }
  .auth-footer {
    margin-top: 24px;
    text-align: center;
    font-size: 13px;
    color: rgba(245,240,232,0.4);
  }
  .auth-footer a {
    color: #d4a853;
    text-decoration: none;
    font-weight: 600;
  }
  .auth-footer a:hover { text-decoration: underline; }
`;

const Login = () => {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        <div className="auth-card">
          <a className="auth-brand" href="/">
            Telu<em>sko</em>
          </a>
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">Sign in to your account to continue</div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="auth-label">Username</label>
            <input
              className="auth-input"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
