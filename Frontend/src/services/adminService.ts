import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Add error handling wrapper
const handleApiError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.message || 'Server error');
  }
  throw new Error('Network error');
};

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
    if (!doctorId) {
      throw new Error('Doctor ID is required');
    }
    const response = await axios.put(`${API_URL}/doctors/${doctorId}`, updates);
    return response.data;
  },

  deleteDoctor: async (doctorId: string) => {
    if (!doctorId) {
      throw new Error('Doctor ID is required');
    }
    const response = await axios.delete(`${API_URL}/doctors/${doctorId}`);
    return response.data;
  },

  // Users
  getAllPatients: async () => {
    try {
      const response = await axios.get(`${API_URL}/patients`);
      return response.data || [];
    } catch (error) {
      handleApiError(error);
    }
  },

  getAllCaregivers: async () => {
    try {
      const response = await axios.get(`${API_URL}/caregivers`);
      return response.data || [];
    } catch (error) {
      handleApiError(error);
    }
  },

  // Make sure these functions correctly handle errors
  updateUserStatus: async (userId: string, status: string) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      console.log(`Updating user ${userId} status to ${status}`);
      const response = await axios.put(`${API_URL}/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      // Check if it's a 404 error, which might mean we need the caregiver's user ID
      if (error.response && error.response.status === 404) {
        throw new Error('User not found. Make sure to use the correct user ID, not the caregiver ID.');
      }
      throw error?.response?.data || error;
    }
  },

  // Medications
  getAllMedications: async () => {
    try {
      const response = await axios.get(`${API_URL}/medications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medications:', error);
      throw error?.response?.data || error;
    }
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
  },

  // Patient Management
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

  // Caregiver Management
  addCaregiver: async (caregiverData: any) => {
    try {
      const response = await axios.post(`${API_URL}/caregivers`, caregiverData);
      return response.data;
    } catch (error) {
      console.error('Error adding caregiver:', error);
      throw error?.response?.data || error;
    }
  },

  updateCaregiver: async (caregiverId: string, updates: any) => {
    try {
      if (!caregiverId) {
        throw new Error('Caregiver ID is required');
      }
      const response = await axios.put(`${API_URL}/caregivers/${caregiverId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating caregiver:', error);
      throw error?.response?.data || error;
    }
  },

  deleteCaregiver: async (caregiverId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/caregivers/${caregiverId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting caregiver:', error);
      throw error?.response?.data || error;
    }
  },

  // Assignments
  assignDoctorToPatient: async (patientId: string, doctorId: string) => {
    const response = await axios.post(`${API_URL}/patients/${patientId}/doctors`, { doctorId });
    return response.data;
  },

  assignPatientToCaregiver: async (caregiverId: string, patientId: string) => {
    try {
      if (!caregiverId || !patientId) {
        throw new Error('Both caregiver ID and patient ID are required');
      }
      
      console.log('Assigning patient', patientId, 'to caregiver', caregiverId);
      
      const response = await axios.post(
        `${API_URL}/caregivers/${caregiverId}/patients`,
        { patientId }
      );
      
      return response.data;
    } catch (error) {
      console.error('Assignment error:', error);
      throw error?.response?.data || error;
    }
  },

  unassignPatientFromCaregiver: async (caregiverId: string, patientId: string) => {
    try {
      if (!caregiverId || !patientId) {
        throw new Error('Both caregiver ID and patient ID are required');
      }
      
      console.log('Unassigning patient', patientId, 'from caregiver', caregiverId);
      
      const response = await axios.delete(
        `${API_URL}/caregivers/${caregiverId}/patients/${patientId}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Unassignment error:', error);
      throw error?.response?.data || error;
    }
  },

  // Details
  getCaregiverDetails: async (caregiverId: string) => {
    const response = await axios.get(`${API_URL}/caregivers/${caregiverId}`);
    return response.data;
  },

  getPatientDetails: async (patientId: string) => {
    const response = await axios.get(`${API_URL}/patients/${patientId}`);
    return response.data;
  }
};