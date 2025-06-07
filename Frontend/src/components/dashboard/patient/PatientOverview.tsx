import React from 'react';
import { PillIcon, BellIcon, ClockIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon } from 'lucide-react';
const PatientOverview: React.FC = () => {
  // Mock data for demonstration
  const upcomingMedications = [{
    id: 1,
    name: 'Lisinopril',
    dosage: '10mg',
    time: '8:00 AM',
    taken: false
  }, {
    id: 2,
    name: 'Metformin',
    dosage: '500mg',
    time: '12:00 PM',
    taken: false
  }, {
    id: 3,
    name: 'Atorvastatin',
    dosage: '20mg',
    time: '8:00 PM',
    taken: false
  }];
  const recentActivity = [{
    id: 1,
    action: 'Took Lisinopril 10mg',
    time: 'Yesterday, 8:05 AM',
    status: 'success'
  }, {
    id: 2,
    name: 'Missed Atorvastatin 20mg',
    time: 'Yesterday, 8:00 PM',
    status: 'missed'
  }, {
    id: 3,
    name: 'Added new prescription',
    time: '2 days ago',
    status: 'info'
  }];
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome to your medication management dashboard.
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
              <p className="text-2xl font-semibold text-blue-600">5</p>
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
              <p className="text-2xl font-semibold text-green-600">92%</p>
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
              <p className="text-2xl font-semibold text-yellow-600">3</p>
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
            {upcomingMedications.map(med => <div key={med.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <PillIcon size={20} className="text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-800">{med.name}</h3>
                    <p className="text-sm text-gray-500">{med.dosage}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-6">
                    <ClockIcon size={16} className="text-gray-400 mr-1" />
                    <span className="text-sm">{med.time}</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm">
                    Mark as Taken
                  </button>
                </div>
              </div>)}
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
            {recentActivity.map(activity => <div key={activity.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${activity.status === 'success' ? 'bg-green-100' : activity.status === 'missed' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    {activity.status === 'success' ? <CheckCircleIcon size={20} className="text-green-600" /> : activity.status === 'missed' ? <XCircleIcon size={20} className="text-red-600" /> : <AlertTriangleIcon size={20} className="text-blue-600" />}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-800">
                      {activity.action || activity.name}
                    </h3>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default PatientOverview;