import axios from 'axios';
import { NewPatientData } from '../types';

const API_URL = 'http://localhost:5000/api/caregiver';

export const caregiverService = {
  // Profile
  getProfile: async () => {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  },

  // Patients
  getPatients: async () => {
    try {
      const response = await axios.get(`${API_URL}/patients`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  addPatient: async (patientData: NewPatientData) => {
    try {
      const response = await axios.post(`${API_URL}/patients`, patientData);
      return response.data;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  },

  updatePatient: async (patientId: string, updates: any) => {
    const response = await axios.put(`${API_URL}/patients/${patientId}`, updates);
    return response.data;
  },

  deletePatient: async (patientId: string) => {
    const response = await axios.delete(`${API_URL}/patients/${patientId}`);
    return response.data;
  },

  // Get available patients that can be added
  getAvailablePatients: async () => {
    try {
      const response = await axios.get(`${API_URL}/available-patients`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available patients:', error);
      throw error;
    }
  },

  // Add existing patient to caregiver
  addExistingPatient: async (patientId: string) => {
    try {
      const response = await axios.post(`${API_URL}/patients/add-existing`, { patientId });
      return response.data;
    } catch (error) {
      console.error('Error adding existing patient:', error);
      throw error;
    }
  },

  // Notes
  getPatientNotes: async (patientId: string) => {
    const response = await axios.get(`${API_URL}/patients/${patientId}/notes`);
    return response.data;
  },

  addNote: async (patientId: string, noteData: any) => {
    const response = await axios.post(`${API_URL}/patients/notes`, {
      patientId,
      ...noteData
    });
    return response.data;
  },

  updateNote: async (noteId: string, updates: any) => {
    const response = await axios.put(`${API_URL}/patients/notes/${noteId}`, updates);
    return response.data;
  },

  deleteNote: async (noteId: string) => {
    const response = await axios.delete(`${API_URL}/patients/notes/${noteId}`);
    return response.data;
  },

  // Prescriptions
  getPrescriptions: async () => {
    try {
      const response = await axios.get(`${API_URL}/prescriptions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }
  },

  addPrescription: async (prescriptionData: FormData) => {
    const response = await axios.post(`${API_URL}/prescriptions`, prescriptionData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};