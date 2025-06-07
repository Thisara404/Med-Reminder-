import React, { useState } from 'react';
import { UserIcon, BellIcon, ShieldIcon, UsersIcon, SaveIcon } from 'lucide-react';
const CaregiverSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    organization: 'Sunshine Home Care',
    position: 'Registered Nurse',
    qualifications: 'RN, BSN',
    bio: 'Experienced caregiver with over 10 years in geriatric care.'
  });
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <h1 className="text-2xl font-bold text-gray-800">Caregiver Settings</h1>
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
            <button onClick={() => setActiveTab('notifications')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'notifications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Notifications
            </button>
            <button onClick={() => setActiveTab('privacy')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'privacy' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Privacy & Security
            </button>
            <button onClick={() => setActiveTab('patients')} className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'patients' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Patient Management
            </button>
          </nav>
        </div>
        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && <div>
              <h2 className="text-lg font-medium text-gray-800 mb-6">
                Caregiver Profile
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
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                      Organization
                    </label>
                    <input type="text" id="organization" name="organization" value={profileForm.organization} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input type="text" id="position" name="position" value={profileForm.position} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                      Qualifications
                    </label>
                    <input type="text" id="qualifications" name="qualifications" value={profileForm.qualifications} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Bio
                    </label>
                    <textarea id="bio" name="bio" rows={4} value={profileForm.bio} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
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
          {/* Notifications Settings */}
          {activeTab === 'notifications' && <div>
              <h2 className="text-lg font-medium text-gray-800 mb-6">
                Notification Preferences
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Patient Alerts
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="missedMedication" name="missedMedication" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="missedMedication" className="font-medium text-gray-700">
                          Missed Medication Alerts
                        </label>
                        <p className="text-gray-500">
                          Receive alerts when patients miss their medication.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="lowAdherence" name="lowAdherence" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="lowAdherence" className="font-medium text-gray-700">
                          Low Adherence Warnings
                        </label>
                        <p className="text-gray-500">
                          Be notified when a patient's adherence rate drops
                          below 80%.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="prescriptionUpdates" name="prescriptionUpdates" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="prescriptionUpdates" className="font-medium text-gray-700">
                          Prescription Updates
                        </label>
                        <p className="text-gray-500">
                          Receive notifications when prescriptions are updated
                          or about to expire.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Notification Channels
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="emailNotifications" name="emailNotifications" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                          Email Notifications
                        </label>
                        <p className="text-gray-500">
                          Receive notifications via email.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="pushNotifications" name="pushNotifications" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="pushNotifications" className="font-medium text-gray-700">
                          Push Notifications
                        </label>
                        <p className="text-gray-500">
                          Receive notifications as push alerts on your device.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="smsNotifications" name="smsNotifications" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="smsNotifications" className="font-medium text-gray-700">
                          SMS Notifications
                        </label>
                        <p className="text-gray-500">
                          Receive urgent notifications via text message.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Daily Summary
                  </h3>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="dailySummary" name="dailySummary" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="dailySummary" className="font-medium text-gray-700">
                        Receive Daily Summary
                      </label>
                      <p className="text-gray-500">
                        Get a daily report of all patient activities and
                        medication adherence.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pl-7">
                    <label htmlFor="summaryTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Time
                    </label>
                    <select id="summaryTime" name="summaryTime" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" defaultValue="18:00">
                      <option value="06:00">6:00 AM</option>
                      <option value="08:00">8:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="20:00">8:00 PM</option>
                    </select>
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
          {/* Privacy & Security Settings */}
          {activeTab === 'privacy' && <div>
              <h2 className="text-lg font-medium text-gray-800 mb-6">
                Privacy & Security
              </h2>
              <div className="space-y-6">
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
                    Data Sharing
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="shareWithPatients" name="shareWithPatients" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="shareWithPatients" className="font-medium text-gray-700">
                          Share Your Information with Patients
                        </label>
                        <p className="text-gray-500">
                          Allow patients to see your profile information and
                          qualifications.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="shareWithHealthcare" name="shareWithHealthcare" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="shareWithHealthcare" className="font-medium text-gray-700">
                          Share with Healthcare Providers
                        </label>
                        <p className="text-gray-500">
                          Allow healthcare providers to see your notes and
                          patient management activities.
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
              </div>
            </div>}
          {/* Patient Management Settings */}
          {activeTab === 'patients' && <div>
              <h2 className="text-lg font-medium text-gray-800 mb-6">
                Patient Management Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Patient Access
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Control what information patients can see and manage in
                    their accounts.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="patientViewNotes" name="patientViewNotes" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="patientViewNotes" className="font-medium text-gray-700">
                          Allow Patients to View Your Notes
                        </label>
                        <p className="text-gray-500">
                          Patients can see notes you've written about their
                          care.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="patientUploadPrescriptions" name="patientUploadPrescriptions" type="checkbox" defaultChecked className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="patientUploadPrescriptions" className="font-medium text-gray-700">
                          Allow Patients to Upload Prescriptions
                        </label>
                        <p className="text-gray-500">
                          Patients can add new prescriptions to their profiles.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="patientModifyMedications" name="patientModifyMedications" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="patientModifyMedications" className="font-medium text-gray-700">
                          Allow Patients to Modify Medication Details
                        </label>
                        <p className="text-gray-500">
                          Patients can update dosage, schedule, and other
                          medication details.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Default Reminder Settings
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Set default reminder settings for all patients. These can be
                    overridden for individual patients.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="defaultReminderTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Default Reminder Time (minutes before scheduled dose)
                      </label>
                      <select id="defaultReminderTime" name="defaultReminderTime" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" defaultValue="15">
                        <option value="5">5 minutes</option>
                        <option value="10">10 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="defaultReminderFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                        Default Reminder Frequency
                      </label>
                      <select id="defaultReminderFrequency" name="defaultReminderFrequency" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" defaultValue="once">
                        <option value="once">Once only</option>
                        <option value="twice">
                          Twice (with 5 minute interval)
                        </option>
                        <option value="until_taken">
                          Until marked as taken
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-md font-medium text-gray-800 mb-4">
                    Patient Invitations
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="autoApprovePatients" name="autoApprovePatients" type="checkbox" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="autoApprovePatients" className="font-medium text-gray-700">
                          Auto-approve Patient Requests
                        </label>
                        <p className="text-gray-500">
                          Automatically approve requests from patients to
                          connect with you.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="invitationMessage" className="block text-sm font-medium text-gray-700 mb-1">
                        Default Invitation Message
                      </label>
                      <textarea id="invitationMessage" name="invitationMessage" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" defaultValue="I'd like to help you manage your medications through the MedReminder app. Please accept this invitation to connect."></textarea>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <UsersIcon size={18} className="mr-2" />
                    Save Patient Management Settings
                  </button>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default CaregiverSettings;