import { Dashboard, OverdueBorrower } from '../types/dashboard';
import apiClient from './tokenManagement/apiClient';

export const getDashboardData = async (): Promise<Dashboard> => {
  const response = await apiClient.get<Dashboard>('/Dashboard/GetDashboardData');
  return response.data;
};

export const getOverdueBorrowers = async (): Promise<OverdueBorrower[]> => {
  const response = await apiClient.get<OverdueBorrower[]>('/Dashboard/GetOverdueBorrowers');
  return response.data;
};