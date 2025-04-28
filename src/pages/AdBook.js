import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddBook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    image: null, // image is a file
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookData = new FormData();
    bookData.append('title', formData.title);
    bookData.append('author', formData.author);
    bookData.append('isbn', formData.isbn);
    if (formData.image) {
      bookData.append('image', formData.image);
    }

    try {
      const response = await fetch('http://localhost:8000/api/books/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: bookData,
      });

      if (response.ok) {
        navigate('/books'); // Redirect to books page
      } else {
        throw new Error('Failed to add book');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Book</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" name="title" required onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Author</label>
          <input type="text" className="form-control" name="author" required onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">ISBN</label>
          <input type="text" className="form-control" name="isbn" required onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <input type="file" className="form-control" name="image" accept="image/*" onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-success">Add Book</button>
      </form>
    </div>
  );
}

export default AddBook;
