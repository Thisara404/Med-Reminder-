const Doctor = require('../model/Doctor');
const User = require('../model/User');
const Patient = require('../model/Patient');
const Caregiver = require('../model/Caregiver');
const Medication = require('../model/Medication');
const mongoose = require('mongoose');

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
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Error updating doctor:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Doctor ID is required' });
    }

    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error('Error deleting doctor:', error);
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
      .populate('caregivers', 'user')
      .populate('medications.medication')
      .lean();

    const formattedPatients = await Promise.all(
      patients.map(async (patient) => {
        const medications = patient.medications?.length || 0;
        const adherenceStats = await calculateMedicationAdherence(patient._id);
        
        return {
          id: patient._id,
          name: patient.user?.name || 'Unknown',
          email: patient.user?.email || '',
          age: calculateAge(patient.dateOfBirth),
          phone: patient.phone || '',
          medications,
          adherence: adherenceStats.rate || 0,
          status: patient.status,
          conditions: patient.conditions || [],
          caregivers: patient.caregivers?.map(c => ({
            id: c._id,
            name: c.user?.name || 'Unknown'
          })) || []
        };
      })
    );

    res.json(formattedPatients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Fix the calculateAge function
function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return 0;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  // Validate that the birth date is in the past
  if (birthDate > today) {
    return 0; // Return 0 for future dates instead of negative values
  }
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

exports.getAllCaregivers = async (req, res) => {
  try {
    const caregivers = await Caregiver.find()
      .populate('user', 'name email status')
      .populate('patients', 'name')
      .sort('-createdAt');
    
    const formattedCaregivers = caregivers.map(caregiver => ({
      _id: caregiver._id,
      user: caregiver.user,
      specialization: caregiver.specialization,
      patients: caregiver.patients,
      organization: caregiver.organization,
      position: caregiver.position,
      status: caregiver.user?.status || 'active'
    }));
    
    res.json(formattedCaregivers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    
    if (!['active', 'suspended', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Find the user first to determine if it's a caregiver or patient
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update the user status
    user.status = status;
    await user.save();
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Medication Management
exports.getAllMedications = async (req, res) => {
  try {
    console.log('Admin getAllMedications called');
    console.log('User:', req.user ? req.user.email : 'No user');
    
    // Query medications without any patient filtering for admin view
    const medications = await Medication.find({})
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${medications.length} medications`);

    // If no medications exist, return empty array instead of error
    if (!medications || medications.length === 0) {
      console.log('No medications found, returning empty array');
      return res.status(200).json([]);
    }

    // Format the response to ensure all fields are present
    const formattedMedications = medications.map(med => ({
      id: med._id.toString(),
      name: med.name || 'Unknown',
      category: med.category || 'Uncategorized',
      description: med.description || 'No description',
      dosage: med.dosage || 'Not specified',
      frequency: med.frequency || 'Not specified',
      instructions: med.instructions || '',
      sideEffects: med.sideEffects || '',
      addedBy: med.addedBy?.name || 'Unknown',
      createdAt: med.createdAt || new Date(),
      status: med.status || 'active'
    }));

    console.log('Formatted medications:', formattedMedications.length);
    res.status(200).json(formattedMedications);
  } catch (error) {
    console.error('Error in getAllMedications:', error);
    res.status(500).json({ 
      message: 'Failed to fetch medications', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.addMedication = async (req, res) => {
  try {
    console.log('Adding medication:', req.body);
    
    const medicationData = {
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      dosage: req.body.dosage,
      frequency: req.body.frequency,
      instructions: req.body.instructions || '',
      sideEffects: req.body.sideEffects || '',
      addedBy: req.user.id,
      status: 'active'
      // Don't include patient field for admin medications
    };
    
    const medication = await Medication.create(medicationData);
    
    console.log('Medication created:', medication._id);
    
    res.status(201).json({
      id: medication._id,
      name: medication.name,
      category: medication.category,
      description: medication.description,
      dosage: medication.dosage,
      frequency: medication.frequency,
      instructions: medication.instructions,
      sideEffects: medication.sideEffects,
      createdAt: medication.createdAt,
      status: medication.status
    });
  } catch (error) {
    console.error('Error adding medication:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

exports.updateMedication = async (req, res) => {
  try {
    const { medicationId } = req.params;
    
    console.log('Updating medication:', medicationId, req.body);
    
    const medication = await Medication.findByIdAndUpdate(
      medicationId,
      {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        dosage: req.body.dosage,
        frequency: req.body.frequency,
        instructions: req.body.instructions,
        sideEffects: req.body.sideEffects
        // Do not update patient field
      },
      { new: true }
    );
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    res.json({
      id: medication._id,
      name: medication.name,
      category: medication.category,
      description: medication.description,
      dosage: medication.dosage,
      frequency: medication.frequency,
      instructions: medication.instructions,
      sideEffects: medication.sideEffects,
      createdAt: medication.createdAt,
      status: medication.status
    });
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

exports.deleteMedication = async (req, res) => {
  try {
    const { medicationId } = req.params;
    
    console.log('Deleting medication:', medicationId);
    
    const medication = await Medication.findByIdAndDelete(medicationId);
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalPatients,
      totalCaregivers,
      totalDoctors,
      totalMedications,
      recentActivities,
      adherenceStats
    ] = await Promise.all([
      Patient.countDocuments(),
      Caregiver.countDocuments(),
      Doctor.countDocuments(),
      Medication.countDocuments(),
      getRecentActivities(),
      getAdherenceStats().catch(err => ({
        overallAdherenceRate: 0,
        patientAdherenceRates: [],
        medicationAdherenceRates: [],
        totalScheduled: 0,
        totalTaken: 0
      }))
    ]);

    res.json({
      totalPatients,
      totalCaregivers,
      totalDoctors,
      totalMedications,
      recentActivities,
      adherenceStats
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
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
        // Get all patients with their medications
        const patients = await Patient.find()
            .populate('user', 'name')
            .populate('medications');
        
        let totalScheduled = 0;
        let totalTaken = 0;
        let patientAdherenceRates = [];
        let medicationStats = new Map();
        
        // Calculate adherence for each patient
        for (const patient of patients) {
            let patientScheduled = 0;
            let patientTaken = 0;
            
            if (patient.medications && patient.medications.length > 0) {
                for (const med of patient.medications) {
                    const adherence = await calculateMedicationAdherence(med._id);
                    patientScheduled += adherence.total;
                    patientTaken += adherence.taken;
                    
                    // Track medication-specific stats
                    const medStats = medicationStats.get(med._id.toString()) || {
                        name: med.name,
                        scheduled: 0,
                        taken: 0
                    };
                    medStats.scheduled += adherence.total;
                    medStats.taken += adherence.taken;
                    medicationStats.set(med._id.toString(), medStats);
                }
            }
            
            totalScheduled += patientScheduled;
            totalTaken += patientTaken;
            
            const adherenceRate = patientScheduled > 0 
                ? (patientTaken / patientScheduled) * 100 
                : 0;
                
            patientAdherenceRates.push({
                patientId: patient._id,
                patientName: patient.user?.name || 'Unknown',
                adherenceRate: parseFloat(adherenceRate.toFixed(2))
            });
        }

        return {
            overallAdherenceRate: totalScheduled > 0 
                ? parseFloat(((totalTaken / totalScheduled) * 100).toFixed(2))
                : 0,
            patientAdherenceRates: patientAdherenceRates
                .sort((a, b) => a.adherenceRate - b.adherenceRate)
                .slice(0, 5),
            medicationAdherenceRates: Array.from(medicationStats.values())
                .map(stat => ({
                    medicationName: stat.name,
                    adherenceRate: stat.scheduled > 0 
                        ? parseFloat(((stat.taken / stat.scheduled) * 100).toFixed(2))
                        : 0
                }))
                .sort((a, b) => a.adherenceRate - b.adherenceRate)
                .slice(0, 5),
            totalScheduled,
            totalTaken
        };
    } catch (error) {
        console.error('Error calculating adherence stats:', error);
        throw error;
    }
}

// Update the helper function
async function calculateMedicationAdherence(medicationId) {
    try {
        const medication = await Medication.findById(medicationId);
        if (!medication) {
            return { total: 0, taken: 0, rate: 0 };
        }

        // Get total scheduled doses
        const total = 30; // Example: 30 days worth of doses
        // Get taken doses (this should be based on your actual data model)
        const taken = Math.floor(Math.random() * total); // Simulated data
        
        return {
            total,
            taken,
            rate: total > 0 ? (taken / total) * 100 : 0
        };
    } catch (error) {
        console.error('Error calculating medication adherence:', error);
        return { total: 0, taken: 0, rate: 0 };
    }
}

exports.assignPatientToCaregiver = async (req, res) => {
  try {
    const { caregiverId } = req.params;
    const { patientId } = req.body;

    console.log('Received assignment request:', { caregiverId, patientId, type: typeof patientId });

    if (!caregiverId || !patientId) {
      return res.status(400).json({ message: 'Both caregiver ID and patient ID are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(caregiverId) || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ 
        message: 'Invalid ID format', 
        details: { 
          caregiverId: { value: caregiverId, isValid: mongoose.Types.ObjectId.isValid(caregiverId) },
          patientId: { value: patientId, isValid: mongoose.Types.ObjectId.isValid(patientId) }
        } 
      });
    }

    // Find the caregiver and update their patients array
    const caregiver = await Caregiver.findByIdAndUpdate(
      caregiverId,
      { $addToSet: { patients: patientId } },
      { new: true }
    ).populate('patients');

    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    // Update the patient's caregivers array
    await Patient.findByIdAndUpdate(
      patientId,
      { $addToSet: { caregivers: caregiverId } }
    );

    res.json({
      success: true,
      message: 'Patient assigned successfully',
      data: {
        caregiverId: caregiver._id,
        patientId,
        totalPatients: caregiver.patients.length
      }
    });
  } catch (error) {
    console.error('Error assigning patient to caregiver:', error);
    res.status(500).json({ 
      message: 'Failed to assign patient', 
      error: error.message 
    });
  }
};

// Add this controller method
exports.unassignPatientFromCaregiver = async (req, res) => {
  try {
    const { caregiverId, patientId } = req.params;

    console.log('Unassigning patient:', { caregiverId, patientId });

    if (!caregiverId || !patientId) {
      return res.status(400).json({ message: 'Both caregiver ID and patient ID are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(caregiverId) || !mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({ 
        message: 'Invalid ID format', 
        details: { 
          caregiverId: { value: caregiverId, isValid: mongoose.Types.ObjectId.isValid(caregiverId) },
          patientId: { value: patientId, isValid: mongoose.Types.ObjectId.isValid(patientId) }
        } 
      });
    }

    // Find the caregiver and remove the patient from their patients array
    const caregiver = await Caregiver.findByIdAndUpdate(
      caregiverId,
      { $pull: { patients: patientId } },
      { new: true }
    );

    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    // Update the patient's caregivers array
    await Patient.findByIdAndUpdate(
      patientId,
      { $pull: { caregivers: caregiverId } }
    );

    res.json({
      success: true,
      message: 'Patient unassigned successfully',
      data: {
        caregiverId: caregiver._id,
        patientId
      }
    });
  } catch (error) {
    console.error('Error unassigning patient from caregiver:', error);
    res.status(500).json({ 
      message: 'Failed to unassign patient', 
      error: error.message 
    });
  }
};

// Create caregiver
exports.addCaregiver = async (req, res) => {
  try {
    // Create a user for the caregiver
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password || 'caregiverDefault123',
      role: 'caregiver'
    });

    // Create caregiver profile
    const caregiver = await Caregiver.create({
      user: user._id,
      specialization: req.body.specialization || 'General Care',
      qualifications: req.body.qualifications || [],
      organization: req.body.organization || '',
      position: req.body.position || ''
    });

    // Get full caregiver details 
    const fullCaregiver = await Caregiver.findById(caregiver._id)
      .populate('user', 'name email');

    res.status(201).json({
      _id: caregiver._id,
      name: user.name,
      email: user.email,
      specialization: caregiver.specialization,
      organization: caregiver.organization,
      position: caregiver.position,
      patients: [],
      status: user.status
    });
  } catch (error) {
    console.error('Error adding caregiver:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update caregiver
exports.updateCaregiver = async (req, res) => {
  try {
    const caregiverId = req.params.caregiverId;
    
    // Find caregiver
    const caregiver = await Caregiver.findById(caregiverId);
    
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    
    // Update caregiver data
    if (req.body.specialization) caregiver.specialization = req.body.specialization;
    if (req.body.organization) caregiver.organization = req.body.organization;
    if (req.body.position) caregiver.position = req.body.position;
    if (req.body.qualifications) caregiver.qualifications = req.body.qualifications;
    
    await caregiver.save();
    
    // Update user data if provided
    if (req.body.name || req.body.email) {
      const user = await User.findById(caregiver.user);
      if (user) {
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        await user.save();
      }
    }
    
    // Get updated caregiver data
    const updatedCaregiver = await Caregiver.findById(caregiverId)
      .populate('user', 'name email status');
    
    res.json({
      _id: updatedCaregiver._id,
      name: updatedCaregiver.user.name,
      email: updatedCaregiver.user.email,
      specialization: updatedCaregiver.specialization,
      organization: updatedCaregiver.organization,
      position: updatedCaregiver.position,
      patients: updatedCaregiver.patients,
      status: updatedCaregiver.user.status
    });
  } catch (error) {
    console.error('Error updating caregiver:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete caregiver
exports.deleteCaregiver = async (req, res) => {
  try {
    const caregiverId = req.params.caregiverId;
    
    const caregiver = await Caregiver.findById(caregiverId);
    
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    
    // Remove caregiver from all patients
    await Patient.updateMany(
      { caregivers: caregiverId },
      { $pull: { caregivers: caregiverId } }
    );
    
    // Delete caregiver profile
    await Caregiver.findByIdAndDelete(caregiverId);
    
    // Delete user account
    await User.findByIdAndDelete(caregiver.user);
    
    res.json({ message: 'Caregiver deleted successfully' });
  } catch (error) {
    console.error('Error deleting caregiver:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add patient management methods
exports.addPatient = async (req, res) => {
  try {
    // Validate date of birth
    const dateOfBirth = new Date(req.body.dateOfBirth);
    const today = new Date();
    
    if (dateOfBirth > today) {
      return res.status(400).json({ message: 'Date of birth cannot be in the future' });
    }
    
    // Create a user for the patient
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password || 'patient123', // Default password
      role: 'patient'
    });

    // Create patient profile
    const patient = await Patient.create({
      user: user._id,
      dateOfBirth: req.body.dateOfBirth,
      phone: req.body.phone,
      conditions: req.body.conditions || [],
      caregivers: req.body.caregivers || []
    });

    // Add patient to caregivers
    if (req.body.caregivers && req.body.caregivers.length > 0) {
      await Caregiver.updateMany(
        { _id: { $in: req.body.caregivers } },
        { $addToSet: { patients: patient._id } }
      );
    }

    // Get full patient details
    const fullPatient = await Patient.findById(patient._id)
      .populate('user', 'name email')
      .populate('caregivers', 'user');

    res.status(201).json({
      id: patient._id,
      name: user.name,
      email: user.email,
      age: calculateAge(patient.dateOfBirth),
      phone: patient.phone,
      conditions: patient.conditions,
      caregivers: patient.caregivers.map((c) => ({
        id: c._id,
        name: c.user?.name || 'Unknown'
      })),
      medications: 0,
      adherence: 0,
      status: 'stable'
    });
  } catch (error) {
    console.error('Error adding patient:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    // Validate date of birth if provided
    if (req.body.dateOfBirth) {
      const dateOfBirth = new Date(req.body.dateOfBirth);
      const today = new Date();
      
      if (dateOfBirth > today) {
        return res.status(400).json({ message: 'Date of birth cannot be in the future' });
      }
    }
    
    const { patientId } = req.params;
    
    // Find patient
    const patient = await Patient.findById(patientId).populate('user');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Update user data if provided
    if (req.body.name || req.body.email) {
      const user = await User.findById(patient.user._id);
      if (user) {
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email;
        await user.save();
      }
    }
    
    // Update patient data
    if (req.body.dateOfBirth) patient.dateOfBirth = req.body.dateOfBirth;
    if (req.body.phone) patient.phone = req.body.phone;
    if (req.body.conditions) patient.conditions = req.body.conditions;
    
    // Handle caregiver updates if provided
    if (req.body.caregivers) {
      // Remove patient from caregivers that are no longer assigned
      await Caregiver.updateMany(
        { 
          _id: { $nin: req.body.caregivers },
          patients: patientId 
        },
        { $pull: { patients: patientId } }
      );
      
      // Add patient to new caregivers
      await Caregiver.updateMany(
        { _id: { $in: req.body.caregivers } },
        { $addToSet: { patients: patientId } }
      );
      
      patient.caregivers = req.body.caregivers;
    }
    
    await patient.save();
    
    const updatedPatient = await Patient.findById(patientId)
      .populate('user', 'name email')
      .populate('caregivers', 'user');
    
    res.json({
      id: updatedPatient._id,
      name: updatedPatient.user.name,
      email: updatedPatient.user.email,
      age: calculateAge(updatedPatient.dateOfBirth),
      phone: updatedPatient.phone,
      conditions: updatedPatient.conditions,
      caregivers: updatedPatient.caregivers.map((c) => ({
        id: c._id,
        name: c.user?.name || 'Unknown'
      })),
      status: updatedPatient.status
    });
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Find patient
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    // Remove patient from all caregivers
    await Caregiver.updateMany(
      { patients: patientId },
      { $pull: { patients: patientId } }
    );
    
    // Delete patient profile
    await Patient.findByIdAndDelete(patientId);
    
    // Delete user account
    if (patient.user) {
      await User.findByIdAndDelete(patient.user);
    }
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};