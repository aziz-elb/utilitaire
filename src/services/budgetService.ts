import api from './api';
import type { PosteCout } from './posteCoutService';

export interface Budget {
  id: string;
  libelle: string;
  description: string;
  posteCout: PosteCout;
  allocationBudgetList?: any[];
}

export const getBudgets = async (): Promise<Budget[]> => {
  const response = await api.get('/budget/');
  return response.data;
};

export const addBudget = async (budget: { libelle: string; description: string; posteCoutId: string }): Promise<Budget> => {
  const { data } = await api.post<Budget>('/budget/create', budget);
  return data;
};

export const updateBudget = async (budget: Budget & { posteCoutId: string }): Promise<Budget> => {
  const { id, libelle, description, posteCoutId } = budget;
  const { data } = await api.put<Budget>(`/budget/update?budgetId=${id}`, { libelle, description, posteCoutId });
  return data;
};

export const deleteBudget = async (id: string): Promise<void> => {
  await api.delete(`/budget/delete?budgetId=${id}`);
}; 