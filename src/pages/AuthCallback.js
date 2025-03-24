import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../contexts/AuthContext';
import { loginWithGoogle } from '../services/api';

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--background-light);
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: var(--primary-color);
  animation: spin 1s ease infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.p`
  font-size: 16px;
  color: var(--text-secondary);
`;

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse the URL search parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userData = params.get('user');

        // If we don't have token or user data, fallback to the API method
        let authData;
        if (!token || !userData) {
          console.log('No token or user data in URL, trying API validation');
          // Use the loginWithGoogle function which handles development/production cases
          authData = await loginWithGoogle(token);
        } else {
          // Parse the user data from the URL
          const user = JSON.parse(decodeURIComponent(userData));
          
          // Create the auth object from URL parameters
          authData = {
            token,
            user
          };
        }

        // Save the user data to context and localStorage
        login(authData);

        // Redirect to the main app
        navigate('/onebox');
      } catch (error) {
        console.error('Error handling authentication callback:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [login, navigate, location.search]);

  return (
    <LoadingContainer>
      <Spinner />
      {error ? (
        <Message>{error}</Message>
      ) : (
        <Message>Completing authentication, please wait...</Message>
      )}
    </LoadingContainer>
  );
};

export default AuthCallback; 