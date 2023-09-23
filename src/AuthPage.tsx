// src/pages/AuthPage.tsx
import { useEffect, useState } from 'react';

const AuthPage = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for the JWT token in localStorage
    const storedToken = localStorage.getItem('jwtToken');

    if (storedToken === 'asd') {
      // Token with value "asd" found, set it in state
      setToken(storedToken);
    } else {
      // Token not found or doesn't match "asd", display an error
      console.log('No valid token found.');
    }
  }, []);

  return (
    <div>
      {token ? (
        <div>
          <h1>Welcome to the Authenticated Page</h1>
          <p>You have a valid token.</p>
        </div>
      ) : (
        <div>
          <h1>Error: Invalid Token</h1>
          <p>You don't have a valid token or the token does not match "asd". Please log in with a valid token.</p>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
