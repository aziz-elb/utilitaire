import api from './api';

export interface Entite {
  entiteId: string;
  titre: string;
  description: string;
}

export const getEntites = async (): Promise<Entite[]> => {
  const response = await api.get('/entites');
  return response.data;
};

export const addEntite = async (entite: Omit<Entite, 'entiteId'>): Promise<Entite> => {
  const { data } = await api.post<Entite>('/entites', entite);
  return data;
};

export const updateEntite = async (entite: Entite): Promise<Entite> => {
  const { data } = await api.put<Entite>(`/entites/${entite.entiteId}`, entite);
  return data;
};

export const deleteEntite = async (entiteId: string): Promise<void> => {
  await api.delete(`/entites/${entiteId}`);
}; 