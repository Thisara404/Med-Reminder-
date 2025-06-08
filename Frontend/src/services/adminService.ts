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
      console.log('Fetching medications from API...');
      
      // Make sure we have the auth token
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/medications`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Medications response:', response.data);
      
      // Ensure we return an array
      const medications = Array.isArray(response.data) ? response.data : [];
      return medications;
    } catch (error: any) {
      console.error('Error fetching medications:', error);
      
      // Handle different error types
      if (error.response) {
        console.error('Response error:', error.response.data);
        throw new Error(`Server error: ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        console.error('Request error:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        console.error('Setup error:', error.message);
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  },

  addMedication: async (medicationData: any) => {
    try {
      console.log('Adding medication:', medicationData);
      
      // Clean the data to ensure no patient field is sent
      const cleanData = {
        name: medicationData.name,
        category: medicationData.category,
        description: medicationData.description,
        dosage: medicationData.dosage,
        frequency: medicationData.frequency,
        instructions: medicationData.instructions || '',
        sideEffects: medicationData.sideEffects || ''
      };
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.post(`${API_URL}/medications`, cleanData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Add medication response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error adding medication:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to add medication');
      }
      throw error;
    }
  },

  updateMedication: async (medicationId: string, updates: any) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.put(`${API_URL}/medications/${medicationId}`, updates, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating medication:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to update medication');
      }
      throw error;
    }
  },

  deleteMedication: async (medicationId: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.delete(`${API_URL}/medications/${medicationId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error deleting medication:', error);
      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to delete medication');
      }
      throw error;
    }
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.get(`${API_URL}/stats`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
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