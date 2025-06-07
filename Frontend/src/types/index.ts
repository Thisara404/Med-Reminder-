export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  medications: number;
  adherence: number;
  conditions: string[];
  status: 'stable' | 'attention' | 'critical';
  dateOfBirth?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface Note {
  id: string;
  patient: string;
  title: string;
  content: string;
  date: string;
  category: 'check-in' | 'medication' | 'appointment' | 'concern';
}

export interface Prescription {
  id: string;
  patient: string;
  name: string;
  doctor: string;
  date: string;
  status: 'active' | 'expired';
  file: string;
}

export interface NewPatientData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  conditions?: string[];
}