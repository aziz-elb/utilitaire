import api from './api';

export interface TypeCommentaire {
  id: string;
  description: string;
}

const BASE_URL = '/type-commentaires';

export const getTypeCommentaires = async (): Promise<TypeCommentaire[]> => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const addTypeCommentaire = async (typeCommentaire: Omit<TypeCommentaire, 'id'>) => {
  const response = await api.post<TypeCommentaire>(BASE_URL, typeCommentaire);
  return response.data;
};

export const updateTypeCommentaire = async (id: string, typeCommentaire: Partial<Omit<TypeCommentaire, 'id'>>) => {
  const response = await api.put<TypeCommentaire>(`${BASE_URL}/${id}`, typeCommentaire);
  return response.data;
};

export const deleteTypeCommentaire = async (id: string) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
}; 