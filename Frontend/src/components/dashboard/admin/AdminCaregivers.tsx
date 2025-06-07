import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Users2Icon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

const AdminCaregivers: React.FC = () => {
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCaregivers();
  }, []);

  const loadCaregivers = async () => {
    try {
      const data = await adminService.getAllCaregivers();
      setCaregivers(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load caregivers');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: string, status: string) => {
    try {
      await adminService.updateUserStatus(userId, status);
      setCaregivers(
        caregivers.map((caregiver) =>
          caregiver.id === userId ? { ...caregiver, status } : caregiver
        )
      );
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Caregivers Management
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Caregiver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patients
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {caregivers.map((caregiver) => (
              <tr key={caregiver.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users2Icon size={20} className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {caregiver.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {caregiver.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {caregiver.patients?.length || 0} patients
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      caregiver.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {caregiver.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {caregiver.status === 'active' ? (
                    <button
                      onClick={() =>
                        handleUpdateStatus(caregiver.id, 'suspended')
                      }
                      className="text-red-600 hover:text-red-900"
                    >
                      <XCircleIcon size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(caregiver.id, 'active')}
                      className="text-green-600 hover:text-green-900"
                    >
                      <CheckCircleIcon size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCaregivers;