import api from './api';

const BASE_URL = '';

// Modèle Projet (Template)
export const getTemplates = async () => {
  const response = await api.get(`${BASE_URL}/modele-projets`);
  return response.data;
};

export const addTemplate = async (template: {
  description: string;
  actifYn: boolean;
  etapeModeles?: any[];
}) => {
  const response = await api.post(`${BASE_URL}/modele-projets`, template);
  return response.data;
};

export const deleteTemplate = async (id: string) => {
  const response = await api.delete(`${BASE_URL}/modele-projets/${id}`);
  return response.data;
};

// Étape Modèle
export const getEtapeModeles = async () => {
  const response = await api.get(`${BASE_URL}/etape-modeles`);
  return response.data;
};

export const addEtapeModele = async (etape: {
  description: string;
  ordre: number;
  modeleProjetId: string;
}) => {
  const response = await api.post(`${BASE_URL}/etape-modeles`, etape);
  return response.data;
};

// Update Modèle Projet (Template)
export const updateTemplate = async (id: string, template: {
  description: string;
  actifYn: boolean;
}) => {
  const response = await api.put(`${BASE_URL}/modele-projets/${id}`, template);
  return response.data;
};

// Update Étape Modèle
export const updateEtapeModele = async (id: string, etape: {
  description: string;
  ordre: number;
  modeleProjetId: string;
}) => {
  const response = await api.put(`${BASE_URL}/etape-modeles/${id}`, etape);
  return response.data;
}; 