import React, { useState } from 'react';
import { FileTextIcon, DownloadIcon, UploadIcon, UserIcon, PlusIcon, SearchIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
const CaregiverPrescriptions: React.FC = () => {
  // Mock data for demonstration
  const [prescriptions, setPrescriptions] = useState([{
    id: 1,
    patient: 'Alice Johnson',
    name: 'Dr. Smith Prescription',
    doctor: 'Dr. John Smith',
    date: '2023-03-15',
    status: 'active',
    file: 'prescription_001.pdf'
  }, {
    id: 2,
    patient: 'Robert Smith',
    name: 'Cardiologist Prescription',
    doctor: 'Dr. Sarah Johnson',
    date: '2023-02-10',
    status: 'active',
    file: 'prescription_002.pdf'
  }, {
    id: 3,
    patient: 'Mary Williams',
    name: 'General Checkup Results',
    doctor: 'Dr. Michael Brown',
    date: '2023-01-05',
    status: 'expired',
    file: 'prescription_003.pdf'
  }, {
    id: 4,
    patient: 'Alice Johnson',
    name: 'Dermatologist Prescription',
    doctor: 'Dr. Emily Taylor',
    date: '2023-01-20',
    status: 'active',
    file: 'prescription_004.pdf'
  }]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPatient, setFilterPatient] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const handleFileUpload = () => {
    // Simulate file upload process
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Add a new prescription to the list
          const newPrescription = {
            id: prescriptions.length + 1,
            patient: 'Robert Smith',
            name: 'New Uploaded Prescription',
            doctor: 'Dr. Jane Wilson',
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
  // Filter prescriptions based on search term, patient filter, and status filter
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.name.toLowerCase().includes(searchTerm.toLowerCase()) || prescription.doctor.toLowerCase().includes(searchTerm.toLowerCase()) || prescription.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = filterPatient === 'all' || prescription.patient === filterPatient;
    const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;
    return matchesSearch && matchesPatient && matchesStatus;
  });
  // Get unique patients for filter dropdown
  const uniquePatients = Array.from(new Set(prescriptions.map(p => p.patient)));
  return <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Patient Prescriptions
          </h1>
          <p className="text-gray-600">
            Upload and manage prescriptions for your patients.
          </p>
        </div>
        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
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
          <input type="text" placeholder="Search prescriptions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <select value={filterPatient} onChange={e => setFilterPatient(e.target.value)} className="py-2 px-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Patients</option>
            {uniquePatients.map((patient, index) => <option key={index} value={patient}>
                {patient}
              </option>)}
          </select>
        </div>
        <div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="py-2 px-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
      {/* Upload in Progress */}
      {isUploading && <div className="bg-white rounded-lg shadow mb-6 p-4">
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
        </div>}
      {/* Prescriptions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">All Prescriptions</h2>
        </div>
        {filteredPrescriptions.length === 0 ? <div className="p-6 text-center">
            <p className="text-gray-500">
              No prescriptions found matching your filters.
            </p>
          </div> : <table className="min-w-full divide-y divide-gray-200">
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
              {filteredPrescriptions.map(prescription => <tr key={prescription.id}>
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
                      <div className={`p-2 rounded-full ${prescription.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <FileTextIcon size={18} className={`${prescription.status === 'active' ? 'text-green-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="ml-3 text-sm text-gray-900">
                        {prescription.name}
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
                      {prescription.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {prescription.status === 'active' ? 'Active' : 'Expired'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-800 mr-3" title="Download">
                      <DownloadIcon size={18} />
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>}
      </div>
      {/* Upload Section */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Upload New Prescription</h2>
        </div>
        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
            <button onClick={handleFileUpload} className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
              <PlusIcon size={18} className="mr-1" />
              Select File
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default CaregiverPrescriptions;