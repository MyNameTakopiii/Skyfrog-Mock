export const getErrorMessage = (
  error: unknown,
  defaultMessage: string,
): string => {
  const errorMessage =
    (error as { data?: { message?: string }; message?: string })?.data
      ?.message ||
    (error as { message?: string })?.message ||
    defaultMessage;

  return errorMessage;
};

export const getAuthHeaders = (): Record<string, string> => {
  if (import.meta.client) {
    const token = localStorage.getItem("auth_token");
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }
  }
  return {};
};

export const getLocalStorage = (key: string): string | null => {
  if (import.meta.client) {
    return localStorage.getItem(key);
  }
  return null;
};

export const setLocalStorage = (key: string, value: string): void => {
  if (import.meta.client) {
    localStorage.setItem(key, value);
  }
};

export const removeLocalStorage = (key: string): void => {
  if (import.meta.client) {
    localStorage.removeItem(key);
  }
};

export const getLocalStorageJSON = <T>(key: string): T | null => {
  const value = getLocalStorage(key);
  if (value) {
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }
  return null;
};

export const setLocalStorageJSON = <T>(key: string, value: T): void => {
  setLocalStorage(key, JSON.stringify(value));
};
