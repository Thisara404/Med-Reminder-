import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { Users2Icon, CheckCircleIcon, XCircleIcon, PlusIcon, EditIcon, TrashIcon, SearchIcon, UserPlusIcon, UserMinusIcon } from 'lucide-react';
import CaregiverModal from './CaregiverModal';
import AssignmentModal from './AssignmentModal';

interface Caregiver {
  _id: string;
  id?: string;
  user?: {
    name: string;
    email: string;
  };
  name?: string;
  email?: string;
  specialization?: string;
  patients?: any[];
  status: 'active' | 'suspended';
}

const AdminCaregivers: React.FC = () => {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);

  // Add new state variables
  const [availablePatients, setAvailablePatients] = useState<any[]>([]);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>('');
  const [caregiverPatients, setCaregiverPatients] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [caregiversData, patientsData] = await Promise.all([
        adminService.getAllCaregivers(),
        adminService.getAllPatients()
      ]);
      setCaregivers(caregiversData);
      setAvailablePatients(patientsData);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCaregiver = async (caregiverData: any) => {
    try {
      const newCaregiver = await adminService.addCaregiver(caregiverData);
      setCaregivers([...caregivers, newCaregiver]);
      setIsModalOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add caregiver');
    }
  };

  const handleUpdateCaregiver = async (caregiverData: any) => {
    if (!selectedCaregiver?._id) return;

    try {
      const updatedCaregiver = await adminService.updateCaregiver(selectedCaregiver._id, caregiverData);
      setCaregivers(caregivers.map(caregiver => 
        caregiver._id === selectedCaregiver._id ? updatedCaregiver : caregiver
      ));
      setIsModalOpen(false);
      setSelectedCaregiver(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update caregiver');
    }
  };

  const handleDeleteCaregiver = async (caregiverId: string) => {
    if (window.confirm('Are you sure you want to delete this caregiver?')) {
      try {
        await adminService.deleteCaregiver(caregiverId);
        setCaregivers(caregivers.filter(caregiver => caregiver._id !== caregiverId));
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete caregiver');
      }
    }
  };

  const handleUpdateStatus = async (caregiverId: string, status: 'active' | 'suspended') => {
    if (!caregiverId) return;
    
    try {
      // Find the user ID for this caregiver
      const caregiver = caregivers.find(c => c._id === caregiverId);
      if (!caregiver) {
        setError('Caregiver not found');
        return;
      }
      
      // Use caregiver's user ID to update status
      const userId = caregiver.user?._id || caregiverId;
      
      await adminService.updateUserStatus(userId, status);
      
      // Update local state
      setCaregivers(caregivers.map(caregiver => 
        caregiver._id === caregiverId 
          ? { ...caregiver, status } 
          : caregiver
      ));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  const handleAssignPatient = async (patientId: string) => {
    try {
      if (!selectedCaregiverId || !patientId) {
        setError('Missing required information');
        return;
      }

      const result = await adminService.assignPatientToCaregiver(
        selectedCaregiverId,
        patientId
      );
      
      // Update the local state
      setCaregivers(caregivers.map(caregiver => 
        caregiver._id === selectedCaregiverId
          ? {
              ...caregiver,
              patients: [...(caregiver.patients || []), { _id: patientId }]
            }
          : caregiver
      ));

      setIsAssignModalOpen(false);
      setSelectedCaregiverId('');
      alert('Patient assigned successfully');
      
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to assign patient');
      console.error('Assignment error:', error);
    }
  };

  const handleUnassignPatient = async (patientId: string) => {
    try {
      if (!selectedCaregiverId || !patientId) {
        setError('Missing required information');
        return;
      }

      const result = await adminService.unassignPatientFromCaregiver(
        selectedCaregiverId,
        patientId
      );
      
      // Update the local state
      setCaregivers(caregivers.map(caregiver => 
        caregiver._id === selectedCaregiverId
          ? {
              ...caregiver,
              patients: (caregiver.patients || []).filter(p => 
                p._id !== patientId && (typeof p === 'string' ? p !== patientId : true)
              )
            }
          : caregiver
      ));

      setIsUnassignModalOpen(false);
      setSelectedCaregiverId('');
      setCaregiverPatients([]);
      alert('Patient unassigned successfully');
      
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to unassign patient');
      console.error('Unassignment error:', error);
    }
  };

  const loadAvailablePatients = async (caregiverId: string) => {
    try {
      // Fetch all patients from the admin service
      const allPatients = await adminService.getAllPatients();
      
      // Find the caregiver
      const selectedCaregiver = caregivers.find(c => c._id === caregiverId);
      
      if (!selectedCaregiver) return [];
      
      // Filter out patients that are already assigned to this caregiver
      const caregiversPatientIds = (selectedCaregiver.patients || [])
        .map(p => typeof p === 'string' ? p : p._id || p.id)
        .filter(Boolean);
        
      const availablePatientsList = allPatients.filter(patient => 
        !caregiversPatientIds.includes(patient._id) && 
        !caregiversPatientIds.includes(patient.id)
      );
      
      return availablePatientsList;
    } catch (error) {
      console.error('Error loading available patients:', error);
      return [];
    }
  };

  const loadCaregiverPatients = async (caregiverId: string) => {
    try {
      const caregiver = caregivers.find(c => c._id === caregiverId);
      if (!caregiver || !caregiver.patients || caregiver.patients.length === 0) {
        return [];
      }
      
      // Get patient details for each patient ID
      const allPatients = await adminService.getAllPatients();
      const patientIds = caregiver.patients.map(p => typeof p === 'string' ? p : p._id || p.id);
      
      return allPatients.filter(p => patientIds.includes(p.id) || patientIds.includes(p._id));
    } catch (error) {
      console.error('Error loading caregiver patients:', error);
      return [];
    }
  };

  const handleAssignButtonClick = async (caregiverId: string) => {
    try {
      setSelectedCaregiverId(caregiverId);
      const patients = await loadAvailablePatients(caregiverId);
      setAvailablePatients(patients);
      setIsAssignModalOpen(true);
    } catch (error) {
      console.error('Error preparing patient assignment:', error);
    }
  };

  const handleUnassignButtonClick = async (caregiverId: string) => {
    try {
      setSelectedCaregiverId(caregiverId);
      const patients = await loadCaregiverPatients(caregiverId);
      setCaregiverPatients(patients);
      setIsUnassignModalOpen(true);
    } catch (error) {
      console.error('Error preparing patient unassignment:', error);
    }
  };

  const filteredCaregivers = caregivers.filter((caregiver: Caregiver) => {
    const name = caregiver?.name || caregiver?.user?.name || '';
    const email = caregiver?.email || caregiver?.user?.email || '';
    const specialization = caregiver?.specialization || '';
    
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Caregivers Management</h1>
        <button
          onClick={() => {
            setSelectedCaregiver(null);
            setIsModalOpen(true);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <PlusIcon size={20} className="mr-2" />
          Add Caregiver
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search caregivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Caregiver
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialization
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
            {filteredCaregivers.map((caregiver, index) => (
              <tr key={caregiver._id || `caregiver-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Users2Icon size={20} className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {caregiver?.name || caregiver?.user?.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {caregiver?.email || caregiver?.user?.email || 'No email'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {caregiver.specialization || 'General Care'}
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
                    {caregiver.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedCaregiver(caregiver);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    title="Edit"
                  >
                    <EditIcon size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteCaregiver(caregiver._id)}
                    className="text-red-600 hover:text-red-900 mr-4"
                    title="Delete"
                  >
                    <TrashIcon size={18} />
                  </button>
                  {caregiver.status === 'active' ? (
                    <button
                      onClick={() =>
                        handleUpdateStatus(caregiver._id, 'suspended')
                      }
                      className="text-red-600 hover:text-red-900 mr-4"
                      title="Suspend"
                    >
                      <XCircleIcon size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(caregiver._id, 'active')}
                      className="text-green-600 hover:text-green-900 mr-4"
                      title="Activate"
                    >
                      <CheckCircleIcon size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleAssignButtonClick(caregiver._id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    title="Assign Patient"
                  >
                    <UserPlusIcon size={18} />
                  </button>
                  <button
                    onClick={() => handleUnassignButtonClick(caregiver._id)}
                    className="text-orange-600 hover:text-orange-900"
                    title="Unassign Patient"
                  >
                    <UserMinusIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CaregiverModal
          caregiver={selectedCaregiver}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCaregiver(null);
          }}
          onSubmit={selectedCaregiver ? handleUpdateCaregiver : handleAddCaregiver}
        />
      )}

      {isAssignModalOpen && (
        <AssignmentModal
          title="Assign Patient"
          items={availablePatients}
          onAssign={handleAssignPatient}
          onClose={() => {
            setIsAssignModalOpen(false);
            setSelectedCaregiverId('');
          }}
          itemLabelField="name"
        />
      )}

      {isUnassignModalOpen && (
        <AssignmentModal
          title="Unassign Patient"
          items={caregiverPatients}
          onAssign={handleUnassignPatient}
          onClose={() => {
            setIsUnassignModalOpen(false);
            setSelectedCaregiverId('');
            setCaregiverPatients([]);
          }}
          itemLabelField="name"
        />
      )}
    </div>
  );
};

export default AdminCaregivers;