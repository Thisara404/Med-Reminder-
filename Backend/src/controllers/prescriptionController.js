const Prescription = require('../model/Prescription');
const Patient = require('../model/Patient');
const Caregiver = require('../model/Caregiver');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/prescriptions/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPEG, JPG, and PNG files are allowed'));
    }
  }
}).single('prescriptionFile');

// Upload prescription
exports.uploadPrescription = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ 
        message: err.message || 'File upload failed' 
      });
    }

    try {
      const { patientId, name, doctor } = req.body;

      if (!patientId) {
        return res.status(400).json({ message: 'Patient ID is required' });
      }

      // Find the caregiver
      const caregiver = await Caregiver.findOne({ user: req.user.id });
      if (!caregiver) {
        return res.status(404).json({ message: 'Caregiver profile not found' });
      }

      // Check if patient is assigned to this caregiver
      if (!caregiver.patients.includes(patientId)) {
        return res.status(403).json({ message: 'You are not assigned to this patient' });
      }

      // Find patient details
      const patient = await Patient.findById(patientId).populate('user', 'name');
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      const prescription = new Prescription({
        patient: patientId,
        uploadedBy: req.user.id,
        name: name || req.file?.originalname || 'Prescription',
        doctor: doctor || 'Unknown Doctor',
        prescriptionFile: req.file ? {
          filename: req.file.filename,
          path: req.file.path,
          mimetype: req.file.mimetype,
          originalname: req.file.originalname
        } : null,
        status: 'active'
      });

      await prescription.save();
      
      // Populate the response
      await prescription.populate('patient', 'user');
      await prescription.populate('uploadedBy', 'name');
      
      res.status(201).json({
        id: prescription._id,
        name: prescription.name,
        patient: patient.user.name,
        patientId: prescription.patient._id,
        doctor: prescription.doctor,
        date: prescription.createdAt,
        status: prescription.status,
        file: prescription.prescriptionFile?.filename,
        medications: prescription.medications || []
      });
    } catch (error) {
      console.error('Error uploading prescription:', error);
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
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'name'
      }
    })
    .populate('uploadedBy', 'name')
    .sort('-createdAt');

    const formattedPrescriptions = prescriptions.map(p => ({
      id: p._id,
      name: p.name || 'Prescription',
      patient: p.patient?.user?.name || 'Unknown Patient',
      patientId: p.patient?._id,
      doctor: p.doctor || 'Unknown Doctor',
      date: p.createdAt,
      status: p.status || 'active',
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
    
    // Find the caregiver
    const caregiver = await Caregiver.findOne({ user: req.user.id });
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver profile not found' });
    }

    // Find prescription and verify it belongs to caregiver's patient
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check if patient is assigned to this caregiver
    if (!caregiver.patients.includes(prescription.patient)) {
      return res.status(403).json({ message: 'You are not authorized to update this prescription' });
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      { ...updates, updatedAt: new Date() },
      { new: true }
    ).populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'name'
      }
    });
    
    res.json({
      id: updatedPrescription._id,
      name: updatedPrescription.name,
      patient: updatedPrescription.patient?.user?.name || 'Unknown Patient',
      patientId: updatedPrescription.patient?._id,
      doctor: updatedPrescription.doctor,
      date: updatedPrescription.createdAt,
      status: updatedPrescription.status,
      file: updatedPrescription.prescriptionFile?.filename,
      medications: updatedPrescription.medications || []
    });
  } catch (error) {
    console.error('Error updating prescription:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete prescription
exports.deletePrescription = async (req, res) => {
  try {
    const { prescriptionId } = req.params;
    
    // Find the caregiver
    const caregiver = await Caregiver.findOne({ user: req.user.id });
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver profile not found' });
    }

    // Find prescription and verify it belongs to caregiver's patient
    const prescription = await Prescription.findById(prescriptionId);
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    // Check if patient is assigned to this caregiver
    if (!caregiver.patients.includes(prescription.patient)) {
      return res.status(403).json({ message: 'You are not authorized to delete this prescription' });
    }

    // Delete the file from filesystem if it exists
    if (prescription.prescriptionFile && prescription.prescriptionFile.path) {
      try {
        if (fs.existsSync(prescription.prescriptionFile.path)) {
          fs.unlinkSync(prescription.prescriptionFile.path);
        }
      } catch (fileError) {
        console.warn('Could not delete file:', fileError);
      }
    }

    await Prescription.findByIdAndDelete(prescriptionId);
    
    res.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};