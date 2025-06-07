import React from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, ShieldIcon, UserIcon, HeartIcon } from 'lucide-react';
const HomePage: React.FC = () => {
  return <div className="w-full">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Never Miss a Medication Again
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            MedReminder helps patients and caregivers manage medication
            schedules effectively, ensuring better health outcomes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold text-lg transition-colors">
              Get Started
            </Link>
            <Link to="/about" className="bg-blue-700 hover:bg-blue-800 px-8 py-3 rounded-full font-semibold text-lg transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How MedReminder Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Set Reminders</h3>
              <p className="text-gray-600">
                Easily set up medication schedules and get timely reminders to
                ensure you never miss a dose.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldIcon size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Tracking</h3>
              <p className="text-gray-600">
                Keep track of all medications securely with our privacy-focused
                platform.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Caregiver Support</h3>
              <p className="text-gray-600">
                Caregivers can manage multiple patients and get insights into
                medication adherence.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* User Types Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Who Can Benefit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">
                For Patients
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <HeartIcon size={16} className="text-blue-600" />
                  </div>
                  <span>Personalized medication schedules</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <HeartIcon size={16} className="text-blue-600" />
                  </div>
                  <span>Timely reminders and notifications</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <HeartIcon size={16} className="text-blue-600" />
                  </div>
                  <span>Easy prescription uploads</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <HeartIcon size={16} className="text-blue-600" />
                  </div>
                  <span>Medication history tracking</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
                  Register as Patient
                </Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">
                For Caregivers
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <HeartIcon size={16} className="text-blue-600" />
                  </div>
                  <span>Manage multiple patient profiles</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <HeartIcon size={16} className="text-blue-600" />
                  </div>
                  <span>Medication adherence monitoring</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <HeartIcon size={16} className="text-blue-600" />
                  </div>
                  <span>Add and manage prescriptions</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <HeartIcon size={16} className="text-blue-600" />
                  </div>
                  <span>Patient notes and medical history</span>
                </li>
              </ul>
              <div className="mt-6">
                <Link to="/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
                  Register as Caregiver
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust MedReminder for their medication
            management needs.
          </p>
          <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold text-lg transition-colors">
            Create Your Account
          </Link>
        </div>
      </section>
    </div>;
};
export default HomePage;