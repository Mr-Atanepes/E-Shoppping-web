import React from 'react';
import './ProductModal.css'; // Create a CSS file for styling

const ProductModal = ({ product, onClose }) => {
  if (!product) return null; // If no product, return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>{product.name}</h2>
        <img src={product.image} alt={product.name} />
        <p>Price: ${product.price.toFixed(2)}</p>
        <p>Description: {product.description}</p>
        <p>Rating: {product.rating}</p>
      </div>
    </div>
  );
};

export default ProductModal;
