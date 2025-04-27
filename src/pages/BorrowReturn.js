import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function BorrowReturn() {
  const { bookId } = useParams();  // Get the bookId from the URL params
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  // Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/books/${bookId}/`);
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError('Failed to load book data');
      }
    };

    fetchBook();
  }, [bookId]);

  // Borrow or Return Book
  const handleBorrowReturn = async () => {
    const token = localStorage.getItem('access_token');
    const action = book.available ? 'borrow' : 'return'; // If available, borrow; if not, return

    try {
      const response = await fetch(`http://localhost:8000/api/books/${bookId}/borrow-return/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }), // Send the action (borrow or return)
      });

      if (response.ok) {
        setBook({ ...book, available: !book.available }); // Toggle availability
        alert(`${action.charAt(0).toUpperCase() + action.slice(1)} successful!`);
      } else {
        setError('Failed to borrow or return the book');
      }
    } catch (err) {
      setError('Error processing request');
    }
  };

  if (!book) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2>{book.available ? 'Borrow' : 'Return'} Book</h2>
      <div className="card">
        <img
          src={book.image ? `http://localhost:8000/api${book.image}` : '/media/book_images/it_end_with_us.jpg'}
          alt={book.title}
          className="card-img-top"
        />
        <div className="card-body">
          <h5 className="card-title">{book.title}</h5>
          <p className="card-text">{book.description}</p>
          <p className="card-text"><strong>Author:</strong> {book.author}</p>
          <p className="card-text"><strong>ISBN:</strong> {book.isbn}</p>
          <p className="card-text"><strong>Available:</strong> {book.available ? 'Yes' : 'No'}</p>

          {/* Conditionally render Borrow or Return button */}
          <button
            className={`btn ${book.available ? 'btn-primary' : 'btn-danger'}`}
            onClick={handleBorrowReturn}
          >
            {book.available ? 'Borrow Book' : 'Return Book'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BorrowReturn;
