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
  
    <div className="table-responsive shadow rounded overflow-hidden">
      <table
        className="table table-hover table-bordered mb-0"
        style={{ backgroundColor: '#ffc0cb', color: '#000' }} // Pink bg, black text
      >
        <thead className="bhtable sticky-top" style={{ backgroundColor: 'pink', color: 'black' }}> {/* Darker pink header */}
          <tr className="text-center align-middle">
            <th scope="col">📚 Book Title</th>
            <th scope="col">👤 User</th>
            <th scope="col">📅 Borrow Date</th>
            <th scope="col">📅 Return Date</th>
            <th scope="col">📌 Status</th>
          </tr>
        </thead>
        <tbody>
          {history.map((record) => (
            <tr key={record.id} className="text-center align-middle">
              <td>{record.book?.title || 'Unknown'}</td>
              <td>{record.username || 'N/A'}</td>
              <td>{record.borrow_date || 'N/A'}</td>
              <td>{record.return_date || 'N/A'}</td>
              <td>
                <span className={`badge ${record.returned_on ? 'bg-success' : 'bg-danger'}`}>
                  {record.returned_on ? 'Returned' : 'Currently Borrowed'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default BookHistory;
