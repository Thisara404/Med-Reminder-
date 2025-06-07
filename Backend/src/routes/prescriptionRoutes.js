// filepath: c:\Users\CHAMA COMPUTERS\Downloads\Yashini\website\Backend\src\routes\prescriptionRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  uploadPrescription,
  getPrescriptions
} = require('../controllers/prescriptionController');

router.post('/:patientId/prescriptions', protect, uploadPrescription);
router.get('/prescriptions', protect, getPrescriptions);

module.exports = router;