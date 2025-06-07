const Reminder = require('../model/Reminder');
const Patient = require('../model/Patient');

// Get reminders for a patient
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ patient: req.params.patientId })
      .populate('medication', 'name dosage instructions')
      .sort('scheduledDate');
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark reminder as taken
exports.markAsTaken = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.reminderId, patient: req.params.patientId },
      { 
        taken: true,
        status: 'completed'
      },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mark reminder as missed
exports.markAsMissed = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.reminderId, patient: req.params.patientId },
      { 
        taken: false,
        status: 'missed'
      },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};