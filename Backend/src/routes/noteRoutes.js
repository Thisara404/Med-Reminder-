const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  addNote,
  getPatientNotes,
  updateNote,
  deleteNote
} = require('../controllers/noteController');

router.post('/patients/:patientId/notes', protect, authorize('caregiver'), addNote);
router.get('/patients/:patientId/notes', protect, authorize('caregiver'), getPatientNotes);
router.put('/notes/:noteId', protect, authorize('caregiver'), updateNote);
router.delete('/notes/:noteId', protect, authorize('caregiver'), deleteNote);

module.exports = router;