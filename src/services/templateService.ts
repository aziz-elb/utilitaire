import api from './api';

export interface TemplateProjet {
  id: string;
  libelle: string;
  description: string;
  version: string;
  actifYn: boolean;
}

export interface EtapeTemplate {
  id: string;
  libelle: string;
  description: string;
  ordre: number;
  templateProjetId?: string;
}

const BASE_URL = '';

// Modèle Projet (Template)
export const getTemplates = async (): Promise<TemplateProjet[]> => {
  const response = await api.get(`${BASE_URL}/template-projets`);
  return response.data;
};

export const addTemplate = async (template: Omit<TemplateProjet, 'id'>) => {
  const response = await api.post<TemplateProjet>(`${BASE_URL}/template-projets`, template);
  return response.data;
};

export const deleteTemplate = async (id: string) => {
  const response = await api.delete(`${BASE_URL}/template-projets/${id}`);
  return response.data;
};

// Étape Template
export const getEtapeTemplates = async (templateId: string): Promise<EtapeTemplate[]> => {
  const response = await api.get(`${BASE_URL}/etape-templates/by-template/${templateId}`);
  return response.data;
};

export const addEtapeTemplate = async (etape: Omit<EtapeTemplate, 'id'> & { templateProjetId: string }) => {
  const response = await api.post<EtapeTemplate>(`${BASE_URL}/etape-templates`, etape);
  return response.data;
};

export const updateEtapeTemplate = async (id: string, etape: Omit<EtapeTemplate, 'id'> & { templateProjetId: string }) => {
  const response = await api.put<EtapeTemplate>(`${BASE_URL}/etape-templates/${id}`, etape);
  return response.data;
};

export const deleteEtapeTemplate = async (id: string) => {
  const response = await api.delete(`${BASE_URL}/etape-templates/${id}`);
  return response.data;
};

// Update Modèle Projet (Template)
export const updateTemplate = async (id: string, template: Partial<Omit<TemplateProjet, 'id'>>) => {
  const response = await api.put<TemplateProjet>(`${BASE_URL}/template-projets/${id}`, template);
  return response.data;
}; 



export const dupliquerTemplate = async (id: string) => {
  const response = await api.post(`${BASE_URL}/template-projets/${id}/duplicate`);
  return response.data;
}