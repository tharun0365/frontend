import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function YourBooks() {
  const { isAuthenticated,  loading } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchYourBooks = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/your-books/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        } else {
          throw new Error('Failed to load your books');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchYourBooks();
  }, [isAuthenticated, loading, navigate]);

  const handleRead = (pdfUrl) => {
    window.open(pdfUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">

      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {books.length === 0 ? (
          <div className="col-12 text-center">
            <p>You have no borrowed books.</p>
          </div>
        ) : (
          books.map((book) => (
            <div key={book.id} className="col-md-3 mb-4">
              <div className="card">
                <img
                  src={book.image ? `http://localhost:8000/api${book.image}` : '/media/book_images/default.jpg'}
                  className="card-img-top"
                  alt={book.title}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text">{book.description}</p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleRead(`http://localhost:8000/api${book.pdf}`)}
                  >
                    Read
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default YourBooks;
