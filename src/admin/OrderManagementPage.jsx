import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './OrderManagementPage.css';

function OrderManagementPage() {
  const [orders, setOrders] = useState([
    { id: 1, customer: "John Doe", total: 59.97, status: "Pending" },
    { id: 2, customer: "Jane Smith", total: 39.99, status: "Shipped" },
    { id: 3, customer: "Bob Johnson", total: 79.98, status: "Delivered" },
  ]);

  const [search, setSearch] = useState('');

  const handleStatusChange = (id, newStatus) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(order => 
    order.customer.toLowerCase().includes(search.toLowerCase()) ||
    order.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="order-management-page">
      <div className="navigation">
        <Link to="/admin" className="admin-link">Admin Dashboard</Link>
        <Link to="/admin/products" className="admin-link">Product Management</Link>
        <Link to="/admin/orders" className="admin-link">Order Management</Link>
      </div>
      <h1>Order Management</h1>
      <input
        type="text"
        placeholder="Search orders by customer or status"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="order-search"
      />
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>
                <select 
                  value={order.status} 
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderManagementPage;
// chrome://media-engagement/