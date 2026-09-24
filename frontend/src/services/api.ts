import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSystemStatus = async () => {
  try {
    const response = await api.get('/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching system status', error);
    return null;
  }
};

export const getVehicleJourney = async (plateNumber: string) => {
  try {
    const response = await api.get(`/vehicles/${plateNumber}/journey`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vehicle journey', error);
    return null;
  }
};
