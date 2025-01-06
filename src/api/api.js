let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// Fetch products
export const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3003/api/products', {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await fetch('http://localhost:3003/api/products', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error.message);
    throw error;
  }
};

// Update a product by ID
export const updateProduct = async (id, productData) => {
  try {
    const response = await fetch(`http://localhost:3003/api/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error.message);
    throw error;
  }
};

// Delete a product by ID
export const deleteProduct = async (id) => {
  try {
    const response = await fetch(`http://localhost:3003/api/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error.message);
    throw error;
  }
};
// Fetch product by ID
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`http://localhost:3003/products/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error.message);
    throw error;
  }
};

// Register user API
export const registerUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:3003/api/auth/signup', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to register');
    return await response.json();
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error;
  }
};

// Login user API
export const loginUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:3003/api/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    setAuthToken(result.token);
    return result;
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
};

// Reset password API
export const sendResetEmail = async (email) => {
  try {
    const response = await fetch('http://localhost:3003/aapi/auth/reset-password', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error sending reset email:', error.message);
    throw error;
  }
};

export default {
  fetchProducts,
  fetchProductById,
  setAuthToken,
  registerUser,
  loginUser,
  sendResetEmail,
  createProduct,
  updateProduct,
  deleteProduct,
};
