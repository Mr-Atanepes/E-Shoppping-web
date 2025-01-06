import React, { useState } from 'react';
import { useCart } from '../store/CartContext'; // Importing the useCart hook
import '../styles/HomePage.css';
// import Footer from '../components/Footer';
import ProductModal from '../components/ProductModal';
import { Star,  Heart } from 'lucide-react';
import { useFavorites } from '../store/FavoritesContext'; // Updated import statement

function HomePage() {
  const { favorites, addFavorite, removeFavorite } = useFavorites(); // Use hook for managing favorites
  const { addToCart } = useCart(); // Access the addToCart function from the cart context
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featuredProducts = [
    { id: 1, name: "Wireless Earbuds", category: "Electronics", price: 79.99, rating: 4.5, image: "/placeholder.svg?height=200&width=200" },
    { id: 2, name: "Slim Fit Jeans", category: "Clothing", price: 49.99, rating: 4.2, image: "/placeholder.svg?height=200&width=200" },
    { id: 3, name: "Smart Home Speaker", category: "Electronics", price: 129.99, rating: 4.7, image: "/placeholder.svg?height=200&width=200" },
    { id: 4, name: "Stainless Steel Cookware Set", category: "Home & Garden", price: 199.99, rating: 4.8, image: "/placeholder.svg?height=200&width=200" },
    { id: 5, name: "Bestselling Novel", category: "Books", price: 14.99, rating: 4.4, image: "/placeholder.svg?height=200&width=200" },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={i <= rating ? "#FFD700" : "none"}
          stroke={i <= rating ? "#FFD700" : "#C0C0C0"}
        />
      );
    }
    return stars;
  };

  const handleFavoriteClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      removeFavorite(productId); // Use hook method to remove
    } else {
      addFavorite(productId); // Use hook method to add
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    addToCart(product); // Use addToCart function from the cart context
  };

  return (
    <div className="home-page">
      <main>
        <section className="hero">
          <div className="container">
            <h1>Welcome to Our E-Commerce Store</h1>
            <p>Discover amazing products at great prices!</p>
            <button className="cta-button">Shop Now</button>
          </div>
        </section>
        <section className="featured-products">
          <div className="container">
            <h2>Featured Products</h2>
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <div className="product-rating">
                    {renderStars(product.rating)}
                    <span>({product.rating})</span>
                  </div>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                  <div className="product-actions">
                   
                    <button onClick={() => handleAddToCart(product)}>Add to cart</button>
                    <button 
                      className={`favorite-button ${favorites.includes(product.id) ? 'favorited' : ''}`}
                      onClick={() => toggleFavorite(product.id)} // Pass product.id to toggleFavorite
                    >
                      <Heart size={16} fill={favorites.includes(product.id) ? "#ff6b6b" : "none"} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      {isModalOpen && <ProductModal product={selectedProduct} onClose={closeModal} />}
    </div>
  );
}

export default HomePage;
{/* <button onClick={() => handleFavoriteClick(product)}>Favorite</button> */}