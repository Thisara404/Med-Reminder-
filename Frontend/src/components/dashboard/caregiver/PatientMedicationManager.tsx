import React, { useState, useEffect } from 'react';
import { PillIcon, PlusIcon, EditIcon, TrashIcon, XIcon } from 'lucide-react';
import { caregiverService } from '../../../services/caregiverService';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
  status: 'active' | 'discontinued';
  category?: string;
  description?: string;
}

interface PatientMedicationManagerProps {
  patientId: string;
}

const PatientMedicationManager: React.FC<PatientMedicationManagerProps> = ({ patientId }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMedication, setCurrentMedication] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: 'Once daily',
    instructions: '',
    status: 'active',
    category: 'General',
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (patientId) {
      loadMedications();
    }
  }, [patientId]);

  const loadMedications = async () => {
    if (!patientId) return;
    
    try {
      setLoading(true);
      setError('');
      console.log("Fetching medications for patient:", patientId);
      
      const data = await caregiverService.getPatientMedications(patientId);
      console.log("Medications received:", data);
      
      setMedications(Array.isArray(data) ? data : []);
      
      // If no medications were returned, let's create some mock data
      if (!data || data.length === 0) {
        console.log("No medications found - you can add medications using the Add button");
      }
    } catch (error: any) {
      console.error("Error loading medications:", error);
      setError('Failed to load medications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = () => {
    setCurrentMedication({
      name: '',
      dosage: '',
      frequency: 'Once daily',
      instructions: '',
      status: 'active',
      category: 'General',
      description: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setCurrentMedication({...medication});
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteMedication = async (medicationId: string) => {
    if (!medicationId) {
      console.error("Cannot delete - medication ID is undefined");
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        setLoading(true);
        await caregiverService.deleteMedication(patientId, medicationId);
        setMedications(medications.filter(med => med.id !== medicationId));
      } catch (error: any) {
        console.error("Error deleting medication:", error);
        setError('Failed to delete medication. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      if (isEditing && currentMedication.id) {
        const updated = await caregiverService.updateMedication(
          patientId,
          currentMedication.id,
          currentMedication
        );
        setMedications(medications.map(med => 
          med.id === currentMedication.id ? updated : med
        ));
      } else {
        // Create new medication
        const newMed = await caregiverService.addMedication(patientId, currentMedication);
        setMedications([...medications, newMed]);
      }
      
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving medication:", error);
      setError('Failed to save medication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Medications</h3>
        <button 
          onClick={handleAddMedication}
          className="flex items-center text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
        >
          <PlusIcon size={16} className="mr-1" />
          Add Medication
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={loadMedications}
                className="text-sm text-red-700 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading medications...</p>
        </div>
      ) : medications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <PillIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No medications found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add medications for this patient to manage their treatment.
          </p>
        </div>
      ) : (
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
                  Frequency
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
              {medications.map(medication => (
                <tr key={medication.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {medication.name}
                    </div>
                    {medication.description && (
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">
                        {medication.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {medication.dosage || 'Not specified'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {medication.frequency || 'Once daily'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      medication.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {medication.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEditMedication(medication)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMedication(medication.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Medication Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? 'Edit Medication' : 'Add Medication'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                <XIcon size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveMedication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Medication Name</label>
                <input
                  type="text"
                  value={currentMedication.name || ''}
                  onChange={(e) => setCurrentMedication({...currentMedication, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Dosage</label>
                <input
                  type="text"
                  value={currentMedication.dosage || ''}
                  onChange={(e) => setCurrentMedication({...currentMedication, dosage: e.target.value})}
                  placeholder="e.g. 10mg"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency</label>
                <select
                  value={currentMedication.frequency || 'Once daily'}
                  onChange={(e) => setCurrentMedication({...currentMedication, frequency: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Every morning">Every morning</option>
                  <option value="Every evening">Every evening</option>
                  <option value="As needed">As needed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Instructions</label>
                <textarea
                  value={currentMedication.instructions || ''}
                  onChange={(e) => setCurrentMedication({...currentMedication, instructions: e.target.value})}
                  placeholder="e.g. Take with food"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={currentMedication.status || 'active'}
                  onChange={(e) => setCurrentMedication({...currentMedication, status: e.target.value as 'active' | 'discontinued'})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="discontinued">Discontinued</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMedicationManager;