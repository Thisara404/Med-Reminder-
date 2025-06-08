import React, { useState, useEffect } from 'react';
import { 
  PillIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  BellIcon 
} from 'lucide-react';
import { patientService } from '../../../services/patientService';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const PatientOverview: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    activeMedications: 0,
    adherenceRate: 0,
    todayReminders: 0
  });
  const [medications, setMedications] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch medications
      const medicationsData = await patientService.getMedications();
      setMedications(medicationsData);
      
      // Fetch reminders
      const remindersData = await patientService.getReminders();
      setReminders(remindersData);
      
      // Calculate stats
      const activeMeds = medicationsData.filter(med => med.status === 'active').length;
      
      // Calculate adherence rate
      const totalReminders = remindersData.length;
      const completedReminders = remindersData.filter(r => r.status === 'completed').length;
      const adherenceRate = totalReminders > 0 
        ? Math.round((completedReminders / totalReminders) * 100) 
        : 100;
      
      // Count today's reminders
      const today = new Date().toISOString().split('T')[0];
      const todayReminders = remindersData.filter(r => 
        new Date(r.scheduledDate).toISOString().split('T')[0] === today
      ).length;
      
      setStats({
        activeMedications: activeMeds,
        adherenceRate,
        todayReminders
      });
      
      // Generate recent activity
      const recentActs = generateRecentActivity(medicationsData, remindersData);
      setRecentActivity(recentActs);
      
    } catch (error) {
      console.error('Error loading patient dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate recent activity
  const generateRecentActivity = (medications: any[], reminders: any[]) => {
    const sortedReminders = [...reminders]
      .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
      .slice(0, 5);
    
    return sortedReminders.map(reminder => {
      const medication = medications.find(m => m.id === reminder.medication) || { name: 'Unknown' };
      
      return {
        id: reminder._id,
        action: reminder.status === 'completed' 
          ? `Took ${medication.name} ${medication.dosage || ''}` 
          : reminder.status === 'missed'
            ? `Missed ${medication.name} ${medication.dosage || ''}`
            : `Scheduled ${medication.name} ${medication.dosage || ''}`,
        time: new Date(reminder.scheduledDate).toLocaleString(),
        status: reminder.status
      };
    });
  };

  const handleMarkAsTaken = async (reminderId: string) => {
    try {
      await patientService.markReminderAsTaken(reminderId);
      
      // Update the UI
      setReminders(reminders.map(reminder => 
        reminder._id === reminderId 
          ? { ...reminder, status: 'completed', taken: true } 
          : reminder
      ));
      
      // Refresh the data
      loadData();
    } catch (error) {
      console.error('Error marking reminder as taken:', error);
      setError('Failed to update reminder');
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome to your medication management dashboard, {user?.name}.
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <PillIcon size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">
                Active Medications
              </h3>
              <p className="text-2xl font-semibold text-blue-600">{stats.activeMedications}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircleIcon size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">
                Adherence Rate
              </h3>
              <p className="text-2xl font-semibold text-green-600">{stats.adherenceRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <BellIcon size={24} className="text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">
                Today's Reminders
              </h3>
              <p className="text-2xl font-semibold text-yellow-600">{stats.todayReminders}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Today's Medications */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Today's Medications
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {reminders.filter(reminder => {
              const today = new Date().toISOString().split('T')[0];
              return new Date(reminder.scheduledDate).toISOString().split('T')[0] === today;
            }).length > 0 ? (
              reminders.filter(reminder => {
                const today = new Date().toISOString().split('T')[0];
                return new Date(reminder.scheduledDate).toISOString().split('T')[0] === today;
              }).map(reminder => {
                const medication = medications.find(m => m.id === reminder.medication) || { name: 'Unknown' };
                
                return (
                  <div key={reminder._id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <PillIcon size={20} className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {medication.name} {medication.dosage}
                        </h3>
                        <div className="text-sm text-gray-500 flex items-center">
                          <ClockIcon size={14} className="mr-1" />
                          {reminder.time}
                        </div>
                      </div>
                    </div>
                    <div>
                      {reminder.status === 'upcoming' && (
                        <button
                          onClick={() => handleMarkAsTaken(reminder._id)}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                        >
                          Mark as Taken
                        </button>
                      )}
                      {reminder.status === 'completed' && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                          Taken
                        </span>
                      )}
                      {reminder.status === 'missed' && (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                          Missed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No medications scheduled for today.</p>
                <Link to="/patient-dashboard/reminders" className="text-blue-600 mt-2 inline-block">
                  Set up reminders
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Activity
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {recentActivity.length > 0 ? (
              recentActivity.map(activity => (
                <div key={activity.id} className="p-4 flex items-center">
                  <div className={`p-2 rounded-full mr-4 ${
                    activity.status === 'completed' ? 'bg-green-100' : 
                    activity.status === 'missed' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {activity.status === 'completed' ? (
                      <CheckCircleIcon size={20} className="text-green-600" />
                    ) : activity.status === 'missed' ? (
                      <XCircleIcon size={20} className="text-red-600" />
                    ) : (
                      <ClockIcon size={20} className="text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No recent activity.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientOverview;