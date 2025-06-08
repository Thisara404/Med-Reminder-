import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';

interface PatientFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  conditions: string;
  caregivers: string[];
}

interface PatientModalProps {
  patient?: any;
  onClose: () => void;
  onSubmit: (data: PatientFormData) => void;
  caregivers?: any[]; // Make caregivers optional
}

const PatientModal: React.FC<PatientModalProps> = ({ 
  patient, 
  onClose, 
  onSubmit, 
  caregivers = [] // Use default empty array
}) => {
  const [formData, setFormData] = useState<PatientFormData>({
    name: patient?.name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    dateOfBirth: patient?.dateOfBirth?.split('T')[0] || '',
    conditions: (patient?.conditions || []).join(', '),
    caregivers: patient?.caregivers?.map((c: any) => c._id || c.id) || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate date of birth is not in the future
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    
    if (birthDate > today) {
      alert("Date of birth cannot be in the future.");
      return;
    }
    
    onSubmit({
      ...formData,
      conditions: formData.conditions.split(',').map(c => c.trim()).filter(c => c)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XIcon size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
            <input
              type="text"
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., Diabetes, Hypertension, Arthritis"
            />
          </div>

          {caregivers && caregivers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Assign Caregivers</label>
              <select
                multiple
                value={formData.caregivers}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData({ ...formData, caregivers: options });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {caregivers.map((caregiver) => (
                  <option key={caregiver._id || caregiver.id} value={caregiver._id || caregiver.id}>
                    {caregiver.name || caregiver.user?.name || 'Unknown'}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple caregivers</p>
            </div>
          )}

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
              {patient ? 'Update' : 'Add'} Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientModal;