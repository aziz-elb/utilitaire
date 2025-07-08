import api from './api';

export interface TypeActivite {
  id: string;
  description: string;
}

export interface TypeActiviteInput {
  description: string;
}

export const getTypeActivites = async (): Promise<TypeActivite[]> => {
  const response = await api.get('/type-activites');
  return response.data;
};

export const getTypeActiviteById = async (id: string): Promise<TypeActivite> => {
  const response = await api.get(`/type-activites/${id}`);
  return response.data;
};

export const addTypeActivite = async (data: TypeActiviteInput): Promise<TypeActivite> => {
  const response = await api.post('/type-activites', data);
  return response.data;
};

export const updateTypeActivite = async (id: string, data: TypeActiviteInput): Promise<TypeActivite> => {
  const response = await api.put(`/type-activites/${id}`, data);
  return response.data;
};

export const updateTypeActivitePartial = async (id: string, data: Partial<TypeActiviteInput>): Promise<TypeActivite> => {
  const response = await api.patch(`/type-activites/${id}`, data);
  return response.data;
};

export const deleteTypeActivite = async (id: string): Promise<void> => {
  await api.delete(`/type-activites/${id}`);
};

export default {
  getTypeActivites,
  getTypeActiviteById,
  addTypeActivite,
  updateTypeActivite,
  updateTypeActivitePartial,
  deleteTypeActivite,
}; 