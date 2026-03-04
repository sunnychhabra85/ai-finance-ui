import { apiPost } from './api';

export const loginApi = (email: string, password: string) =>
  apiPost('/auth/login', { email, password });

export const registerApi = (email: string, password: string, firstName: string) =>
  apiPost('/auth/register', { email, password, firstName });

export const logoutApi = () => apiPost('/auth/logout', {});
