import { vi } from 'vitest';

// Mock user data
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    name: 'Test User'
  },
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z'
};

// Mock session data
export const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser
};

// Mock auth response for successful operations
export const mockAuthSuccess = {
  data: {
    user: mockUser,
    session: mockSession
  },
  error: null
};

// Mock auth response for errors
export const mockAuthError = {
  data: {
    user: null,
    session: null
  },
  error: {
    message: 'Invalid credentials',
    status: 400
  }
};

// Mock Supabase client
export const createMockSupabaseClient = () => {
  const mockAuth = {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    verifyOtp: vi.fn(),
    getUser: vi.fn(),
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(() => {
      return {
        data: { subscription: { unsubscribe: vi.fn() } }
      };
    })
  };

  const mockSupabase = {
    auth: mockAuth,
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn()
    }))
  };

  return { mockSupabase, mockAuth };
};

// Mock fetch for API calls
export const mockFetch = vi.fn();

// Helper to setup successful auth responses
export const setupSuccessfulAuth = (mockAuth: any) => {
  mockAuth.signUp.mockResolvedValue(mockAuthSuccess);
  mockAuth.signInWithPassword.mockResolvedValue(mockAuthSuccess);
  mockAuth.signOut.mockResolvedValue({ error: null });
  mockAuth.resetPasswordForEmail.mockResolvedValue({ error: null });
  mockAuth.verifyOtp.mockResolvedValue(mockAuthSuccess);
  mockAuth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  mockAuth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });
};

// Helper to setup failed auth responses
export const setupFailedAuth = (mockAuth: any, errorMessage = 'Authentication failed') => {
  const errorResponse = {
    data: { user: null, session: null },
    error: { message: errorMessage, status: 400 }
  };
  
  mockAuth.signUp.mockResolvedValue(errorResponse);
  mockAuth.signInWithPassword.mockResolvedValue(errorResponse);
  mockAuth.signOut.mockResolvedValue({ error: { message: errorMessage } });
  mockAuth.resetPasswordForEmail.mockResolvedValue({ error: { message: errorMessage } });
  mockAuth.verifyOtp.mockResolvedValue(errorResponse);
  mockAuth.getUser.mockResolvedValue({ data: { user: null }, error: { message: errorMessage } });
  mockAuth.getSession.mockResolvedValue({ data: { session: null }, error: { message: errorMessage } });
};

// Mock API responses
export const mockApiSuccess = {
  ok: true,
  status: 200,
  json: vi.fn().mockResolvedValue({ success: true, user: mockUser })
};

export const mockApiError = {
  ok: false,
  status: 400,
  json: vi.fn().mockResolvedValue({ error: 'API Error' })
};

// Setup mock fetch responses
export const setupSuccessfulApi = () => {
  mockFetch.mockResolvedValue(mockApiSuccess);
};

export const setupFailedApi = () => {
  mockFetch.mockResolvedValue(mockApiError);
};