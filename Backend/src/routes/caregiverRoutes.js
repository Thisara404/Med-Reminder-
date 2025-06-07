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
    addPrescription,
    getPrescriptions,
    updatePrescription,
    deletePrescription,
    getPatientNotes,
    updatePatientNote,
    deletePatientNote,
    getAvailablePatients,
    addExistingPatient
} = require('../controllers/caregiverController');

// Patient routes
router.get('/profile', protect, authorize('caregiver'), getProfile);
router.get('/patients', protect, authorize('caregiver'), getPatients);
router.post('/patients', protect, authorize('caregiver'), addNewPatient);
router.put('/patients/:patientId', protect, authorize('caregiver'), updatePatient);
router.delete('/patients/:patientId', protect, authorize('caregiver'), deletePatient);

// Prescription routes
router.get('/prescriptions', protect, authorize('caregiver'), getPrescriptions);
router.post('/prescriptions', protect, authorize('caregiver'), addPrescription);
router.put('/prescriptions/:prescriptionId', protect, authorize('caregiver'), updatePrescription);
router.delete('/prescriptions/:prescriptionId', protect, authorize('caregiver'), deletePrescription);

// Notes routes
router.get('/patients/:patientId/notes', protect, authorize('caregiver'), getPatientNotes);
router.post('/patients/notes', protect, authorize('caregiver'), addPatientNote);
router.put('/patients/notes/:noteId', protect, authorize('caregiver'), updatePatientNote);
router.delete('/patients/notes/:noteId', protect, authorize('caregiver'), deletePatientNote);

// Add these routes
router.get('/available-patients', protect, authorize('caregiver'), getAvailablePatients);
router.post('/patients/add-existing', protect, authorize('caregiver'), addExistingPatient);

module.exports = router;