const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

// Check if user is admin middleware
const isAdmin = (req, res, next) => {
  try {
    const user = req.user;
    
    // Check if user is an admin
    if (!user.isAdmin && user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
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

// Medication management routes - FIXED
router.get('/medications', protect, isAdmin, adminController.getAllMedications);
router.post('/medications', protect, isAdmin, adminController.addMedication);
router.put('/medications/:medicationId', protect, isAdmin, adminController.updateMedication);
router.delete('/medications/:medicationId', protect, isAdmin, adminController.deleteMedication);

// Dashboard stats
router.get('/stats', protect, isAdmin, adminController.getDashboardStats);

// Caregiver management
router.post('/caregivers', protect, isAdmin, adminController.addCaregiver);
router.put('/caregivers/:caregiverId', protect, isAdmin, adminController.updateCaregiver);
router.delete('/caregivers/:caregiverId', protect, isAdmin, adminController.deleteCaregiver);

// Patient management
router.post('/patients', protect, isAdmin, adminController.addPatient);
router.put('/patients/:patientId', protect, isAdmin, adminController.updatePatient);
router.delete('/patients/:patientId', protect, isAdmin, adminController.deletePatient);

// Assignment management
router.post('/caregivers/:caregiverId/patients', protect, isAdmin, adminController.assignPatientToCaregiver);
router.delete('/caregivers/:caregiverId/patients/:patientId', protect, isAdmin, adminController.unassignPatientFromCaregiver);

module.exports = router;