import { LoginDTO, User, Tokens } from '../types/model';
import apiClient from './tokenManagement/apiClient';
import { TokenService } from './tokenManagement/TokenService';


export const login = async (credentials: LoginDTO): Promise<Tokens> => {
  const response = await apiClient.post<Tokens>('/Auth/login', credentials);
  TokenService.setTokens(response.data);
  return response.data;
};

export const signup = async (user: User): Promise<void> => {
  await apiClient.post('/Auth/signup', user);
};