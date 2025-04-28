import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function BorrowReturn() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/books/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
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

    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated, navigate]);

  const handleBorrow = async (bookId) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`http://localhost:8000/api/books/${bookId}/borrow-return/?action=borrow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        window.location.reload(); // Reload to update book availability
      } else {
        throw new Error('Failed to borrow the book');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReturn = async (bookId) => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`http://localhost:8000/api/books/${bookId}/borrow-return/?action=return`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        window.location.reload(); // Reload to update book availability
      } else {
        throw new Error('Failed to return the book');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {books.map((book) => (
          <div key={book.id} className="col-md-3 mb-4">
            <div className="card">
              <img
                src={book.image ? `http://localhost:8000/api${book.image}` : '/media/book_images/it_end_with_us.jpg'}
                alt={book.title}
                className="card-img-top"
                // style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">{book.description}</p>

                {/* Action Buttons */}
                {book.available ? (
                  <button className="btn btn-success btn-block" 
                  onClick={() => handleBorrow(book.id)}>Borrow                  
                  </button>
                  ) : (
                  <>
                  {book.borrowed_by === user?.username ? (
                  <button className="btn btn-success btn-block" 
                  onClick={() => handleReturn(book.id)}>Return
                  </button>
                  ) : (
                  <p>Not Available</p>
                 )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BorrowReturn;
