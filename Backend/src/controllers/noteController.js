const Note = require('../model/Note');
const Patient = require('../model/Patient');

// Add note
exports.addNote = async (req, res) => {
  try {
    const { patientId, title, content, category } = req.body;

    const note = await Note.create({
      patient: patientId,
      caregiver: req.user.id,
      title,
      content,
      category
    });

    await note.populate('caregiver', 'name');
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get notes for a patient
exports.getPatientNotes = async (req, res) => {
  try {
    const notes = await Note.find({ patient: req.params.patientId })
      .populate('caregiver', 'name')
      .sort('-date');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { 
        _id: req.params.noteId, 
        caregiver: req.user.id 
      },
      req.body,
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.noteId, 
      caregiver: req.user.id 
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};