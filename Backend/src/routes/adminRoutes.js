const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  addDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctors,
  getDashboardStats,
  getAllPatients,
  getAllCaregivers,
  updateUserStatus,
  addMedication,
  updateMedication,
  deleteMedication,
  getAllMedications
} = require('../controllers/adminController');

// Check if user is admin middleware
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Doctor management
router.post('/doctors', protect, isAdmin, addDoctor);
router.put('/doctors/:id', protect, isAdmin, updateDoctor);
router.delete('/doctors/:id', protect, isAdmin, deleteDoctor);
router.get('/doctors', protect, isAdmin, getDoctors);

// User management
router.get('/patients', protect, isAdmin, getAllPatients);
router.get('/caregivers', protect, isAdmin, getAllCaregivers);
router.put('/users/:userId/status', protect, isAdmin, updateUserStatus);

// Medication management
router.post('/medications', protect, isAdmin, addMedication);
router.put('/medications/:id', protect, isAdmin, updateMedication);
router.delete('/medications/:id', protect, isAdmin, deleteMedication);
router.get('/medications', protect, isAdmin, getAllMedications);

// Dashboard stats
router.get('/stats', protect, isAdmin, getDashboardStats);

module.exports = router;