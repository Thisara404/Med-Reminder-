import React from 'react';
import { UsersIcon, PillIcon, AlertTriangleIcon, CheckCircleIcon, ClipboardCheckIcon, UserIcon } from 'lucide-react';
const CaregiverOverview: React.FC = () => {
  // Mock data for demonstration
  const patients = [{
    id: 1,
    name: 'Alice Johnson',
    age: 72,
    medications: 5,
    adherence: 95,
    status: 'stable'
  }, {
    id: 2,
    name: 'Robert Smith',
    age: 68,
    medications: 3,
    adherence: 85,
    status: 'attention'
  }, {
    id: 3,
    name: 'Mary Williams',
    age: 75,
    medications: 4,
    adherence: 100,
    status: 'stable'
  }];
  const recentActivities = [{
    id: 1,
    patient: 'Alice Johnson',
    action: 'Took Lisinopril 10mg',
    time: 'Today, 8:05 AM',
    status: 'success'
  }, {
    id: 2,
    patient: 'Robert Smith',
    action: 'Missed Atorvastatin 20mg',
    time: 'Yesterday, 8:00 PM',
    status: 'missed'
  }, {
    id: 3,
    patient: 'Mary Williams',
    action: 'New prescription added',
    time: '2 days ago',
    status: 'info'
  }];
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Caregiver Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of your patients and their medication adherence.
        </p>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <UsersIcon size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">
                Total Patients
              </h3>
              <p className="text-2xl font-semibold text-blue-600">3</p>
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
              <p className="text-2xl font-semibold text-green-600">93%</p>
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
              <p className="text-2xl font-semibold text-yellow-600">1</p>
            </div>
          </div>
        </div>
      </div>
      {/* Patient Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Patient Overview
        </h2>
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
              {patients.map(patient => <tr key={patient.id}>
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
                      <span>{patient.medications}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {patient.adherence}%
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div className={`h-2 rounded-full ${patient.adherence > 90 ? 'bg-green-500' : patient.adherence > 75 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                    width: `${patient.adherence}%`
                  }}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.status === 'stable' ? 'bg-green-100 text-green-800' : patient.status === 'attention' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {patient.status === 'stable' ? 'Stable' : patient.status === 'attention' ? 'Needs Attention' : 'Critical'}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Recent Activity
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {recentActivities.map(activity => <div key={activity.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${activity.status === 'success' ? 'bg-green-100' : activity.status === 'missed' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    {activity.status === 'success' ? <CheckCircleIcon size={20} className="text-green-600" /> : activity.status === 'missed' ? <AlertTriangleIcon size={20} className="text-red-600" /> : <ClipboardCheckIcon size={20} className="text-blue-600" />}
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
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default CaregiverOverview;