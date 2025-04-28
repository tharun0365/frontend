import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import AuthContext

function Books() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Removed logout
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!localStorage.getItem('access_token')) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/books/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        } else {
          throw new Error('Failed to fetch books');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBooks();
  }, [isAuthenticated, navigate]); // Corrected useEffect dependencies

  const handleAddBook = () => {
    navigate('/add-book');
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/books/${bookId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        setBooks(books.filter((book) => book.id !== bookId));
      } else {
        throw new Error('Failed to delete the book');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add Book Button */}
      {user && user.role === 'librarian' && (
        <div className="text-center mb-4">
          <button className="btn btn-success" onClick={handleAddBook}>
            Add Book
          </button>
        </div>
      )}

      <div className="row">
        {books.length === 0 ? (
          <div className="col-12 text-center">
            <p>No books available.</p>
          </div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="col-md-3 mb-4">
              <div className="card">
                <img
                  src={book.image ? `http://localhost:8000/api${book.image}` : '/media/book_images/it_end_with_us.jpg'}
                  alt={book.title}
                  className="card-img-top"
                  // style={{ height: '300px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">{book.author}</p>
                  <button className="btn btn-primary w-100 me-2 ">View Details</button>

                  {/* Librarian Controls */}
                  {user && user.role === 'librarian' && (
                    <div className="mt-auto">
                      <button
                        className="btn btn-warning w-100 me-2 mt-2"
                        onClick={() => navigate(`/edit-book/${book.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger w-100 me-2 mt-2"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Books;








