const Caregiver = require('../model/Caregiver');
const Patient = require('../model/Patient');
const Prescription = require('../model/Prescription');
const Medication = require('../model/Medication');
const User = require('../model/User');
const Note = require('../model/Note');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: './uploads/prescriptions/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb('Error: Images and PDFs only!');
    }
  }
});

// Get caregiver profile with patients
exports.getProfile = async (req, res) => {
    try {
        const caregiver = await Caregiver.findOne({ user: req.user.id })
            .populate('patients', 'name email medications reminders');
        if (!caregiver) {
            return res.status(404).json({ message: 'Caregiver profile not found' });
        }
        res.json(caregiver);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all patients for a caregiver
exports.getPatients = async (req, res) => {
  try {
    let caregiver = await Caregiver.findOne({ user: req.user.id });
    
    if (!caregiver) {
      // Create caregiver profile if it doesn't exist
      caregiver = await Caregiver.create({
        user: req.user.id,
        specialization: 'General Care',
        patients: []
      });
    }

    // Send empty array if no patients yet
    if (!caregiver.patients || caregiver.patients.length === 0) {
      return res.json([]);
    }

    const patientsWithDetails = await Promise.all(
      caregiver.patients.map(async (patientId) => {
        const patient = await Patient.findById(patientId)
          .populate('user', 'name email');
        
        if (!patient || !patient.user) return null;

        const medications = await Medication.countDocuments({ patient: patientId });
        const adherenceStats = await getPatientAdherence(patientId);
        
        return {
          id: patient._id,
          name: patient.user.name || 'Unknown',
          email: patient.user.email || '',
          phone: patient.phone || '',
          age: calculateAge(patient.dateOfBirth),
          medications,
          adherence: adherenceStats.rate,
          status: getPatientStatus(adherenceStats.rate),
          conditions: patient.conditions || []
        };
      })
    );

    // Filter out any null values from deleted patients
    const validPatients = patientsWithDetails.filter(p => p !== null);
    res.json(validPatients);

  } catch (error) {
    console.error('Error in getPatients:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add new patient
exports.addNewPatient = async (req, res) => {
    try {
        const { name, email, dateOfBirth, conditions } = req.body;
        const user = await User.create({
            name,
            email,
            password: 'temporary123',
            role: 'patient'
        });

        const patient = await Patient.create({
            user: user._id,
            dateOfBirth,
            conditions,
            caregivers: [req.user.id]
        });

        await Caregiver.findOneAndUpdate(
            { user: req.user.id },
            { $push: { patients: patient._id } }
        );

        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update patient
exports.updatePatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const updates = req.body;
        const patient = await Patient.findByIdAndUpdate(patientId, updates, { new: true });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete patient
exports.deletePatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        await Patient.findByIdAndDelete(patientId);
        await Caregiver.findOneAndUpdate(
            { user: req.user.id },
            { $pull: { patients: patientId } }
        );
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add prescription with file upload
exports.addPrescription = async (req, res) => {
  upload.single('prescriptionFile')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || err });
    }

    try {
      const { patientId, name, doctor } = req.body;

      if (!patientId) {
        return res.status(400).json({ message: 'Patient ID is required' });
      }

      const prescription = new Prescription({
        patient: patientId,
        uploadedBy: req.user.id,
        name: name || req.file?.originalname || 'Prescription',
        doctor: doctor || 'Unknown Doctor',
        prescriptionFile: req.file ? {
          filename: req.file.filename,
          path: req.file.path,
          mimetype: req.file.mimetype
        } : null,
        status: 'active'
      });

      await prescription.save();
      
      await prescription.populate('patient', 'user');
      
      res.status(201).json({
        id: prescription._id,
        name: prescription.name,
        patient: prescription.patient?.user?.name || 'Unknown Patient',
        patientId: prescription.patient._id,
        doctor: prescription.doctor,
        date: prescription.createdAt,
        status: prescription.status,
        file: prescription.prescriptionFile?.filename,
        medications: prescription.medications || []
      });
    } catch (error) {
      console.error('Error adding prescription:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
};

// Get all prescriptions for caregiver's patients
exports.getPrescriptions = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ user: req.user.id });
    if (!caregiver) {
      return res.json([]); // Return empty array if no caregiver profile
    }

    const prescriptions = await Prescription.find({
      patient: { $in: caregiver.patients }
    })
    .populate('patient', 'user')
    .populate('uploadedBy', 'name')
    .sort('-createdAt');

    const formattedPrescriptions = prescriptions.map(p => ({
      id: p._id,
      name: p.name || 'Prescription',
      patient: p.patient?.user?.name || 'Unknown Patient',
      patientId: p.patient?._id,
      doctor: p.doctor || 'Unknown Doctor',
      date: p.createdAt,
      status: p.status,
      file: p.prescriptionFile?.filename,
      medications: p.medications || []
    }));

    res.json(formattedPrescriptions);
  } catch (error) {
    console.error('Error in getPrescriptions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update prescription
exports.updatePrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const updates = req.body;
        
        const prescription = await Prescription.findByIdAndUpdate(
            prescriptionId,
            updates,
            { new: true }
        );
        
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        
        res.json(prescription);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete prescription
exports.deletePrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        
        const prescription = await Prescription.findByIdAndDelete(prescriptionId);
        
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        
        res.json({ message: 'Prescription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get patient notes
exports.getPatientNotes = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        const notes = await Note.find({ patient: patientId })
            .populate('caregiver', 'user')
            .sort('-createdAt');
        
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add patient note
exports.addPatientNote = async (req, res) => {
    try {
        const { patientId, title, content, category, date } = req.body;
        
        const note = new Note({
            patient: patientId,
            caregiver: req.user.id,
            title,
            content,
            category,
            date: date || new Date()
        });

        await note.save();
        await note.populate('caregiver', 'user');
        
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update patient note
exports.updatePatientNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const updates = req.body;
        
        const note = await Note.findByIdAndUpdate(
            noteId,
            { ...updates, updatedAt: new Date() },
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

// Delete patient note
exports.deletePatientNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        
        const note = await Note.findByIdAndDelete(noteId);
        
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add patient
exports.addPatient = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, conditions } = req.body;

    // Create user account for patient
    const patientUser = await User.create({
      name,
      email,
      // Generate a temporary password that patient can change later
      password: Math.random().toString(36).slice(-8),
      role: 'patient'
    });

    // Create patient profile
    const patient = await Patient.create({
      user: patientUser._id,
      dateOfBirth,
      phone,
      conditions: conditions || [],
      caregivers: [req.user.id]
    });

    // Add patient to caregiver's patients list
    await Caregiver.findOneAndUpdate(
      { user: req.user.id },
      { $addToSet: { patients: patient._id } }
    );

    // Get full patient details
    const fullPatient = await Patient.findById(patient._id)
      .populate('user', 'name email');

    res.status(201).json({
      id: patient._id,
      name: patientUser.name,
      email: patientUser.email,
      phone: patient.phone,
      dateOfBirth: patient.dateOfBirth,
      conditions: patient.conditions,
      medications: 0,
      adherence: 100,
      status: 'stable'
    });

  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).json({ 
      message: 'Failed to add patient', 
      error: error.message 
    });
  }
};

// Get available patients (not assigned to this caregiver)
exports.getAvailablePatients = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ user: req.user.id });
    
    // Find patients not assigned to this caregiver
    const patients = await Patient.find({
      _id: { $nin: caregiver.patients }
    }).populate('user', 'name email');

    const availablePatients = patients.map(patient => ({
      id: patient._id,
      name: patient.user.name,
      email: patient.user.email
    }));

    res.json(availablePatients);
  } catch (error) {
    console.error('Error getting available patients:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add existing patient to caregiver
exports.addExistingPatient = async (req, res) => {
  try {
    const { patientId } = req.body;
    
    // Add patient to caregiver's list
    const caregiver = await Caregiver.findOneAndUpdate(
      { user: req.user.id },
      { $addToSet: { patients: patientId } },
      { new: true }
    );

    // Add caregiver to patient's list
    await Patient.findByIdAndUpdate(
      patientId,
      { $addToSet: { caregivers: caregiver._id } }
    );

    // Get patient details
    const patient = await Patient.findById(patientId)
      .populate('user', 'name email');

    res.json({
      id: patient._id,
      name: patient.user.name,
      email: patient.user.email,
      conditions: patient.conditions,
      medications: 0,
      adherence: 100,
      status: 'stable'
    });
  } catch (error) {
    console.error('Error adding existing patient:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper functions
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const getPatientStatus = (adherenceRate) => {
  if (adherenceRate >= 90) return 'stable';
  if (adherenceRate >= 75) return 'attention';
  return 'critical';
};

const getPatientAdherence = async (patientId) => {
  // Implement adherence calculation logic here
  // For now, return mock data
  return { rate: Math.floor(Math.random() * (100 - 70) + 70) };
};