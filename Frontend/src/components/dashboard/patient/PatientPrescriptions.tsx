import React, { useState, useEffect } from 'react';
import { 
  FileTextIcon, 
  InfoIcon, 
  DownloadIcon,
  PillIcon,
  ClockIcon,
  XIcon
} from 'lucide-react';
import { patientService } from '../../../services/patientService';
import { Link } from 'react-router-dom';

const PatientPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  useEffect(() => {
    loadPrescriptions();
  }, []);
  
  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await patientService.getPrescriptions();
      setPrescriptions(data);
    } catch (error: any) {
      console.error('Error loading prescriptions:', error);
      setError(error.message || 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewDetails = (prescription: any) => {
    setSelectedPrescription(prescription);
    setIsDetailsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPrescription(null);
  };
  
  const handleDownload = (prescription: any) => {
    if (prescription.file) {
      // Create a link to download the file
      window.open(`http://localhost:5000/uploads/prescriptions/${prescription.file}`, '_blank');
    } else {
      alert('No file available for download');
    }
  };

  const handleAddReminder = (medicationName: string) => {
    // Navigate to medications page to set a reminder
    window.location.href = '/patient-dashboard/medications';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Prescriptions</h1>
          <p className="text-gray-600">View and manage your prescriptions.</p>
        </div>
      </div>
      
      {/* Prescriptions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">Prescription History</h3>
        </div>
        
        {prescriptions.length === 0 ? (
          <div className="p-8 text-center">
            <FileTextIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No prescriptions found.</p>
            <p className="text-sm text-gray-400 mt-2">Your caregiver will upload prescriptions for you.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {prescriptions.map(prescription => (
              <div key={prescription.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start mb-4 md:mb-0">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <FileTextIcon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{prescription.name || 'Prescription'}</h4>
                    <p className="text-sm text-gray-500">
                      Doctor: {prescription.doctor || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(prescription.date).toLocaleDateString()}
                    </p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {prescription.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewDetails(prescription)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    <InfoIcon size={20} />
                  </button>
                  {prescription.file && (
                    <button 
                      onClick={() => handleDownload(prescription)}
                      className="text-green-600 hover:text-green-800"
                      title="Download"
                    >
                      <DownloadIcon size={20} />
                    </button>
                  )}
                </div>
                
                {/* Show medications if available */}
                {prescription.medications && prescription.medications.length > 0 && (
                  <div className="mt-4 ml-10">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Prescribed Medications:</h5>
                    <div className="space-y-2">
                      {prescription.medications.map((med: any, index: number) => (
                        <div key={index} className="flex items-center bg-gray-50 p-2 rounded">
                          <PillIcon size={14} className="text-blue-600 mr-2" />
                          <span className="text-sm text-gray-800">
                            {med.name} {med.dosage && `- ${med.dosage}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Prescription Details Modal */}
      {isDetailsModalOpen && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Prescription Details</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                <XIcon size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prescription Name</label>
                  <div className="mt-1">
                    <p className="text-base text-gray-900">{selectedPrescription.name || 'Prescription'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doctor</label>
                  <div className="mt-1">
                    <p className="text-base text-gray-900">{selectedPrescription.doctor || 'Unknown'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <div className="mt-1">
                    <p className="text-base text-gray-900">{new Date(selectedPrescription.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedPrescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedPrescription.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Prescribed Medications</h3>
                {selectedPrescription.medications && selectedPrescription.medications.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medication</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedPrescription.medications.map((med: any, index: number) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{med.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{med.dosage || 'Not specified'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{med.frequency || 'Not specified'}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{med.instructions || 'Not specified'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-gray-500">No medications found in this prescription.</p>
                  </div>
                )}
              </div>
              
              {/* Notes */}
              {selectedPrescription.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-800">{selectedPrescription.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;