import React, { useState } from 'react';
import { Edit, Trash2, Eye, Power, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import './UserManagementPage.css';

// Mock data
const mockUsers = [
  {
    id: '001',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
    registrationDate: '2024-02-15',
  },
  {
    id: '002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'Suspended',
    registrationDate: '2024-02-14',
  },
  {
    id: '003',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Editor',
    status: 'Deactivated',
    registrationDate: '2024-02-13',
  },
];

const UserManagementPage = () => {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedUsers(checked ? users.map(user => user.id) : []);
  };

  const handleBulkAction = (action) => {
    if (!action) return;
    
    switch (action) {
      case 'suspend':
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'Suspended' } : user
        ));
        break;
      case 'activate':
        setUsers(prev => prev.map(user => 
          selectedUsers.includes(user.id) ? { ...user, status: 'Active' } : user
        ));
        break;
      case 'delete':
        setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
        break;
      case 'changeRole':
        // Implement role change logic
        break;
    }
  };

  const handleEditUser = (updatedUser) => {
    setUsers(prev =>
      prev.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
    setEditingUser(null);
  };

  const handleDeleteUser = () => {
    setUsers(prev => prev.filter(user => user.id !== deletingUser.id));
    setDeletingUser(null);
  };

  const handleToggleStatus = (user) => {
    const statusFlow = ['Active', 'Suspended', 'Deactivated'];
    const currentIndex = statusFlow.indexOf(user.status);
    const nextStatus = statusFlow[(currentIndex + 1) % statusFlow.length];

    setUsers(prev =>
      prev.map(u => u.id === user.id ? { ...u, status: nextStatus } : u)
    );
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Suspended': return 'status-suspended';
      case 'Deactivated': return 'status-deactivated';
      default: return '';
    }
  };

  return (
    <div className="user-management">
      <div className="admin-links">
        <Link to="/admin/products" className="admin-link">Manage Products</Link>
        <Link to="/admin/orders" className="admin-link">Manage Orders</Link>
        <Link to="/admin" className="admin-link">Admin Dashboard </Link>
      </div>
      <div className="user-management__content">
        <h1 className="user-management__title">User Management</h1>
        
        <div className="user-management__controls">
          <div className="search-bar">
            <div className="search-bar__icon">
              <Search size={20} />
            </div>
            <input
              type="text"
              className="search-bar__input"
              placeholder="Search users by name, email, or role..."
              onChange={handleSearch}
            />
          </div>

          {selectedUsers.length > 0 && (
            <div className="bulk-actions">
              <span className="bulk-actions__count">
                {selectedUsers.length} users selected
              </span>
              <select
                className="bulk-actions__select"
                onChange={(e) => handleBulkAction(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Bulk Actions</option>
                <option value="suspend">Suspend Selected</option>
                <option value="activate">Activate Selected</option>
                <option value="delete">Delete Selected</option>
                <option value="changeRole">Change Role</option>
              </select>
            </div>
          )}
        </div>

        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={selectedUsers.length === users.length && users.length > 0}
                  />
                </th>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </td>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="role-badge">{user.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.registrationDate}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="action-button edit"
                        title="Edit user"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setViewingUser(user)}
                        className="action-button view"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="action-button toggle"
                        title="Toggle status"
                      >
                        <Power size={16} />
                      </button>
                      <button
                        onClick={() => setDeletingUser(user)}
                        className="action-button delete"
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        {editingUser && (
          <div className="modal">
            <div className="modal__content">
              <h2>Edit User</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleEditUser(editingUser);
              }}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      name: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      email: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      role: e.target.value
                    })}
                  >
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Editor">Editor</option>
                  </select>
                </div>
                <div className="modal__actions">
                  <button type="button" onClick={() => setEditingUser(null)}>
                    Cancel
                  </button>
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {viewingUser && (
          <div className="modal">
            <div className="modal__content">
              <h2>User Details</h2>
              <div className="user-details">
                <p><strong>ID:</strong> {viewingUser.id}</p>
                <p><strong>Name:</strong> {viewingUser.name}</p>
                <p><strong>Email:</strong> {viewingUser.email}</p>
                <p><strong>Role:</strong> {viewingUser.role}</p>
                <p><strong>Status:</strong> {viewingUser.status}</p>
                <p><strong>Registration Date:</strong> {viewingUser.registrationDate}</p>
              </div>
              <div className="modal__actions">
                <button onClick={() => setViewingUser(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {deletingUser && (
          <div className="modal">
            <div className="modal__content">
              <h2>Delete User</h2>
              <p>Are you sure you want to delete user "{deletingUser.name}"?</p>
              <div className="modal__actions">
                <button onClick={() => setDeletingUser(null)}>Cancel</button>
                <button onClick={handleDeleteUser} className="delete">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;