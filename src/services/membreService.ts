import api from './api';

const BASE_URL = '/membres';

export interface Membre {
  id: string;
  nomPrenom: string;
  email: string;
  telephone: string;
  interneYn: boolean;
  actifYn: boolean;
  role: string;
  profilePictureUrl: string;
  dateCreation: string;
  typeMembreId: string;
  entiteId: string;
  fonctionId: string;
  keycloakUserId: string;
  pendingEmail?: string | null;
  pendingEmailToken?: string | null;
}

export interface MembreInput {
  nomPrenom: string;
  email: string;
  telephone: string;
  interneYn: boolean;
  actifYn: boolean;
  role: string;
  photoProfile?: string;
  password?: string;
  typeMembreId: string;
  entiteId: string;
  fonctionId: string;
}

export const getMembres = async (): Promise<Membre[]> => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const getMembreById = async (membreId: string): Promise<Membre> => {
  const response = await api.get(`${BASE_URL}/${membreId}`);
  return response.data;
};

export const addMembre = async (data: MembreInput): Promise<Membre> => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

export const updateMembre = async (membreId: string, data: Partial<MembreInput>): Promise<Membre> => {
  const response = await api.put(`${BASE_URL}/${membreId}`, data);
  return response.data;
};

export const updateMembrePartial = async (membreId: string, data: Partial<MembreInput>): Promise<Membre> => {
  const response = await api.patch(`${BASE_URL}/${membreId}`, data);
  return response.data;
};

export const deleteMembre = async (membreId: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${membreId}`);
};

export default {
  getMembres,
  getMembreById,
  addMembre,
  updateMembre,
  updateMembrePartial,
  deleteMembre,
}; 