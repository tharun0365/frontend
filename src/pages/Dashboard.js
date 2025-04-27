import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user data is available in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Update state with the user data from localStorage
    }
  }, []); // This runs only once when the component mounts

  if (!user) {
    return (
      <div className="container mt-5">
        <h2>Please login to view your dashboard.</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Welcome, {user.username}!</h2>
      <p>You are logged in as <strong>{user.role}</strong>.</p>
    </div>
  );
}

export default Dashboard;

