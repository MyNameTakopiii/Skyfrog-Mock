import type { RegisterUserDTO, LoginUserDTO } from "../../types";
import { registerQuery, loginQuery, fetchCurrentUserQuery } from "./query/auth";
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
  getLocalStorageJSON,
  setLocalStorageJSON,
} from "./query/helpers";

interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UseAuthReturn {
  user: ComputedRef<AuthUser | null>;
  token: ComputedRef<string | null>;
  isAuthenticated: ComputedRef<boolean>;
  isLoading: ComputedRef<boolean>;
  error: ComputedRef<string | null>;
  register: (
    data: RegisterUserDTO,
  ) => Promise<{ success: boolean; error?: string }>;
  login: (data: LoginUserDTO) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  fetchCurrentUser: () => Promise<{ success: boolean; error?: string }>;
  getAuthHeaders: () => { Authorization?: string };
  clearError: () => void;
}

export const useCustomAuth = (): UseAuthReturn => {
  // Reactive state for authentication
  const state = useState<AuthState>("auth", () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }));

  /**
   * Initialize auth state from localStorage on client side
   */
  const initAuth = () => {
    const token = getLocalStorage("auth_token");
    const user = getLocalStorageJSON<AuthUser>("auth_user");

    if (token && user) {
      state.value.token = token;
      state.value.user = user;
      state.value.isAuthenticated = true;
    }
  };

  /**
   * Register a new user account
   * @param data - Registration data (firstName, lastName, email, password)
   * @returns Promise with success status
   */
  const register = async (
    data: RegisterUserDTO,
  ): Promise<{ success: boolean; error?: string }> => {
    state.value.isLoading = true;
    state.value.error = null;

    const result = await registerQuery(data);

    if (result.success) {
      state.value.isLoading = false;
      return { success: true };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Registration failed";
    return { success: false, error: result.error };
  };

  /**
   * Login with email and password
   * @param data - Login credentials (email, password)
   * @returns Promise with success status
   */
  const login = async (
    data: LoginUserDTO,
  ): Promise<{ success: boolean; error?: string }> => {
    state.value.isLoading = true;
    state.value.error = null;

    const result = await loginQuery(data);

    if (result.success && result.token && result.user) {
      // Store token and user in state
      state.value.token = result.token;
      state.value.user = result.user;
      state.value.isAuthenticated = true;

      // Persist to localStorage
      setLocalStorage("auth_token", result.token);
      setLocalStorageJSON("auth_user", result.user);

      state.value.isLoading = false;
      return { success: true };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Login failed";
    return { success: false, error: result.error };
  };

  /**
   * Logout the current user
   * Clears authentication state and localStorage
   */
  const logout = () => {
    // Clear state
    state.value.user = null;
    state.value.token = null;
    state.value.isAuthenticated = false;
    state.value.error = null;

    // Clear localStorage
    removeLocalStorage("auth_token");
    removeLocalStorage("auth_user");
  };

  /**
   * Fetch current user data from the server
   * Validates the stored token and refreshes user data
   * @returns Promise with success status
   */
  const fetchCurrentUser = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    if (!state.value.token) {
      return { success: false, error: "No token available" };
    }

    state.value.isLoading = true;
    state.value.error = null;

    const result = await fetchCurrentUserQuery(state.value.token);

    if (result.success && result.user) {
      state.value.user = result.user;
      state.value.isAuthenticated = true;

      // Update localStorage
      setLocalStorageJSON("auth_user", result.user);

      state.value.isLoading = false;
      return { success: true };
    }

    state.value.isLoading = false;
    state.value.error = result.error || "Failed to fetch user";

    // If token is invalid, logout
    if (
      result.error?.includes("401") ||
      result.error?.includes("Unauthorized")
    ) {
      logout();
    }

    return { success: false, error: result.error };
  };

  /**
   * Get authorization header for API requests
   * @returns Authorization header object or empty object
   */
  const getAuthHeaders = () => {
    if (state.value.token) {
      return {
        Authorization: `Bearer ${state.value.token}`,
      };
    }
    return {};
  };

  /**
   * Clear error message
   */
  const clearError = () => {
    state.value.error = null;
  };

  // Initialize auth state on composable creation
  initAuth();

  return {
    // State
    user: computed(() => state.value.user),
    token: computed(() => state.value.token),
    isAuthenticated: computed(() => state.value.isAuthenticated),
    isLoading: computed(() => state.value.isLoading),
    error: computed(() => state.value.error),

    // Methods
    register,
    login,
    logout,
    fetchCurrentUser,
    getAuthHeaders,
    clearError,
  };
};
