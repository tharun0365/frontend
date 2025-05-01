import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditBook() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [image, setImage] = useState(null);
  const [available_copies, setAvailable_Copies] = useState('');
  const [total_copies, setTotal_Copies] = useState('');


  useEffect(() => {
    const fetchBook = async () => {
      const response = await fetch(`http://localhost:8000/api/books/${bookId}/`);
      const data = await response.json();
      setBook(data);
      setTitle(data.title);
      setAuthor(data.author);
      setIsbn(data.isbn);
      setAvailable_Copies(data.available_copies);
      setTotal_Copies(data.total_copies);
    };

    fetchBook();
  }, [bookId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('isbn', isbn);
    formData.append('available_copies', available_copies);
    formData.append('total_copies', total_copies);
    
    if (image) formData.append('image', image);

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`http://localhost:8000/api/books/${bookId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Book updated successfully');
        navigate('/books'); // Redirect back to books list
      } else {
        alert('Failed to update book');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">ISBN</label>
          <input
            type="text"
            className="form-control"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Available copies</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setAvailable_Copies(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Total copies</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setTotal_Copies(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">Update Book</button>
      </form>
    </div>
  );
}

export default EditBook;
