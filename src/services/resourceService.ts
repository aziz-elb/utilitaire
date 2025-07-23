import api from './api';

export interface Resource {
  _id: string;
  name: string;
  uris: string[];
}

const BASE_URL = '/resources';

export const getResources = async (): Promise<Resource[]> => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const addResource = async (resource: { name: string; uris: string[] }) => {
  const response = await api.post<Resource>(BASE_URL, resource);
  return response.data;
};

export const updateResource = async (_id: string, resource: { name: string; uris: string[] }) => {
  const response = await api.put<Resource>(`${BASE_URL}/${_id}`, resource);
  return response.data;
};

export const deleteResource = async (_id: string) => {
  const response = await api.delete(`${BASE_URL}/${_id}`);
  return response.data;
}; 

export const AssignRessourceToRole = async (resourceID : string , roleName : string) => {
  const response = await api.post(`/roles/${roleName}/resources/${resourceID}`);
  return response.data;
}