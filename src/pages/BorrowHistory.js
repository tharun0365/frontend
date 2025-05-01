import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function BookHistory() {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (loading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (loading || user?.role !== 'librarian') return;

    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/borrow-history/', {
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
  }, [isAuthenticated, loading, user, navigate]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

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
          history.map((record) => (
            <div key={record.id} className="col-md-3 mb-4">
              <div className="card h-100">
                <img
                 src={record.book_image ? `http://localhost:8000/api${record.book_image}` : '/media/book_images/default.jpg'}
                 alt={record.book_title || 'Unknown'}
                  className="card-img-top"
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{record.book_title || 'Unknown'}</h5>
                  <p className="card-text"><strong>Borrowed by:</strong> {record.username || 'N/A'}</p>
                  <p className="card-text"><strong>Borrowed on:</strong> {record.borrow_date || 'N/A'}</p>
                  <p className="card-text"><strong>Returned on:</strong> {record.return_date || 'N/A'}</p>
                  <p className="card-text text-{record.returned_on ? 'success' : 'danger'}">
                    <strong>Status:</strong> {record.returned_on ? 'Returned' : 'Currently Borrowed'}
                  </p>
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
