import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import LaunchList from './LaunchList'; // Import the LaunchList component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if there's a JWT token in local storage
    const jwtToken = localStorage.getItem('jwtToken');
    if (jwtToken) {
      // Set isAuthenticated to true if a token is found
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    // Simulate a login action by storing a JWT token in local storage
    localStorage.setItem('jwtToken', 'your-jwt-token-here');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Simulate a logout action by removing the JWT token from local storage
    localStorage.removeItem('jwtToken');
    setIsAuthenticated(false);
  };

  return (
    <div>
      {isAuthenticated ? (
        // Render the LaunchList component when authenticated
        <div>
          <Button onClick={handleLogout}>Logout</Button>
          <LaunchList />
        </div>
      ) : (
        <div>
          <p>You are not authenticated.</p>
          <Button onClick={handleLogin}>Login</Button>
        </div>
      )}
    </div>
  );
}

export default App;
