const Doctor = require('../model/Doctor');
const User = require('../model/User');
const Patient = require('../model/Patient');
const Caregiver = require('../model/Caregiver');
const Medication = require('../model/Medication');

// Doctor Management
exports.addDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create({
      ...req.body,
      addedBy: req.user.id
    });
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort('-createdAt');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .sort('-createdAt')
      .populate('addedBy', 'name');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User Management
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('user', 'name email')
      .populate('caregivers', 'name')
      .sort('-createdAt');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllCaregivers = async (req, res) => {
  try {
    const caregivers = await Caregiver.find()
      .populate('user', 'name email')
      .populate('patients', 'name')
      .sort('-createdAt');
    res.json(caregivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Medication Management
exports.addMedication = async (req, res) => {
  try {
    const medication = await Medication.create({
      ...req.body,
      addedBy: req.user.id
    });
    res.status(201).json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.find().sort('-createdAt');
    res.json(medications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update medication
exports.updateMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete medication
exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndDelete(req.params.id);
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const stats = {
      totalPatients: await Patient.countDocuments(),
      totalCaregivers: await Caregiver.countDocuments(),
      totalDoctors: await Doctor.countDocuments(),
      totalMedications: await Medication.countDocuments(),
      recentActivities: await getRecentActivities(),
      adherenceStats: await getAdherenceStats()
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper functions
async function getRecentActivities() {
    try {
        // Get the latest patient registrations
        const newPatients = await Patient.find()
            .sort('-createdAt')
            .limit(5)
            .populate('user', 'name email');
        
        // Get the latest caregiver registrations
        const newCaregivers = await Caregiver.find()
            .sort('-createdAt')
            .limit(5)
            .populate('user', 'name email');
        
        // Get the latest medication additions
        const newMedications = await Medication.find()
            .sort('-createdAt')
            .limit(5);
        
        // Combine and format activities
        const activities = [
            ...newPatients.map(p => ({
                type: 'NEW_PATIENT',
                timestamp: p.createdAt,
                data: { name: p.user?.name, id: p._id }
            })),
            ...newCaregivers.map(c => ({
                type: 'NEW_CAREGIVER',
                timestamp: c.createdAt,
                data: { name: c.user?.name, id: c._id }
            })),
            ...newMedications.map(m => ({
                type: 'NEW_MEDICATION',
                timestamp: m.createdAt,
                data: { name: m.name, id: m._id }
            }))
        ];
        
        // Sort by timestamp (newest first)
        return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
    } catch (error) {
        console.error('Error fetching recent activities:', error);
        return [];
    }
}

async function getAdherenceStats() {
    try {
        // Get all patients
        const patients = await Patient.find().populate('medications.medication');
        
        let totalScheduled = 0;
        let totalTaken = 0;
        let patientAdherenceRates = [];
        
        // Calculate adherence for each patient
        for (const patient of patients) {
            if (patient.medications && patient.medications.length > 0) {
                let patientScheduled = 0;
                let patientTaken = 0;
                
                for (const med of patient.medications) {
                    if (med.schedules && med.schedules.length > 0) {
                        patientScheduled += med.schedules.length;
                        patientTaken += med.schedules.filter(s => s.taken).length;
                    }
                }
                
                totalScheduled += patientScheduled;
                totalTaken += patientTaken;
                
                const adherenceRate = patientScheduled > 0 
                    ? (patientTaken / patientScheduled) * 100 
                    : 0;
                    
                patientAdherenceRates.push({
                    patientId: patient._id,
                    patientName: patient.name,
                    adherenceRate: adherenceRate.toFixed(2)
                });
            }
        }
        
        // Calculate overall adherence rate
        const overallAdherenceRate = totalScheduled > 0 
            ? (totalTaken / totalScheduled) * 100 
            : 0;
        
        // Get medications with lowest adherence
        const medications = await Medication.find();
        const medicationAdherenceRates = [];
        
        for (const med of medications) {
            // This would need to be adjusted based on your actual data model
            // Here we're assuming there's a way to count scheduled vs taken for each medication
            const medStats = await calculateMedicationAdherence(med._id);
            medicationAdherenceRates.push({
                medicationId: med._id,
                medicationName: med.name,
                adherenceRate: medStats.rate
            });
        }
        
        return {
            overallAdherenceRate: overallAdherenceRate.toFixed(2),
            patientAdherenceRates: patientAdherenceRates.sort((a, b) => a.adherenceRate - b.adherenceRate).slice(0, 5),
            medicationAdherenceRates: medicationAdherenceRates.sort((a, b) => a.adherenceRate - b.adherenceRate).slice(0, 5),
            totalScheduled,
            totalTaken
        };
    } catch (error) {
        console.error('Error calculating adherence stats:', error);
        return {
            overallAdherenceRate: 0,
            patientAdherenceRates: [],
            medicationAdherenceRates: [],
            totalScheduled: 0,
            totalTaken: 0
        };
    }
}

// Helper for medication adherence calculation
async function calculateMedicationAdherence(medicationId) {
    // This would need to be implemented based on your data model
    // For now, returning a placeholder
    return {
        total: 0,
        taken: 0,
        rate: 0
    };
}