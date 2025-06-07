import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Users2Icon, 
  UserCogIcon, 
  PillIcon, 
  ActivityIcon, 
  ClipboardListIcon,
  SettingsIcon 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AdminOverview from '../../components/dashboard/admin/AdminOverview';
import AdminDoctors from '../../components/dashboard/admin/AdminDoctors';
import AdminCaregivers from '../../components/dashboard/admin/AdminCaregivers';
import AdminPatients from '../../components/dashboard/admin/AdminPatients';
import AdminMedications from '../../components/dashboard/admin/AdminMedications';
import AdminSettings from '../../components/dashboard/admin/AdminSettings';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Overview',
      href: '/admin-dashboard',
      icon: <ActivityIcon size={20} />
    },
    {
      name: 'Doctors',
      href: '/admin-dashboard/doctors',
      icon: <UserCogIcon size={20} />
    },
    {
      name: 'Caregivers',
      href: '/admin-dashboard/caregivers',
      icon: <Users2Icon size={20} />
    },
    {
      name: 'Patients',
      href: '/admin-dashboard/patients',
      icon: <ClipboardListIcon size={20} />
    },
    {
      name: 'Medications',
      href: '/admin-dashboard/medications',
      icon: <PillIcon size={20} />
    },
    {
      name: 'Settings',
      href: '/admin-dashboard/settings',
      icon: <SettingsIcon size={20} />
    }
  ];

  const isActive = (path: string) => {
    if (path === '/admin-dashboard' && location.pathname === '/admin-dashboard') {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="bg-white md:w-64 w-full md:min-h-screen shadow-sm">
          <div className="p-4 bg-blue-600 text-white">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            <p className="text-sm opacity-80">
              Welcome, {user?.name || 'Admin'}
            </p>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {navigation.map(item => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center p-3 rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/doctors" element={<AdminDoctors />} />
            <Route path="/caregivers" element={<AdminCaregivers />} />
            <Route path="/patients" element={<AdminPatients />} />
            <Route path="/medications" element={<AdminMedications />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;