import api from './api';

export interface ActiviteProjet {
  id: string;
  projetId: string;
  typeActiviteId: string;
  contenu: string;
  createurEmail?: string;
  dateCreation?: string;
  modificateurEmail?: string;
  dateModification?: string;
}

export interface ActiviteProjetInput {
  projetId: string;
  typeActiviteId: string;
  contenu: string;
}

export interface ActiviteProjetUpdate {
  typeActiviteId: string;
  contenu: string;
}

// Récupérer toutes les activités d'un projet
export const getActivitesProjet = async (projetId: string): Promise<ActiviteProjet[]> => {
  try {
    const response = await api.get(`/activite-projets/projet/${projetId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des activités du projet:', error);
    throw error;
  }
};

// Récupérer une activité par ID
export const getActiviteProjetById = async (id: string): Promise<ActiviteProjet> => {
  try {
    const response = await api.get(`/activite-projets/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement de l\'activité:', error);
    throw error;
  }
};

// Créer une nouvelle activité
export const createActiviteProjet = async (data: ActiviteProjetInput): Promise<ActiviteProjet> => {
  try {
    const response = await api.post('/activite-projets', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'activité:', error);
    throw error;
  }
};

// Mettre à jour une activité
export const updateActiviteProjet = async (id: string, data: ActiviteProjetUpdate): Promise<ActiviteProjet> => {
  try {
    const response = await api.put(`/activite-projets/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'activité:', error);
    throw error;
  }
};

// Supprimer une activité
export const deleteActiviteProjet = async (id: string): Promise<void> => {
  try {
    await api.delete(`/activite-projets/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'activité:', error);
    throw error;
  }
};

export default {
  getActivitesProjet,
  getActiviteProjetById,
  createActiviteProjet,
  updateActiviteProjet,
  deleteActiviteProjet,
}; 