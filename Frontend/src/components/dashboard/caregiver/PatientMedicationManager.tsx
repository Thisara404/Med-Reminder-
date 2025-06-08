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
    status: 'active'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newMedication, setNewMedication] = useState('');

  useEffect(() => {
    loadMedications();
  }, [patientId]);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const data = await caregiverService.getPatientMedications(patientId);
      setMedications(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load medications');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = async () => {
    if (!newMedication) return;
    setLoading(true);
    setError('');
    try {
      // Make sure to pass the patientId correctly
      const medicationData = { 
        name: newMedication,
        dosage: currentMedication.dosage || '',
        frequency: currentMedication.frequency || 'Once daily',
        instructions: currentMedication.instructions || '',
        category: 'General',
        description: ''
      };
      
      const addedMedication = await caregiverService.addMedication(patientId, medicationData);
      setMedications([...medications, addedMedication]);
      setNewMedication('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMedication = (medication: Medication) => {
    setCurrentMedication(medication);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteMedication = async (medicationId: string) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await caregiverService.deleteMedication(patientId, medicationId);
        setMedications(medications.filter(med => med.id !== medicationId));
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete medication');
      }
    }
  };

  const handleSaveMedication = async () => {
    try {
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
        const newMed = await caregiverService.addMedication(patientId, currentMedication);
        setMedications([...medications, newMed]);
      }
      setIsModalOpen(false);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to save medication');
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Medications</h3>
        <button 
          onClick={handleAddMedication}
          className="flex items-center text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700"
        >
          <PlusIcon size={16} className="mr-1" />
          Add Medication
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading medications...</div>
      ) : error ? (
        <div className="text-red-500 py-2">{error}</div>
      ) : medications.length === 0 ? (
        <div className="text-gray-500 py-4 text-center">No medications found</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medication
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosage
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medications.map(medication => (
                <tr key={medication.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-1.5 rounded-full mr-2">
                        <PillIcon size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{medication.name}</div>
                        <div className="text-xs text-gray-500">{medication.instructions}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {medication.dosage}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {medication.frequency}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      medication.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {medication.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
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

            <form onSubmit={(e) => { e.preventDefault(); handleSaveMedication(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Medication Name*</label>
                <input
                  type="text"
                  value={currentMedication.name || ''}
                  onChange={(e) => setCurrentMedication({...currentMedication, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Dosage*</label>
                <input
                  type="text"
                  value={currentMedication.dosage || ''}
                  onChange={(e) => setCurrentMedication({...currentMedication, dosage: e.target.value})}
                  placeholder="e.g. 10mg"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Frequency*</label>
                <select
                  value={currentMedication.frequency || 'Once daily'}
                  onChange={(e) => setCurrentMedication({...currentMedication, frequency: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="Three times daily">Three times daily</option>
                  <option value="Four times daily">Four times daily</option>
                  <option value="Every other day">Every other day</option>
                  <option value="Weekly">Weekly</option>
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