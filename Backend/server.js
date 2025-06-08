require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const caregiverRoutes = require('./src/routes/caregiverRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const medicationRoutes = require('./src/routes/medicationRoutes');
const reminderRoutes = require('./src/routes/reminderRoutes');
const prescriptionRoutes = require('./src/routes/prescriptionRoutes');
const noteRoutes = require('./src/routes/noteRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const { errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/caregiver', caregiverRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api', medicationRoutes);
app.use('/api', reminderRoutes);
app.use('/api/prescriptions', prescriptionRoutes); // Changed to /api/prescriptions
app.use('/api', noteRoutes);
app.use('/api/admin', adminRoutes);

// Enable file uploads directory
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use(errorHandler);

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});