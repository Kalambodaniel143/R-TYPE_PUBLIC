/**
 * API Configuration and Helper Functions
 */

// Get base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'api';

/**
 * Build full API URL
 */
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${API_VERSION}/${cleanEndpoint}`;
};

/**
 * Generic API request function
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = buildApiUrl(endpoint);

  // Default headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    defaultHeaders['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Check if response has content before parsing JSON
  // DELETE requests typically return 204 No Content
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return null; // No content to parse
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

/**
 * Authentication API calls
 */
export const authAPI = {
  /**
   * Step 1: Login with email/password
   */
  login: async (email: string, password: string) => {
    return apiRequest('auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Step 2: Verify 2FA code
   */
  verify2FA: async (email: string, code: string) => {
    return apiRequest('auth/verify-2fa/', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },

  /**
   * Google OAuth login
   */
  googleLogin: async (accessToken: string) => {
    return apiRequest('auth/google/', {
      method: 'POST',
      body: JSON.stringify({ access_token: accessToken }),
    });
  },

  /**
   * Register new user
   */
  register: async (userData: any) => {
    return apiRequest('auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Verify email
   */
  verifyEmail: async (token: string) => {
    return apiRequest('auth/verify-email/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string) => {
    const requestBody: any = { email };

    return apiRequest('auth/password-reset/', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },

  /**
   * Reset password confirm
   */
  resetPassword: async (uidb64: string, token: string, password: string) => {
    return apiRequest('auth/password-reset-confirm/', {
      method: 'POST',
      body: JSON.stringify({
        uidb64,
        token,
        password,
        password_confirm: password
      }),
    });
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    return apiRequest('auth/me/', {
      method: 'GET',
    });
  },

  /**
   * Logout
   */
  logout: async () => {
    return apiRequest('auth/logout/', {
      method: 'POST',
    });
  },
};


/**
 * Area Creation API calls
 */
export const areasAPI = {
  /**
   * Get all available services with their actions and reactions
   */
  about: async () => {
    return apiRequest('core/about.json', {
      method: 'GET',
    });
  },

  /**
   * Create a new AREA
   */
  createArea: async (areaData: any) => {
    return apiRequest('areas/', {
      method: 'POST',
      body: JSON.stringify(areaData),
    });
  },

  /**
   * Get user's AREAs
   */
  getUserAreas: async () => {
    return apiRequest('areas/', {
      method: 'GET',
    });
  },

  /**
   * Get a single AREA by ID
   */
  getArea: async (areaId: string) => {
    return apiRequest(`areas/${areaId}/`, {
      method: 'GET',
    });
  },

  /**
   * Update an existing AREA
   */
  updateArea: async (areaId: string, areaData: any) => {
    return apiRequest(`areas/${areaId}/`, {
      method: 'PUT',
      body: JSON.stringify(areaData),
    });
  },

  /**
   * Delete an AREA
   */
  deleteArea: async (areaId: string) => {
    console.log('Deleting area with ID:', areaId);
    return apiRequest(`areas/${areaId}/`, {
      method: 'DELETE',
    });
  },
};

/**
 * OAuth Service Integration API calls
 */
export const oauthAPI = {
  /**
   * Get OAuth connection status for all services
   */
  getConnectionStatus: async () => {
    return apiRequest('oauth/status/', {
      method: 'GET',
    });
  },

  /**
   * Get OAuth authorization URL for a service
   */
  getAuthUrl: async (serviceName: string) => {
    return apiRequest(`oauth/${serviceName}/authorize/`, {
      method: 'GET',
    });
  },

  /**
   * Complete OAuth flow with authorization code or access token
   */
  completeOAuth: async (serviceName: string, tokenOrCode: string, state?: string) => {
    // Determine the correct field name based on service and token format
    const payload: any = { state };
    
    // Discord and GitHub use authorization codes, Google uses access tokens
    if (serviceName === 'discord' || serviceName === 'github') {
      payload.code = tokenOrCode;
    } else {
      payload.access_token = tokenOrCode;
    }
    
    return apiRequest(`oauth/${serviceName}/complete/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Disconnect OAuth service
   */
  disconnectService: async (serviceName: string) => {
    return apiRequest(`oauth/${serviceName}/disconnect/`, {
      method: 'DELETE',
    });
  },

  /**
   * Refresh OAuth token for a service
   */
  refreshToken: async (serviceName: string) => {
    return apiRequest(`oauth/${serviceName}/refresh/`, {
      method: 'POST',
    });
  },
};