import api from './api';


export const getProfileinfo  = async () => {
    const response = await api.get('/profile');
    return response.data;
}

export const updateProfile = async (data: { nomPrenom: string; telephone: string; profilePictureUrl: string }) => {
  const response = await api.put('/api/profile', data);
  return response.data;
};

