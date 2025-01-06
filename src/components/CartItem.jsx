import React from 'react';
import { useDispatch } from 'react-redux';
import { changeQuantity, removeFromCart } from '../stores/cart';
import "../styles/ProductsPage.css  ";

const CartItem = ({ product }) => {
  const dispatch = useDispatch();

  const handleIncrease = () => {
    dispatch(changeQuantity({ productId: product.id, quantity: product.quantity + 1 }));
  };

  const handleDecrease = () => {
    if (product.quantity > 1) {
      dispatch(changeQuantity({ productId: product.id, quantity: product.quantity - 1 }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart({ productId: product.id }));
  };

  return (
    <div className="cart-item">
      <img src={product.imageUrl} alt={product.name} className="cart-item-img" />
      <div className="cart-item-details">
        <h4>{product.name}</h4>
        <p>${product.price * product.quantity}</p>
        <div className="cart-item-quantity">
          <button className="quantity-btn" onClick={handleDecrease}>-</button>
          <span>{product.quantity}</span>
          <button className="quantity-btn" onClick={handleIncrease}>+</button>
        </div>
        <button className="remove-btn" onClick={handleRemove}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;
