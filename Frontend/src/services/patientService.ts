import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Set up axios interceptor for authentication
axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const patientService = {
  // Profile
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_URL}/patient/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      throw error;
    }
  },

  // Medications
  getMedications: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
      
      // Get the patient profile to extract the ID
      const profile = await patientService.getProfile();
      const patientId = profile._id;
      
      if (!patientId) {
        throw new Error('Patient ID not found');
      }
      
      console.log(`Fetching medications for patient ID: ${patientId}`);
      const response = await axios.get(`${API_URL}/patients/${patientId}/medications`);
      console.log('Patient medications:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching medications:', error);
      return [];
    }
  },

  // Prescriptions
  getPrescriptions: async () => {
    try {
      const profile = await patientService.getProfile();
      const patientId = profile._id;
      
      const response = await axios.get(`${API_URL}/patients/${patientId}/prescriptions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      return [];
    }
  },

  // Reminders
  getReminders: async () => {
    try {
      const profile = await patientService.getProfile();
      const patientId = profile._id;
      
      if (!patientId) {
        throw new Error('Patient ID not found');
      }
      
      const response = await axios.get(`${API_URL}/${patientId}/reminders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reminders:', error);
      return [];
    }
  },

  // Add reminder
  addReminder: async (reminderData: any) => {
    try {
      const profile = await patientService.getProfile();
      const patientId = profile._id;
      
      if (!patientId) {
        throw new Error('Patient ID not found');
      }
      
      console.log(`Adding reminder for patient ${patientId}:`, reminderData);
      
      const response = await axios.post(
        `${API_URL}/${patientId}/reminders`, 
        {
          ...reminderData,
          patient: patientId
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error adding reminder:', error);
      throw error;
    }
  },

  // Mark reminder as taken
  markReminderAsTaken: async (reminderId: string) => {
    try {
      const profile = await patientService.getProfile();
      const patientId = profile._id;
      
      const response = await axios.put(
        `${API_URL}/${patientId}/reminders/${reminderId}/taken`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error marking reminder as taken:', error);
      throw error;
    }
  },

  // Mark reminder as missed
  markReminderAsMissed: async (reminderId: string) => {
    try {
      const profile = await patientService.getProfile();
      const patientId = profile._id;
      
      const response = await axios.put(
        `${API_URL}/${patientId}/reminders/${reminderId}/missed`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error marking reminder as missed:', error);
      throw error;
    }
  },

  // Get assigned caregivers
  getCaregivers: async () => {
    try {
      const profile = await patientService.getProfile();
      
      if (profile.caregivers && Array.isArray(profile.caregivers)) {
        return profile.caregivers;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching caregivers:', error);
      return [];
    }
  }
};