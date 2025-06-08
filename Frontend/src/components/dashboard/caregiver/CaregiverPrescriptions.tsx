import React, { useState, useEffect, useRef } from 'react';
import { 
  FileTextIcon, 
  DownloadIcon, 
  UploadIcon, 
  UserIcon, 
  PlusIcon, 
  SearchIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  AlertTriangleIcon,
  EyeIcon,
  TrashIcon,
  EditIcon,
  CalendarIcon,
  PillIcon
} from 'lucide-react';
import { caregiverService } from '../../../services/caregiverService';

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

interface Prescription {
  id: string;
  name: string;
  patient: string;
  patientId: string;
  doctor: string;
  date: string;
  status: 'active' | 'expired';
  file?: string;
  medications?: any[];
  notes?: string;
  issueDate?: string;
  expiryDate?: string;
}

const CaregiverPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPatient, setFilterPatient] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [patientsData, prescriptionsData] = await Promise.all([
        caregiverService.getPatients(),
        caregiverService.getPrescriptions()
      ]);
      
      setPatients(patientsData);
      setPrescriptions(prescriptionsData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedPatientId) {
      setError('Please select a patient first');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, JPG, or PNG file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError('');

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('prescriptionFile', file);
      formData.append('patientId', selectedPatientId);
      formData.append('name', file.name);
      formData.append('doctor', 'Uploaded by Caregiver');

      const newPrescription = await caregiverService.addPrescription(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setPrescriptions([newPrescription, ...prescriptions]);
      setIsUploadModalOpen(false);
      setSelectedPatientId('');
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);

    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload prescription');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeletePrescription = async (prescriptionId: string) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await caregiverService.deletePrescription(prescriptionId);
        setPrescriptions(prescriptions.filter(p => p.id !== prescriptionId));
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete prescription');
      }
    }
  };

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDetailsModalOpen(true);
  };

  const handleDownload = (prescription: Prescription) => {
    if (prescription.file) {
      // In a real implementation, this would download the file
      const downloadUrl = `http://localhost:5000/uploads/prescriptions/${prescription.file}`;
      window.open(downloadUrl, '_blank');
    } else {
      alert('No file available for download');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleExtractMedications = async (prescriptionId: string) => {
    try {
      setLoading(true);
      setError('');
      
      console.log(`Extracting medications for prescription: ${prescriptionId}`);
      const response = await caregiverService.extractMedications(prescriptionId);
      console.log('Extraction response:', response);
      
      // Update the prescription with extracted medications
      setPrescriptions(prev => 
        prev.map(p => p.id === prescriptionId ? 
          {...p, medications: response.medications} : p
        )
      );
      
      // Also update the selected prescription if it's currently being viewed
      if (selectedPrescription && selectedPrescription.id === prescriptionId) {
        setSelectedPrescription({
          ...selectedPrescription,
          medications: response.medications
        });
      }
      
      // Display a success message with the number of medications extracted
      const medicationCount = response.medications.length;
      alert(`Success! ${medicationCount} medication${medicationCount !== 1 ? 's' : ''} extracted from the prescription.`);
    } catch (error: any) {
      console.error('Error extracting medications:', error);
      let errorMsg = 'Failed to extract medications';
      if (error.response) {
        errorMsg = error.response.data?.message || errorMsg;
      }
      setError(errorMsg);
      alert(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter prescriptions based on search term, patient filter, and status filter
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = filterPatient === 'all' || prescription.patient === filterPatient;
    const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;
    return matchesSearch && matchesPatient && matchesStatus;
  });

  // Get unique patients for filter dropdown
  const uniquePatients = Array.from(new Set(prescriptions.map(p => p.patient)));

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {error && <ErrorMessage message={error} />}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Patient Prescriptions
          </h1>
          <p className="text-gray-600">
            Upload and manage prescriptions for your patients.
          </p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          <PlusIcon size={18} className="mr-1" />
          Upload Prescription
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <select
            value={filterPatient}
            onChange={e => setFilterPatient(e.target.value)}
            className="py-2 px-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Patients</option>
            {uniquePatients.map((patient, index) => (
              <option key={index} value={patient}>
                {patient}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="py-2 px-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FileTextIcon size={20} className="text-blue-600 mr-2" />
              <span className="font-medium">Uploading prescription...</span>
            </div>
            <span className="text-sm text-gray-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Prescriptions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">All Prescriptions ({filteredPrescriptions.length})</h2>
        </div>
        {filteredPrescriptions.length === 0 ? (
          <div className="p-6 text-center">
            <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterPatient !== 'all' || filterStatus !== 'all'
                ? 'No prescriptions match your current filters.'
                : 'Get started by uploading your first prescription.'
              }
            </p>
            {!searchTerm && filterPatient === 'all' && filterStatus === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Upload Prescription
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prescription
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                {filteredPrescriptions.map(prescription => (
                  <tr key={prescription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <UserIcon size={18} className="text-blue-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {prescription.patient}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${
                          prescription.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <FileTextIcon size={18} className={`${
                            prescription.status === 'active' ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {prescription.name}
                          </div>
                          {prescription.medications && prescription.medications.length > 0 && (
                            <div className="text-sm text-gray-500">
                              {prescription.medications.length} medication(s)
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {prescription.doctor}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(prescription.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        prescription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {prescription.status === 'active' ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(prescription)}
                          className="text-gray-600 hover:text-gray-800"
                          title="View Details"
                        >
                          <EyeIcon size={18} />
                        </button>
                        <button
                          onClick={() => handleDownload(prescription)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Download"
                        >
                          <DownloadIcon size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePrescription(prescription.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <TrashIcon size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upload Prescription</h2>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircleIcon size={24} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Patient *
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Choose a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <UploadIcon size={24} className="text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Drag and drop a prescription file here, or click to browse
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Supported formats: PDF, JPG, PNG (Max size: 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!selectedPatientId}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-md"
              >
                <PlusIcon size={18} className="mr-1" />
                Select File
              </button>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Prescription Details
              </h2>
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircleIcon size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Patient</label>
                    <div className="flex items-center mt-1">
                      <UserIcon size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{selectedPrescription.patient}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Doctor</label>
                    <div className="flex items-center mt-1">
                      <UserIcon size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{selectedPrescription.doctor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Date</label>
                    <div className="flex items-center mt-1">
                      <CalendarIcon size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {new Date(selectedPrescription.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedPrescription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedPrescription.status === 'active' ? 'Active' : 'Expired'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">File Information</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileTextIcon size={20} className="text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedPrescription.name}</p>
                      {selectedPrescription.file && (
                        <p className="text-xs text-gray-500">File: {selectedPrescription.file}</p>
                      )}
                    </div>
                  </div>
                  {selectedPrescription.file && (
                    <button
                      onClick={() => handleDownload(selectedPrescription)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <DownloadIcon size={16} className="mr-1" />
                      Download
                    </button>
                  )}
                </div>
              </div>

              {/* Medications */}
              {selectedPrescription.medications && selectedPrescription.medications.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Extracted Medications</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedPrescription.medications.map((med, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{med.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{med.dosage}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{med.frequency}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{med.instructions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <p className="text-gray-500 italic">No medications have been extracted from this prescription yet.</p>
                  {selectedPrescription.file && (
                    <button
                      onClick={() => handleExtractMedications(selectedPrescription.id)}
                      className="mt-2 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <SearchIcon size={16} className="mr-1" />
                      Extract Medications
                    </button>
                  )}
                </div>
              )}
              
              {/* Notes */}
              {selectedPrescription.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedPrescription.notes}
                  </p>
                </div>
              )}

              {/* Additional Dates */}
              {(selectedPrescription.issueDate || selectedPrescription.expiryDate) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedPrescription.issueDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Issue Date</label>
                        <div className="flex items-center mt-1">
                          <CalendarIcon size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(selectedPrescription.issueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                    {selectedPrescription.expiryDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <div className="flex items-center mt-1">
                          <CalendarIcon size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(selectedPrescription.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              {selectedPrescription.file && (
                <button
                  onClick={() => handleDownload(selectedPrescription)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <DownloadIcon size={16} className="mr-1" />
                  Download File
                </button>
              )}
              {selectedPrescription.file && (
                <button
                  onClick={() => handleExtractMedications(selectedPrescription.id)}
                  className="ml-2 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <SearchIcon size={16} className="mr-1" />
                  Extract Medications
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverPrescriptions;