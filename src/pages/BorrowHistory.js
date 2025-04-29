import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

function BookHistory() {
  const { isAuthenticated, user, loading } = useAuth();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading || !isAuthenticated || user?.role !== 'librarian') return;

    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/books/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        } else {
          throw new Error('Failed to fetch history');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHistory();
  }, [isAuthenticated, loading, user]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!isAuthenticated) {
    return <div className="text-center mt-5 text-danger">You must be logged in to view this page.</div>;
  }

  if (user?.role !== 'librarian') {
    return <div className="text-center mt-5 text-danger">You do not have permission to view this page. Only librarians can access it.</div>;
  }

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {history.length === 0 ? (
          <div className="col-12 text-center">
            <p>No borrow history available.</p>
          </div>
        ) : (
          history.map((book) => (
            <div key={book.id} className="col-md-3 mb-4">
              <div className="card">
                <img
                  src={book.image ? `http://localhost:8000/api${book.image}` : '/media/book_images/it_end_with_us.jpg'}
                  alt={book.title}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text"><strong>Borrowed by:</strong> {book.borrowed_by || 'N/A'}</p>
                  <p className="card-text"><strong>Borrowed on:</strong> {book.borrowed_on || 'N/A'}</p>
                  <p className="card-text"><strong>Returned on:</strong> {book.returned_on || 'N/A'}</p>
                  <p className="card-text"><strong>Status:</strong> {book.available ? 'Available' : 'Borrowed'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BookHistory;
