import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

function BorrowHistory() {
  const { isAuthenticated, user } = useAuth();
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      if (!isAuthenticated || user.role !== 'librarian') {
        setError('You do not have permission to view borrow history');
        return;
      }

      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch('http://localhost:8000/api/borrow-history/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBorrowHistory(data);
        } else {
          throw new Error('Failed to fetch borrow history');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBorrowHistory();
  }, [isAuthenticated, user.role]);

  return (
    <div className="container mt-5">
      {error && <div className="alert alert-danger">{error}</div>}

      <h2 className="mb-4">Borrow History</h2>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Username</th>
              <th>Borrow Date</th>
              <th>Return Date</th>
            </tr>
          </thead>
          <tbody>
            {borrowHistory.map((borrow) => (
              <tr key={borrow.id}>
                <td>{borrow.book.title}</td>
                <td>{borrow.user.username}</td>
                <td>{borrow.borrow_date}</td>
                <td>{borrow.return_date ? borrow.return_date : 'Not Returned'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BorrowHistory;
