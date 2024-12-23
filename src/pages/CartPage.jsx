import React, { useContext } from 'react';
import { CartContext } from '../store/CartContext';  // Import CartContext
import '../styles/CartPage.css';

function CartPage() {
  const { cart, removeFromCart, addToCart } = useContext(CartContext);  // Use CartContext

  // Handle quantity change
  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;  // Prevent quantity from going below 1
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    addToCart(updatedCart); // Updating cart globally via CartContext
  };

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      
      {/* Conditional rendering for cart content */}
      {cart.length > 0 ? (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-info">
                <img src={item.image} alt={item.name} className="product-image" />
                <h2>{item.name}</h2>
                <p className="price" style={{ display: 'none' }}>${item.price.toFixed(2)}</p>
                <div className="quantity">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                    min="1"
                  />
                </div>
              </div>
              <div className="cart-item-actions">
                <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
                <p className="total-item-price" style={{ marginTop: '10px', fontSize: '1.2rem', color: '#333' }}>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
        </div>
      )}

      {/* Total and Checkout Button */}
      {cart.length > 0 && (
        <div className="cart-total">
          <h3>Total Price: ${calculateTotal()}</h3>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}

export default CartPage;
