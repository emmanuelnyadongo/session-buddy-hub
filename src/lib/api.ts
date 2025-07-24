// In production, use relative URLs since frontend and backend are on the same domain
const API_BASE_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Auth endpoints
  async register(userData: {
    name: string;
    email: string;
    password: string;
    university?: string;
  }): Promise<ApiResponse<{ user: unknown; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: unknown; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(data: {
    token: string;
    password: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    return this.request(`/auth/verify-email/${token}`, {
      method: 'GET',
    });
  }

  // User endpoints
  async getProfile(): Promise<ApiResponse<{ user: unknown }>> {
    return this.request('/users/profile');
  }

  async updateProfile(profileData: {
    name?: string;
    university?: string;
    bio?: string;
  }): Promise<ApiResponse<{ user: unknown }>> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserSessions(type: string = 'all', limit: number = 10, offset: number = 0): Promise<ApiResponse<{ sessions: unknown[] }>> {
    return this.request(`/users/sessions?type=${type}&limit=${limit}&offset=${offset}`);
  }

  async getUserStats(): Promise<ApiResponse<{ stats: unknown }>> {
    return this.request('/users/stats');
  }

  async searchUsers(query: string, limit: number = 10, offset: number = 0): Promise<ApiResponse<{ users: unknown[] }>> {
    return this.request(`/users/search?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
  }

  async getUserById(userId: string): Promise<ApiResponse<{ user: unknown; sessions: unknown[] }>> {
    return this.request(`/users/${userId}`);
  }

  // Session endpoints
  async getSessions(params: {
    subject?: string;
    date?: string;
    creator_id?: string;
    limit?: number;
    offset?: number;
    status?: string;
  } = {}): Promise<ApiResponse<{ sessions: unknown[] }>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });
    
    return this.request(`/sessions?${searchParams.toString()}`);
  }

  async getSession(sessionId: string): Promise<ApiResponse<{
    session: unknown;
    participants: unknown[];
    isParticipant: boolean;
  }>> {
    return this.request(`/sessions/${sessionId}`);
  }

  async createSession(sessionData: {
    title: string;
    description: string;
    subject: string;
    date: string;
    start_time: string;
    duration: number;
    max_participants?: number;
    location?: string;
    is_online?: boolean;
    meeting_link?: string;
    tags?: string[];
  }): Promise<ApiResponse<{ session: unknown }>> {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateSession(sessionId: string, sessionData: {
    title?: string;
    description?: string;
    subject?: string;
    date?: string;
    start_time?: string;
    duration?: number;
    max_participants?: number;
    location?: string;
    is_online?: boolean;
    meeting_link?: string;
    tags?: string[];
  }): Promise<ApiResponse<{ session: unknown }>> {
    return this.request(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  async deleteSession(sessionId: string): Promise<ApiResponse> {
    return this.request(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  async joinSession(sessionId: string): Promise<ApiResponse> {
    return this.request(`/sessions/${sessionId}/join`, {
      method: 'POST',
    });
  }

  async leaveSession(sessionId: string): Promise<ApiResponse> {
    return this.request(`/sessions/${sessionId}/leave`, {
      method: 'POST',
    });
  }

  async getSessionMessages(sessionId: string, limit: number = 50, offset: number = 0): Promise<ApiResponse<{ messages: unknown[] }>> {
    return this.request(`/sessions/${sessionId}/messages?limit=${limit}&offset=${offset}`);
  }

  async sendMessage(sessionId: string, message: string, messageType: string = 'text'): Promise<ApiResponse> {
    return this.request(`/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message, message_type: messageType }),
    });
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Auth context helper
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}; 