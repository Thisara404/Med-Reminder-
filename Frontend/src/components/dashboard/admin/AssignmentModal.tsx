import React, { useState } from 'react';
import { XIcon } from 'lucide-react';

interface AssignmentModalProps {
  title: string;
  items: any[];
  onAssign: (id: string) => void;
  onClose: () => void;
  itemLabelField: string;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  title,
  items,
  onAssign,
  onClose,
  itemLabelField
}) => {
  const [selectedId, setSelectedId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedId) {
      onAssign(selectedId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XIcon size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select {title}
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select...</option>
              {items && items.length > 0 && items.map((item) => (
                <option key={item._id || item.id} value={item._id || item.id}>
                  {item.name || (item.user && item.user.name) || 'Unknown'}
                </option>
              ))}
            </select>
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
              disabled={!selectedId}
            >
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentModal;