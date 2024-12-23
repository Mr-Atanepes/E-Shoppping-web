import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import { ProductContext } from '../store/ProductContext'; // Correct import for ProductContext

const AdminDashboard = () => {
  const { products, setProducts } = useContext(ProductContext); // Use context for products and setProducts
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddProduct = (e) => {
    e.preventDefault();

    // Validation
    if (!name || !price || !description) {
      setError('All fields are required');
      return;
    }
    if (price <= 0) {
      setError('Price must be a positive number');
      return;
    }

    const newProduct = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      description,
    };

    setProducts([...products, newProduct]);

    // Clear the form and reset error/success
    setName('');
    setPrice('');
    setDescription('');
    setError('');
    setSuccessMessage('Product added successfully');
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Navigation Links */}
      <div className="admin-links">
        <Link to="/admin/products" className="admin-link">Manage Products</Link>
        <Link to="/admin/orders" className="admin-link">Manage Orders</Link>
        <Link to="/admin/users" className="admin-link">Manage Users</Link>
      </div>

      {/* Stats Section */}
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p>{products.length}</p> {/* Dynamic product count */}
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>50</p> {/* Static order count */}
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p>${products.reduce((total, product) => total + product.price, 0).toFixed(2)}</p> {/* Dynamic revenue calculation */}
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Success Message */}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {/* Add Product Form */}
     
      {/* Current Products List */}
      {/* <h3>Current Products</h3> */}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price} - {product.description}
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
