import React, { useState } from 'react';
import { PillIcon, ClockIcon, CalendarIcon, InfoIcon, PlusIcon, TrashIcon, EditIcon } from 'lucide-react';
const PatientMedications: React.FC = () => {
  // Mock data for demonstration
  const [medications, setMedications] = useState([{
    id: 1,
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    time: '8:00 AM',
    startDate: '2023-01-15',
    endDate: '2023-07-15',
    instructions: 'Take with water before breakfast',
    purpose: 'Blood pressure'
  }, {
    id: 2,
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    time: '8:00 AM, 8:00 PM',
    startDate: '2023-02-01',
    endDate: '',
    instructions: 'Take with food',
    purpose: 'Diabetes'
  }, {
    id: 3,
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    time: '8:00 PM',
    startDate: '2023-01-10',
    endDate: '',
    instructions: 'Take in the evening',
    purpose: 'Cholesterol'
  }]);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleViewDetails = (medication: any) => {
    setSelectedMedication(medication);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedication(null);
  };
  return <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Medications</h1>
          <p className="text-gray-600">Manage and track your medications.</p>
        </div>
        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
          <PlusIcon size={18} className="mr-1" />
          Add Medication
        </button>
      </div>
      {/* Medications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medication
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dosage
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Schedule
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purpose
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medications.map(medication => <tr key={medication.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <PillIcon size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {medication.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {medication.dosage}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon size={14} className="text-gray-400 mr-1" />
                    <span>{medication.frequency}</span>
                  </div>
                  <div className="text-sm text-gray-500">{medication.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {medication.purpose}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleViewDetails(medication)} className="text-blue-600 hover:text-blue-800">
                      <InfoIcon size={18} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <EditIcon size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
      {/* Medication Detail Modal */}
      {isModalOpen && selectedMedication && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Medication Details
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <PillIcon size={24} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-medium">
                    {selectedMedication.name}
                  </h4>
                  <p className="text-gray-500">{selectedMedication.dosage}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <dl className="space-y-3">
                  <div className="flex items-start">
                    <dt className="flex items-center w-1/3 text-sm font-medium text-gray-500">
                      <ClockIcon size={16} className="mr-1" />
                      Schedule:
                    </dt>
                    <dd className="w-2/3 text-sm text-gray-900">
                      {selectedMedication.frequency}
                      <br />
                      <span className="text-gray-600">
                        {selectedMedication.time}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="flex items-center w-1/3 text-sm font-medium text-gray-500">
                      <CalendarIcon size={16} className="mr-1" />
                      Duration:
                    </dt>
                    <dd className="w-2/3 text-sm text-gray-900">
                      From {selectedMedication.startDate}
                      {selectedMedication.endDate && <span> to {selectedMedication.endDate}</span>}
                      {!selectedMedication.endDate && <span> (ongoing)</span>}
                    </dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="w-1/3 text-sm font-medium text-gray-500">
                      Purpose:
                    </dt>
                    <dd className="w-2/3 text-sm text-gray-900">
                      {selectedMedication.purpose}
                    </dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="w-1/3 text-sm font-medium text-gray-500">
                      Instructions:
                    </dt>
                    <dd className="w-2/3 text-sm text-gray-900">
                      {selectedMedication.instructions}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={closeModal} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                Close
              </button>
              <button className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700">
                Edit
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export default PatientMedications;