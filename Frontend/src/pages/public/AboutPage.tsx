import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, AlertTriangleIcon, BellIcon, ClipboardCheckIcon } from 'lucide-react';
const AboutPage: React.FC = () => {
  return <div className="w-full">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            About MedReminder
          </h1>
          <p className="text-xl">
            Our mission is to improve medication adherence and patient outcomes
            through innovative technology.
          </p>
        </div>
      </section>
      {/* Our Mission */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg mb-6">
              At MedReminder, we believe that medication adherence is a critical
              factor in achieving positive health outcomes. Our platform is
              designed to bridge the gap between healthcare providers, patients,
              and caregivers by providing a comprehensive solution for
              medication management.
            </p>
            <p className="text-lg mb-6">
              Studies show that approximately 50% of patients with chronic
              conditions don't take their medications as prescribed. This
              non-adherence leads to increased hospitalizations, disease
              progression, and higher healthcare costs. MedReminder aims to
              address this challenge through timely reminders, easy-to-use
              interfaces, and seamless communication between patients and
              caregivers.
            </p>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            How MedReminder Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-3">Setup Your Profile</h3>
              <p className="text-gray-600">
                Register as a patient or caregiver and create your personalized
                profile with relevant medical information.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-3">Add Medications</h3>
              <p className="text-gray-600">
                Upload prescriptions or manually add medications with dosage
                information and scheduling details.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-3">Get Reminders</h3>
              <p className="text-gray-600">
                Receive timely notifications when it's time to take your
                medication, never missing a dose.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold text-lg mb-3">Track Progress</h3>
              <p className="text-gray-600">
                Monitor medication adherence over time and share reports with
                healthcare providers as needed.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Key Benefits */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Key Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                <CheckIcon size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Improved Medication Adherence
                </h3>
                <p className="text-gray-600">
                  Timely reminders and easy tracking help ensure medications are
                  taken as prescribed.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                <CheckIcon size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Reduced Healthcare Costs
                </h3>
                <p className="text-gray-600">
                  Better medication adherence leads to fewer complications and
                  hospitalizations.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                <CheckIcon size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Enhanced Caregiver Support
                </h3>
                <p className="text-gray-600">
                  Caregivers can manage multiple patients and stay informed
                  about medication adherence.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                <CheckIcon size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Better Health Outcomes
                </h3>
                <p className="text-gray-600">
                  Consistent medication use as prescribed leads to improved
                  overall health and wellbeing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Common Challenges */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Common Medication Challenges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <AlertTriangleIcon size={24} className="text-orange-500 mr-3" />
                <h3 className="font-semibold text-lg">Forgetfulness</h3>
              </div>
              <p className="text-gray-600">
                Many patients simply forget to take their medications at the
                right time.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium mb-2">Our Solution:</h4>
                <div className="flex items-center">
                  <BellIcon size={16} className="text-blue-600 mr-2" />
                  <span>Customizable reminders and notifications</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <AlertTriangleIcon size={24} className="text-orange-500 mr-3" />
                <h3 className="font-semibold text-lg">Complex Regimens</h3>
              </div>
              <p className="text-gray-600">
                Managing multiple medications with different schedules can be
                overwhelming.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium mb-2">Our Solution:</h4>
                <div className="flex items-center">
                  <ClipboardCheckIcon size={16} className="text-blue-600 mr-2" />
                  <span>
                    Organized medication schedules and clear instructions
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <AlertTriangleIcon size={24} className="text-orange-500 mr-3" />
                <h3 className="font-semibold text-lg">Caregiver Burden</h3>
              </div>
              <p className="text-gray-600">
                Caregivers often struggle to manage medications for multiple
                patients.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-medium mb-2">Our Solution:</h4>
                <div className="flex items-center">
                  <ClipboardCheckIcon size={16} className="text-blue-600 mr-2" />
                  <span>
                    Multi-patient dashboard with comprehensive oversight
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Improve Medication Adherence?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join MedReminder today and take control of your medication
            management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full font-semibold transition-colors">
              Sign Up Now
            </Link>
            <Link to="/contact" className="bg-blue-700 hover:bg-blue-800 px-8 py-3 rounded-full font-semibold transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>;
};
export default AboutPage;