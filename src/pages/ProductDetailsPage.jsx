import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetailsPage.css';

function ProductDetailsPage() {
  const { id } = useParams();
  // Fetch product data dynamically (this is still mock data for now)
  const product = {
    id: id,
    name: "Sample Product",
    price: 99.99,
    description: "This is a sample product description.",
    image: "https://via.placeholder.com/400"
  };

  const [cart, setCart] = useState([]);

  const handleAddToCart = () => {
    setCart([...cart, product]);
    alert("Product added to cart");
  };

  return (
    <div className="product-details-page">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="price">${product.price.toFixed(2)}</p>
        <p className="description">{product.description}</p>
        <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
