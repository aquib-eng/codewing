import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const getProduct = (item) => item.product || item.productId || {};

  const loadCart = async () => {
    try {
  
      const res = await api.get("/cart");
      const cartItems = res.data.items || res.data.cart?.items || [];
      setItems(cartItems);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    loadCart();
   
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      
      await api.put(`/cart/${productId}`, { quantity: newQuantity });
      loadCart();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update quantity.");
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete(`/cart/${productId}`);
      loadCart();
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove item.");
    }
  };

  const total = items.reduce(
    (sum, item) => sum + (getProduct(item).price || 0) * item.quantity,
    0
  );

  return (
    <div style={styles.page}>
      <h2>Your Cart</h2>

      {loading && <p>Loading cart...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p>
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </p>
      )}

      {items.map((item) => {
        const product = getProduct(item);
        return (
          <div key={product._id} style={styles.row}>
            <img
              src={product.image || "https://via.placeholder.com/80"}
              alt={product.name}
              style={styles.image}
            />

            <div style={styles.info}>
              <h4 style={{ margin: 0 }}>{product.name}</h4>
              <p style={{ margin: "4px 0" }}>₹{product.price}</p>
            </div>

            <div style={styles.qty}>
              <button
                onClick={() => updateQuantity(product._id, item.quantity - 1)}
                style={styles.qtyBtn}
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(product._id, item.quantity + 1)}
                style={styles.qtyBtn}
              >
                +
              </button>
            </div>

            <p style={styles.subtotal}>₹{(product.price || 0) * item.quantity}</p>

            <button onClick={() => removeItem(product._id)} style={styles.remove}>
              Remove
            </button>
          </div>
        );
      })}

      {items.length > 0 && <h3 style={styles.total}>Total: ₹{total}</h3>}
    </div>
  );
}

const styles = {
  page: {
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    background: "#f3f4f6",
    minHeight: "calc(100vh - 60px)",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    background: "#fff",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    marginBottom: "12px",
  },
  image: { width: "80px", height: "80px", objectFit: "cover", borderRadius: "6px" },
  info: { flex: 1 },
  qty: { display: "flex", alignItems: "center", gap: "10px" },
  qtyBtn: {
    width: "28px",
    height: "28px",
    border: "1px solid #ccc",
    background: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  subtotal: { fontWeight: "bold", width: "80px", textAlign: "right" },
  remove: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  total: { textAlign: "right" },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "8px",
    borderRadius: "4px",
  },
};

export default Cart;