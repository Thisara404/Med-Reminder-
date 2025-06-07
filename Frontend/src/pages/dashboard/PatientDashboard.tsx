import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { PillIcon, CalendarIcon, BellIcon, FileTextIcon, SettingsIcon, UploadIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PatientOverview from '../../components/dashboard/patient/PatientOverview';
import PatientMedications from '../../components/dashboard/patient/PatientMedications';
import PatientReminders from '../../components/dashboard/patient/PatientReminders';
import PatientPrescriptions from '../../components/dashboard/patient/PatientPrescriptions';
import PatientSettings from '../../components/dashboard/patient/PatientSettings';
const PatientDashboard: React.FC = () => {
  const {
    user
  } = useAuth();
  const location = useLocation();
  const navigation = [{
    name: 'Overview',
    href: '/patient-dashboard',
    icon: <CalendarIcon size={20} />
  }, {
    name: 'Medications',
    href: '/patient-dashboard/medications',
    icon: <PillIcon size={20} />
  }, {
    name: 'Reminders',
    href: '/patient-dashboard/reminders',
    icon: <BellIcon size={20} />
  }, {
    name: 'Prescriptions',
    href: '/patient-dashboard/prescriptions',
    icon: <FileTextIcon size={20} />
  }, {
    name: 'Settings',
    href: '/patient-dashboard/settings',
    icon: <SettingsIcon size={20} />
  }];
  const isActive = (path: string) => {
    if (path === '/patient-dashboard' && location.pathname === '/patient-dashboard') {
      return true;
    }
    return location.pathname === path;
  };
  return <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="bg-white md:w-64 w-full md:min-h-screen shadow-sm">
          <div className="p-4 bg-blue-600 text-white">
            <h2 className="text-xl font-semibold">Patient Dashboard</h2>
            <p className="text-sm opacity-80">
              Welcome, {user?.name || 'Patient'}
            </p>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {navigation.map(item => <li key={item.name}>
                  <Link to={item.href} className={`flex items-center p-3 rounded-md transition-colors ${isActive(item.href) ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>)}
            </ul>
          </nav>
        </div>
        {/* Main Content */}
        <div className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<PatientOverview />} />
            <Route path="/medications" element={<PatientMedications />} />
            <Route path="/reminders" element={<PatientReminders />} />
            <Route path="/prescriptions" element={<PatientPrescriptions />} />
            <Route path="/settings" element={<PatientSettings />} />
          </Routes>
        </div>
      </div>
    </div>;
};
export default PatientDashboard;