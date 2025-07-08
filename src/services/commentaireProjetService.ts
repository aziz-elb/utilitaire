import api from './api';

export interface CommentaireProjetInput {
  contenu: string;
}

export interface CommentaireProjet {
  id: string;
  contenu: string;
  auteurEmail: string;
  dateCreation: string;
  projetId: string;
}

export const addCommentaireProjet = async (projetId: string, data: CommentaireProjetInput): Promise<CommentaireProjet> => {
  try {
    const response = await api.post(`/projets/${projetId}/commentaires`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCommentairesProjet = async (projetId: string): Promise<CommentaireProjet[]> => {
  try {
    const response = await api.get(`/projets/${projetId}/commentaires`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  addCommentaireProjet,
  getCommentairesProjet,
}; 