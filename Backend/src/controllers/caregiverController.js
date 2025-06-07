const Caregiver = require('../model/Caregiver');
const Patient = require('../model/Patient');
const Prescription = require('../model/Prescription');
const User = require('../model/User');

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
    // First, find the caregiver document
    let caregiver = await Caregiver.findOne({ user: req.user.id });
    
    if (!caregiver) {
      // Create caregiver profile if it doesn't exist
      caregiver = await Caregiver.create({
        user: req.user.id,
        specialization: 'General Care',
        patients: []
      });
    }

    // Get patients with their user details
    const patientsWithDetails = await Promise.all(
      caregiver.patients.map(async (patientId) => {
        const patient = await Patient.findById(patientId).populate('user', 'name email');
        const medications = await Prescription.countDocuments({ patient: patientId });
        const adherenceStats = await getPatientAdherence(patientId);
        
        return {
          id: patient._id,
          name: patient.user.name,
          email: patient.user.email,
          age: calculateAge(patient.dateOfBirth),
          medications,
          adherence: adherenceStats.rate,
          status: getPatientStatus(adherenceStats.rate),
          conditions: patient.conditions || []
        };
      })
    );

    res.json(patientsWithDetails);
  } catch (error) {
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

// Add prescription
exports.addPrescription = async (req, res) => {
    try {
        const { patientId, prescriptionData } = req.body;
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        patient.medications.push({
            ...prescriptionData,
            prescribedBy: req.user.id,
            dateAdded: new Date()
        });
        await patient.save();
        res.status(201).json(patient.medications[patient.medications.length - 1]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get all prescriptions for caregiver's patients
exports.getPrescriptions = async (req, res) => {
  try {
    const caregiver = await Caregiver.findOne({ user: req.user.id });
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    const prescriptions = await Prescription.find({
      patient: { $in: caregiver.patients }
    })
    .populate('patient', 'user')
    .populate('prescribedBy', 'name')
    .sort('-createdAt');

    const formattedPrescriptions = prescriptions.map(p => ({
      id: p._id,
      name: p.name,
      patient: p.patient.user.name,
      doctor: p.prescribedBy.name,
      date: p.createdAt,
      status: p.status,
      file: p.prescriptionFile.filename
    }));

    res.json(formattedPrescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update prescription
exports.updatePrescription = async (req, res) => {
    try {
        const { patientId, prescriptionId } = req.params;
        const updates = req.body;
        const patient = await Patient.findOneAndUpdate(
            { _id: patientId, "medications._id": prescriptionId },
            { $set: { "medications.$": updates } },
            { new: true }
        );
        if (!patient) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        res.json(patient.medications.id(prescriptionId));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete prescription
exports.deletePrescription = async (req, res) => {
    try {
        const { patientId, prescriptionId } = req.params;
        const patient = await Patient.findByIdAndUpdate(
            patientId,
            { $pull: { medications: { _id: prescriptionId } } },
            { new: true }
        );
        if (!patient) {
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
        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient.notes || []);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add patient note
exports.addPatientNote = async (req, res) => {
    try {
        const { patientId, note } = req.body;
        const patient = await Patient.findByIdAndUpdate(
            patientId,
            { $push: { notes: { ...note, createdBy: req.user.id } } },
            { new: true }
        );
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(201).json(patient.notes[patient.notes.length - 1]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update patient note
exports.updatePatientNote = async (req, res) => {
    try {
        const { patientId, noteId } = req.params;
        const updates = req.body;
        const patient = await Patient.findOneAndUpdate(
            { _id: patientId, "notes._id": noteId },
            { $set: { "notes.$": { ...updates, updatedAt: new Date() } } },
            { new: true }
        );
        if (!patient) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(patient.notes.id(noteId));
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete patient note
exports.deletePatientNote = async (req, res) => {
    try {
        const { patientId, noteId } = req.params;
        const patient = await Patient.findByIdAndUpdate(
            patientId,
            { $pull: { notes: { _id: noteId } } },
            { new: true }
        );
        if (!patient) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
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