// actions/cart.js
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const CHANGE_QUANTITY = 'CHANGE_QUANTITY';
export const TOGGLE_STATUS_TAB = 'TOGGLE_STATUS_TAB';

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

export const removeFromCart = (product) => ({
  type: REMOVE_FROM_CART,
  payload: product,
});

export const changeQuantity = (product) => ({
  type: CHANGE_QUANTITY,
  payload: product,
});

export const toggleStatusTab = () => ({
  type: TOGGLE_STATUS_TAB,
});
