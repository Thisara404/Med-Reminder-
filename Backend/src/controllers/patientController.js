const Patient = require('../model/Patient');

// Get patient profile
exports.getProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id }).populate('caregivers', 'name email');
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update medications
exports.updateMedications = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    patient.medications = req.body.medications;
    await patient.save();
    res.json(patient.medications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update reminders
exports.updateReminders = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    patient.reminders = req.body.reminders;
    await patient.save();
    res.json(patient.reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};