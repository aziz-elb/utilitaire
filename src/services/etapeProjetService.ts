import api from './api';

export interface EtapeProjet {
  id: string;
  titre: string;
  description: string;
  ordre_execution: number;
  progressionPct: number | null;
  priorite: string | null;
  dateDebut: string | null;
  dateFin: string | null;
  statutEtapeId: string | null;
  typeEtapeId: string | null;
  issueTemplateYn: boolean;
  projetId?: string;
}

export interface EtapeProjetInput {
  projetId: string;
  titre: string;
  description: string;
  progressionPct: number;
  ordre_execution: number;
  priorite: string;
  dateDebut: string;
  dateFin: string;
  statutId: string;
  typeEtapeId: string;
}

export interface EtapeProjetUpdate {
  titre?: string;
  description?: string;
  progressionPct?: number;
  ordre_execution?: number;
  priorite?: string;
  dateDebut?: string;
  dateFin?: string;
  statutId?: string;
  typeEtapeId?: string;
}

// Récupérer toutes les étapes d'un projet
export const getEtapesProjet = async (projetId: string): Promise<EtapeProjet[]> => {
  try {
    const response = await api.get(`/projets/${projetId}/etapes`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des étapes du projet:', error);
    throw error;
  }
};

// Récupérer toutes les étapes (non utilisé dans la nouvelle API, mais conservé si besoin)
// export const getAllEtapesProjet = async (): Promise<EtapeProjet[]> => {
//   try {
//     const response = await api.get('/etapes-projet');
//     return response.data;
//   } catch (error) {
//     console.error('Erreur lors du chargement des étapes:', error);
//     throw error;
//   }
// };

// Récupérer une étape par ID
// export const getEtapeProjetById = async (id: string): Promise<EtapeProjet> => {
//   try {
//     const response = await api.get(`/etapes-projet/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Erreur lors du chargement de l\'étape:', error);
//     throw error;
//   }
// };

// Créer une nouvelle étape
export const createEtapeProjet = async (data: EtapeProjetInput): Promise<EtapeProjet> => {
  try {
    const response = await api.post('/etapes-projet', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'étape:', error);
    throw error;
  }
};

// Mettre à jour une étape
export const updateEtapeProjet = async (id: string, data: EtapeProjetUpdate): Promise<EtapeProjet> => {
  try {
    console.log("data ----", data);
    const response = await api.put(`/etapes-projet/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'étape:', error);
    throw error;
  }
};

// Supprimer une étape
export const deleteEtapeProjet = async (id: string): Promise<void> => {
  try {
    await api.delete(`/etapes-projet/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étape:', error);
    throw error;
  }
};

// Mettre à jour l'ordre des étapes (à adapter si l'API change)
// export const updateEtapesOrder = async (etapes: { id: string; ordre_execution: number }[]): Promise<void> => {
//   try {
//     await api.put('/etapes-projet/ordre', { etapes });
//   } catch (error) {
//     console.error('Erreur lors de la mise à jour de l\'ordre des étapes:', error);
//     throw error;
//   }
// };

export default {
  getEtapesProjet,
  // getAllEtapesProjet,
  // getEtapeProjetById,
  createEtapeProjet,
  updateEtapeProjet,
  deleteEtapeProjet,
  // updateEtapesOrder,
}; 