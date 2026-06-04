import { login, register } from './mockAuth.js';
export const loginApi = async (payload) => login(payload.email, payload.password);
export const registerApi = async (payload) => register(payload.name, payload.email, payload.password);
export { login, register };
