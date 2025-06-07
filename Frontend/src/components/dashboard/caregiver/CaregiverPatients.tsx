import React, { useState, useEffect } from 'react';
import { UserIcon, PillIcon, PhoneIcon, MailIcon, ClipboardCheckIcon, PlusIcon, EditIcon, TrashIcon, SearchIcon } from 'lucide-react';
import { caregiverService } from '../../../services/caregiverService';
import { NewPatientData } from '../../../types';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14h4v4h-4zm0-8h4v4h-4zm0 8H6a2 2 0 01-2-2v-4a2 2 0 012-2h4v4H6v4h4zm8-4h-4v4h4v-4zm0-8h-4v4h4V6zm0 8h4a2 2 0 002-2v-4a2 2 0 00-2-2h-4v4h4v4h-4z" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </div>
  </div>
);

interface AddPatientFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  conditions: string;
}

interface AddPatientModalProps {
  onClose: () => void;
  onSubmit: (data: NewPatientData) => void;
  onExistingPatientSubmit: (patientId: string) => void;
}

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

  useEffect(() => {
    const fetchAvailablePatients = async () => {
      try {
        const data = await caregiverService.getAvailablePatients();
        setAvailablePatients(data);
      } catch (error) {
        console.error('Error fetching available patients:', error);
      }
    };
    fetchAvailablePatients();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewPatient) {
      onSubmit({
        ...formData,
        conditions: formData.conditions.split(',').map(c => c.trim()).filter(c => c)
      });
    } else {
      onExistingPatientSubmit(selectedPatientId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Add Patient</h2>
        
        {/* Toggle between new and existing patient */}
        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md ${
              isNewPatient ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setIsNewPatient(true)}
          >
            New Patient
          </button>
          <button
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
            // New patient form
            <div className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Medical Conditions (comma-separated)</label>
                <input
                  type="text"
                  value={formData.conditions}
                  onChange={(e) => setFormData({...formData, conditions: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Diabetes, Hypertension"
                />
              </div>
            </div>
          ) : (
            // Existing patient selection
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CaregiverPatients: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await caregiverService.getPatients();
      setPatients(data);
    } catch (error) {
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
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add patient');
    }
  };

  const handleAddExistingPatient = async (patientId: string) => {
    try {
      const newPatient = await caregiverService.addExistingPatient(patientId);
      setPatients([...patients, newPatient]);
      setIsAddModalOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add patient');
    }
  };

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedPatient(null);
  };

  const searchInPatient = (patient: any, searchTerm: string): boolean => {
    const searchValue = searchTerm.toLowerCase();
    const searchableFields = [
      patient.name,
      patient.email,
      patient.phone,
      patient.age?.toString(),
      patient.id,
      patient.status,
      ...(patient.conditions || []),
      patient.emergencyContact,
      patient.emergencyPhone
    ];

    return searchableFields.some(field => 
      field?.toLowerCase().includes(searchValue)
    );
  };

  // Enhanced search function
  const filteredPatients = patients.filter(patient => {
    if (!patient) return false;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      // Search by name
      (patient.name?.toLowerCase().includes(searchTermLower)) ||
      // Search by email
      (patient.email?.toLowerCase().includes(searchTermLower)) ||
      // Search by phone
      (patient.phone?.toLowerCase().includes(searchTermLower)) ||
      // Search by age
      (patient.age?.toString().includes(searchTerm)) ||
      // Search by conditions
      (patient.conditions?.some(condition => 
        condition.toLowerCase().includes(searchTermLower)
      )) ||
      // Search by status
      (patient.status?.toLowerCase().includes(searchTermLower)) ||
      // Search by ID
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
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Patients</h1>
          <p className="text-gray-600">
            Manage and monitor your patients' medication adherence.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)} 
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          <PlusIcon size={18} className="mr-1" />
          Add New Patient
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
            placeholder="Search patients by name, email, phone, age, conditions..." 
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
                Medications
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
              <tr key={patient.id}>
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
                  <div className="text-sm text-gray-500 flex items-center">
                    <MailIcon size={14} className="text-gray-400 mr-1" />
                    {patient.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <PillIcon size={14} className="text-gray-400 mr-1" />
                    <span>{patient.medications} medications</span>
                  </div>
                  <div className="mt-1">
                    <div className="text-xs text-gray-500">
                      Adherence: {patient.adherence}%
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div className={`h-2 rounded-full ${patient.adherence > 90 ? 'bg-green-500' : patient.adherence > 75 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                    width: `${patient.adherence}%`
                  }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.status === 'stable' ? 'bg-green-100 text-green-800' : patient.status === 'attention' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {patient.status === 'stable' ? 'Stable' : patient.status === 'attention' ? 'Needs Attention' : 'Critical'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleViewDetails(patient)} className="text-blue-600 hover:text-blue-800" title="View Details">
                      <ClipboardCheckIcon size={18} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800" title="Edit Patient">
                      <EditIcon size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800" title="Remove Patient">
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No patients found matching your search criteria.
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {isViewModalOpen && selectedPatient && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Patient Details
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                      {selectedPatient.conditions.map((condition: string, index: number) => <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
                            {condition}
                          </span>)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Medications:</span>
                    <div className="flex items-center mt-1">
                      <PillIcon size={16} className="text-blue-600 mr-1" />
                      <span>
                        {selectedPatient.medications} active medications
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Adherence Rate:</span>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div className={`h-2 rounded-full ${selectedPatient.adherence > 90 ? 'bg-green-500' : selectedPatient.adherence > 75 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                      width: `${selectedPatient.adherence}%`
                    }}></div>
                      </div>
                      <span className="font-medium">
                        {selectedPatient.adherence}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={closeModal} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                Close
              </button>
              <button className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">
                View Full Profile
              </button>
            </div>
          </div>
        </div>}
      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <AddPatientModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddPatient}
          onExistingPatientSubmit={handleAddExistingPatient}
        />
      )}
    </div>
  );
};

export default CaregiverPatients;