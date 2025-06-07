import React, { useState } from 'react';
import { UserIcon, LockIcon, BellIcon, ShieldIcon, SaveIcon } from 'lucide-react';
const PatientSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1980-01-15',
    address: '123 Main St, Anytown, CA 90210',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '(555) 987-6543',
    allergies: 'Penicillin',
    bloodType: 'O+'
  });
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the profile in the backend
    alert('Profile updated successfully!');
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>
      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('profile')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Profile
            </button>
            <button onClick={() => setActiveTab('security')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'security' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Security
            </button>
            <button onClick={() => setActiveTab('notifications')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'notifications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Notifications
            </button>
            <button onClick={() => setActiveTab('privacy')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'privacy' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Privacy
            </button>
          </nav>
        </div>
        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && <div>
              <h2 className="text-lg font-medium text-gray-800 mb-6">
                Profile Information
              </h2>
              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input type="text" id="name" name="name" value={profileForm.name} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input type="email" id="email" name="email" value={profileForm.email} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input type="tel" id="phone" name="phone" value={profileForm.phone} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input type="date" id="dateOfBirth" name="dateOfBirth" value={profileForm.dateOfBirth} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input type="text" id="address" name="address" value={profileForm.address} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Medical Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                        Blood Type
                      </label>
                      <select id="bloodType" name="bloodType" value={profileForm.bloodType} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                        Allergies
                      </label>
                      <input type="text" id="allergies" name="allergies" value={profileForm.allergies} onChange={handleProfileChange} placeholder="List any allergies, or 'None' if none" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact Name
                      </label>
                      <input type="text" id="emergencyContact" name="emergencyContact" value={profileForm.emergencyContact} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact Phone
                      </label>
                      <input type="tel" id="emergencyPhone" name="emergencyPhone" value={profileForm.emergencyPhone} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <SaveIcon size={18} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>}
          {/* Security Settings */}
          {activeTab === 'security' && <div>
              <h2 className="text-lg font-medium text-gray-800 mb-6">
                Security Settings
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input type="password" id="currentPassword" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input type="password" id="newPassword" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input type="password" id="confirmPassword" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <LockIcon size={18} className="mr-2" />
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="twoFactor" name="twoFactor" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="twoFactor" className="font-medium text-gray-700">
                        Enable two-factor authentication
                      </label>
                      <p className="text-gray-500">
                        Add an extra layer of security to your account by
                        requiring a verification code in addition to your
                        password.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Login Sessions
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    These are devices that have logged into your account. Revoke
                    any sessions that you do not recognize.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-gray-500">
                          Chrome on Windows • Los Angeles, CA • Started 2 hours
                          ago
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Previous Session</p>
                        <p className="text-sm text-gray-500">
                          Safari on iPhone • Los Angeles, CA • 2 days ago
                        </p>
                      </div>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Revoke
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {/* Notifications Settings */}
          {activeTab === 'notifications' && <div>
              <h2 className="text-lg font-medium text-gray-800 mb-6">
                Notification Preferences
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Medication Reminders
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="emailReminders" name="emailReminders" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="emailReminders" className="font-medium text-gray-700">
                          Email Reminders
                        </label>
                        <p className="text-gray-500">
                          Receive medication reminders via email.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="pushReminders" name="pushReminders" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="pushReminders" className="font-medium text-gray-700">
                          Push Notifications
                        </label>
                        <p className="text-gray-500">
                          Receive medication reminders as push notifications on
                          your device.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="smsReminders" name="smsReminders" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="smsReminders" className="font-medium text-gray-700">
                          SMS Reminders
                        </label>
                        <p className="text-gray-500">
                          Receive medication reminders via text message.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    System Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="prescriptionUpdates" name="prescriptionUpdates" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="prescriptionUpdates" className="font-medium text-gray-700">
                          Prescription Updates
                        </label>
                        <p className="text-gray-500">
                          Receive notifications about prescription uploads,
                          changes, or expirations.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="refillReminders" name="refillReminders" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="refillReminders" className="font-medium text-gray-700">
                          Refill Reminders
                        </label>
                        <p className="text-gray-500">
                          Receive reminders when it's time to refill your
                          prescriptions.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="systemUpdates" name="systemUpdates" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="systemUpdates" className="font-medium text-gray-700">
                          System Updates
                        </label>
                        <p className="text-gray-500">
                          Receive notifications about new features and system
                          updates.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <BellIcon size={18} className="mr-2" />
                    Save Notification Preferences
                  </button>
                </div>
              </div>
            </div>}
          {/* Privacy Settings */}
          {activeTab === 'privacy' && <div>
              <h2 className="text-lg font-medium text-gray-800 mb-6">
                Privacy Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Data Sharing
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="shareWithCaregiver" name="shareWithCaregiver" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="shareWithCaregiver" className="font-medium text-gray-700">
                          Share with Caregiver
                        </label>
                        <p className="text-gray-500">
                          Allow your designated caregiver to access your
                          medication information and adherence data.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="shareWithDoctor" name="shareWithDoctor" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="shareWithDoctor" className="font-medium text-gray-700">
                          Share with Healthcare Provider
                        </label>
                        <p className="text-gray-500">
                          Allow your healthcare providers to access your
                          medication information and adherence data.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="anonymousData" name="anonymousData" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="anonymousData" className="font-medium text-gray-700">
                          Anonymous Data Usage
                        </label>
                        <p className="text-gray-500">
                          Allow anonymous usage of your data for research and
                          system improvements.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Account Management
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        Download My Data
                      </button>
                      <p className="mt-1 text-sm text-gray-500">
                        Download a copy of all your personal data stored in our
                        system.
                      </p>
                    </div>
                    <div>
                      <button className="text-red-600 hover:text-red-800 font-medium">
                        Delete My Account
                      </button>
                      <p className="mt-1 text-sm text-gray-500">
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <ShieldIcon size={18} className="mr-2" />
                    Save Privacy Settings
                  </button>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default PatientSettings;