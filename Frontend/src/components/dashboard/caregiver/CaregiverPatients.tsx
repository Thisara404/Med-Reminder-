import React, { useState } from 'react';
import { UserIcon, PillIcon, PhoneIcon, MailIcon, ClipboardCheckIcon, PlusIcon, EditIcon, TrashIcon, SearchIcon } from 'lucide-react';
const CaregiverPatients: React.FC = () => {
  // Mock data for demonstration
  const [patients, setPatients] = useState([{
    id: 1,
    name: 'Alice Johnson',
    age: 72,
    email: 'alice.j@example.com',
    phone: '(555) 123-4567',
    medications: 5,
    adherence: 95,
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    status: 'stable'
  }, {
    id: 2,
    name: 'Robert Smith',
    age: 68,
    email: 'robert.s@example.com',
    phone: '(555) 987-6543',
    medications: 3,
    adherence: 85,
    conditions: ['Heart Disease', 'Arthritis'],
    status: 'attention'
  }, {
    id: 3,
    name: 'Mary Williams',
    age: 75,
    email: 'mary.w@example.com',
    phone: '(555) 456-7890',
    medications: 4,
    adherence: 100,
    conditions: ['Osteoporosis', 'COPD'],
    status: 'stable'
  }]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };
  const closeModal = () => {
    setIsViewModalOpen(false);
    setSelectedPatient(null);
  };
  const filteredPatients = patients.filter(patient => patient.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Patients</h1>
          <p className="text-gray-600">
            Manage and monitor your patients' medication adherence.
          </p>
        </div>
        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
          <PlusIcon size={18} className="mr-1" />
          Add New Patient
        </button>
      </div>
      {/* Search and Filter */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input type="text" placeholder="Search patients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>
      {/* Patients List */}
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
            {filteredPatients.map(patient => <tr key={patient.id}>
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
              </tr>)}
          </tbody>
        </table>
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
    </div>;
};
export default CaregiverPatients;