import React, { useState, useEffect, useContext } from 'react';
import { fetchProducts } from '../api/api';  // Ensure this fetches your products
import '../styles/ProductsPage.css';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../store/CartContext';
import { useFavorites } from '../store/FavoritesContext'; // Correctly import the custom hook




function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const { addToCart } = useContext(CartContext);  // Using CartContext to add items to the cart
  const { favorites, addFavorite, removeFavorite } = useFavorites(); // Use the custom hook to access favorites

  // Fetch products from API
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        setError(error);
      }
    };
    getProducts();
  }, []);

  // Handle image upload (for the admin or a feature allowing image uploads)
  const handleImageUpload = async (event) => {
    const formData = new FormData();
    formData.append('image', event.target.files[0]);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      setImageUrl(result.filePath); // Assuming backend sends image URL
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    addToCart(product);  // This will now allow the same product to be added multiple times
  };

  return (
    <div className="products-page">
      <h1>Our Products</h1>

      {/* Image Upload Section (Optional, could be part of admin functionality) */}
      <div className="upload-section">
        <h3>Upload Product Image</h3>
        <input type="file" onChange={handleImageUpload} />
        {imageUrl && <img src={`http://localhost:5000${imageUrl}`} alt="Uploaded" />}
      </div>

      {/* Error Handling */}
      {error && <div>Error fetching products: {error.message}</div>}

      {/* Display Products */}
      <div className="product-grid">
        <table>
          <thead>
            <tr>
              <th>Product surname</th>
              <th>Descriptions</th>
              <th>Price</th>
              <th>Ratings</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsPage;
