// src/reducers/userReducer.js

const initialState = {
    userInfo: null,
    isAuthenticated: false,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                userInfo: action.payload,
                isAuthenticated: true,
            };
        case 'LOGOUT':
            return {
                ...state,
                userInfo: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};

export default userReducer;
