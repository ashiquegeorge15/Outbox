import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchOneboxListDirect, sendDirectApiRequest } from '../services/api';

const ApiTesterContainer = styled.div`
  margin: 20px;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--background-light);
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 15px;
  color: var(--text-primary);
`;

const EndpointInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-bottom: 10px;
  font-family: monospace;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: var(--gray-light);
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  margin-top: 20px;
`;

const ResultTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 10px;
  color: var(--text-primary);
`;

const ResultPreview = styled.pre`
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
  font-family: monospace;
  font-size: 12px;
  color: #333;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: 4px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 10px;
  background-color: ${props => props.success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(211, 47, 47, 0.1)'};
  color: ${props => props.success ? '#4CAF50' : '#d32f2f'};
`;

const OptionsContainer = styled.div`
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
`;

const Checkbox = styled.input`
  margin-right: 8px;
`;

const InfoMessage = styled.div`
  color: #1976d2;
  margin-top: 10px;
  padding: 10px;
  background-color: rgba(25, 118, 210, 0.1);
  border-radius: 4px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: white;
  color: var(--text-primary);
`;

const Label = styled.span`
  font-size: 14px;
  color: var(--text-secondary);
  margin-right: 8px;
`;

const RequestDataContainer = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const RequestDataTextarea = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  resize: vertical;
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background-color: ${props => props.active ? 'var(--primary-color)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  cursor: pointer;
  font-weight: 500;
  
  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  
  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  
  &:not(:last-child) {
    border-right: none;
  }
`;

const Spinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const HeadersContainer = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const HeaderRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const HeaderInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
`;

const AddHeaderButton = styled.button`
  background-color: #f0f0f0;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0 10px;
  cursor: pointer;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const RemoveHeaderButton = styled.button`
  background-color: #f0f0f0;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0 10px;
  cursor: pointer;
  color: #d32f2f;
  
  &:hover {
    background-color: #e0e0e0;
  }
`;

const CollapsibleSection = styled.div`
  margin-bottom: 15px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f5f5f5;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: ${props => props.isOpen ? '10px' : '0'};
  
  &:hover {
    background-color: #e9e9e9;
  }
`;

const SectionTitle = styled.span`
  font-weight: 500;
  flex: 1;
`;

const ToggleIcon = styled.span`
  font-size: 18px;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s ease;
`;

const SectionContent = styled.div`
  padding: 10px;
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 4px 4px;
  background-color: white;
`;

const ResponseMetadata = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 14px;
`;

const ResponseMetaItem = styled.div`
  margin-bottom: 4px;
  display: flex;
`;

const ResponseMetaLabel = styled.span`
  font-weight: 500;
  margin-right: 10px;
  min-width: 120px;
`;

const ResponseMetaValue = styled.span`
  font-family: monospace;
`;

const ApiTester = () => {
  const [endpoint, setEndpoint] = useState('https://hiring.reachinbox.xyz/api/v1/onebox/list');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [useCorsProxy, setUseCorsProxy] = useState(true);
  const [httpMethod, setHttpMethod] = useState('GET');
  const [requestData, setRequestData] = useState('');
  const [activeTab, setActiveTab] = useState('request');
  const [customHeaders, setCustomHeaders] = useState([{ key: '', value: '' }]);
  const [headersOpen, setHeadersOpen] = useState(false);
  const [responseMetadata, setResponseMetadata] = useState(null);

  // Format JSON on focus out
  const formatRequestData = () => {
    if (!requestData.trim()) return;
    
    try {
      const parsed = JSON.parse(requestData);
      setRequestData(JSON.stringify(parsed, null, 2));
    } catch (e) {
      // If it's not valid JSON, leave it as is
    }
  };

  const addHeader = () => {
    setCustomHeaders([...customHeaders, { key: '', value: '' }]);
  };
  
  const removeHeader = (index) => {
    const newHeaders = [...customHeaders];
    newHeaders.splice(index, 1);
    setCustomHeaders(newHeaders);
  };
  
  const updateHeader = (index, field, value) => {
    const newHeaders = [...customHeaders];
    newHeaders[index][field] = value;
    setCustomHeaders(newHeaders);
  };
  
  const processHeaders = () => {
    const headers = {};
    customHeaders.forEach(header => {
      if (header.key.trim() && header.value.trim()) {
        headers[header.key.trim()] = header.value.trim();
      }
    });
    return headers;
  };

  const handleOneboxListRequest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSuccess(false);
    setResponseMetadata(null);
    
    try {
      // Include custom headers if any are defined
      const headers = processHeaders();
      const startTime = Date.now();
      const response = await fetchOneboxListDirect(useCorsProxy, httpMethod, null, headers);
      const endTime = Date.now();
      
      setResult(response);
      setSuccess(true);
      setResponseMetadata({
        time: `${endTime - startTime}ms`,
        size: JSON.stringify(response).length,
        type: typeof response === 'object' ? 'JSON' : typeof response
      });
      setActiveTab('response');
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomEndpointRequest = async () => {
    if (!endpoint) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    setSuccess(false);
    setResponseMetadata(null);
    
    try {
      // Parse request data if provided and method supports it
      let parsedData = null;
      if (requestData && (httpMethod === 'POST' || httpMethod === 'PUT' || httpMethod === 'PATCH')) {
        try {
          parsedData = JSON.parse(requestData);
        } catch (e) {
          throw new Error('Invalid JSON in request data');
        }
      }
      
      // Process custom headers
      const headers = processHeaders();
      
      const startTime = Date.now();
      const response = await sendDirectApiRequest(endpoint, useCorsProxy, httpMethod, parsedData, headers);
      const endTime = Date.now();
      
      setResult(response);
      setSuccess(true);
      setResponseMetadata({
        time: `${endTime - startTime}ms`,
        size: JSON.stringify(response).length,
        type: typeof response === 'object' ? 'JSON' : typeof response
      });
      setActiveTab('response');
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format the response for display
  const formatResponse = (data) => {
    if (!data) return '';
    
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    
    return data.toString();
  };

  return (
    <ApiTesterContainer>
      <Title>API Request Tester {success && <StatusBadge success>Success</StatusBadge>} {error && <StatusBadge>Failed</StatusBadge>}</Title>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'request'} 
          onClick={() => setActiveTab('request')}
        >
          Request
        </Tab>
        <Tab 
          active={activeTab === 'response'} 
          onClick={() => setActiveTab('response')}
          disabled={!result && !error}
        >
          Response
        </Tab>
      </TabsContainer>
      
      {activeTab === 'request' && (
        <>
          <EndpointInput
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="Enter API endpoint"
          />

          <OptionsContainer>
            <div>
              <Label>Method:</Label>
              <Select 
                value={httpMethod}
                onChange={(e) => setHttpMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </Select>
            </div>
            
            <CheckboxLabel>
              <Checkbox 
                type="checkbox" 
                checked={useCorsProxy}
                onChange={(e) => setUseCorsProxy(e.target.checked)}
              />
              Use CORS Proxy
            </CheckboxLabel>
          </OptionsContainer>
          
          {useCorsProxy && (
            <InfoMessage>
              Using a CORS proxy to bypass CORS restrictions. This is only for development/testing purposes.
              The app is using <strong>corsproxy.io</strong> which doesn't require special access.
              <br /><br />
              <strong>Note:</strong> If you're experiencing issues with the current proxy, you can modify the proxy list in <code>src/services/api.js</code> to use a different one.
            </InfoMessage>
          )}
          
          <CollapsibleSection>
            <SectionHeader onClick={() => setHeadersOpen(!headersOpen)} isOpen={headersOpen}>
              <SectionTitle>Custom Headers</SectionTitle>
              <ToggleIcon isOpen={headersOpen}>▼</ToggleIcon>
            </SectionHeader>
            
            {headersOpen && (
              <SectionContent>
                <HeadersContainer>
                  {customHeaders.map((header, index) => (
                    <HeaderRow key={index}>
                      <HeaderInput
                        placeholder="Header name"
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                      />
                      <HeaderInput
                        placeholder="Header value"
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                      />
                      <RemoveHeaderButton onClick={() => removeHeader(index)}>
                        ✕
                      </RemoveHeaderButton>
                    </HeaderRow>
                  ))}
                  <AddHeaderButton onClick={addHeader}>Add Header</AddHeaderButton>
                </HeadersContainer>
              </SectionContent>
            )}
          </CollapsibleSection>
          
          {(httpMethod === 'POST' || httpMethod === 'PUT' || httpMethod === 'PATCH') && (
            <RequestDataContainer>
              <Label>Request Body (JSON):</Label>
              <RequestDataTextarea
                value={requestData}
                onChange={(e) => setRequestData(e.target.value)}
                onBlur={formatRequestData}
                placeholder='{"key": "value"}'
              />
            </RequestDataContainer>
          )}
          
          <ButtonContainer>
            <Button 
              onClick={handleOneboxListRequest} 
              disabled={loading}
            >
              {loading ? <><Spinner />Loading...</> : 'Request Onebox List'}
            </Button>
            
            <Button 
              onClick={handleCustomEndpointRequest} 
              disabled={loading || !endpoint}
            >
              {loading ? <><Spinner />Loading...</> : 'Send Custom Request'}
            </Button>
          </ButtonContainer>
        </>
      )}
      
      {activeTab === 'response' && (
        <>
          {error && (
            <ErrorMessage>
              Error: {error}
            </ErrorMessage>
          )}
          
          {result && (
            <ResultContainer>
              {responseMetadata && (
                <ResponseMetadata>
                  <ResponseMetaItem>
                    <ResponseMetaLabel>Response Time:</ResponseMetaLabel>
                    <ResponseMetaValue>{responseMetadata.time}</ResponseMetaValue>
                  </ResponseMetaItem>
                  <ResponseMetaItem>
                    <ResponseMetaLabel>Response Size:</ResponseMetaLabel>
                    <ResponseMetaValue>{responseMetadata.size} bytes</ResponseMetaValue>
                  </ResponseMetaItem>
                  <ResponseMetaItem>
                    <ResponseMetaLabel>Content Type:</ResponseMetaLabel>
                    <ResponseMetaValue>{responseMetadata.type}</ResponseMetaValue>
                  </ResponseMetaItem>
                </ResponseMetadata>
              )}
              <ResultTitle>Response:</ResultTitle>
              <ResultPreview>
                {formatResponse(result)}
              </ResultPreview>
            </ResultContainer>
          )}
          
          <ButtonContainer>
            <Button onClick={() => setActiveTab('request')}>
              Back to Request
            </Button>
          </ButtonContainer>
        </>
      )}
    </ApiTesterContainer>
  );
};

export default ApiTester; 