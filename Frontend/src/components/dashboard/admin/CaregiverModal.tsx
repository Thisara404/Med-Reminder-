import React, { useState } from 'react';
import { XIcon } from 'lucide-react';

interface CaregiverFormData {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualifications: string;
  organization: string;
}

interface CaregiverModalProps {
  caregiver?: any;
  onClose: () => void;
  onSubmit: (data: CaregiverFormData) => void;
}

const CaregiverModal: React.FC<CaregiverModalProps> = ({ caregiver, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CaregiverFormData>({
    name: caregiver?.name || '',
    email: caregiver?.email || '',
    phone: caregiver?.phone || '',
    specialization: caregiver?.specialization || '',
    qualifications: (caregiver?.qualifications || []).join(', '),
    organization: caregiver?.organization || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      qualifications: formData.qualifications.split(',').map(q => q.trim()).filter(q => q)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {caregiver ? 'Edit Caregiver' : 'Add New Caregiver'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XIcon size={24} />
          </button>
        </div>

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
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization</label>
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
              Qualifications (comma-separated)
            </label>
            <input
              type="text"
              value={formData.qualifications}
              onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., RN, BSN, MSN"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Organization</label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              {caregiver ? 'Update' : 'Add'} Caregiver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaregiverModal;