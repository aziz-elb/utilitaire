import api from './api';

const BASE_URL = '/roles';

export interface Role {
  id: string;
  name: string;
  description: string;
  scopeParamRequired?: any;
  composite?: boolean;
  composites?: any;
  clientRole?: boolean;
  containerId?: string;
  attributes?: any;
}

export interface RoleInput {
  name?: string;
  description: string;
}

export const getRoles = async (): Promise<Role[]> => {
  const response = await api.get(BASE_URL);
  return response.data;
};

export const addRole = async (data: RoleInput): Promise<Role> => {
  const response = await api.post(BASE_URL, data);
  return response.data;
};

export const updateRole = async (roleName: string, data: Partial<RoleInput>): Promise<Role> => {
  const response = await api.put(`${BASE_URL}/${roleName}`, data);
  return response.data;
};

export const deleteRole = async (roleId: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${roleId}`);
};

export default {
  getRoles,
  addRole,
  updateRole,
  deleteRole,
}; 