import api from './api';

export interface PosteCout {
  id: string;
  libelle: string;
  typePoste: string;
  ordreAffichage: string;
  actifYn: boolean;
}

export const getPosteCouts = async (): Promise<PosteCout[]> => {
  const response = await api.get('/postecout/all');
  return response.data;
};

export const addPosteCout = async (posteCout: Omit<PosteCout, 'id'>): Promise<PosteCout> => {
  const { data } = await api.post<PosteCout>('/postecout/create', posteCout);
  return data;
};

export const updatePosteCout = async (posteCout: PosteCout): Promise<PosteCout> => {
  const { id, ...rest } = posteCout;
  const { data } = await api.put<PosteCout>(`/postecout/update?posteCoutId=${id}`, rest);
  return data;
};

export const deletePosteCout = async (id: string): Promise<void> => {
  await api.delete(`/postecout/delete?posteCoutId=${id}`);
}; 