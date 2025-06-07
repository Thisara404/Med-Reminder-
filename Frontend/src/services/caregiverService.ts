import axios from 'axios';

const API_URL = 'http://localhost:5000/api/caregiver';

export const caregiverService = {
  // Profile
  getProfile: async () => {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  },

  // Patients
  getPatients: async () => {
    const response = await axios.get(`${API_URL}/patients`);
    return response.data;
  },

  addPatient: async (patientData: any) => {
    const response = await axios.post(`${API_URL}/patients`, patientData);
    return response.data;
  },

  updatePatient: async (patientId: string, updates: any) => {
    const response = await axios.put(`${API_URL}/patients/${patientId}`, updates);
    return response.data;
  },

  deletePatient: async (patientId: string) => {
    const response = await axios.delete(`${API_URL}/patients/${patientId}`);
    return response.data;
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
    const response = await axios.get(`${API_URL}/prescriptions`);
    return response.data;
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