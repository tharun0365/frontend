import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // This includes the Bootstrap JavaScript
import './App.css';
import Login from './pages/Log';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Books from './pages/Books';
import AddBook from './pages/AdBook';
import EditBook from './pages/EditBook';
import BorrowReturn from './pages/BorrowReturn';
import BorrowHistory from './pages/BorrowHistory';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/edit-book/:bookId" element={<EditBook />} />
        <Route path="/borrow-return/" element={<BorrowReturn />} />
        <Route path="/borrow-history" element={<BorrowHistory />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;






