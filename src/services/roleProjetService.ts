import api from './api';

export interface RoleProjet {
  id: string;
  libelle: string;
}

export interface RoleProjetInput {
  libelle: string;
}

export interface RoleProjetUpdate {
  libelle?: string;
}

// Récupérer tous les rôles de projet
export const getRoleProjets = async (): Promise<RoleProjet[]> => {
  try {
    const response = await api.get('/role-projets');
    return response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des rôles de projet:', error);
    throw error;
  }
};

// Créer un nouveau rôle de projet
export const addRoleProjet = async (data: RoleProjetInput): Promise<RoleProjet> => {
  try {
    const response = await api.post('/role-projets', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du rôle de projet:', error);
    throw error;
  }
};

// Mettre à jour un rôle de projet
export const updateRoleProjet = async (id: string, data: RoleProjetUpdate): Promise<RoleProjet> => {
  try {
    const response = await api.put(`/role-projets/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rôle de projet:', error);
    throw error;
  }
};

// Supprimer un rôle de projet
export const deleteRoleProjet = async (id: string): Promise<void> => {
  try {
    await api.delete(`/role-projets/${id}`);
  } catch (error) {
    console.error('Erreur lors de la suppression du rôle de projet:', error);
    throw error;
  }
};

export default {
  getRoleProjets,
  addRoleProjet,
  updateRoleProjet,
  deleteRoleProjet,
}; 