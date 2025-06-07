import React, { useState } from 'react';
import { BellIcon, PillIcon, ClockIcon, CheckIcon, XIcon, CalendarIcon, BellOffIcon, Settings2Icon } from 'lucide-react';
const PatientReminders: React.FC = () => {
  // Mock data for demonstration
  const [reminders, setReminders] = useState([{
    id: 1,
    medication: 'Lisinopril',
    dosage: '10mg',
    time: '8:00 AM',
    taken: false,
    status: 'upcoming' // upcoming, completed, missed
  }, {
    id: 2,
    medication: 'Metformin',
    dosage: '500mg',
    time: '12:00 PM',
    taken: false,
    status: 'upcoming'
  }, {
    id: 3,
    medication: 'Metformin',
    dosage: '500mg',
    time: '8:00 AM',
    taken: true,
    status: 'completed'
  }, {
    id: 4,
    medication: 'Atorvastatin',
    dosage: '20mg',
    time: '8:00 PM',
    taken: false,
    status: 'upcoming'
  }]);
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: false,
    sms: true,
    reminderTime: 15 // minutes before
  });
  const handleMarkAsTaken = (id: number) => {
    setReminders(reminders.map(reminder => reminder.id === id ? {
      ...reminder,
      taken: true,
      status: 'completed'
    } : reminder));
  };
  const handleMarkAsMissed = (id: number) => {
    setReminders(reminders.map(reminder => reminder.id === id ? {
      ...reminder,
      taken: false,
      status: 'missed'
    } : reminder));
  };
  const upcomingReminders = reminders.filter(r => r.status === 'upcoming');
  const completedReminders = reminders.filter(r => r.status === 'completed');
  const missedReminders = reminders.filter(r => r.status === 'missed');
  return <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Medication Reminders
          </h1>
          <p className="text-gray-600">
            Never miss a dose with timely reminders.
          </p>
        </div>
        <button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
          <Settings2Icon size={18} className="mr-1" />
          Reminder Settings
        </button>
      </div>
      {/* Today's Reminders */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Today's Reminders
        </h2>
        {upcomingReminders.length === 0 ? <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <BellOffIcon size={24} className="text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-800">
              No Upcoming Reminders
            </h3>
            <p className="text-gray-600 mt-1">
              You've completed all your medication reminders for today.
            </p>
          </div> : <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {upcomingReminders.map(reminder => <div key={reminder.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <PillIcon size={20} className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-800">
                        {reminder.medication}
                      </h3>
                      <p className="text-sm text-gray-500">{reminder.dosage}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-6">
                      <ClockIcon size={16} className="text-gray-400 mr-1" />
                      <span className="text-sm">{reminder.time}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleMarkAsTaken(reminder.id)} className="bg-green-600 hover:bg-green-700 text-white p-1 rounded-md" title="Mark as Taken">
                        <CheckIcon size={18} />
                      </button>
                      <button onClick={() => handleMarkAsMissed(reminder.id)} className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-md" title="Mark as Missed">
                        <XIcon size={18} />
                      </button>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>}
      </div>
      {/* Completed Reminders */}
      {completedReminders.length > 0 && <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Completed
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {completedReminders.map(reminder => <div key={reminder.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckIcon size={20} className="text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-800">
                        {reminder.medication}
                      </h3>
                      <p className="text-sm text-gray-500">{reminder.dosage}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <ClockIcon size={16} className="text-gray-400 mr-1" />
                      <span className="text-sm">{reminder.time}</span>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
      {/* Missed Reminders */}
      {missedReminders.length > 0 && <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Missed</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {missedReminders.map(reminder => <div key={reminder.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-2 rounded-full">
                      <XIcon size={20} className="text-red-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-800">
                        {reminder.medication}
                      </h3>
                      <p className="text-sm text-gray-500">{reminder.dosage}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <ClockIcon size={16} className="text-gray-400 mr-1" />
                      <span className="text-sm">{reminder.time}</span>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>}
      {/* Notification Settings */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Notification Settings
        </h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <BellIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Push Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive alerts on your device
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={notificationSettings.push} onChange={() => setNotificationSettings({
                ...notificationSettings,
                push: !notificationSettings.push
              })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <MailIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive reminders via email
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={notificationSettings.email} onChange={() => setNotificationSettings({
                ...notificationSettings,
                email: !notificationSettings.email
              })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <PhoneIcon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    SMS Notifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Receive reminders via text message
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={notificationSettings.sms} onChange={() => setNotificationSettings({
                ...notificationSettings,
                sms: !notificationSettings.sms
              })} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">
                Reminder Timing
              </h3>
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  <CalendarIcon size={16} className="text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">Send reminders</span>
                </div>
                <select value={notificationSettings.reminderTime} onChange={e => setNotificationSettings({
                ...notificationSettings,
                reminderTime: parseInt(e.target.value)
              })} className="border border-gray-300 rounded-md text-sm p-1">
                  <option value="5">5 minutes before</option>
                  <option value="10">10 minutes before</option>
                  <option value="15">15 minutes before</option>
                  <option value="30">30 minutes before</option>
                  <option value="60">1 hour before</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
// Missing icons - add these
const PhoneIcon = (props: any) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    </svg>;
};
const MailIcon = (props: any) => {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>;
};
export default PatientReminders;