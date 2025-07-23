import api from './api';

export interface ProjetMembre {
  id: string;
  membreEmail: string;
  createurEmail: string;
  dateCreation: string;
  modificateurEmail?: string;
  dateModification?: string;
  roleProjetId?: string;
  roleProjetLibelle?: string;
  roleProjet?: {
    id: string;
    libelle: string;
  };
  dateAffectation?: string;
}

export interface AssignerMembreInput {
  projetId: string;
  membreEmail: string;
  roleProjetId: string;
}

export interface ChangerRoleInput {
  nouveauRoleProjetId: string;
}

// Assigner un membre à un projet
export const assignerMembre = async (data: AssignerMembreInput): Promise<ProjetMembre> => {
  try {
    const response = await api.post('/projet-membres/assign', null, {
      params: {
        projetId: data.projetId,
        membreEmail: data.membreEmail,
        roleProjetId: data.roleProjetId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'assignation du membre:', error);
    throw error;
  }
};

// Récupérer les membres d'un projet
export const getMembresByProjet = async (projetId: string): Promise<ProjetMembre[]> => {
  try {
    const response = await api.get(`/projet-membres/by-projet/${projetId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des membres du projet:', error);
    throw error;
  }
};

// Supprimer un membre du projet
export const supprimerMembre = async (membreId: string): Promise<void> => {
  try {
    await api.delete(`/projet-membres/${membreId}`);
  } catch (error) {
    console.error('Erreur lors de la suppression du membre:', error);
    throw error;
  }
};

// Changer le rôle d'un membre
export const changerRoleMembre = async (membreId: string, data: ChangerRoleInput): Promise<ProjetMembre> => {
  try {
    const response = await api.patch(`/projet-membres/${membreId}/role`, null, {
      params: {
        nouveauRoleProjetId: data.nouveauRoleProjetId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors du changement de rôle:', error);
    throw error;
  }
};

export default {
  assignerMembre,
  getMembresByProjet,
  supprimerMembre,
  changerRoleMembre,
}; 