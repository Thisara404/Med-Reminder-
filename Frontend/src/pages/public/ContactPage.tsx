import React, { useState } from 'react';
import { PhoneIcon, MailIcon, MapPinIcon, ClockIcon, SendIcon } from 'lucide-react';
const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the form data to a server
    alert('Your message has been sent! We will contact you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };
  // Sample emergency hospitals data
  const emergencyHospitals = [{
    name: 'City General Hospital',
    address: '123 Main Street, Downtown',
    phone: '(555) 123-4567',
    hours: '24/7 Emergency Services'
  }, {
    name: 'Memorial Medical Center',
    address: '456 Healthcare Blvd, Westside',
    phone: '(555) 987-6543',
    hours: '24/7 Emergency Services'
  }, {
    name: 'Community Hospital',
    address: '789 Wellness Way, Eastside',
    phone: '(555) 456-7890',
    hours: '24/7 Emergency Services'
  }];
  return <div className="w-full">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl">
            Get in touch with our team or find emergency medical services near
            you.
          </p>
        </div>
      </section>
      {/* Contact Information and Form */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <MapPinIcon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Our Location</h3>
                    <p className="text-gray-600">
                      123 Healthcare Avenue
                      <br />
                      Medical District, CA 90210
                      <br />
                      United States
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <PhoneIcon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Phone Numbers</h3>
                    <p className="text-gray-600">
                      Customer Support: +1 (555) 123-4567
                      <br />
                      Technical Help: +1 (555) 987-6543
                      <br />
                      Emergency Line: +1 (555) 911-0000
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <MailIcon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email Addresses</h3>
                    <p className="text-gray-600">
                      General Inquiries: info@medreminder.com
                      <br />
                      Support: support@medreminder.com
                      <br />
                      Partnerships: partners@medreminder.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <ClockIcon size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Billing Question">Billing Question</option>
                    <option value="Partnership Opportunity">
                      Partnership Opportunity
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required></textarea>
                </div>
                <div>
                  <button type="submit" className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
                    <SendIcon size={18} className="mr-2" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* Emergency Hospitals Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Nearby Emergency Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {emergencyHospitals.map((hospital, index) => <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">
                  {hospital.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPinIcon size={18} className="text-gray-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p>{hospital.address}</p>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                    <p>{hospital.phone}</p>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                    <p>{hospital.hours}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a href="#" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                    Get Directions
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </a>
                </div>
              </div>)}
          </div>
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">
              Emergency Contact Information
            </h3>
            <p className="mb-4">
              In case of a medical emergency, please dial <strong>911</strong>{' '}
              immediately or contact your local emergency services.
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              <PhoneIcon size={20} className="mr-2" />
              <span>National Emergency Hotline: 911</span>
            </div>
          </div>
        </div>
      </section>
      {/* Map Section (Placeholder) */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Find Us on the Map
          </h2>
          {/* This would be replaced with an actual map component in a real application */}
          <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-lg">
              Interactive Map Would Be Displayed Here
            </p>
          </div>
        </div>
      </section>
    </div>;
};
export default ContactPage;