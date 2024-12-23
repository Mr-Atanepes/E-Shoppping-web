import React from 'react';
import { useFavorites } from '../store/FavoritesContext';
import { Link } from 'react-router-dom';
import '../styles/FavoritesPage.css'; 

const NavBar = () => (
  <nav>
    <Link to="/favorites" style={{ display: 'none' }}>Favorites</Link> {/* Hide the text */}
  </nav>
);

const FavoritesPage = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="favorites-page"> 
      <NavBar />
      <h2>Your Favorites</h2>
      {favorites.length === 0 ? (
        <p className="empty-state">No favorites added yet.</p> 
      ) : (
        favorites.map((product) => (
          <div key={product.id} className="favorite-item"> 
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <img src={product.imageUrl} alt={product.name} className="favorite-item-image" />
            <button className="remove-favorite-button" onClick={() => removeFavorite(product.id)}>Remove from Favorites</button>
            <p>Category: {product.category}</p>
            <p>Brand: {product.brand}</p>
            <p>Rating: {product.rating}/5</p>
          </div>
        ))
      )}
    </div>
  );
};

export { NavBar };
export default FavoritesPage;