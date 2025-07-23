import api from './api';

export interface StatutProjet {
  id: string;
  libelle: string;
}

const BASE_URL = '/statut-projets';

export const getStatutProjets = async (): Promise<StatutProjet[]> => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const addStatutProjet = async (statutProjet: Omit<StatutProjet, 'id'>) => {
  const response = await api.post<StatutProjet>(BASE_URL, statutProjet);
  return response.data;
};

export const updateStatutProjet = async (id: string, statutProjet: Partial<Omit<StatutProjet, 'id'>>) => {
  const response = await api.put<StatutProjet>(`${BASE_URL}/${id}`, statutProjet);
  return response.data;
};



export const deleteStatutProjet = async (id: string) => {
  const response = await api.delete(`${BASE_URL}/${id}`);
  return response.data;
}; 