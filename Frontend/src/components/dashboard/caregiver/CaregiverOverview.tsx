import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  PillIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  ClipboardCheckIcon, 
  UserIcon,
  TrendingUpIcon,
  CalendarIcon
} from 'lucide-react';
import { caregiverService } from '../../../services/caregiverService';

const CaregiverOverview: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPatients: 0,
    overallAdherence: 0,
    needsAttention: 0,
    stablePatients: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const patientsData = await caregiverService.getPatients();
      setPatients(patientsData);
      
      // Calculate stats
      const total = patientsData.length;
      const needsAttention = patientsData.filter(p => 
        p.status === 'attention' || p.status === 'critical'
      ).length;
      const stable = patientsData.filter(p => p.status === 'stable').length;
      const totalAdherence = patientsData.reduce((sum, p) => sum + (p.adherence || 0), 0);
      const averageAdherence = total > 0 ? Math.round(totalAdherence / total) : 0;

      setStats({
        totalPatients: total,
        overallAdherence: averageAdherence,
        needsAttention,
        stablePatients: stable
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Generate recent activities (mock data for now)
  const recentActivities = [
    {
      id: 1,
      patient: patients[0]?.name || 'Patient 1',
      action: 'Completed medication schedule',
      time: 'Today, 8:05 AM',
      status: 'success'
    },
    {
      id: 2,
      patient: patients[1]?.name || 'Patient 2',
      action: 'Missed evening medication',
      time: 'Yesterday, 8:00 PM',
      status: 'missed'
    },
    {
      id: 3,
      patient: patients[2]?.name || 'Patient 3',
      action: 'New prescription added',
      time: '2 days ago',
      status: 'info'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Caregiver Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of your patients and their medication adherence.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <UsersIcon size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">
                Total Patients
              </h3>
              <p className="text-2xl font-semibold text-blue-600">{stats.totalPatients}</p>
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
                Overall Adherence
              </h3>
              <p className="text-2xl font-semibold text-green-600">{stats.overallAdherence}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangleIcon size={24} className="text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">
                Needs Attention
              </h3>
              <p className="text-2xl font-semibold text-yellow-600">{stats.needsAttention}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUpIcon size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">
                Stable Patients
              </h3>
              <p className="text-2xl font-semibold text-green-600">{stats.stablePatients}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Patient Overview
        </h2>
        
        {patients.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No patients assigned</h3>
            <p className="mt-1 text-sm text-gray-500">
              You don't have any patients assigned yet. Contact your administrator or add new patients.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medications
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adherence
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.slice(0, 5).map(patient => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <UserIcon size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {patient.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{patient.age}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <PillIcon size={14} className="text-gray-400 mr-1" />
                        <span>{patient.medications || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {patient.adherence || 0}%
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${
                            (patient.adherence || 0) > 90 ? 'bg-green-500' : 
                            (patient.adherence || 0) > 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${patient.adherence || 0}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.status === 'stable' ? 'bg-green-100 text-green-800' : 
                        patient.status === 'attention' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {patient.status === 'stable' ? 'Stable' : 
                         patient.status === 'attention' ? 'Needs Attention' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {patients.length > 5 && (
              <div className="bg-gray-50 px-6 py-3 text-center">
                <span className="text-sm text-gray-500">
                  Showing 5 of {patients.length} patients
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Activity
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {recentActivities.map(activity => (
              <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-100' : 
                    activity.status === 'missed' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircleIcon size={20} className="text-green-600" />
                    ) : activity.status === 'missed' ? (
                      <AlertTriangleIcon size={20} className="text-red-600" />
                    ) : (
                      <ClipboardCheckIcon size={20} className="text-blue-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-800">
                      {activity.patient}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activity.action} • {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {recentActivities.length === 0 && (
              <div className="p-8 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Patient activities will appear here when they interact with their medications.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverOverview;