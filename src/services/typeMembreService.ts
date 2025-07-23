import api from './api';

export interface TypeMembre {
  id: string;
  libelle: string;
  obligatoireYn: boolean;
}

export const getTypeMembres = async (): Promise<TypeMembre[]> => {
  const response = await api.get('/type-membres');
  return response.data;
};

export const addTypeMembre = async (typeMembre: Omit<TypeMembre, 'id'>): Promise<TypeMembre> => {
  const { data } = await api.post<TypeMembre>('/type-membres', typeMembre);
  return data;
};

export const updateTypeMembre = async (typeMembre: TypeMembre): Promise<TypeMembre> => {
  const { data } = await api.put<TypeMembre>(`/type-membres/${typeMembre.id}`, typeMembre);
  return data;
};

export const deleteTypeMembre = async (id: string): Promise<void> => {
  await api.delete(`/type-membres/${id}`);
}; 