import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AdminDashboard from './admin/AdminDashboard';
import ProductManagementPage from './admin/ProductManagementPage';
import OrderManagementPage from './admin/OrderManagementPage';
import FavoritesPage from './pages/FavoritesPage'; 
import { Provider } from 'react-redux';
import { FavoritesProvider } from './store/FavoritesContext'; 
import store from './store/Store'; 
import { CartProvider } from './store/CartContext'; 
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import UserManagementPage from './admin/UserManagementPage'; 
import Profile from "./pages/profilepage.jsx";
import { ProductProvider } from './store/ProductContext';
import PrivateRoute from "./routes/PrivateRoute.js";
// Import the separated authentication components
import Login from './UserAuth/Login';
import Signup from './UserAuth/Signup.jsx';
import ForgotPassword from './UserAuth/ForgotPassword';
import './UserAuth/auth.css';

function App() {
    const [products, setProducts] = useState([]);
    const [showAuthForm, setShowAuthForm] = useState(false);

    const toggleAuthForm = () => {
        setShowAuthForm(!showAuthForm);
    };

    return (
        <Provider store={store}> 
            <ProductProvider>  
                <FavoritesProvider>
                    <CartProvider>
                        <Router>
                            <div className="app">
                                <Header onUserIconClick={toggleAuthForm} />
                                <main>
                                    <Routes>
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/products" element={<ProductsPage />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/signup" element={<Signup />} />
                                        <Route path="/forgot-password" element={<ForgotPassword />} />
                                        <Route path="/admin" element={<AdminDashboard products={products} setProducts={setProducts} />} />
                                        <Route path="/admin/products" element={<ProductManagementPage />} />
                                        <Route path="/admin/orders" element={<OrderManagementPage />} />
                                        <Route path="/admin/users" element={<UserManagementPage />} />
                                        <Route path="/cart"        element={<CartPage />} />
                                        <Route path="/checkout"    element={<CheckoutPage />} />
                                        <Route path="/favorites"   element={<FavoritesPage />} />
                                        <Route path="/profile"     element={<PrivateRoute><Profile /></PrivateRoute>}/>
                                        </Routes>
                                </main>
                                <Footer />
                            </div>
                        </Router>
                    </CartProvider>
                </FavoritesProvider>
            </ProductProvider>
        </Provider>
    );
}

export default App;

// Correct import for ProductContext
// import { l } from 'lucide-react';
// import Profile from './ProfilePage';