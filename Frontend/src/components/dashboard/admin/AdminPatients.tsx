import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { UserIcon, PillIcon, PlusIcon, EditIcon, TrashIcon, SearchIcon } from 'lucide-react';
import PatientModal from './PatientModal';

interface Patient {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  medications: number;
  adherence: number;
  conditions: string[];
  status: 'stable' | 'attention' | 'critical';
  caregivers: Array<{ id: string; name: string; }>;
}

const AdminPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const patientsData = await adminService.getAllPatients();
      setPatients(patientsData);
    } catch (error: any) {
      setError(error.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (patientData: any) => {
    try {
      const newPatient = await adminService.addPatient(patientData);
      setPatients([...patients, newPatient]);
      setIsModalOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add patient');
    }
  };

  const handleUpdatePatient = async (patientData: any) => {
    try {
      const updatedPatient = await adminService.updatePatient(selectedPatient!.id, patientData);
      setPatients(patients.map(patient => 
        patient.id === selectedPatient!.id ? updatedPatient : patient
      ));
      setIsModalOpen(false);
      setSelectedPatient(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update patient');
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await adminService.deletePatient(patientId);
        setPatients(patients.filter(patient => patient.id !== patientId));
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete patient');
      }
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient?.conditions?.some(condition => 
      condition.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patients Management</h1>
        <button
          onClick={() => {
            setSelectedPatient(null);
            setIsModalOpen(true);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <PlusIcon size={20} className="mr-2" />
          Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medications
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
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <UserIcon size={20} className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {patient.name}
                      </div>
                      <div className="text-sm text-gray-500">{patient.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.age}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <PillIcon size={16} className="text-gray-400 mr-2" />
                    {patient.medications} active medications
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      patient.status === 'stable'
                        ? 'bg-green-100 text-green-800'
                        : patient.status === 'attention'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedPatient(patient);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <EditIcon size={18} />
                  </button>
                  <button
                    onClick={() => handleDeletePatient(patient.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <PatientModal
          patient={selectedPatient}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPatient(null);
          }}
          onSubmit={selectedPatient ? handleUpdatePatient : handleAddPatient}
          caregivers={[]} // Pass an empty array if you don't have caregivers data
        />
      )}
    </div>
  );
};

export default AdminPatients;