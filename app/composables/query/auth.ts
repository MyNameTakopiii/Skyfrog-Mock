import type { RegisterUserDTO, LoginUserDTO } from "../../../types";
import { API_ENDPOINTS } from "./api-endpoints";
import { getErrorMessage } from "./helpers";

interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Register a new user account
 * Public endpoint - no authentication required
 */
export const registerQuery = async (
  data: RegisterUserDTO,
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    const response = await $fetch<{ success: boolean; user: AuthUser }>(
      API_ENDPOINTS.AUTH_REGISTER,
      {
        method: "POST",
        body: data,
      },
    );

    if (response.success && response.user) {
      return { success: true, user: response.user };
    }

    return { success: false, error: "Registration failed" };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Registration failed"),
    };
  }
};

/**
 * Login with email and password
 * Public endpoint - no authentication required
 */
export const loginQuery = async (
  data: LoginUserDTO,
): Promise<{
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}> => {
  try {
    const response = await $fetch<{
      success: boolean;
      token: string;
      user: AuthUser;
    }>(API_ENDPOINTS.AUTH_LOGIN, {
      method: "POST",
      body: data,
    });

    if (response.success && response.token && response.user) {
      return { success: true, token: response.token, user: response.user };
    }

    return { success: false, error: "Login failed" };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error, "Login failed") };
  }
};

/**
 * Fetch current user data from the server
 * Protected endpoint - requires authentication
 */
export const fetchCurrentUserQuery = async (
  token: string,
): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
  try {
    const response = await $fetch<{ success: boolean; user: AuthUser }>(
      API_ENDPOINTS.AUTH_ME,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.success && response.user) {
      return { success: true, user: response.user };
    }

    return { success: false, error: "Failed to fetch user" };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error, "Failed to fetch user"),
    };
  }
};
