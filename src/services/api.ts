import axios from 'axios';

// Remplace cette URL par l'URL publique de ton backend
const baseURL = 'http://localhost:9000/api';

const api = axios.create({
  baseURL,
  withCredentials: false, // À mettre à true si vous utilisez des cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Ajout du token Bearer automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // console.log('Token présent:', !!token, 'URL:', config.url, 'Method:', config.method);
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
    // Important pour les requêtes PATCH/PUT
    if (config.method?.toUpperCase() === 'PATCH') {
      config.headers['Content-Type'] = 'application/json';
    }
  } else {
    console.warn('Aucun token trouvé pour la requête:', config.url);
  }
  return config;
});

// Gestion centralisée des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ici, on peut gérer les erreurs globales (ex: déconnexion auto sur 401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 