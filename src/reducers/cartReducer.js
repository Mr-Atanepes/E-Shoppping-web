import { ADD_TO_CART, REMOVE_FROM_CART, CHANGE_QUANTITY } from '../actions/cart';

const initialState = [];

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const existingProduct = state.find(item => item.id === action.payload.id);
            if (existingProduct) {
                return state.map(item =>
                    item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...state, { ...action.payload, quantity: 1 }];
        case REMOVE_FROM_CART:
            return state.filter(item => item.id !== action.payload.id);
        case CHANGE_QUANTITY:
            return state.map(item =>
                item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
            );
        default:
            return state;
    }
};

export default cartReducer;
