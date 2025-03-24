import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import ApiTester from '../components/ApiTester';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-light);
  color: var(--text-primary);
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background-color: var(--primary-color);
  color: white;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
`;

const BackLink = styled(Link)`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  margin-right: 16px;
  
  svg {
    margin-right: 5px;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const ApiTesterPage = () => {
  return (
    <PageContainer>
      <Header>
        <BackLink to="/onebox">
          <FiArrowLeft />
          Back to OneBox
        </BackLink>
        <Title>API Tester</Title>
      </Header>
      
      <Content>
        <p>
          Use this tool to directly send API requests to the backend endpoints.
          The default endpoint is set to the onebox list API.
        </p>
        
        <ApiTester />
      </Content>
    </PageContainer>
  );
};

export default ApiTesterPage; 