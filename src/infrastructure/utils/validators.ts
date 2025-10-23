export const validators = {
  isEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isPassword: (password: string, minLength: number = 6): boolean => {
    return password.length >= minLength;
  },

  isRequired: (value: string): boolean => {
    return value.trim().length > 0;
  },

  isMinLength: (value: string, minLength: number): boolean => {
    return value.length >= minLength;
  },

  isMaxLength: (value: string, maxLength: number): boolean => {
    return value.length <= maxLength;
  },

  isNumber: (value: string): boolean => {
    return !isNaN(Number(value));
  },

  isPositive: (value: number): boolean => {
    return value > 0;
  },
};
