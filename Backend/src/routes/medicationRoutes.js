const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  getMedications,
  addMedication,
  updateMedication
} = require('../controllers/medicationController');

router.get('/:patientId/medications', protect, getMedications);
router.post('/:patientId/medications', protect, authorize('caregiver'), addMedication);
router.put('/:patientId/medications/:medicationId', protect, authorize('caregiver'), updateMedication);

module.exports = router;