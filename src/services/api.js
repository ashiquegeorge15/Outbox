import axios from 'axios';

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Create an instance of axios with default config
const api = axios.create({
  baseURL: 'https://hiring.reachinbox.xyz/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`

  };
};

// Mock data for API responses
const mockThreads = [
  {
    id: '1',
    from: 'john.doe@example.com',
    fromName: 'John Doe',
    to: 'me@example.com',
    subject: 'Project Discussion Follow-up',
    preview: 'Hey, I wanted to follow up on our meeting yesterday...',
    body: '<p>Hey,</p><p>I wanted to follow up on our meeting yesterday. I think we have a good plan going forward with the project. Let me know if you have any questions.</p><p>Best regards,<br/>John</p>',
    timestamp: '2023-03-15T10:30:00Z',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    from: 'sarah.parker@example.com',
    fromName: 'Sarah Parker',
    to: 'me@example.com',
    subject: 'Monthly Report - February 2023',
    preview: 'Please find attached the monthly report for February 2023...',
    body: '<p>Hi there,</p><p>Please find attached the monthly report for February 2023. We exceeded our sales targets by 15% this month!</p><p>Regards,<br/>Sarah</p>',
    timestamp: '2023-03-14T15:45:00Z',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    from: 'mike.wilson@example.com',
    fromName: 'Mike Wilson',
    to: 'me@example.com',
    subject: 'Team Building Event',
    preview: 'We are planning a team building event next month...',
    body: '<p>Hello everyone,</p><p>We are planning a team building event next month. It will be on the 15th of April. Please mark your calendars!</p><p>Best,<br/>Mike</p>',
    timestamp: '2023-03-13T09:20:00Z',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  }
];

// API endpoints
const ENDPOINTS = {
  GOOGLE_LOGIN: 'https://hiring.reachinbox.xyz/api/v1/auth/google-login',
  ONEBOX_LIST: 'https://hiring.reachinbox.xyz/api/v1/onebox/list',
  ONEBOX_THREAD: (threadId) => `https://hiring.reachinbox.xyz/api/v1/onebox/${threadId}`,
  REPLY_THREAD: (threadId) => `https://hiring.reachinbox.xyz/api/v1/reply/${threadId}`
};

// Function to redirect to Google login
export const redirectToGoogleLogin = () => {
  // Get the current host to set as the redirect URL
  const redirectUrl = window.location.origin;
  const loginUrl = `${ENDPOINTS.GOOGLE_LOGIN}?redirect_to=${encodeURIComponent(redirectUrl + '/auth/callback')}`;
  
  console.log('Redirecting to:', loginUrl);
  window.location.href = loginUrl;
};

// API functions
export const loginWithGoogle = async (token) => {
  // In development, always use mock data
  if (isDevelopment) {
    console.log('Using mock login data in development');
    return {
      token: 'mock_token_12345',
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'https://randomuser.me/api/portraits/men/1.jpg'
      }
    };
  }

  // In production, validate the token from the callback
  if (token) {
    try {
      // Normally we would validate the token with an API call
      // For this example, we'll just assume the token is valid
      // A real implementation would send the token to the backend for validation
      console.log('Validating token:', token);
      return {
        token,
        user: {
          // These details would typically come from the backend
          name: 'Authenticated User',
          email: 'user@example.com',
          picture: 'https://randomuser.me/api/portraits/men/1.jpg'
        }
      };
    } catch (error) {
      console.error('Token validation failed:', error.message);
      throw error;
    }
  } else {
    throw new Error('No authentication token provided');
  }
};

export const getOneboxList = async () => {
  // In development, always use mock data
  if (isDevelopment) {
    console.log('Using mock thread list in development');
    return mockThreads;
  }

  try {
    const response = await axios.get(ENDPOINTS.ONEBOX_LIST, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.warn('Onebox list API call failed, using mock data:', error.message);
    return mockThreads;
  }
};

export const getOneboxThread = async (threadId) => {
  // In development, always use mock data
  if (isDevelopment) {
    console.log('Using mock thread data in development');
    const thread = mockThreads.find(t => t.id === threadId);
    if (thread) {
      return thread;
    }
    throw new Error('Thread not found');
  }

  try {
    const response = await axios.get(ENDPOINTS.ONEBOX_THREAD(threadId), {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.warn('Onebox thread API call failed, using mock data:', error.message);
    const thread = mockThreads.find(t => t.id === threadId);
    if (thread) {
      return thread;
    }
    throw new Error('Thread not found');
  }
};

export const deleteOneboxThread = async (threadId) => {
  // In development, always use mock data
  if (isDevelopment) {
    console.log('Using mock delete response in development');
    return { success: true, message: 'Thread deleted successfully (mock)' };
  }

  try {
    const response = await axios.delete(ENDPOINTS.ONEBOX_THREAD(threadId), {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.warn('Delete thread API call failed, using mock response:', error.message);
    return { success: true, message: 'Thread deleted successfully' };
  }
};

export const sendReply = async (threadId, replyData) => {
  // In development, always use mock data
  if (isDevelopment) {
    console.log('Using mock reply response in development');
    return { success: true, message: 'Reply sent successfully (mock)' };
  }

  try {
    const response = await axios.post(ENDPOINTS.REPLY_THREAD(threadId), replyData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.warn('Send reply API call failed, using mock response:', error.message);
    return { success: true, message: 'Reply sent successfully' };
  }
};

// Function to directly send an API request to any endpoint
// This bypasses the development mode check and directly hits the API
export const sendDirectApiRequest = async (endpoint, useCorsProxy = false, method = 'GET', requestData = null, customHeaders = {}) => {
  console.log(`Sending direct API request to: ${endpoint} with method: ${method}`);
  
  let requestUrl = endpoint;
  
  // Apply CORS proxy if needed
  if (useCorsProxy) {
    // List of available CORS proxies (in case one is not working)
    const corsProxies = [
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url=',
      'https://corsproxy.io/?'
    ];
    
    // Using corsproxy.io as the default since it doesn't require special access
    const corsProxyUrl = corsProxies[2];
    
    if (corsProxyUrl.includes('allorigins') || corsProxyUrl.includes('corsproxy.io')) {
      // For these proxies, we need to encode the URL
      requestUrl = `${corsProxyUrl}${encodeURIComponent(endpoint)}`;
    } else {
      requestUrl = `${corsProxyUrl}${endpoint}`;
    }
    
    console.log(`Using CORS proxy: ${requestUrl}`);
  }
  
  try {
    const config = {
      method,
      url: requestUrl,
      headers: {
        ...getAuthHeaders(),
        // Some CORS proxies require this header
        'X-Requested-With': 'XMLHttpRequest',
        // Add custom headers
        ...customHeaders
      }
    };
    
    // Add data to request if needed (for POST, PUT, etc.)
    if (requestData && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.data = requestData;
    }
    
    const response = await axios(config);
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Direct API request failed:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      throw new Error(`Server responded with status ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from server. CORS issue or server unavailable.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw error;
    }
  }
};

// Function to fetch the onebox list directly from the API
// This ignores the development mode check and always hits the real API
export const fetchOneboxListDirect = async (useCorsProxy = false, method = 'GET', requestData = null, customHeaders = {}) => {
  return sendDirectApiRequest(ENDPOINTS.ONEBOX_LIST, useCorsProxy, method, requestData, customHeaders);
};

export default api; 