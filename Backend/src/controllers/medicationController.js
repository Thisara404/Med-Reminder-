const Medication = require('../model/Medication');
const Patient = require('../model/Patient');
const Reminder = require('../model/Reminder');

// Get medications for a patient
exports.getMedications = async (req, res) => {
  try {
    const medications = await Medication.find({ patient: req.params.patientId })
      .populate('prescribedBy', 'name email')
      .sort('-createdAt');
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add new medication (Caregiver only)
exports.addMedication = async (req, res) => {
  try {
    const { patientId } = req.params;
    const medication = new Medication({
      ...req.body,
      patient: patientId,
      prescribedBy: req.user.id
    });

    await medication.save();

    // Create initial reminders
    await createReminders(medication);

    res.status(201).json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update medication (Caregiver only)
exports.updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.medicationId, patient: req.params.patientId },
      req.body,
      { new: true }
    );
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Update reminders if schedule changed
    if (req.body.time || req.body.frequency) {
      await updateReminders(medication);
    }

    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete medication (Caregiver only)
exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({
      _id: req.params.medicationId,
      patient: req.params.patientId
    });
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Also delete any associated reminders
    await Reminder.deleteMany({ medication: req.params.medicationId });

    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};