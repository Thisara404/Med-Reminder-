const Medication = require('../model/Medication');
const Patient = require('../model/Patient');
const Reminder = require('../model/Reminder');

// Get medications for a patient
exports.getMedications = async (req, res) => {
  try {
    console.log(`Fetching medications for patient: ${req.params.patientId}`);
    
    // Validate patientId
    if (!req.params.patientId) {
      return res.status(400).json({ 
        message: 'Patient ID is required',
        medications: [] 
      });
    }
    
    // Check if patient exists
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ 
        message: 'Patient not found',
        medications: [] 
      });
    }
    
    // Get medications
    const medications = await Medication.find({ patient: req.params.patientId })
      .sort('-createdAt');
    
    console.log(`Found ${medications.length} medications for patient ${req.params.patientId}`);
    
    // Transform to include id property for frontend
    const transformedMedications = medications.map(med => ({
      id: med._id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      instructions: med.instructions || '',
      status: med.status,
      category: med.category,
      description: med.description,
      source: med.source,
      createdAt: med.createdAt
    }));
    
    // Return medications or empty array
    res.json(transformedMedications);
  } catch (error) {
    console.error('Error in getMedications:', error);
    res.status(500).json({ 
      message: 'Server error fetching medications', 
      error: error.message,
      medications: []
    });
  }
};

// Add new medication (Caregiver only)
exports.addMedication = async (req, res) => {
  try {
    console.log('Adding medication with data:', req.body);
    const { patientId } = req.params;
    
    // Ensure all required fields are present
    const medicationData = {
      name: req.body.name,
      category: req.body.category || 'General',
      description: req.body.description || `${req.body.name} medication`,
      dosage: req.body.dosage || 'Not specified',
      frequency: req.body.frequency || 'Once daily',
      instructions: req.body.instructions || 'Take as directed',
      patient: patientId,
      addedBy: req.user.id,
      prescribedBy: req.user.id,
      status: req.body.status || 'active',
      source: req.body.source || 'manual'
    };

    const medication = new Medication(medicationData);
    await medication.save();

    // Return the medication with id property
    const responseData = {
      id: medication._id,
      name: medication.name,
      category: medication.category,
      description: medication.description,
      dosage: medication.dosage,
      frequency: medication.frequency,
      instructions: medication.instructions,
      status: medication.status
    };

    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error adding medication:', error);
    res.status(500).json({ 
      message: 'Server error adding medication', 
      error: error.message 
    });
  }
};

// Update medication (Caregiver only)
exports.updateMedication = async (req, res) => {
  try {
    console.log(`Updating medication ${req.params.medicationId} for patient ${req.params.patientId}`);
    console.log('Update data:', req.body);
    
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.medicationId, patient: req.params.patientId },
      req.body,
      { new: true }
    );
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    // Return the medication with id property
    const responseData = {
      id: medication._id,
      name: medication.name,
      category: medication.category,
      description: medication.description,
      dosage: medication.dosage,
      frequency: medication.frequency,
      instructions: medication.instructions,
      status: medication.status
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete medication (Caregiver only)
exports.deleteMedication = async (req, res) => {
  try {
    console.log(`Attempting to delete medication ${req.params.medicationId} for patient ${req.params.patientId}`);
    
    if (!req.params.medicationId) {
      return res.status(400).json({ message: 'Medication ID is required' });
    }
    
    const result = await Medication.findOneAndDelete({
      _id: req.params.medicationId,
      patient: req.params.patientId
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Medication not found' });
    }

    console.log(`Successfully deleted medication ${req.params.medicationId}`);
    
    // Also delete any associated reminders
    await Reminder.deleteMany({ medication: req.params.medicationId });

    res.json({ 
      message: 'Medication deleted successfully',
      id: req.params.medicationId 
    });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper functions for reminders (implement these as needed)
async function createReminders(medication) {
  // Implementation for creating reminders
}

async function updateReminders(medication) {
  // Implementation for updating reminders
}