import api from './api';

export interface EtapeProjet {
  id: string;
  projetId: string;
  titre: string;
  description: string;
  progressionPct: number;
  ordre: number;
  priorite: 'HAUTE' | 'MOYEN' | 'BAS';
  dateDebut: string;
  dateFin: string;
  statutId: string;
  typeEtapeId: string;
  createurEmail?: string;
  dateCreation?: string;
  modificateurEmail?: string;
  dateModification?: string;
}

export interface EtapeProjetInput {
  projetId: string;
  titre: string;
  description: string;
  progressionPct: number;
  ordre: number;
  priorite: 'HAUTE' | 'MOYEN' | 'BAS';
  dateDebut: string;
  dateFin: string;
  statutId: string;
  typeEtapeId: string;
}

export interface EtapeProjetUpdate {
  titre?: string;
  description?: string;
  progressionPct?: number;
  ordre?: number;
  priorite?: 'HAUTE' | 'MOYEN' | 'BAS';
  dateDebut?: string;
  dateFin?: string;
  statutId?: string;
  typeEtapeId?: string;
}

// Récupérer toutes les étapes d'un projet
export const getEtapesProjet = async (projetId: string): Promise<EtapeProjet[]> => {
  try {
    const response = await api.get('/etape-projets');
    // Filtrer les étapes pour le projet spécifique
    return response.data.filter((etape: EtapeProjet) => etape.projetId === projetId);
  } catch (error) {
    console.error('Erreur lors du chargement des étapes du projet:', error);
    throw error;
  }
};

// Récupérer toutes les étapes
export const getAllEtapesProjet = async (): Promise<EtapeProjet[]> => {
  try {
    const response = await api.get('/etape-projets');
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des étapes:', error);
    throw error;
  }
};

// Récupérer une étape par ID
export const getEtapeProjetById = async (id: string): Promise<EtapeProjet> => {
  try {
    const response = await api.get(`/etape-projets/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement de l\'étape:', error);
    throw error;
  }
};

// Créer une nouvelle étape
export const createEtapeProjet = async (data: EtapeProjetInput): Promise<EtapeProjet> => {
  try {
    const response = await api.post('/etape-projets', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'étape:', error);
    throw error;
  }
};

// Mettre à jour une étape
export const updateEtapeProjet = async (id: string, data: EtapeProjetUpdate): Promise<EtapeProjet> => {
  try {
    const response = await api.put(`/etape-projets/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'étape:', error);
    throw error;
  }
};

// Supprimer une étape
export const deleteEtapeProjet = async (id: string): Promise<void> => {
  try {
    await api.delete(`/etape-projets/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étape:', error);
    throw error;
  }
};

// Mettre à jour l'ordre des étapes
export const updateEtapesOrder = async (etapes: { id: string; ordre: number }[]): Promise<void> => {
  try {
    await api.put('/etape-projets/ordre', { etapes });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'ordre des étapes:', error);
    throw error;
  }
};

export default {
  getEtapesProjet,
  getAllEtapesProjet,
  getEtapeProjetById,
  createEtapeProjet,
  updateEtapeProjet,
  deleteEtapeProjet,
  updateEtapesOrder,
}; 