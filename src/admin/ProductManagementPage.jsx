import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductManagementPage.css';
import { ProductContext } from '../store/ProductContext';

function ProductManagementPage() {
  const navigate = useNavigate();
  const { products, addProduct, deleteProduct } = useContext(ProductContext);

  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (editingProduct) {
      addProduct({ ...newProduct, id: editingProduct.id });
      setEditingProduct(null);
    } else {
      addProduct({ ...newProduct, id: Date.now() });
    }

    setNewProduct({ name: '', price: '', description: '' });
  };

  const handleDeleteProduct = (id) => {
    deleteProduct(id); // Call the deleteProduct function from the context
  };

  const handleEditProduct = (product) => {
    setNewProduct({ name: product.name, price: product.price, description: product.description });
    setEditingProduct(product);
  };

  return (
    <div className="product-management-page">
      <h1>Product Management</h1>

      <div className="button-container">
        <button onClick={() => navigate('/admin/orders')}>Manage Orders</button>
        <button onClick={() => navigate('/admin')}>Admin Dashboard</button>
        <button onClick={() => navigate('/admin/users')}>Manage Users</button>
      </div>

      <form onSubmit={handleAddProduct} className="add-product-form">
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Price"
          required
        />
        <textarea
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        />
        <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
      </form>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${isNaN(product.price) ? 'N/A' : Number(product.price).toFixed(2)}</td>
              <td>{product.description}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditProduct(product)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductManagementPage;
