import React from "react";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import rootReducer from "./reducers";
import { AuthProvider } from "./store/authContext";  // Import AuthProvider
import { FavoritesProvider } from './store/FavoritesContext'; // Import FavoritesProvider

// Set up the Redux store using configureStore
const store = configureStore({
  reducer: rootReducer,
});

// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app, wrapping it in the Redux Provider and AuthProvider
root.render(
  <Provider store={store}>
    <AuthProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </AuthProvider>
  </Provider>,
  document.getElementById('root')
);
