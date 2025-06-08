const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
    getProfile,
    getPatients,
    addPatientNote,
    addNewPatient,
    updatePatient,
    deletePatient,
    getPatientNotes,
    updatePatientNote,
    deletePatientNote,
    getAvailablePatients,
    addExistingPatient,
    addPatient
} = require('../controllers/caregiverController');

// Import prescription controller functions
const {
  uploadPrescription,
  getPrescriptions,
  updatePrescription,
  deletePrescription
} = require('../controllers/prescriptionController');

// Patient routes
router.get('/profile', protect, authorize('caregiver'), getProfile);
router.get('/patients', protect, authorize('caregiver'), getPatients);
router.post('/patients', protect, authorize('caregiver'), addPatient);
router.put('/patients/:patientId', protect, authorize('caregiver'), updatePatient);
router.delete('/patients/:patientId', protect, authorize('caregiver'), deletePatient);

// Prescription routes
router.get('/prescriptions', protect, authorize('caregiver'), getPrescriptions);
router.post('/prescriptions/upload', protect, authorize('caregiver'), uploadPrescription);
router.put('/prescriptions/:prescriptionId', protect, authorize('caregiver'), updatePrescription);
router.delete('/prescriptions/:prescriptionId', protect, authorize('caregiver'), deletePrescription);

// Notes routes
router.get('/patients/:patientId/notes', protect, authorize('caregiver'), getPatientNotes);
router.post('/patients/notes', protect, authorize('caregiver'), addPatientNote);
router.put('/patients/notes/:noteId', protect, authorize('caregiver'), updatePatientNote);
router.delete('/patients/notes/:noteId', protect, authorize('caregiver'), deletePatientNote);

// Additional patient routes
router.get('/available-patients', protect, authorize('caregiver'), getAvailablePatients);
router.post('/patients/add-existing', protect, authorize('caregiver'), addExistingPatient);

module.exports = router;