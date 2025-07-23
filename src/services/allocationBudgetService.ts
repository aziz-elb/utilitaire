import api from './api';

export interface PosteCout {
  id: string;
  libelle: string;
  typePoste: string;
  ordreAffichage: string;
  actifYn: boolean;
}

export interface BudgetDto {
  id: string;
  libelle: string;
  description: string;
  allocationBudgetList?: any;
  posteCout: PosteCout;
}

export interface ProjectDto {
  id: string;
  titre: string;
  description: string | null;
  dateDebut: string;
  dateFin: string | null;
}

export interface AllocationBudgetHistorique {
  id: string;
  montantPrevu: number;
  montantReel: number;
  dateModification: string | null;
  fkMembreId: string;
  motifModification: string | null;
}

export interface AllocationBudget {
  id: string;
  budgetDto: BudgetDto;
  projectDto: ProjectDto;
  allocationBudgetHistoriques?: AllocationBudgetHistorique[] | null;
  montantPrevu: number;
  montatReel: number;
}

export interface AllocationBudgetCreatePayload {
  budgetId: string;
  projectId: string;
  montantPrevu: number;
  montantReel: number;
}

export interface AllocationBudgetUpdatePayload {
  budgetId: string;
  projectId: string;
  montantPrevu: number;
  montantReel: number;
  motifModification: string;
}

export async function getAllocationBudgets(): Promise<AllocationBudget[]> {
  const { data } = await api.get('/allocationbudget/all');
  return data;
}

export async function createAllocationBudget(payload: AllocationBudgetCreatePayload): Promise<AllocationBudget> {
  const { data } = await api.post('/allocationbudget/create', payload);
  return data;
}

export async function updateAllocationBudget(id: string, payload: AllocationBudgetUpdatePayload): Promise<AllocationBudget> {
  const { data } = await api.put(`/allocationbudget/update?allocationBudgetId=${id}`, payload);
  return data;
}

export async function deleteAllocationBudget(id: string): Promise<void> {
  await api.delete(`/allocationbudget/delete/${id}`);
} 