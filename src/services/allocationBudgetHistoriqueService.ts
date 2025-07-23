import api from './api';

export interface ModificateurMembre {
  membreId: string;
  nomPrenom: string;
  email: string;
}

export interface AllocationBudgetHistorique {
  id: string;
  montantPrevu: number;
  montantReel: number;
  dateModification: string | null;
  modificateurMembre: ModificateurMembre;
  motifModification: string | null;
}

export async function getAllocationBudgetHistoriques(): Promise<AllocationBudgetHistorique[]> {
  const { data } = await api.get('/allocationbudgethistory');
  return data;
}

export async function getAllocationBudgetHistoriquesByBudget(budgetId: string): Promise<AllocationBudgetHistorique[]> {
  const { data } = await api.get(`/allocationbudgethistory/budget`, { params: { budgetId } });
  return data;
}

export async function getAllocationBudgetHistoriquesByProject(projectId: string): Promise<AllocationBudgetHistorique[]> {
  const { data } = await api.get(`/allocationbudgethistory/project`, { params: { projectId } });
  return data;
}

export async function updateAllocationBudgetHistorique(id: string, motifModification: string): Promise<AllocationBudgetHistorique> {
  const { data } = await api.put(`/allocationbudgethistory/update/${id}`, { motifModification });
  return data;
}

export async function deleteAllocationBudgetHistorique(id: string): Promise<void> {
  await api.delete(`/allocationbudgethistory/delete/${id}`);
} 