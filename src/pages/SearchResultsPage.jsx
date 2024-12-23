import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResultsPage = () => {
  const [products, setProducts] = useState([]); // Mock products array
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();

  // Mock product data (replace with actual product fetching from an API or state)
  const allProducts = [
    { id: 1, name: 'Laptop', description: 'A powerful laptop' },
    { id: 2, name: 'Smartphone', description: 'Latest smartphone' },
    { id: 3, name: 'Headphones', description: 'Noise-cancelling headphones' },
    { id: 4, name: 'Watch', description: 'Smartwatch with great features' }
  ];

  useEffect(() => {
    // Get search term from query parameter
    const query = new URLSearchParams(location.search).get('query')?.toLowerCase();

    // Filter products based on the query parameter
    if (query) {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts); // If no query, show all products
    }
  }, [location.search]); // Re-run on search parameter change

  return (
    <div className="search-results-page">
      <h1>Search Results</h1>
      <div>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
