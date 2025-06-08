import axios from 'axios';
import { NewPatientData } from '../types';

const API_URL = 'http://localhost:5000/api/caregiver';

// Set up axios interceptor for authentication
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

  // Prescriptions - Updated methods
  getPrescriptions: async () => {
    try {
      const response = await axios.get(`${API_URL}/prescriptions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }
  },

  addPrescription: async (formData: FormData) => {
    try {
      const response = await axios.post(`${API_URL}/prescriptions/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding prescription:', error);
      throw error;
    }
  },

  updatePrescription: async (prescriptionId: string, updates: any) => {
    try {
      const response = await axios.put(`${API_URL}/prescriptions/${prescriptionId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating prescription:', error);
      throw error;
    }
  },

  deletePrescription: async (prescriptionId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/prescriptions/${prescriptionId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting prescription:', error);
      throw error;
    }
  },

  // Extract medications from prescription
  extractMedications: async (prescriptionId: string) => {
    try {
      // Use the absolute URL with the correct API path
      const response = await axios.post(`http://localhost:5000/api/prescriptions/${prescriptionId}/extract`);
      return response.data;
    } catch (error) {
      console.error('Error extracting medications:', error);
      throw error;
    }
  },

  // Medications
  // Get patient medications
  getPatientMedications: async (patientId: string) => {
    try {
      console.log(`Fetching medications for patient ${patientId}`);
      
      // Get the auth token
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user || !user.token) {
        console.error('Authentication token not found');
        throw new Error('Authentication required');
      }
      
      // Always use direct URL for API calls with proper authorization
      const response = await axios.get(
        `http://localhost:5000/api/patients/${patientId}/medications`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );
      
      console.log('Medication API response:', response.data);
      return response.data || []; // Ensure we always return an array
    } catch (error) {
      console.error('Error fetching patient medications:', error);
      // Return empty array instead of throwing to avoid breaking the UI
      return [];
    }
  },

  // Add medication
  addMedication: async (patientId: string, medicationData: any) => {
    try {
      console.log(`Adding medication for patient ${patientId}:`, medicationData);
      
      // Complete the medication data with required fields
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const completeData = {
        ...medicationData,
        addedBy: user.id, // Add the required addedBy field
        category: medicationData.category || 'General', // Ensure category is provided
        description: medicationData.description || `${medicationData.name} ${medicationData.dosage || ''}` // Ensure description is provided
      };
      
      const response = await axios.post(
        `http://localhost:5000/api/patients/${patientId}/medications`, 
        completeData
      );
      
      console.log('Add medication response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding medication:', error);
      throw error;
    }
  },

  // Update medication
  updateMedication: async (patientId: string, medicationId: string, updates: any) => {
    try {
      console.log(`Updating medication ${medicationId} for patient ${patientId}:`, updates);
      
      const response = await axios.put(
        `http://localhost:5000/api/patients/${patientId}/medications/${medicationId}`, 
        updates
      );
      
      console.log('Update medication response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating medication:', error);
      throw error;
    }
  },

  // Delete medication
  deleteMedication: async (patientId: string, medicationId: string) => {
    try {
      console.log(`Deleting medication ${medicationId} for patient ${patientId}`);
      
      if (!medicationId) {
        throw new Error('Medication ID is required for deletion');
      }
      
      const response = await axios.delete(
        `http://localhost:5000/api/patients/${patientId}/medications/${medicationId}`
      );
      
      console.log('Delete medication response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting medication:', error);
      throw error;
    }
  },

  // Reminders
  getReminders: async () => {
    const response = await axios.get(`${API_URL}/reminders`);
    return response.data;
  },

  addReminder: async (reminderData: any) => {
    const response = await axios.post(`${API_URL}/reminders`, reminderData);
    return response.data;
  },

  updateReminder: async (reminderId: string, updates: any) => {
    const response = await axios.put(`${API_URL}/reminders/${reminderId}`, updates);
    return response.data;
  },

  deleteReminder: async (reminderId: string) => {
    const response = await axios.delete(`${API_URL}/reminders/${reminderId}`);
    return response.data;
  },

  markReminderComplete: async (reminderId: string) => {
    const response = await axios.patch(`${API_URL}/reminders/${reminderId}/complete`);
    return response.data;
  }
};