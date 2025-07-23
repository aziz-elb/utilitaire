import api from './api';

export interface ProjetPartiePrenante {
  id: string;
  projetId: string;
  membreEmail: string;
  typePartiePrenanteId: string;
  niveauInfluenceId: string;
  createurEmail: string;
  dateCreation: string;
  modificateurEmail?: string;
  dateModification?: string;
  typePartiePrenante?: {
    id: string;
    libelle: string;
  };
  niveauInfluence?: {
    id: string;
    description: string;
  };
}

export interface PartiePrenanteInput {
  projetId: string;
  typePartiePrenanteId: string;
  membreEmail: string;
  niveauInfluenceId: string;
}

export interface PartiePrenanteUpdate {
  projetId?: string;
  typePartiePrenanteId?: string;
  membreEmail?: string;
  niveauInfluenceId?: string;
}

// Récupérer les parties prenantes d'un projet
export const getPartiesPrenantesByProjet = async (projetId: string): Promise<ProjetPartiePrenante[]> => {
  try {
    const response = await api.get(`/parties-prenantes/projet/${projetId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des parties prenantes du projet:', error);
    throw error;
  }
};

// Créer une nouvelle partie prenante
export const createPartiePrenante = async (data: PartiePrenanteInput): Promise<ProjetPartiePrenante> => {
  try {
    const response = await api.post('/parties-prenantes', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la partie prenante:', error);
    throw error;
  }
};

// Mettre à jour une partie prenante
export const updatePartiePrenante = async (id: string, data: PartiePrenanteUpdate): Promise<ProjetPartiePrenante> => {
  try {
    const response = await api.put(`/parties-prenantes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la partie prenante:', error);
    throw error;
  }
};

// Supprimer une partie prenante
export const deletePartiePrenante = async (id: string): Promise<void> => {
  try {
    await api.delete(`/parties-prenantes/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de la partie prenante:', error);
    throw error;
  }
};

export default {
  getPartiesPrenantesByProjet,
  createPartiePrenante,
  updatePartiePrenante,
  deletePartiePrenante,
}; 