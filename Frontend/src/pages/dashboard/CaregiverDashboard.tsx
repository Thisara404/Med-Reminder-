import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { UsersIcon, UserPlusIcon, FileTextIcon, ClipboardCheckIcon, SettingsIcon, PlusIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CaregiverOverview from '../../components/dashboard/caregiver/CaregiverOverview';
import CaregiverPatients from '../../components/dashboard/caregiver/CaregiverPatients';
import CaregiverPrescriptions from '../../components/dashboard/caregiver/CaregiverPrescriptions';
import CaregiverNotes from '../../components/dashboard/caregiver/CaregiverNotes';
import CaregiverSettings from '../../components/dashboard/caregiver/CaregiverSettings';
const CaregiverDashboard: React.FC = () => {
  const {
    user
  } = useAuth();
  const location = useLocation();
  const navigation = [{
    name: 'Overview',
    href: '/caregiver-dashboard',
    icon: <ClipboardCheckIcon size={20} />
  }, {
    name: 'My Patients',
    href: '/caregiver-dashboard/patients',
    icon: <UsersIcon size={20} />
  }, {
    name: 'Prescriptions',
    href: '/caregiver-dashboard/prescriptions',
    icon: <FileTextIcon size={20} />
  }, {
    name: 'Patient Notes',
    href: '/caregiver-dashboard/notes',
    icon: <ClipboardCheckIcon size={20} />
  }, {
    name: 'Settings',
    href: '/caregiver-dashboard/settings',
    icon: <SettingsIcon size={20} />
  }];
  const isActive = (path: string) => {
    if (path === '/caregiver-dashboard' && location.pathname === '/caregiver-dashboard') {
      return true;
    }
    return location.pathname === path;
  };
  return <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="bg-white md:w-64 w-full md:min-h-screen shadow-sm">
          <div className="p-4 bg-blue-600 text-white">
            <h2 className="text-xl font-semibold">Caregiver Dashboard</h2>
            <p className="text-sm opacity-80">
              Welcome, {user?.name || 'Caregiver'}
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
            <div className="mt-8 px-3">
              <Link to="/caregiver-dashboard/patients/add" className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition-colors">
                <PlusIcon size={18} className="mr-1" />
                Add New Patient
              </Link>
            </div>
          </nav>
        </div>
        {/* Main Content */}
        <div className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<CaregiverOverview />} />
            <Route path="/patients" element={<CaregiverPatients />} />
            <Route path="/prescriptions" element={<CaregiverPrescriptions />} />
            <Route path="/notes" element={<CaregiverNotes />} />
            <Route path="/settings" element={<CaregiverSettings />} />
          </Routes>
        </div>
      </div>
    </div>;
};
export default CaregiverDashboard;