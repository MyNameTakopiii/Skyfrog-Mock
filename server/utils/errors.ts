import { z } from "zod";

/**
 * Error utility functions for consistent error handling across the API
 */

/**
 * Handle validation errors from Zod
 */
export function handleValidationError(error: z.ZodError) {
  throw createError({
    statusCode: 400,
    message: "Validation failed",
    data: error.issues,
  });
}

/**
 * Handle authentication errors
 */
export function handleAuthError(message: string = "Authentication required") {
  throw createError({
    statusCode: 401,
    message,
  });
}

/**
 * Handle not found errors
 */
export function handleNotFoundError(message: string = "Resource not found") {
  throw createError({
    statusCode: 404,
    message,
  });
}

/**
 * Handle server errors
 */
export function handleServerError(message: string = "Internal server error") {
  throw createError({
    statusCode: 500,
    message,
  });
}

/**
 * Handle bad request errors
 */
export function handleBadRequestError(message: string = "Bad request") {
  throw createError({
    statusCode: 400,
    message,
  });
}

/**
 * Generic error handler that checks error type and throws appropriate error
 */
export function handleError(
  error: unknown,
  defaultMessage: string = "An error occurred",
) {
  if (error instanceof z.ZodError) {
    handleValidationError(error);
  }

  if (typeof error === "object" && error !== null && "statusCode" in error) {
    throw error;
  }

  handleServerError(defaultMessage);
}
