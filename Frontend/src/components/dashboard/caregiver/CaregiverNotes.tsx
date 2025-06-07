import React, { useState, useEffect } from 'react';
import { ClipboardIcon, PlusIcon, UserIcon, CalendarIcon, EditIcon, TrashIcon, SearchIcon, SaveIcon } from 'lucide-react';
import { caregiverService } from '../../../services/caregiverService';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const ErrorMessage = ({ message }: {
  message: string;
}) => <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <AlertIcon className="h-5 w-5 text-red-400" />
      </div>
      <div className="ml-3">
        <p className="text-sm text-red-700">{message}</p>
      </div>
    </div>
  </div>;

const CaregiverNotes: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [currentNote, setCurrentNote] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPatient, setFilterPatient] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock data for demonstration
  const sampleNotes = [{
    id: 1,
    patient: 'Alice Johnson',
    title: 'Weekly Check-in',
    content: 'Blood pressure readings are stable. Patient reports feeling well overall. No side effects from new medication.',
    date: '2023-03-15',
    category: 'check-in'
  }, {
    id: 2,
    patient: 'Robert Smith',
    title: 'Medication Adjustment',
    content: 'Reduced Lisinopril dosage from 20mg to 10mg due to low blood pressure readings. Follow up in two weeks.',
    date: '2023-03-12',
    category: 'medication'
  }, {
    id: 3,
    patient: 'Mary Williams',
    title: 'Doctor Appointment Notes',
    content: 'Dr. Johnson recommended physical therapy twice weekly. New prescription for pain management added.',
    date: '2023-03-10',
    category: 'appointment'
  }, {
    id: 4,
    patient: 'Robert Smith',
    title: 'Concerning Symptoms',
    content: 'Patient reported dizziness after taking evening medication. Monitoring situation and will consult with doctor if symptoms persist.',
    date: '2023-03-08',
    category: 'concern'
  }];

  // Get unique patients for filter dropdown
  const uniquePatients = Array.from(new Set(notes.map(note => note.patient)));

  useEffect(() => {
    // Simulate an API call
    const fetchData = async () => {
      try {
        // Replace with your data fetching logic
        setNotes(sampleNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddNote = async (noteData: any) => {
    try {
      const newNote = await caregiverService.addNote(selectedPatient.id, noteData);
      setNotes([...notes, newNote]);
      setIsAddingNote(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add note');
    }
  };

  const handleEditNote = (note: any) => {
    setCurrentNote(note);
    setIsEditingNote(true);
    setIsAddingNote(false);
  };
  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };
  const handleSaveNote = () => {
    if (isAddingNote) {
      const newNote = {
        ...currentNote,
        id: notes.length + 1
      };
      setNotes([...notes, newNote]);
    } else if (isEditingNote) {
      setNotes(notes.map(note => note.id === currentNote.id ? currentNote : note));
    }
    setIsAddingNote(false);
    setIsEditingNote(false);
    setCurrentNote(null);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setCurrentNote({
      ...currentNote,
      [name]: value
    });
  };
  // Filter notes based on search term, patient filter, and category filter
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || note.content.toLowerCase().includes(searchTerm.toLowerCase()) || note.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = filterPatient === 'all' || note.patient === filterPatient;
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    return matchesSearch && matchesPatient && matchesCategory;
  });
  return <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Notes</h1>
          <p className="text-gray-600">
            Keep track of important information about your patients.
          </p>
        </div>
        <button onClick={handleAddNote} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
          <PlusIcon size={18} className="mr-1" />
          Add New Note
        </button>
      </div>
      {/* Search and Filter */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input type="text" placeholder="Search notes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500" />
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
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="py-2 px-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Categories</option>
            <option value="check-in">Check-in</option>
            <option value="medication">Medication</option>
            <option value="appointment">Appointment</option>
            <option value="concern">Concern</option>
          </select>
        </div>
      </div>
      {/* Add/Edit Note Form */}
      {(isAddingNote || isEditingNote) && <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-semibold mb-4">
            {isAddingNote ? 'Add New Note' : 'Edit Note'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">
                Patient
              </label>
              {isAddingNote ? <select id="patient" name="patient" value={currentNote.patient} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                  <option value="">Select a patient</option>
                  {uniquePatients.map((patient, index) => <option key={index} value={patient}>
                      {patient}
                    </option>)}
                </select> : <input type="text" id="patient" name="patient" value={currentNote.patient} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md" />}
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select id="category" name="category" value={currentNote.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                <option value="check-in">Check-in</option>
                <option value="medication">Medication</option>
                <option value="appointment">Appointment</option>
                <option value="concern">Concern</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input type="text" id="title" name="title" value={currentNote.title} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Note Content
            </label>
            <textarea id="content" name="content" rows={4} value={currentNote.content} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input type="date" id="date" name="date" value={currentNote.date} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={() => {
          setIsAddingNote(false);
          setIsEditingNote(false);
          setCurrentNote(null);
        }} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleSaveNote} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md text-sm font-medium text-white">
              <SaveIcon size={18} className="mr-1" />
              Save Note
            </button>
          </div>
        </div>}
      {/* Notes List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Patient Notes</h2>
        </div>
        {filteredNotes.length === 0 ? <div className="p-6 text-center">
            <p className="text-gray-500">
              No notes found matching your filters.
            </p>
          </div> : <div className="divide-y divide-gray-200">
            {filteredNotes.map(note => <div key={note.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full mr-3 ${note.category === 'check-in' ? 'bg-green-100' : note.category === 'medication' ? 'bg-blue-100' : note.category === 'appointment' ? 'bg-purple-100' : 'bg-yellow-100'}`}>
                      <ClipboardIcon size={18} className={`${note.category === 'check-in' ? 'text-green-600' : note.category === 'medication' ? 'text-blue-600' : note.category === 'appointment' ? 'text-purple-600' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {note.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <UserIcon size={14} className="mr-1" />
                        <span className="mr-3">{note.patient}</span>
                        <CalendarIcon size={14} className="mr-1" />
                        <span>{note.date}</span>
                      </div>
                      <div className="mt-2 text-gray-700">
                        <p>{note.content}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditNote(note)} className="text-gray-600 hover:text-gray-800 p-1" title="Edit Note">
                      <EditIcon size={18} />
                    </button>
                    <button onClick={() => handleDeleteNote(note.id)} className="text-red-600 hover:text-red-800 p-1" title="Delete Note">
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
    </div>;
};
export default CaregiverNotes;