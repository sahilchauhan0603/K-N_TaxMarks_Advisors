import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaClock, FaArrowRight } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const SERVICES = [
  "Tax Planning",
  "ITR Filing",
  "GST Filing",
  "Trademark",
  "Business Advisory",
]

const ContactUsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const contactMethods = [
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email Us",
      details: "kntaxmarkadvisors@gmail.com",
      action: "mailto:kntaxmarkadvisors@gmail.com",
      actionText: "Send Message",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <FaPhone className="text-2xl" />,
      title: "Call Us",
      details: "+91 9318469138",
      action: "tel:+919318469138",
      actionText: "Call Now",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <FaClock className="text-2xl" />,
      title: "Hours",
      details: "Monday-Friday: 9am-6pm IST",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.name || user.given_name || user.first_name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !service || !message) {
      setStatus('Please fill all fields.');
      return;
    }
    try {
      const res = await axios.post('/api/contact/send', { name, email, phone, service, message });
      if (res.data.success) {
        setStatus('Inquiry submitted successfully! We will contact you soon.');
        setName(''); setEmail(''); setPhone(''); setService(''); setMessage('');
      } else {
        setStatus('Failed to send inquiry. Please try again.');
      }
    } catch (err) {
      setStatus('Failed to send inquiry. Please try again.. ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">K&N TaxMark Advisors</span>
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-xl text-gray-600">
            We're here to help! Reach out to our team for any questions or support.
          </p>
        </div>

        {/* Contact Cards - Improved with hover effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {contactMethods.map((method, index) => (
            <div 
              key={index} 
              className={`${method.color} p-6 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col h-full`}
            >
              <div className="flex items-start mb-4">
                <div className={`p-3 rounded-lg ${method.color.replace('bg-', 'bg-opacity-20 ')} mr-4`}>
                  {method.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{method.title}</h3>
                  <p className="text-gray-700 mt-1">{method.details}</p>
                </div>
              </div>
              {method.action && (
                <a 
                  href={method.action} 
                  className="mt-4 inline-flex items-center text-sm font-medium group"
                >
                  {method.actionText}
                  <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Form */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Send us a message</h2>
              <p className="text-gray-500 mb-6">We'll get back to you within 24 hours</p>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Your Phone Number"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={service}
                  onChange={e => setService(e.target.value)}
                  required
                >
                  <option value="">Select a Service</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <textarea
                  placeholder="Your Message"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Submit Inquiry
                </button>
                {status && <div className="text-center text-green-600 font-medium mt-2">{status}</div>}
              </form>
              {/* WhatsApp Chat Button */}
              <div className="mt-8 flex justify-center">
                <a
                  href="https://wa.me/919318469138"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                  aria-label="Chat on WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.617h-.001a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374A9.86 9.86 0 012.1 12.045C2.111 6.495 6.584 2.021 12.13 2.021c2.637 0 5.112 1.027 6.988 2.896a9.825 9.825 0 012.892 6.995c-.013 5.548-4.486 10.021-10.033 10.021zm8.413-18.294A11.815 11.815 0 0012.13.021C5.495.021.111 5.406.1 12.045c0 2.123.555 4.199 1.607 6.032L.017 23.984a1 1 0 001.225 1.225l5.934-1.689a11.87 11.87 0 005.954 1.523h.005c6.634 0 12.021-5.385 12.033-12.021a11.87 11.87 0 00-3.484-8.606z"/></svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
            {/* Support Info */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-400 to-blue-600 p-6 sm:p-8 md:p-12 text-white flex items-center">
              <div className="w-full">
                <div className="flex items-start mb-8">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg mr-4 text-black">
                    <MdSupportAgent className="text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Customer Support</h3>
                    <p className="text-blue-100">Our dedicated team is ready to assist you</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium uppercase tracking-wider text-blue-200 mb-2">Quick Help</h4>
                    <ul className="space-y-2">
                      <li>
                        <a href="/faq" className="flex items-center text-blue-50 hover:text-white transition-colors">
                          <FaArrowRight className="mr-2 text-xs" />
                          Frequently Asked Questions
                        </a>
                      </li>
                      <li>
                        <a href="/community" className="flex items-center text-blue-50 hover:text-white transition-colors">
                          <FaArrowRight className="mr-2 text-xs" />
                          Community Forum
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-6 border-t border-blue-500">
                    <h4 className="text-sm font-medium uppercase tracking-wider text-blue-200 mb-2">Emergency</h4>
                    <p className="text-blue-50">
                      For critical issues, call our 24/7 support line: <br />
                      <a href="tel:+18005551234" className="font-semibold hover:underline">+91 9318469138</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;