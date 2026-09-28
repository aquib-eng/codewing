function ProductCard({ product, onAddToCart }) {
  return (
    <div style={styles.card}>
      <img
        src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
        alt={product.name}
        style={styles.image}
      />

      <h3 style={styles.name}>{product.name}</h3>
      <p style={styles.description}>{product.description}</p>
      <p style={styles.price}>₹{product.price}</p>

    
      {onAddToCart && (
        <button onClick={() => onAddToCart(product)} style={styles.button}>
          Add to Cart
        </button>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  name: {
    margin: "12px 0 4px",
  },
  description: {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0 0 8px",
  },
  price: {
    fontWeight: "bold",
    fontSize: "18px",
    margin: "0 0 12px",
  },
  button: {
    marginTop: "auto",
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ProductCard;