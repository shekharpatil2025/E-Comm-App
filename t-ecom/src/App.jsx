import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";

// Context
import { AppProvider, AppContext } from "./Context/Context";

// Components
import Navbar from "./components/Navbar/Navbar";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/LoginPage";
import NotFound from "./pages/Login/NotFound";
import Register from "./pages/Register/RegisterPage";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import SearchResults from "./pages/Search/SearchResults";
import Order from "./pages/Orders/Order";
import AddProduct from "./pages/Admin/AddProduct";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";

// ── Must be logged in ──────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  return user ? children : <Navigate to="/login" replace />;
};

// ── Must be logged in AND have ADMIN role ──────────────
const AdminRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/unauthorized" replace />;
  return children;
};

// ── Already logged in → redirect to home ──────────────
const PublicOnlyRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  return user ? <Navigate to="/" replace /> : children;
};

// ── Simple 403 page shown to USER trying admin routes ─
const Unauthorized = () => (
  <div
    style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      gap: 12,
      textAlign: "center",
      padding: 24,
    }}
  >
    <div style={{ fontSize: 64 }}>🚫</div>
    <h2 style={{ fontWeight: 700, margin: 0 }}>Access Denied</h2>
    <p style={{ color: "#888", margin: 0 }}>
      You need <strong>ADMIN</strong> privileges to view this page.
    </p>
    <a
      href="/"
      style={{
        marginTop: 12,
        padding: "10px 24px",
        background: "#d4a853",
        color: "#0d0d0d",
        borderRadius: 4,
        fontWeight: 700,
        textDecoration: "none",
        fontSize: 13,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      Back to Home
    </a>
  </div>
);

function AppRoutes() {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <BrowserRouter>
      <ToastContainer autoClose={2000} hideProgressBar={true} />
      <Routes>
        {/* Public auth routes — no Navbar */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />

        {/* All other routes — with Navbar */}
        <Route
          path="*"
          element={
            <>
              <Navbar onSelectCategory={setSelectedCategory} />
              <div
                className="min-vh-100 bg-light"
                style={{ paddingTop: "62px" }}
              >
                <Routes>
                  {/* Public */}
                  <Route
                    path="/"
                    element={<Home selectedCategory={selectedCategory} />}
                  />
                  <Route path="/product" element={<Product />} />
                  <Route path="/product/:id" element={<Product />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/search-results" element={<SearchResults />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  {/* Logged in users only */}
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Order />
                      </ProtectedRoute>
                    }
                  />

                  {/* ADMIN only */}
                  <Route
                    path="/add_product"
                    element={
                      <AdminRoute>
                        <AddProduct />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/product/update/:id"
                    element={
                      <AdminRoute>
                        <UpdateProduct />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </div>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
