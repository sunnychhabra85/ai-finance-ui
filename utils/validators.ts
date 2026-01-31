export const isEmailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPasswordValid = (password: string) =>
  password.length >= 6;
