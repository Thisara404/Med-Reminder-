import React, { useState } from 'react';
import { FileTextIcon, DownloadIcon, TrashIcon, UploadIcon, PlusIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
const PatientPrescriptions: React.FC = () => {
  // Mock data for demonstration
  const [prescriptions, setPrescriptions] = useState([{
    id: 1,
    name: 'Dr. Smith Prescription',
    doctor: 'Dr. John Smith',
    date: '2023-03-15',
    status: 'active',
    file: 'prescription_001.pdf'
  }, {
    id: 2,
    name: 'Cardiologist Prescription',
    doctor: 'Dr. Sarah Johnson',
    date: '2023-02-10',
    status: 'active',
    file: 'prescription_002.pdf'
  }, {
    id: 3,
    name: 'General Checkup Results',
    doctor: 'Dr. Michael Brown',
    date: '2023-01-05',
    status: 'expired',
    file: 'prescription_003.pdf'
  }]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const handleFileUpload = () => {
    // Simulate file upload process
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Add a new prescription to the list
          const newPrescription = {
            id: prescriptions.length + 1,
            name: 'New Uploaded Prescription',
            doctor: 'Unknown',
            date: new Date().toISOString().split('T')[0],
            status: 'active',
            file: 'new_prescription.pdf'
          };
          setPrescriptions([...prescriptions, newPrescription]);
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };
  const handleDelete = (id: number) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };
  return <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Prescriptions</h1>
          <p className="text-gray-600">
            Upload and manage your medical prescriptions.
          </p>
        </div>
      </div>
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow mb-8 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Upload New Prescription
          </h2>
          {!isUploading ? <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <UploadIcon size={24} className="text-blue-600" />
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Drag and drop your prescription file here, or click to browse
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Supported formats: PDF, JPG, PNG (Max size: 10MB)
              </p>
              <button onClick={handleFileUpload} className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
                <PlusIcon size={18} className="mr-1" />
                Select File
              </button>
            </div> : <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FileTextIcon size={20} className="text-blue-600 mr-2" />
                  <span className="font-medium">Uploading prescription...</span>
                </div>
                <span className="text-sm text-gray-600">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{
              width: `${uploadProgress}%`
            }}></div>
              </div>
              {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
            </div>}
        </div>
      </div>
      {/* Prescriptions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Prescription History</h2>
        </div>
        {prescriptions.length === 0 ? <div className="p-6 text-center">
            <p className="text-gray-500">
              No prescriptions found. Upload your first prescription above.
            </p>
          </div> : <ul className="divide-y divide-gray-200">
            {prescriptions.map(prescription => <li key={prescription.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${prescription.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <FileTextIcon size={20} className={`${prescription.status === 'active' ? 'text-green-600' : 'text-gray-600'}`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-800">
                        {prescription.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {prescription.doctor} • {prescription.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 text-xs rounded-full ${prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {prescription.status === 'active' ? 'Active' : 'Expired'}
                    </div>
                    <button className="text-gray-600 hover:text-gray-800 p-1" title="Download">
                      <DownloadIcon size={18} />
                    </button>
                    <button onClick={() => handleDelete(prescription.id)} className="text-red-600 hover:text-red-800 p-1" title="Delete">
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </div>
              </li>)}
          </ul>}
      </div>
    </div>;
};
export default PatientPrescriptions;