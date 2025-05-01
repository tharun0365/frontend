import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function BorrowReturn() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/books/', {
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
  }, [isAuthenticated, loading, navigate]);

  const handleBorrow = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/books/${bookId}/borrow-return/?action=borrow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        window.location.reload();
      } else {
        throw new Error('Failed to borrow the book');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/books/${bookId}/borrow-return/?action=return`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        window.location.reload();
      } else {
        throw new Error('Failed to return the book');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {books.length === 0 ? (
          <div className="col-12 text-center">
            <p>No books available.</p>
          </div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="col-md-3 mb-4">
              <div className="card h-100">
                <img
                  src={book.image ? `http://localhost:8000/api${book.image}` : '/media/book_images/it_end_with_us.jpg'}
                  alt={book.title}
                  className="card-img-top"
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">{book.description}</p>
                  <p><strong>Total Copies:</strong> {book.total_copies}</p>
                  <p><strong>Available Copies:</strong> {book.available_copies}</p>

                  {/* Action Buttons */}
                  {book.borrowed_by === user?.username ? (
                    <button className="btn btn-warning mt-auto" onClick={() => handleReturn(book.id)}>
                      Return
                    </button>
                  ) : book.available_copies > 0 ? (
                    <button className="btn btn-success mt-auto" onClick={() => handleBorrow(book.id)}>
                      Borrow
                    </button>
                  ) : (
                    <p className="text-danger mt-auto">Not Available</p>
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

export default BorrowReturn;
