import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from './CartItem';
import { toggleStatusTab } from '../stores/cart';

const CartTab = () => {
  const cartItems = useSelector(state => state.cart.items);
  const statusTab = useSelector(state => state.cart.statusTab);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(toggleStatusTab());
  };

  return (
    <div className={`cart-tab ${statusTab ? "open" : "closed"}`}> 
      <h2>Shopping Cart</h2>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cartItems.map(item => <CartItem key={item.id} product={item} />)
        )}
      </div>
      <div className="cart-footer">
        <button className="close-btn" onClick={handleClose}>Close</button>
        <button className="checkout-btn">Checkout</button>
      </div>
    </div>
  );
};

export default CartTab;
