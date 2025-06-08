const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  getMedications,
  addMedication,
  updateMedication,
  deleteMedication // Add this import
} = require('../controllers/medicationController');

// Update routes to use 'patients' prefix
router.get('/patients/:patientId/medications', protect, getMedications);
router.post('/patients/:patientId/medications', protect, authorize('caregiver'), addMedication);
router.put('/patients/:patientId/medications/:medicationId', protect, authorize('caregiver'), updateMedication);
router.delete('/patients/:patientId/medications/:medicationId', protect, authorize('caregiver'), deleteMedication); // Add delete route

module.exports = router;