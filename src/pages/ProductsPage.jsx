import React, { useState, useEffect, useContext } from 'react';
import { fetchProducts } from '../api/api';  // Ensure this fetches your products
import '../styles/ProductsPage.css';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../store/CartContext';
import { useFavorites } from '../store/FavoritesContext'; // Correctly import the custom hook

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);  // Using CartContext to add items to the cart
  const { favorites, addFavorite, removeFavorite } = useFavorites(); // Use the custom hook to access favorites

  // Fetch products from API
  const getProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      setError('Failed to fetch products. Please try again later.');
    }
  };

  useEffect(() => {
    getProducts(); // Initial fetch

    const interval = setInterval(() => {
      getProducts(); // Fetch every 5 seconds
    }, 5000); // Adjust the interval as needed

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    refreshUserProducts(); // Call the function when the component mounts
  }, []);

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    addToCart(product);
  };
  const refreshUserProducts = async () => {
    try {
        const data = await fetchProducts(); // Fetch updated products
        setProducts(data); // Update state with new products
    } catch (error) {
        setError('Failed to refresh products. Please try again later.');
    }
};
  return (
    <div className="products-container">
      {error && <p>{error}</p>} {/* Display error if any */}
      {products.length > 0 ? (
        products.map(product => (
          <ProductCard key={product._id} product={product} addToCart={handleAddToCart} />
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
}

export default ProductsPage;