// filepath: c:\Users\CHAMA COMPUTERS\Downloads\Yashini\website\Backend\src\routes\prescriptionRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  uploadPrescription,
  getPrescriptions,
  updatePrescription,
  deletePrescription
} = require('../controllers/prescriptionController');

// Prescription routes
router.post('/upload', protect, authorize('caregiver'), uploadPrescription);
router.get('/', protect, authorize('caregiver'), getPrescriptions);
router.put('/:prescriptionId', protect, authorize('caregiver'), updatePrescription);
router.delete('/:prescriptionId', protect, authorize('caregiver'), deletePrescription);

module.exports = router;