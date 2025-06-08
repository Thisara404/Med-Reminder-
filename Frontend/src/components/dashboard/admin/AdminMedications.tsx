import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import MedicationModal from './MedicationModal';

const AdminMedications: React.FC = () => {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading medications...');
      const data = await adminService.getAllMedications();
      console.log('Received medications data:', data);
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setMedications(data);
      } else {
        console.warn('Received non-array data:', data);
        setMedications([]);
      }
    } catch (error: any) {
      console.error('Error loading medications:', error);
      setError(error.message || 'Failed to load medications. Please try again.');
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
    loadMedications();
  };

  const handleAddMedication = async (medicationData: any) => {
    try {
      setError('');
      const newMedication = await adminService.addMedication(medicationData);
      setMedications(prev => [...prev, newMedication]);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error adding medication:', error);
      setError(error.message || 'Failed to add medication');
    }
  };

  const handleUpdateMedication = async (medicationData: any) => {
    if (!selectedMedication) return;

    try {
      setError('');
      const updatedMedication = await adminService.updateMedication(selectedMedication.id, medicationData);
      setMedications(prev => 
        prev.map(med => med.id === selectedMedication.id ? updatedMedication : med)
      );
      setIsModalOpen(false);
      setSelectedMedication(null);
    } catch (error: any) {
      console.error('Error updating medication:', error);
      setError(error.message || 'Failed to update medication');
    }
  };

  const handleDeleteMedication = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await adminService.deleteMedication(id);
        setMedications(prev => prev.filter(med => med.id !== id));
      } catch (error: any) {
        console.error('Error deleting medication:', error);
        setError(error.message || 'Failed to delete medication');
      }
    }
  };

  const filteredMedications = medications.filter(med => 
    (med.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (med.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading medications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-red-800">Error Loading Medications</h3>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Medications Management</h1>
        <button
          onClick={() => {
            setSelectedMedication(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Medication
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search medications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Medications List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredMedications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No medications found</p>
            <button
              onClick={() => {
                setSelectedMedication(null);
                setIsModalOpen(true);
              }}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              Add the first medication
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMedications.map((medication) => (
                <tr key={medication.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{medication.name}</div>
                    <div className="text-sm text-gray-500">{medication.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {medication.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {medication.dosage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {medication.frequency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedMedication(medication);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMedication(medication.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <MedicationModal
          medication={selectedMedication}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMedication(null);
          }}
          onSubmit={selectedMedication ? handleUpdateMedication : handleAddMedication}
        />
      )}
    </div>
  );
};

export default AdminMedications;