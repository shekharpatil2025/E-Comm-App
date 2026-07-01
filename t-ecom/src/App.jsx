import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

// Context
import { AppProvider, AppContext } from "./Context/Context";

// Components
import Navbar from "./components/Navbar/Navbar";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/LoginPage";
import Register from "./pages/Register/RegisterPage";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import SearchResults from "./pages/Search/SearchResults";
import Order from "./pages/Orders/Order";
import AddProduct from "./pages/Admin/AddProduct";
import UpdateProduct from "./pages/Admin/UpdateProduct";

// Redirects to /login if user is not logged in
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  return user ? children : <Navigate to="/login" replace />;
};

// Redirects to / if user is already logged in
const PublicOnlyRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  return user ? <Navigate to="/" replace /> : children;
};

function AppRoutes() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <BrowserRouter>
      <ToastContainer autoClose={2000} hideProgressBar={true} />

      <Routes>
        {/* Public Routes */}
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

        {/* All other routes */}
        <Route
          path="*"
          element={
            <>
              <Navbar onSelectCategory={handleCategorySelect} />

              <div
                className="min-vh-100 bg-light"
                style={{ paddingTop: "62px" }}
              >
                <Routes>
                  <Route
                    path="/"
                    element={<Home selectedCategory={selectedCategory} />}
                  />

                  <Route path="/product" element={<Product />} />
                  <Route path="/product/:id" element={<Product />} />

                  <Route path="/cart" element={<Cart />} />

                  <Route path="/search-results" element={<SearchResults />} />

                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Order />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/add_product"
                    element={
                      <ProtectedRoute>
                        <AddProduct />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/product/update/:id"
                    element={
                      <ProtectedRoute>
                        <UpdateProduct />
                      </ProtectedRoute>
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
