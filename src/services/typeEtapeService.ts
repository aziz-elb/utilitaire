import api from './api';

export interface TypeEtape {
  id: string;
  libelle: string;
}

export interface TypeEtapeInput {
  libelle: string;
}

export const getTypeEtapes = async (): Promise<TypeEtape[]> => {
  const response = await api.get('/type-etapes');
  return response.data;
};

export const getTypeEtapeById = async (id: string): Promise<TypeEtape> => {
  const response = await api.get(`/type-etapes/${id}`);
  return response.data;
};

export const addTypeEtape = async (data: TypeEtapeInput): Promise<TypeEtape> => {
  const response = await api.post('/type-etapes', data);
  return response.data;
};

export const updateTypeEtape = async (id: string, data: TypeEtapeInput): Promise<TypeEtape> => {
  const response = await api.put(`/type-etapes/${id}`, data);
  return response.data;
};

export const updateTypeEtapePartial = async (id: string, data: Partial<TypeEtapeInput>): Promise<TypeEtape> => {
  const response = await api.patch(`/type-etapes/${id}`, data);
  return response.data;
};

export const deleteTypeEtape = async (id: string): Promise<void> => {
  await api.delete(`/type-etapes/${id}`);
};

export default {
  getTypeEtapes,
  getTypeEtapeById,
  addTypeEtape,
  updateTypeEtape,
  updateTypeEtapePartial,
  deleteTypeEtape,
}; 