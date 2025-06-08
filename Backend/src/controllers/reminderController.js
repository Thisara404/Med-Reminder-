const Reminder = require('../model/Reminder');
const Patient = require('../model/Patient');
const Medication = require('../model/Medication');

// Get reminders for a patient
exports.getReminders = async (req, res) => {
  try {
    console.log(`Fetching reminders for patient: ${req.params.patientId}`);
    
    // Check if patient exists
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Get reminders with medication details
    const reminders = await Reminder.find({ patient: req.params.patientId })
      .populate('medication', 'name dosage instructions')
      .sort('scheduledDate');
    
    console.log(`Found ${reminders.length} reminders for patient ${req.params.patientId}`);
    
    res.json(reminders);
  } catch (error) {
    console.error('Error in getReminders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add new reminder
exports.addReminder = async (req, res) => {
  try {
    console.log(`Adding reminder for patient: ${req.params.patientId} with data:`, req.body);
    
    const { medication, time, scheduledDate, notes, status } = req.body;
    
    // Validate required fields
    if (!medication || !time || !scheduledDate) {
      return res.status(400).json({ message: 'Medication, time, and scheduled date are required' });
    }
    
    // Check if medication exists
    const medicationDoc = await Medication.findById(medication);
    if (!medicationDoc) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    // Create reminder
    const reminder = new Reminder({
      medication,
      patient: req.params.patientId,
      time,
      scheduledDate,
      notes: notes || '',
      status: status || 'upcoming',
      taken: false,
      notificationSent: false
    });
    
    await reminder.save();
    
    // Return the new reminder with medication info
    const populatedReminder = await Reminder.findById(reminder._id)
      .populate('medication', 'name dosage instructions');
      
    res.status(201).json(populatedReminder);
  } catch (error) {
    console.error('Error adding reminder:', error);
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

// Get upcoming reminders for today
exports.getTodayReminders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const reminders = await Reminder.find({
      patient: req.params.patientId,
      scheduledDate: {
        $gte: today,
        $lt: tomorrow
      },
      status: 'upcoming'
    }).populate('medication', 'name dosage instructions');
    
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};