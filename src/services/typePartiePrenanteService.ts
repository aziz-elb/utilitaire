import api from './api';

export interface TypePartiePrenante {
  id: string;
  description: string;
  code?: string;
  actif?: boolean;
}

export interface TypePartiePrenanteInput {
  description: string;
}

export const getTypePartiePrenantes = async (): Promise<TypePartiePrenante[]> => {
  try {
    const response = await api.get('/type-partie-prenantes');
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des types de parties prenantes:', error);
    throw error;
  }
};

export const getTypePartiePrenanteById = async (id: string): Promise<TypePartiePrenante> => {
  try {
    const response = await api.get(`/type-partie-prenantes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement du type de partie prenante:', error);
    throw error;
  }
};

export const addTypePartiePrenante = async (data: TypePartiePrenanteInput): Promise<TypePartiePrenante> => {
  const response = await api.post('/type-partie-prenantes', data);
  return response.data;
};

export const updateTypePartiePrenante = async (id: string, data: Partial<TypePartiePrenante>): Promise<TypePartiePrenante> => {
  try {
    const response = await api.put(`/type-partie-prenantes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du type de partie prenante:', error);
    throw error;
  }
};

export const updateTypePartiePrenantePartial = async (id: string, data: Partial<TypePartiePrenanteInput>): Promise<TypePartiePrenante> => {
  const response = await api.patch(`/type-partie-prenantes/${id}`, data);
  return response.data;
};

export const deleteTypePartiePrenante = async (id: string): Promise<void> => {
  try {
    await api.delete(`/type-partie-prenantes/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression du type de partie prenante:', error);
    throw error;
  }
};

export default {
  getTypePartiePrenantes,
  getTypePartiePrenanteById,
  addTypePartiePrenante,
  updateTypePartiePrenante,
  updateTypePartiePrenantePartial,
  deleteTypePartiePrenante,
}; 