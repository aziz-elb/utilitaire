import api from './api';

export interface ProjectInput {
  titre: string;
  code: string;
  description: string;
  typeProjetId: string;
  templateProjetId: string;
  dateDebut: string;
  dateFin: string;
  dateCible: string;
  statutProjetId: string;
  progressionPct: number;
  niveauComplexite: number;
  passationTermineeYn: boolean;
  visibiliteYn: boolean;
  documentationDeposeeYn: boolean;
}

export interface Project {
  id: string;
  titre: string;
  code: string;
  description: string;
  typeProjetId: string;
  templateProjetId: string;
  dateDebut: string;
  dateFin: string;
  dateCible: string;
  statutProjetId: string;
  progressionPct: number;
  niveauComplexite: number;
  passationTermineeYn: boolean;
  visibiliteYn: boolean;
  documentationDeposeeYn: boolean;
  // Ajoutez d'autres champs selon la réponse de l'API
}

export const addProject = async (data: ProjectInput): Promise<Project> => {
  try {
    const response = await api.post('/projets', data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du projet:', error);
    throw error; // <--- Add this line
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

export const updateProject = async (id: string, data: ProjectInput): Promise<Project> => {
  const response = await api.put(`/projets/${id}`, data);
  return response.data;
};

// export const updateProjectPartial = async (id: string, data: Partial<ProjectInput>): Promise<Project> => {
//   const response = await api.patch(`/projets/${id}`, data);
//   return response.data;
// };

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projets/${id}`);
};

export default {
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
}; 