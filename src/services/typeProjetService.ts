import api from './api';

export interface TypeProjet {
  id: string;
  libelle: string;
  description: string;
  actifYn: boolean;
}

const BASE_URL = '/type-projets';

export const getTypeProjets = async (): Promise<TypeProjet[]> => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const addTypeProjet = async (typeProjet: Omit<TypeProjet, 'id'>) => {
  const response = await api.post<TypeProjet>(BASE_URL, typeProjet);
  return response.data;
};

export const updateTypeProjet = async (id: string, typeProjet: Partial<Omit<TypeProjet, 'id'>>) => {
  const response = await api.put<TypeProjet>(`${BASE_URL}/${id}`, typeProjet);
  return response.data;
};

export const deleteTypeProjet = async (id: string) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
}; 