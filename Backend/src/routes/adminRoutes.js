const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

// Check if user is admin middleware
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Doctor management
router.post('/doctors', protect, isAdmin, adminController.addDoctor);
router.put('/doctors/:id', protect, isAdmin, adminController.updateDoctor);
router.delete('/doctors/:id', protect, isAdmin, adminController.deleteDoctor);
router.get('/doctors', protect, isAdmin, adminController.getDoctors);

// User management
router.get('/patients', protect, isAdmin, adminController.getAllPatients);
router.get('/caregivers', protect, isAdmin, adminController.getAllCaregivers);
router.put('/users/:userId/status', protect, isAdmin, adminController.updateUserStatus);

// Medication management
router.post('/medications', protect, isAdmin, adminController.addMedication);
router.put('/medications/:id', protect, isAdmin, adminController.updateMedication);
router.delete('/medications/:id', protect, isAdmin, adminController.deleteMedication);
router.get('/medications', protect, isAdmin, adminController.getAllMedications);

// Dashboard stats
router.get('/stats', protect, isAdmin, adminController.getDashboardStats);

// Assign patient to caregiver
router.post(
  '/caregivers/:caregiverId/patients',
  protect,
  isAdmin,
  adminController.assignPatientToCaregiver
);

// Unassign patient from caregiver
router.delete(
  '/caregivers/:caregiverId/patients/:patientId',
  protect,
  isAdmin,
  adminController.unassignPatientFromCaregiver
);

// Caregiver management
router.post('/caregivers', protect, isAdmin, adminController.addCaregiver);
router.put('/caregivers/:caregiverId', protect, isAdmin, adminController.updateCaregiver);
router.delete('/caregivers/:caregiverId', protect, isAdmin, adminController.deleteCaregiver);

// Patient management
router.post('/patients', protect, isAdmin, adminController.addPatient);
router.put('/patients/:patientId', protect, isAdmin, adminController.updatePatient);
router.delete('/patients/:patientId', protect, isAdmin, adminController.deletePatient);

module.exports = router;