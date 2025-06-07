const Prescription = require('../model/Prescription');
const Patient = require('../model/Patient');
const Medication = require('../model/Medication');
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
}).single('prescriptionFile');

// Upload prescription
exports.uploadPrescription = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const prescription = new Prescription({
        patient: req.params.patientId,
        uploadedBy: req.user.id,
        prescriptionFile: {
          filename: req.file.filename,
          path: req.file.path,
          mimetype: req.file.mimetype
        }
      });

      await prescription.save();
      
      // Trigger prescription analysis (async)
      analyzePrescription(prescription._id);

      res.status(201).json(prescription);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
};

// Get prescriptions
exports.getPrescriptions = async (req, res) => {
  try {
    const query = req.user.role === 'patient' 
      ? { patient: req.user.id }
      : req.query.patientId 
        ? { patient: req.query.patientId }
        : {};

    const prescriptions = await Prescription.find(query)
      .populate('patient', 'name')
      .populate('uploadedBy', 'name role')
      .sort('-createdAt');

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};