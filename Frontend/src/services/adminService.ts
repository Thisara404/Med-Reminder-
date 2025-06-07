import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

export const adminService = {
  // Doctors
  getDoctors: async () => {
    const response = await axios.get(`${API_URL}/doctors`);
    return response.data;
  },

  addDoctor: async (doctorData: any) => {
    const response = await axios.post(`${API_URL}/doctors`, doctorData);
    return response.data;
  },

  updateDoctor: async (doctorId: string, updates: any) => {
    const response = await axios.put(`${API_URL}/doctors/${doctorId}`, updates);
    return response.data;
  },

  deleteDoctor: async (doctorId: string) => {
    const response = await axios.delete(`${API_URL}/doctors/${doctorId}`);
    return response.data;
  },

  // Users
  getAllPatients: async () => {
    const response = await axios.get(`${API_URL}/patients`);
    return response.data;
  },

  getAllCaregivers: async () => {
    const response = await axios.get(`${API_URL}/caregivers`);
    return response.data;
  },

  updateUserStatus: async (userId: string, status: string) => {
    const response = await axios.put(`${API_URL}/users/${userId}/status`, { status });
    return response.data;
  },

  // Medications
  getAllMedications: async () => {
    const response = await axios.get(`${API_URL}/medications`);
    return response.data;
  },

  addMedication: async (medicationData: any) => {
    const response = await axios.post(`${API_URL}/medications`, medicationData);
    return response.data;
  },

  updateMedication: async (medicationId: string, updates: any) => {
    const response = await axios.put(`${API_URL}/medications/${medicationId}`, updates);
    return response.data;
  },

  deleteMedication: async (medicationId: string) => {
    const response = await axios.delete(`${API_URL}/medications/${medicationId}`);
    return response.data;
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  }
};