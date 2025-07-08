import api from './api';
import { AxiosError } from 'axios';

export interface ProjectInput {
  titre: string;
  description: string;
  modeleProjetId: string;
  etapeModeleId: string;
  dateDebut: string; // format YYYY-MM-DD
  dateFin: string;   // format YYYY-MM-DD
  dateCible: string; // format YYYY-MM-DD
  progressionPct: number;
  niveauComplexite: string;
  documentationDeposeeYn: boolean;
  passationTermineeYn: boolean;
}

export interface Project {
  id: string;
  titre: string;
  description: string;
  modeleProjetId: string;
  etapeModeleId: string;
  dateDebut: string;
  dateFin: string;
  dateCible: string;
  progressionPct: number;
  niveauComplexite: string;
  documentationDeposeeYn: boolean;
  passationTermineeYn: boolean;
  // Ajoutez d'autres champs selon la réponse de l'API
}

export const addProject = async (data: ProjectInput): Promise<Project> => {
  console.log('=== AJOUT PROJET - DÉBUT ===');
  console.log('URL de la requête:', '/projets');
  console.log('Méthode: POST');
  console.log('Body envoyé au backend:', JSON.stringify(data, null, 2));
  console.log('Type de données:', typeof data);
  console.log('Propriétés du body:');
  Object.entries(data).forEach(([key, value]) => {
    console.log(`  ${key}:`, value, `(type: ${typeof value})`);
  });
  
  try {
    console.log('Envoi de la requête...');
    const response = await api.post('/projets', data);
    console.log('Réponse reçue:', response);
    console.log('=== AJOUT PROJET - SUCCÈS ===');
    return response.data;
  } catch (error) {
    console.error('=== AJOUT PROJET - ERREUR ===');
    console.error('Erreur complète:', error);
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error('Status:', axiosError.response.status);
      console.error('Headers:', axiosError.response.headers);
      console.error('Data:', axiosError.response.data);
    }
    console.error('Config de la requête:', axiosError.config);
    throw error;
  }
};

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projets');
  return response.data;
};

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await api.get(`/projets/${id}`);
  return response.data;
};

export const updateProject = async (id: string, data: Partial<ProjectInput>): Promise<Project> => {
  const response = await api.put(`/projets/${id}`, data);
  return response.data;
};

export const updateProjectPartial = async (id: string, data: Partial<ProjectInput>): Promise<Project> => {
  const response = await api.patch(`/projets/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projets/${id}`);
};

export default {
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  updateProjectPartial,
  deleteProject,
}; 