import React, { useState, useEffect } from 'react';
import { 
  ClipboardIcon, 
  PlusIcon, 
  UserIcon, 
  CalendarIcon, 
  EditIcon, 
  TrashIcon, 
  SearchIcon, 
  SaveIcon,
  AlertTriangleIcon,
  XIcon
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

interface Note {
  id: string;
  patient: string;
  patientId: string;
  title: string;
  content: string;
  date: string;
  category: 'check-in' | 'medication' | 'appointment' | 'concern';
}

const CaregiverNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({
    patient: '',
    patientId: '',
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    category: 'check-in'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPatient, setFilterPatient] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load patients first
      const patientsData = await caregiverService.getPatients();
      setPatients(patientsData);
      
      // Load notes for all patients
      const allNotes: Note[] = [];
      for (const patient of patientsData) {
        try {
          const patientNotes = await caregiverService.getPatientNotes(patient.id);
          const formattedNotes = patientNotes.map((note: any) => ({
            id: note._id || note.id,
            patient: patient.name,
            patientId: patient.id,
            title: note.title,
            content: note.content,
            date: new Date(note.date || note.createdAt).toISOString().split('T')[0],
            category: note.category
          }));
          allNotes.push(...formattedNotes);
        } catch (noteError) {
          console.warn(`Failed to load notes for patient ${patient.name}:`, noteError);
        }
      }
      setNotes(allNotes);
      setError('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    setCurrentNote({
      patient: '',
      patientId: '',
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      category: 'check-in'
    });
    setIsAddingNote(true);
    setIsEditingNote(false);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsEditingNote(true);
    setIsAddingNote(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await caregiverService.deleteNote(noteId);
        setNotes(notes.filter(note => note.id !== noteId));
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to delete note');
      }
    }
  };

  const handleSaveNote = async () => {
    try {
      if (!currentNote.patientId || !currentNote.title || !currentNote.content) {
        setError('Please fill in all required fields');
        return;
      }

      if (isAddingNote) {
        const newNote = await caregiverService.addNote(currentNote.patientId, {
          title: currentNote.title,
          content: currentNote.content,
          category: currentNote.category,
          date: currentNote.date
        });
        
        const formattedNote: Note = {
          id: newNote._id || newNote.id,
          patient: patients.find(p => p.id === currentNote.patientId)?.name || 'Unknown',
          patientId: currentNote.patientId,
          title: newNote.title,
          content: newNote.content,
          date: new Date(newNote.date || newNote.createdAt).toISOString().split('T')[0],
          category: newNote.category
        };
        
        setNotes([...notes, formattedNote]);
      } else if (isEditingNote) {
        const updatedNote = await caregiverService.updateNote(currentNote.id!, {
          title: currentNote.title,
          content: currentNote.content,
          category: currentNote.category,
          date: currentNote.date
        });
        
        setNotes(notes.map(note => 
          note.id === currentNote.id 
            ? { ...note, ...currentNote } as Note
            : note
        ));
      }

      setIsAddingNote(false);
      setIsEditingNote(false);
      setCurrentNote({
        patient: '',
        patientId: '',
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        category: 'check-in'
      });
      setError('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to save note');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'patient') {
      const selectedPatient = patients.find(p => p.name === value);
      setCurrentNote({
        ...currentNote,
        patient: value,
        patientId: selectedPatient?.id || ''
      });
    } else {
      setCurrentNote({
        ...currentNote,
        [name]: value
      });
    }
  };

  // Filter notes based on search term, patient filter, and category filter
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPatient = filterPatient === 'all' || note.patient === filterPatient;
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    return matchesSearch && matchesPatient && matchesCategory;
  });

  // Get unique patients for filter dropdown
  const uniquePatients = Array.from(new Set(notes.map(note => note.patient)));

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {error && <ErrorMessage message={error} />}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Notes</h1>
          <p className="text-gray-600">
            Keep track of important information about your patients.
          </p>
        </div>
        <button 
          onClick={handleAddNote} 
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
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
          <input
            type="text"
            placeholder="Search notes..."
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
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="py-2 px-3 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="check-in">Check-in</option>
            <option value="medication">Medication</option>
            <option value="appointment">Appointment</option>
            <option value="concern">Concern</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Note Form */}
      {(isAddingNote || isEditingNote) && (
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-lg font-semibold mb-4">
            {isAddingNote ? 'Add New Note' : 'Edit Note'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">
                Patient *
              </label>
              {isAddingNote ? (
                <select
                  id="patient"
                  name="patient"
                  value={currentNote.patient}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.name}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="patient"
                  name="patient"
                  value={currentNote.patient}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
                />
              )}
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={currentNote.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="check-in">Check-in</option>
                <option value="medication">Medication</option>
                <option value="appointment">Appointment</option>
                <option value="concern">Concern</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={currentNote.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Note Content *
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              value={currentNote.content}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={currentNote.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setIsAddingNote(false);
                setIsEditingNote(false);
                setCurrentNote({
                  patient: '',
                  patientId: '',
                  title: '',
                  content: '',
                  date: new Date().toISOString().split('T')[0],
                  category: 'check-in'
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md text-sm font-medium text-white"
            >
              <SaveIcon size={18} className="mr-1" />
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Patient Notes ({filteredNotes.length})</h2>
        </div>
        {filteredNotes.length === 0 ? (
          <div className="p-6 text-center">
            <ClipboardIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterPatient !== 'all' || filterCategory !== 'all'
                ? 'No notes match your current filters.'
                : 'Get started by adding your first patient note.'
              }
            </p>
            {!searchTerm && filterPatient === 'all' && filterCategory === 'all' && (
              <div className="mt-6">
                <button
                  onClick={handleAddNote}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Add Note
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotes.map(note => (
              <div key={note.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full mr-3 ${
                      note.category === 'check-in' ? 'bg-green-100' :
                      note.category === 'medication' ? 'bg-blue-100' :
                      note.category === 'appointment' ? 'bg-purple-100' : 'bg-yellow-100'
                    }`}>
                      <ClipboardIcon size={18} className={`${
                        note.category === 'check-in' ? 'text-green-600' :
                        note.category === 'medication' ? 'text-blue-600' :
                        note.category === 'appointment' ? 'text-purple-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {note.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <UserIcon size={14} className="mr-1" />
                        <span className="mr-3">{note.patient}</span>
                        <CalendarIcon size={14} className="mr-1" />
                        <span>{new Date(note.date).toLocaleDateString()}</span>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                          note.category === 'check-in' ? 'bg-green-100 text-green-800' :
                          note.category === 'medication' ? 'bg-blue-100 text-blue-800' :
                          note.category === 'appointment' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {note.category}
                        </span>
                      </div>
                      <div className="mt-2 text-gray-700">
                        <p className="whitespace-pre-wrap">{note.content}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="text-gray-600 hover:text-gray-800 p-1"
                      title="Edit Note"
                    >
                      <EditIcon size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete Note"
                    >
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaregiverNotes;