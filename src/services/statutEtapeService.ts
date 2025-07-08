import api from './api';

export interface StatutEtape {
  id: string;
  description: string;
}

export interface StatutEtapeInput {
  description: string;
}

export const getStatutEtapes = async (): Promise<StatutEtape[]> => {
  const response = await api.get('/statut-etapes');
  return response.data;
};

export const getStatutEtapeById = async (id: string): Promise<StatutEtape> => {
  const response = await api.get(`/statut-etapes/${id}`);
  return response.data;
};

export const addStatutEtape = async (data: StatutEtapeInput): Promise<StatutEtape> => {
  const response = await api.post('/statut-etapes', data);
  return response.data;
};

export const updateStatutEtape = async (id: string, data: StatutEtapeInput): Promise<StatutEtape> => {
  const response = await api.put(`/statut-etapes/${id}`, data);
  return response.data;
};

export const updateStatutEtapePartial = async (id: string, data: Partial<StatutEtapeInput>): Promise<StatutEtape> => {
  const response = await api.patch(`/statut-etapes/${id}`, data);
  return response.data;
};

export const deleteStatutEtape = async (id: string): Promise<void> => {
  await api.delete(`/statut-etapes/${id}`);
};

export default {
  getStatutEtapes,
  getStatutEtapeById,
  addStatutEtape,
  updateStatutEtape,
  updateStatutEtapePartial,
  deleteStatutEtape,
}; 