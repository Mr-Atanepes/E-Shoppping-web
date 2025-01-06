import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductManagementPage.css';
import { ProductContext } from '../store/ProductContext';
import { createProduct, updateProduct, deleteProduct, fetchProducts } from '../api/api'; // Ensure all functions are imported

function ProductManagementPage() {
    const navigate = useNavigate();
    const { products, setProducts } = useContext(ProductContext); // Ensure setProducts is available
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [error, setError] = useState(null); // State for error handling

    // Function to create a product
    const handleCreateProduct = async (productData) => {
        try {
            await createProduct(productData); // Call the create function
            refreshUserProducts(); // Refresh the user products after creation
        } catch (error) {
            setError('Failed to create product. Please try again later.');
        }
    };

    // Function to refresh user products
    const refreshUserProducts = async () => {
        try {
            const data = await fetchProducts(); // Fetch updated products
            setProducts(data); // Update state with new products
        } catch (error) {
            setError('Failed to refresh products. Please try again later.');
        }
    };

    // Handle form submission for creating/updating a product
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (editingProduct) {
            await handleUpdateProduct(editingProduct._id, newProduct); // Update existing product
            setEditingProduct(null); // Reset editing state
        } else {
            await handleCreateProduct(newProduct); // Create new product
        }
        setNewProduct({ name: '', price: '', description: '' }); // Reset form fields
    };

    // Handle input change
    const handleInputChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    // Handle editing a product
    const handleEditProduct = (product) => {
        setNewProduct({ name: product.name, price: product.price, description: product.description });
        setEditingProduct(product);
    };

    // Handle updating a product
    const handleUpdateProduct = async (id, productData) => {
        try {
            await updateProduct(id, productData); // Call the update function
            refreshUserProducts();
}
catch(err){
  console.log(err)
};

const handleDeleteProduct = async (id) => {
  await deleteProduct(id);
  refreshUserProducts(); // Refresh after deleting
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
}
export default ProductManagementPage;
