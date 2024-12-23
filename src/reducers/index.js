import { combineReducers } from 'redux';

// Import your individual reducers here
import userReducer from './userReducer';
import cartReducer from './cartReducer'; // Import the cart reducer

const rootReducer = combineReducers({
    // Add your individual reducers here
    user: userReducer,
    cart: cartReducer, // Add the cart reducer
});

export default rootReducer;
