import React, { useState, useContext } from 'react';
import '../styles/Header.css';
import { useFavorites } from '../store/FavoritesContext';
import { CartContext } from '../store/CartContext';
import { Link } from 'react-router-dom';
import productsData from '../data/products'; // Import your products data

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [authVisible, setAuthVisible] = useState(false); // State to toggle Auth modal
  const { favorites } = useFavorites();
  const { cart } = useContext(CartContext);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const filteredProducts = productsData.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log('Filtered Products:', filteredProducts);
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const toggleAuthModal = () => setAuthVisible((prev) => !prev);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">E-Commerce Store</Link>
        </div>
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>
        <nav className="nav-menu">
          <Link to="/products">Products</Link>
          <div className="dropdown" onClick={toggleDropdown}>
            <button>Popular Categories</button>
            {showDropdown && (
              <div className="dropdown-content">
                <Link to="/products/clothes">Clothes</Link>
                <Link to="/products/headphones">Headphones</Link>
                <Link to="/products/shoes">Shoes</Link>
              </div>
            )}
          </div>
          <Link to="/favorites" className="favorites-link">
            <span className="icon">❤</span>
            <span className="favorites-count">{favorites.length}</span>
          </Link>
          <Link to="/cart" className="cart-link">
            <span className="icon">🛒</span>
            <span className="cart-count">{cart.length}</span>
          </Link>
          <Link to="/login" className="user-link">
            <span className="icon">👤</span>
          </Link>
        </nav>
      </div>
      {authVisible && <></>}
    </header>
  );
}

export default Header;
