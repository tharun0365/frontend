import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import AuthContext

function Books() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  // Fetch books from API using the access token
  const fetchBooks = async () => {
    if (!isAuthenticated) {
      return navigate('/login');
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
        setBooks(data); // Assuming the response contains a list of books
      } else {
        throw new Error('Failed to fetch books');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [isAuthenticated]); // Only fetch books if authenticated

  // Add Book (only for librarians)
  const handleAddBook = () => {
    navigate('/add-book'); // Assuming you have a route for adding books
  };

  // Delete Book (only for librarians)
  const handleDeleteBook = (bookId) => {
    fetch(`http://localhost:8000/api/books/${bookId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setBooks(books.filter((book) => book.id !== bookId));
        } else {
          throw new Error('Failed to delete the book');
        }
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="container mt-5">
      
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Show Add button only for librarians */}
      {user && user.role === 'librarian' && (
        <button className="btn btn-primary mb-3" onClick={handleAddBook}>
          Add Book
        </button>
      )}

      <div className="row">
        {books.map((book) => (
          <div key={book.id} className="col-md-3 mb-4">
            <div className="card">
              <img
                src={book.image ? `http://localhost:8000/api${book.image}` : '/media/book_images/it_end_with_us.jpg'} // Adjusted image URL
                alt={book.title}
                className="card-img-top"
              />
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">{book.description}</p>
                <button className="btn btn-primary">View Details</button>

                {/* Only show Edit and Delete buttons for librarians */}
                {user && user.role === 'librarian' && (
                  <div>
                    <button className="btn btn-warning" onClick={() =>  navigate(`/edit-book/${book.id}`)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteBook(book.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;
