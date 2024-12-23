import React, { createContext, useState } from 'react';

// Create the context
export const ProductContext = createContext();

// Create a provider component to wrap around your app
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Function to add or update a product
  const addProduct = (product) => {
    setProducts((prevProducts) => {
      const existingProductIndex = prevProducts.findIndex(p => p.id === product.id);
      if (existingProductIndex !== -1) {
        // Update the existing product
        const updatedProducts = [...prevProducts];
        updatedProducts[existingProductIndex] = product;
        return updatedProducts;
      }
      // Add a new product
      return [...prevProducts, product];
    });
  };

  // Function to delete a product
  const deleteProduct = (id) => {
    setProducts((prevProducts) => prevProducts.filter(product => product.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
