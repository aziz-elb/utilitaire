import api from './api';

export interface NiveauInfluence {
  id: string;
  description: string;
  code?: string;
  actif?: boolean;
}

export interface NiveauInfluenceInput {
  description: string;
}

export const getNiveauInfluences = async (): Promise<NiveauInfluence[]> => {
  try {
    const response = await api.get('/niveau-influences');
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des niveaux d\'influence:', error);
    throw error;
  }
};

export const getNiveauInfluenceById = async (id: string): Promise<NiveauInfluence> => {
  try {
    const response = await api.get(`/niveau-influences/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement du niveau d\'influence:', error);
    throw error;
  }
};

export const addNiveauInfluence = async (data: NiveauInfluenceInput): Promise<NiveauInfluence> => {
  const response = await api.post('/niveau-influences', data);
  return response.data;
};

export const updateNiveauInfluence = async (id: string, data: Partial<NiveauInfluence>): Promise<NiveauInfluence> => {
  try {
    const response = await api.put(`/niveau-influences/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du niveau d\'influence:', error);
    throw error;
  }
};

export const updateNiveauInfluencePartial = async (id: string, data: Partial<NiveauInfluenceInput>): Promise<NiveauInfluence> => {
  const response = await api.patch(`/niveau-influences/${id}`, data);
  return response.data;
};

export const deleteNiveauInfluence = async (id: string): Promise<void> => {
  try {
    await api.delete(`/niveau-influences/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression du niveau d\'influence:', error);
    throw error;
  }
};

export default {
  getNiveauInfluences,
  getNiveauInfluenceById,
  addNiveauInfluence,
  updateNiveauInfluence,
  updateNiveauInfluencePartial,
  deleteNiveauInfluence,
}; 