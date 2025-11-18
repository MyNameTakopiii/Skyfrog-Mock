/**
 * Validate first name
 */
export const validateFirstName = (firstName: string): string => {
  if (!firstName.trim()) {
    return "First name is required";
  }
  if (firstName.length > 50) {
    return "First name must be less than 50 characters";
  }
  return "";
};

/**
 * Validate last name
 */
export const validateLastName = (lastName: string): string => {
  if (!lastName.trim()) {
    return "Last name is required";
  }
  if (lastName.length > 50) {
    return "Last name must be less than 50 characters";
  }
  return "";
};

/**
 * Validate email address
 */
export const validateEmail = (email: string): string => {
  if (!email.trim()) {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address";
  }
  return "";
};

/**
 * Validate phone number (Thai format)
 */
export const validatePhone = (phone: string): string => {
  if (!phone.trim()) {
    return "Phone number is required";
  }
  if (!/^0\d{9}$/.test(phone)) {
    return "Phone number must be 10 digits starting with 0";
  }
  return "";
};

/**
 * Validate password
 */
export const validatePassword = (password: string): string => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (password.length > 100) {
    return "Password must be less than 100 characters";
  }
  return "";
};

/**
 * Validate password confirmation
 */
export const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return "";
};

/**
 * Validate registration form
 */
export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface RegistrationValidationErrors {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const validateRegistrationForm = (
  formData: RegistrationFormData,
): { isValid: boolean; errors: RegistrationValidationErrors } => {
  const errors: RegistrationValidationErrors = {
    firstName: validateFirstName(formData.firstName),
    lastName: validateLastName(formData.lastName),
    email: validateEmail(formData.email),
    phone: validatePhone(formData.phone),
    password: validatePassword(formData.password),
    confirmPassword: validateConfirmPassword(
      formData.password,
      formData.confirmPassword,
    ),
  };

  const isValid = !Object.values(errors).some((error) => error !== "");

  return { isValid, errors };
};

/**
 * Validate login form
 */
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginValidationErrors {
  email: string;
  password: string;
}

export const validateLoginForm = (
  formData: LoginFormData,
): { isValid: boolean; errors: LoginValidationErrors } => {
  const errors: LoginValidationErrors = {
    email: validateEmail(formData.email),
    password: !formData.password ? "Password is required" : "",
  };

  const isValid = !Object.values(errors).some((error) => error !== "");

  return { isValid, errors };
};
