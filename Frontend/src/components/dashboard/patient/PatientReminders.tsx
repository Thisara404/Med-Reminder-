import React, { useState, useEffect } from 'react';
import { 
  PillIcon, 
  BellIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  MailIcon,
  PhoneIcon,
  CheckIcon,
  XIcon
} from 'lucide-react';
import { patientService } from '../../../services/patientService';
import { Link } from 'react-router-dom';

const PatientReminders: React.FC = () => {
  const [reminders, setReminders] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: false,
    sms: true,
    reminderTime: 15 // minutes before
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch medications first
      const medsData = await patientService.getMedications();
      setMedications(medsData);
      
      // Then fetch reminders
      const remindersData = await patientService.getReminders();
      
      // Enhance reminders with medication details
      const enhancedReminders = remindersData.map((reminder: any) => {
        const medication = medsData.find(m => m.id === reminder.medication) || 
                          { name: reminder.medication?.name || 'Unknown', dosage: reminder.medication?.dosage || '' };
        return {
          ...reminder,
          medicationName: medication.name,
          medicationDosage: medication.dosage || 'Not specified'
        };
      });
      
      setReminders(enhancedReminders);
    } catch (error: any) {
      console.error('Error loading reminders:', error);
      setError(error.message || 'Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsTaken = async (reminderId: string) => {
    try {
      await patientService.markReminderAsTaken(reminderId);
      
      // Update local state
      setReminders(reminders.map(reminder => 
        reminder._id === reminderId 
          ? { ...reminder, status: 'completed', taken: true } 
          : reminder
      ));
    } catch (error: any) {
      console.error('Error marking reminder as taken:', error);
      alert('Failed to update reminder. Please try again.');
    }
  };

  const handleMarkAsMissed = async (reminderId: string) => {
    try {
      await patientService.markReminderAsMissed(reminderId);
      
      // Update local state
      setReminders(reminders.map(reminder => 
        reminder._id === reminderId 
          ? { ...reminder, status: 'missed', taken: false } 
          : reminder
      ));
    } catch (error: any) {
      console.error('Error marking reminder as missed:', error);
      alert('Failed to update reminder. Please try again.');
    }
  };

  // Filter reminders by status
  const upcomingReminders = reminders.filter(r => r.status === 'upcoming');
  const completedReminders = reminders.filter(r => r.status === 'completed');
  const missedReminders = reminders.filter(r => r.status === 'missed');

  // Format time for display
  const formatTime = (time: string) => {
    try {
      if (!time) return 'Not specified';
      
      // For full datetime strings
      if (time.includes('T')) {
        return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      
      // For time-only strings
      return time;
    } catch (e) {
      return time;
    }
  };

  // Format date for display
  const formatDate = (date: string) => {
    try {
      if (!date) return 'Not specified';
      return new Date(date).toLocaleDateString();
    } catch (e) {
      return date;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medication Reminders</h1>
          <p className="text-gray-600">Track and manage your medication schedule.</p>
        </div>
        <Link 
          to="/patient-dashboard/medications" 
          className="flex items-center text-sm bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
        >
          <PillIcon size={16} className="mr-2" />
          Set New Reminder
        </Link>
      </div>

      {/* Upcoming Reminders */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BellIcon size={20} className="mr-2 text-blue-600" />
          Upcoming Reminders
        </h2>
        
        {upcomingReminders.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {upcomingReminders.map(reminder => (
                <div key={reminder._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <PillIcon size={20} className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        {reminder.medicationName} {reminder.medicationDosage}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon size={12} className="mr-1" />
                        {formatTime(reminder.time)} - {formatDate(reminder.scheduledDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMarkAsTaken(reminder._id)}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200 flex items-center"
                    >
                      <CheckIcon size={12} className="mr-1" /> Take
                    </button>
                    <button
                      onClick={() => handleMarkAsMissed(reminder._id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200 flex items-center"
                    >
                      <XIcon size={12} className="mr-1" /> Skip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <BellIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No upcoming reminders. Set reminders for your medications.</p>
            <Link 
              to="/patient-dashboard/medications" 
              className="mt-4 inline-flex items-center text-blue-600 hover:underline"
            >
              <PillIcon size={16} className="mr-1" /> Go to Medications
            </Link>
          </div>
        )}
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CheckCircleIcon size={20} className="mr-2 text-green-600" />
            Completed Reminders
          </h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {completedReminders.slice(0, 5).map(reminder => (
                <div key={reminder._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircleIcon size={20} className="text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        {reminder.medicationName} {reminder.medicationDosage}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon size={12} className="mr-1" />
                        {formatTime(reminder.time)} - {formatDate(reminder.scheduledDate)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                      Completed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Missed Reminders */}
      {missedReminders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <XCircleIcon size={20} className="mr-2 text-red-600" />
            Missed Reminders
          </h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {missedReminders.slice(0, 5).map(reminder => (
                <div key={reminder._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-2 rounded-full">
                      <XCircleIcon size={20} className="text-red-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        {reminder.medicationName} {reminder.medicationDosage}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <ClockIcon size={12} className="mr-1" />
                        {formatTime(reminder.time)} - {formatDate(reminder.scheduledDate)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                      Missed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <BellIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Push Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive reminders as push notifications
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notificationSettings.push} 
                  onChange={() => setNotificationSettings({
                    ...notificationSettings,
                    push: !notificationSettings.push
                  })} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <MailIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive reminders via email
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notificationSettings.email} 
                  onChange={() => setNotificationSettings({
                    ...notificationSettings,
                    email: !notificationSettings.email
                  })} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <PhoneIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    SMS Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive reminders via text message
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notificationSettings.sms} 
                  onChange={() => setNotificationSettings({
                    ...notificationSettings,
                    sms: !notificationSettings.sms
                  })} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Time (minutes before scheduled time)
              </label>
              <select
                value={notificationSettings.reminderTime}
                onChange={(e) => setNotificationSettings({
                  ...notificationSettings,
                  reminderTime: parseInt(e.target.value)
                })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value={5}>5 minutes before</option>
                <option value={10}>10 minutes before</option>
                <option value={15}>15 minutes before</option>
                <option value={30}>30 minutes before</option>
                <option value={60}>1 hour before</option>
              </select>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientReminders;