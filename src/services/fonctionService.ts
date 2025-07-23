import api from './api';

export interface Fonction {
  id: string;
  libelle: string;
}

export const getFonctions = async (): Promise<Fonction[]> => {
  const response = await api.get('/fonctions');
  return response.data;
};

export const addFonction = async (fonction: Omit<Fonction, 'id'>): Promise<Fonction> => {
  const { data } = await api.post<Fonction>('/fonctions', fonction);
  return data;
};

export const updateFonction = async (fonction: Fonction): Promise<Fonction> => {
  const { data } = await api.put<Fonction>(`/fonctions/${fonction.id}`, fonction);
  return data;
};

export const deleteFonction = async (id: string): Promise<void> => {
  await api.delete(`/fonctions/${id}`);
}; 