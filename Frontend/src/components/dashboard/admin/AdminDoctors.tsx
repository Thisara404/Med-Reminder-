import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { UserCogIcon, PlusIcon, EditIcon, TrashIcon, SearchIcon } from 'lucide-react';

interface DoctorFormData {
  name: string;
  specialization: string;
  registrationNumber: string;
  contact: {
    email: string;
    phone: string;
  };
}

const DoctorModal: React.FC<{
  doctor?: any;
  onClose: () => void;
  onSubmit: (data: DoctorFormData) => void;
}> = ({ doctor, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<DoctorFormData>({
    name: doctor?.name || '',
    specialization: doctor?.specialization || '',
    registrationNumber: doctor?.registrationNumber || '',
    contact: {
      email: doctor?.contact?.email || '',
      phone: doctor?.contact?.phone || ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">
          {doctor ? 'Edit Doctor' : 'Add New Doctor'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Specialization
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Registration Number
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.contact.email}
              onChange={(e) => setFormData({
                ...formData,
                contact: { ...formData.contact, email: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={formData.contact.phone}
              onChange={(e) => setFormData({
                ...formData,
                contact: { ...formData.contact, phone: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {doctor ? 'Update' : 'Add'} Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await adminService.getDoctors();
      setDoctors(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (doctorData: any) => {
    try {
      const newDoctor = await adminService.addDoctor(doctorData);
      setDoctors([...doctors, newDoctor]);
      setIsModalOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add doctor');
    }
  };

  const handleUpdateDoctor = async (doctorData: any) => {
    if (!currentDoctor?._id) {
      setError('Invalid doctor ID');
      return;
    }

    try {
      const updatedDoctor = await adminService.updateDoctor(currentDoctor._id, doctorData);
      setDoctors(doctors.map(doctor => 
        doctor._id === currentDoctor._id ? updatedDoctor : doctor
      ));
      setIsModalOpen(false);
      setCurrentDoctor(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update doctor');
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (!doctorId) {
      setError('Invalid doctor ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await adminService.deleteDoctor(doctorId);
        setDoctors(doctors.filter(doctor => doctor._id !== doctorId));
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete doctor');
      }
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctors Management</h1>
        <button
          onClick={() => {
            setCurrentDoctor(null);
            setIsModalOpen(true);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <PlusIcon size={20} className="mr-2" />
          Add Doctor
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search doctors by name, specialization, or registration number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Specialization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDoctors.map((doctor) => (
              <tr key={doctor._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <UserCogIcon size={20} className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {doctor.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {doctor.specialization}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {doctor.registrationNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {doctor.contact.email}
                  </div>
                  <div className="text-sm text-gray-500">
                    {doctor.contact.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setCurrentDoctor(doctor);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <EditIcon size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteDoctor(doctor._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <DoctorModal
          doctor={currentDoctor}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentDoctor(null);
          }}
          onSubmit={currentDoctor ? handleUpdateDoctor : handleAddDoctor}
        />
      )}
    </div>
  );
};

export default AdminDoctors;