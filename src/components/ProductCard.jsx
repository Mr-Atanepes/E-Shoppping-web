import React from 'react';
import { useFavorites } from '../store/FavoritesContext'; 
import { useDispatch } from 'react-redux';
import { toggleStatusTab } from '../actions/cart';
import './ProductCard.css';
const ProductCard = ({ product }) => {
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const dispatch = useDispatch();
    
    const isFavorite = favorites.some(fav => fav.id === product.id);
    
    const handleAddToCart = () => {
        dispatch(toggleStatusTab({
            productId: product.id,
            quantity: 1
        }));
    };

    const handleToggleFavorite = () => {
        if (isFavorite) {
            removeFavorite(product.id);
        } else {
            addFavorite(product);
        }
    };

    return (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <div className="product-actions">
               
            <button 
                    className={isFavorite ? "remove-fav-btn" : "add-fav-btn"}
                    onClick={handleToggleFavorite}
                    aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                >
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </button>
                <button 
                    className="btn add-to-cart-btn" 
                    onClick={handleAddToCart}
                    aria-label="Add to production">
                    Add to Ass
                </button>
            </div>
        </div>
        
    );
};

export default ProductCard;