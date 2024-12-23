import React, { useState } from 'react';

function AddProductForm() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('image', image);

    try {
      const response = await fetch('/api/products/add', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Product added successfully!');
        setName('');
        setPrice('');
        setDescription('');
        setImage(null);
      } else {
        alert(result.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding product');
    }
  };

  return (
    <form id="add-product-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        required
      />
      <input
        type="number"
        name="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Product Price"
        required
      />
      <textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Product Description"
        required
      />
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
        required
      />
      <button type="submit">Add Product</button>
    </form>
  );
}

export default AddProductForm;
