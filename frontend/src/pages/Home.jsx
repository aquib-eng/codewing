import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const data = Array.isArray(res.data) ? res.data : res.data.products;
        setProducts(data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart", { productId: product._id, quantity: 1 });
      setMessage({ type: "success", text: `${product.name} added to cart!` });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Could not add to cart.",
      });
    }

    setTimeout(() => setMessage({ type: "", text: "" }), 2500);
  };

  return (
    <div style={styles.page}>
      <h2>Products</h2>

      {message.text && (
        <p style={message.type === "success" ? styles.success : styles.error}>
          {message.text}
        </p>
      )}

      {loading && <p>Loading products...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {!loading && !error && products.length === 0 && <p>No products found.</p>}

      <div style={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
  },
  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "8px",
    borderRadius: "4px",
  },
  success: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "8px",
    borderRadius: "4px",
  },
};

export default Home;