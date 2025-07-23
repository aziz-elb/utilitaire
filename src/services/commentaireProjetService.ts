import api from './api';

export interface CommentaireProjet {
  id: string;
  projetId: string;
  commentaire: string; // Changé de 'contenu' à 'commentaire' pour correspondre à l'API
  auteurEmail: string;
  dateCreation: string;
  modificateurEmail?: string;
  dateModification?: string;
  typeCommentaireId?: string;
  typeCommentaire?: {
    id: string;
    libelle: string;
  };
}

export interface CommentaireInput {
  projetId: string;
  contenu: string; // Gardé 'contenu' pour l'input car l'API l'attend ainsi
  typeCommentaireId: string;
}

export interface CommentaireUpdate {
  projetId?: string;
  contenu?: string; // Gardé 'contenu' pour l'update car l'API l'attend ainsi
  typeCommentaireId?: string;
}

// Récupérer les commentaires d'un projet
export const getCommentairesProjet = async (projetId: string): Promise<CommentaireProjet[]> => {
  try {
    const response = await api.get(`/commentaires/projet/${projetId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des commentaires du projet:', error);
    throw error;
  }
};

// Récupérer les commentaires par auteur
export const getCommentairesByAuteur = async (membreEmail: string): Promise<CommentaireProjet[]> => {
  try {
    const response = await api.get(`/commentaires/auteur/${membreEmail}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des commentaires par auteur:', error);
    throw error;
  }
};

// Créer un nouveau commentaire
export const createCommentaire = async (data: CommentaireInput): Promise<CommentaireProjet> => {
  try {
    const response = await api.post('/commentaires', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du commentaire:', error);
    throw error;
  }
};

// Mettre à jour un commentaire
export const updateCommentaire = async (id: string, data: CommentaireUpdate): Promise<CommentaireProjet> => {
  try {
    const response = await api.put(`/commentaires/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du commentaire:', error);
    throw error;
  }
};

// Supprimer un commentaire
export const deleteCommentaire = async (id: string): Promise<void> => {
  try {
    await api.delete(`/commentaires/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    throw error;
  }
};

// Fonction legacy pour compatibilité (à supprimer plus tard)
export const addCommentaireProjet = async (projetId: string, data: { contenu: string }): Promise<CommentaireProjet> => {
  return createCommentaire({
    projetId,
    contenu: data.contenu,
    typeCommentaireId: "", // Valeur par défaut
  });
};

export default {
  getCommentairesProjet,
  getCommentairesByAuteur,
  createCommentaire,
  updateCommentaire,
  deleteCommentaire,
  addCommentaireProjet, // Legacy
}; 