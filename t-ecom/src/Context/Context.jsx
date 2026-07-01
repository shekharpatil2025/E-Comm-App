import API from "../axios";
import { useState, useEffect, createContext } from "react";

export const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  user: null,
  token: null,
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData: () => {},
  updateStockQuantity: (productId, newQuantity) => {},
  clearCart: () => {},
  login: async (credentials) => {},
  register: async (userData) => {},
  logout: () => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || [],
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // ── Auth ──────────────────────────────────────────────
  const register = async (userData) => {
    const response = await API.post("/api/auth/register", userData);
    const { token, username, role } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ username, role }));
    setToken(token);
    setUser({ username, role });
    return response.data;
  };

  const login = async (credentials) => {
    const response = await API.post("/api/auth/login", credentials);
    const { token, username, role } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ username, role }));
    setToken(token);
    setUser({ username, role });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setToken(null);
    setUser(null);
    setCart([]);
  };

  // ── Cart ──────────────────────────────────────────────
  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.id === product.id,
    );
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const { imageData, ...productWithoutImage } = product;
      const updatedCart = [...cart, { ...productWithoutImage, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // ── Products ─────────────────────────────────────────
  const refreshData = async () => {
    try {
      const response = await API.get("/api/products");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        user,
        token,
        addToCart,
        removeFromCart,
        refreshData,
        clearCart,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
