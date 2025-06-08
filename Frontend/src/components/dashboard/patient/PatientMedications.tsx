import React, { useState, useEffect } from 'react';
import { 
  PillIcon, 
  PlusIcon, 
  InfoIcon, 
  ClockIcon,
  CalendarIcon,
  EditIcon,
  TrashIcon,
  XIcon
} from 'lucide-react';
import { patientService } from '../../../services/patientService';
import { Link } from 'react-router-dom';

const PatientMedications: React.FC = () => {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMedication, setSelectedMedication] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddReminderModalOpen, setIsAddReminderModalOpen] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    time: '08:00',
    scheduledDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const data = await patientService.getMedications();
      console.log("Loaded medications:", data);
      setMedications(data);
    } catch (error: any) {
      console.error('Error loading medications:', error);
      setError(error.message || 'Failed to load medications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (medication: any) => {
    setSelectedMedication(medication);
    setIsModalOpen(true);
  };

  const handleAddReminder = (medication: any) => {
    setSelectedMedication(medication);
    setReminderForm({
      time: '08:00',
      scheduledDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsAddReminderModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedication(null);
  };

  const closeReminderModal = () => {
    setIsAddReminderModalOpen(false);
    setSelectedMedication(null);
  };

  const handleSubmitReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMedication) return;
    
    try {
      setLoading(true);
      await patientService.addReminder({
        medication: selectedMedication.id,
        time: reminderForm.time,
        scheduledDate: reminderForm.scheduledDate,
        notes: reminderForm.notes,
        status: 'upcoming'
      });
      
      closeReminderModal();
      
      // Show success message
      alert('Reminder set successfully!');
    } catch (error: any) {
      console.error('Error adding reminder:', error);
      alert(`Failed to set reminder: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter medications based on search term
  const filteredMedications = medications.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={loadMedications}
              className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-600"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Medications</h1>
          <p className="text-gray-600">View your medications and set reminders.</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search medications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
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
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMedications.length > 0 ? (
              filteredMedications.map(medication => (
                <tr key={medication.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <PillIcon size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {medication.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {medication.category || 'General'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {medication.dosage || 'Not specified'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon size={14} className="text-gray-400 mr-1" />
                      <span>{medication.frequency || 'Not specified'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      medication.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {medication.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleViewDetails(medication)} 
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <InfoIcon size={18} />
                      </button>
                      <button 
                        onClick={() => handleAddReminder(medication)} 
                        className="text-green-600 hover:text-green-800"
                        title="Set Reminder"
                      >
                        <ClockIcon size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No medications found. Your caregiver will add medications for you.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Medication Detail Modal */}
      {isModalOpen && selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Medication Details
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <XIcon size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Medication Name</h4>
                <p className="text-base text-gray-900">{selectedMedication.name}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Category</h4>
                <p className="text-base text-gray-900">{selectedMedication.category || 'Not specified'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Dosage</h4>
                <p className="text-base text-gray-900">{selectedMedication.dosage || 'Not specified'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Frequency</h4>
                <p className="text-base text-gray-900">{selectedMedication.frequency || 'Not specified'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500">Instructions</h4>
                <p className="text-base text-gray-900">{selectedMedication.instructions || 'No specific instructions'}</p>
              </div>
              
              {selectedMedication.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="text-base text-gray-900">{selectedMedication.description}</p>
                </div>
              )}
              
              <div className="pt-4 flex justify-end space-x-3">
                <button onClick={closeModal} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Close
                </button>
                <button 
                  onClick={() => {
                    closeModal();
                    handleAddReminder(selectedMedication);
                  }} 
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
                >
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Reminder Modal */}
      {isAddReminderModalOpen && selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Set Reminder for {selectedMedication.name}
              </h3>
              <button onClick={closeReminderModal} className="text-gray-400 hover:text-gray-500">
                <XIcon size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitReminder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time
                </label>
                <input
                  type="time"
                  value={reminderForm.time}
                  onChange={(e) => setReminderForm({...reminderForm, time: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={reminderForm.scheduledDate}
                  onChange={(e) => setReminderForm({...reminderForm, scheduledDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  value={reminderForm.notes}
                  onChange={(e) => setReminderForm({...reminderForm, notes: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  placeholder="Any special instructions or notes about this reminder"
                ></textarea>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Reminder Details</h4>
                <p className="text-sm text-blue-700">
                  <strong>Medication:</strong> {selectedMedication.name}
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Dosage:</strong> {selectedMedication.dosage || 'Not specified'}
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Instructions:</strong> {selectedMedication.instructions || 'No specific instructions'}
                </p>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={closeReminderModal} 
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
                >
                  Set Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMedications;