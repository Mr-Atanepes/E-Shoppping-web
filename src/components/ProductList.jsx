import React, { useState, useEffect } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        alert('Failed to fetch products');
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a product"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredProducts.map((product) => (
          <li key={product._id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <img src={product.imageUrl} alt={product.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
