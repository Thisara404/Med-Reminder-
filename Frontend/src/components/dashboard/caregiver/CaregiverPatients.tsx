import React, { useState, useEffect } from 'react';
import { 
  UserIcon, 
  PillIcon, 
  PhoneIcon, 
  MailIcon, 
  ClipboardCheckIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  SearchIcon,
  CalendarIcon,
  HeartIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XIcon
} from 'lucide-react';
import { caregiverService } from '../../../services/caregiverService';
import { NewPatientData } from '../../../types';

// Loading and Error Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <AlertTriangleIcon className="h-5 w-5 text-red-400" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </div>
  </div>
);

// Interfaces
interface AddPatientFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  conditions: string;
}

interface EditPatientFormData {
  name: string;
  phone: string;
  conditions: string;
}

interface AddPatientModalProps {
  onClose: () => void;
  onSubmit: (data: NewPatientData) => void;
  onExistingPatientSubmit: (patientId: string) => void;
}

interface EditPatientModalProps {
  patient: any;
  onClose: () => void;
  onSubmit: (patientId: string, data: EditPatientFormData) => void;
}

// Add Patient Modal Component
const AddPatientModal: React.FC<AddPatientModalProps> = ({ onClose, onSubmit, onExistingPatientSubmit }) => {
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [availablePatients, setAvailablePatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [formData, setFormData] = useState<AddPatientFormData>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    conditions: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAvailablePatients = async () => {
      try {
        const data = await caregiverService.getAvailablePatients();
        setAvailablePatients(data);
      } catch (error) {
        console.error('Error fetching available patients:', error);
        setError('Failed to load available patients');
      }
    };
    fetchAvailablePatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isNewPatient) {
        // Validate form data
        if (!formData.name || !formData.email || !formData.phone || !formData.dateOfBirth) {
          setError('Please fill in all required fields');
          return;
        }

        // Validate date of birth
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        if (birthDate > today) {
          setError('Date of birth cannot be in the future');
          return;
        }

        await onSubmit({
          ...formData,
          conditions: formData.conditions.split(',').map(c => c.trim()).filter(c => c)
        });
      } else {
        if (!selectedPatientId) {
          setError('Please select a patient');
          return;
        }
        await onExistingPatientSubmit(selectedPatientId);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Patient</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XIcon size={24} />
          </button>
        </div>
        
        {error && <ErrorMessage message={error} />}
        
        {/* Toggle between new and existing patient */}
        <div className="flex space-x-4 mb-6">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              isNewPatient ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setIsNewPatient(true)}
          >
            New Patient
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              !isNewPatient ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setIsNewPatient(false)}
          >
            Existing Patient
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isNewPatient ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                <input
                  type="text"
                  value={formData.conditions}
                  onChange={(e) => setFormData({...formData, conditions: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Diabetes, Hypertension (comma-separated)"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a patient...</option>
                  {availablePatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.email})
                    </option>
                  ))}
                </select>
                {availablePatients.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">No available patients to assign</p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!isNewPatient && !selectedPatientId)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Patient Modal Component
const EditPatientModal: React.FC<EditPatientModalProps> = ({ patient, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EditPatientFormData>({
    name: patient?.name || '',
    phone: patient?.phone || '',
    conditions: Array.isArray(patient?.conditions) ? patient.conditions.join(', ') : ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(patient.id, {
        ...formData,
        conditions: formData.conditions.split(',').map(c => c.trim()).filter(c => c)
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Patient</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XIcon size={24} />
          </button>
        </div>
        
        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
            <input
              type="text"
              value={formData.conditions}
              onChange={(e) => setFormData({...formData, conditions: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Diabetes, Hypertension (comma-separated)"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Patient Medication Manager Component
const PatientMedicationManager: React.FC<{ patientId: string }> = ({ patientId }) => {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchMedications = async () => {
      if (!patientId) return;
      setLoading(true);
      setError('');
      try {
        const data = await caregiverService.getPatientMedications(patientId);
        setMedications(data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load medications');
      } finally {
        setLoading(false);
      }
    };
    fetchMedications();
  }, [patientId]);

  const handleAddMedication = async () => {
    if (!newMedication) return;
    setLoading(true);
    setError('');
    try {
      // Make sure to pass patientId as first parameter, not in the medicationData
      const addedMedication = await caregiverService.addMedication(patientId, { 
        name: newMedication,
        dosage: '',
        frequency: 'Once daily',
        instructions: '',
        status: 'active'
      });
      setMedications([...medications, addedMedication]);
      setNewMedication('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMedication = (medication: any) => {
    setEditingMedication(medication);
    setNewMedication(medication.name);
    setIsEditMode(true);
  };

  const handleUpdateMedication = async () => {
    if (!editingMedication || !newMedication) return;
    setLoading(true);
    setError('');
    try {
      const updatedMedication = { ...editingMedication, name: newMedication };
      await caregiverService.updateMedication(updatedMedication.id, updatedMedication);
      setMedications(medications.map(med => med.id === updatedMedication.id ? updatedMedication : med));
      setNewMedication('');
      setIsEditMode(false);
      setEditingMedication(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update medication');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedication = async (medicationId: string) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      setLoading(true);
      setError('');
      try {
        await caregiverService.deleteMedication(medicationId);
        setMedications(medications.filter(med => med.id !== medicationId));
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete medication');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Medications</h3>
      {error && <ErrorMessage message={error} />}
      
      <div className="flex space-x-3 mb-4">
        <input
          type="text"
          value={newMedication}
          onChange={(e) => setNewMedication(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          placeholder="Add new medication"
        />
        <button
          onClick={isEditMode ? handleUpdateMedication : handleAddMedication}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Medication' : 'Add Medication')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medication
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medications.map(medication => (
              <tr key={medication.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {medication.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => handleEditMedication(medication)}
                      className="text-gray-600 hover:text-gray-800" 
                      title="Edit Medication"
                    >
                      <EditIcon size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteMedication(medication.id)}
                      className="text-red-600 hover:text-red-800" 
                      title="Delete Medication"
                    >
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {medications.length === 0 && (
          <div className="text-center py-12">
            <PillIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No medications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add medications to manage your patient's treatment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main CaregiverPatients Component
const CaregiverPatients: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<any>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await caregiverService.getPatients();
      setPatients(data);
      setError('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (patientData: NewPatientData) => {
    try {
      const newPatient = await caregiverService.addPatient(patientData);
      setPatients([...patients, newPatient]);
      setIsAddModalOpen(false);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add patient');
    }
  };

  const handleAddExistingPatient = async (patientId: string) => {
    try {
      const newPatient = await caregiverService.addExistingPatient(patientId);
      setPatients([...patients, newPatient]);
      setIsAddModalOpen(false);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add patient');
    }
  };

  const handleEditPatient = async (patientId: string, updates: EditPatientFormData) => {
    try {
      await caregiverService.updatePatient(patientId, updates);
      // Reload patients to get updated data
      await loadPatients();
      setIsEditModalOpen(false);
      setEditingPatient(null);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update patient');
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    if (window.confirm('Are you sure you want to remove this patient from your care? This action cannot be undone.')) {
      try {
        await caregiverService.deletePatient(patientId);
        setPatients(patients.filter(p => p.id !== patientId));
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete patient');
      }
    }
  };

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (patient: any) => {
    setEditingPatient(patient);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedPatient(null);
  };

  // Enhanced search function
  const filteredPatients = patients.filter(patient => {
    if (!patient || !searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (patient.name?.toLowerCase().includes(searchTermLower)) ||
      (patient.email?.toLowerCase().includes(searchTermLower)) ||
      (patient.phone?.toLowerCase().includes(searchTermLower)) ||
      (patient.age?.toString().includes(searchTerm)) ||
      (patient.conditions?.some((condition: string) => 
        condition.toLowerCase().includes(searchTermLower)
      )) ||
      (patient.status?.toLowerCase().includes(searchTermLower)) ||
      (patient.id?.toLowerCase().includes(searchTermLower))
    );
  });

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Generate search suggestions
    if (value.length > 1) {
      const suggestions = patients
        .flatMap(patient => [
          patient.name,
          patient.email,
          ...(patient.conditions || [])
        ])
        .filter((item): item is string => !!item)
        .filter(item => 
          item.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 5);
      
      setSearchSuggestions([...new Set(suggestions)]);
    } else {
      setSearchSuggestions([]);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {error && <ErrorMessage message={error} />}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Patients</h1>
          <p className="text-gray-600">
            Manage and monitor your patients' medication adherence.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)} 
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          <PlusIcon size={18} className="mr-1" />
          Add Patient
        </button>
      </div>

      {/* Enhanced Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search patients by name, email, phone, conditions..." 
            value={searchTerm} 
            onChange={handleSearchInput}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {searchSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              {searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    setSearchSuggestions([]);
                  }}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Health Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map(patient => (
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
                      <div className="text-sm text-gray-500">
                        {patient.age} years old
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center">
                    <PhoneIcon size={14} className="text-gray-400 mr-1" />
                    {patient.phone}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <MailIcon size={14} className="text-gray-400 mr-1" />
                    {patient.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <PillIcon size={14} className="text-gray-400 mr-1" />
                    <span>{patient.medications || 0} medications</span>
                  </div>
                  {patient.conditions && patient.conditions.length > 0 && (
                    <div className="mt-1">
                      <div className="text-xs text-gray-500 flex items-center">
                        <HeartIcon size={12} className="text-red-400 mr-1" />
                        {patient.conditions.slice(0, 2).join(', ')}
                        {patient.conditions.length > 2 && ` +${patient.conditions.length - 2} more`}
                      </div>
                    </div>
                  )}
                  <div className="mt-1">
                    <div className="text-xs text-gray-500">
                      Adherence: {patient.adherence || 0}%
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => handleViewDetails(patient)} 
                      className="text-blue-600 hover:text-blue-800" 
                      title="View Details"
                    >
                      <ClipboardCheckIcon size={18} />
                    </button>
                    <button 
                      onClick={() => handleEditClick(patient)}
                      className="text-gray-600 hover:text-gray-800" 
                      title="Edit Patient"
                    >
                      <EditIcon size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeletePatient(patient.id)}
                      className="text-red-600 hover:text-red-800" 
                      title="Remove Patient"
                    >
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            {searchTerm ? (
              <div>
                <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No patients match your search criteria.
                </p>
              </div>
            ) : (
              <div>
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No patients</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding your first patient.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Add Patient
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {isViewModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Patient Details
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <XIcon size={24} />
              </button>
            </div>
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <UserIcon size={24} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-medium">
                    {selectedPatient.name}
                  </h4>
                  <p className="text-gray-500">
                    {selectedPatient.age} years old
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <PhoneIcon size={16} className="text-gray-400 mr-2" />
                    <span>{selectedPatient.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MailIcon size={16} className="text-gray-400 mr-2" />
                    <span>{selectedPatient.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium mb-3">Medical Information</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-500">Medical Conditions:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPatient.conditions && selectedPatient.conditions.length > 0 ? (
                        selectedPatient.conditions.map((condition: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                            {condition}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">No conditions recorded</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Medications:</span>
                    <div className="flex items-center mt-1">
                      <PillIcon size={16} className="text-blue-600 mr-1" />
                      <span>{selectedPatient.medications || 0} active medications</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Adherence Rate:</span>
                    <div className="flex items-center mt-1">
                      <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                        <div 
                          className={`h-3 rounded-full ${
                            (selectedPatient.adherence || 0) > 90 ? 'bg-green-500' : 
                            (selectedPatient.adherence || 0) > 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${selectedPatient.adherence || 0}%` }}
                        ></div>
                      </div>
                      <span className="font-medium">
                        {selectedPatient.adherence || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Patient Medication Manager */}
              <PatientMedicationManager patientId={selectedPatient.id} />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={closeModal} 
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button 
                onClick={() => handleEditClick(selectedPatient)}
                className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
              >
                Edit Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <AddPatientModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddPatient}
          onExistingPatientSubmit={handleAddExistingPatient}
        />
      )}

      {/* Edit Patient Modal */}
      {isEditModalOpen && editingPatient && (
        <EditPatientModal
          patient={editingPatient}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPatient(null);
          }}
          onSubmit={handleEditPatient}
        />
      )}
    </div>
  );
};

export default CaregiverPatients;