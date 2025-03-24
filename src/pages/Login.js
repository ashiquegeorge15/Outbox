import React, { useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { AuthContext } from '../contexts/AuthContext';
import { redirectToGoogleLogin } from '../services/api';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--background-light);
  color: var(--text-primary);
`;

const LoginCard = styled.div`
  width: 400px;
  padding: 40px;
  border-radius: 12px;
  background-color: var(--background-light);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 30px;
  color: var(--primary-color);
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  background-color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 20px;
  
  &:hover {
    background-color: var(--gray-light);
  }
  
  svg {
    margin-right: 10px;
    font-size: 20px;
  }
`;

const Heading = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--text-primary);
`;

const Subheading = styled.p`
  font-size: 16px;
  margin-bottom: 30px;
  color: var(--text-secondary);
  text-align: center;
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleGoogleLogin = () => {
    // In development mode:
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock login in development mode');
      // For demo/development, use mock login
      const mockResponse = {
        token: 'mock_token_12345',
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          picture: 'https://randomuser.me/api/portraits/men/1.jpg'
        }
      };
      
      login(mockResponse);
      navigate('/onebox');
    } else {
      // In production, use actual Google OAuth
      console.log('Redirecting to Google login');
      redirectToGoogleLogin();
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>ReachInbox</Logo>
        <Heading>Welcome Back</Heading>
        <Subheading>
          Sign in to access your inbox and manage your emails efficiently
        </Subheading>
        
        <LoginButton onClick={handleGoogleLogin}>
          <FcGoogle />
          Sign in with Google
        </LoginButton>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 