import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/index'; // Explicitly import the index file

// Set up the Redux store using configureStore
const store = configureStore({
  reducer: rootReducer,
});

export default store;
