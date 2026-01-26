import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaClock, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { MdSupportAgent } from 'react-icons/md';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import AIChatbot from '../components/AIChatbot';

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
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const contactMethods = [
    {
      icon: <FaEnvelope className="text-xl" />,
      title: "Email Address",
      details: "kntaxmarkadvisors@gmail.com",
      action: "mailto:kntaxmarkadvisors@gmail.com",
      color: "bg-slate-50 text-slate-700"
    },
    {
      icon: <FaPhone className="text-xl" />,
      title: "Phone Number",
      details: "+91 9318469138",
      action: "tel:+919318469138",
      color: "bg-slate-50 text-slate-700"
    },
    {
      icon: <FaClock className="text-xl" />,
      title: "Business Hours",
      details: "Monday - Friday: 9:00 AM - 6:00 PM IST",
      color: "bg-slate-50 text-slate-700"
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
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <div className="bg-white border-b border-slate-200 py-4 md:py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions or need assistance? Our dedicated team is here to help you with all your tax and advisory needs.
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="px-1 sm:px-1 lg:px-1 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-lg p-6 hover:border-slate-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center mb-3">
                  <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
                    {method.icon}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{method.title}</h3>
                {method.action ? (
                  <a 
                    href={method.action} 
                    className="text-sm text-slate-600 hover:text-slate-900 hover:underline transition-colors break-all cursor-pointer font-medium"
                  >
                    {method.details}
                  </a>
                ) : (
                  <p className="text-sm text-gray-600">{method.details}</p>
                )}
              </div>
            ))}
            
            {/* AI Help Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-6 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-pointer" onClick={() => setIsChatbotOpen(true)}>
              <div className="flex items-center mb-3">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg text-white shadow-md">
                  <MdSupportAgent className="text-xl" />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-blue-900 mb-2 hover:text-blue-700 transition-colors">AI Assistant</h3>
              <p className="text-sm text-blue-700">Get instant answers to your questions</p>
            </div>
          </div>
          
          {/* AI Chatbot */}
          <AIChatbot 
            isOpen={isChatbotOpen} 
            onClose={() => setIsChatbotOpen(false)} 
            serviceName="Contact Us" 
          />

          {/* Contact Form Section */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Form */}
              <div className="w-full lg:w-3/5 p-8 md:p-12">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                  <p className="text-sm text-gray-600">We'll respond within 24 hours</p>
                </div>
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white transition-colors"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white transition-colors"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white transition-colors"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Service <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white text-gray-900 transition-colors cursor-pointer"
                        value={service}
                        onChange={e => setService(e.target.value)}
                        required
                      >
                        <option value="">Select service</option>
                        {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Tell us about your requirements..."
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent bg-white resize-none transition-colors"
                      rows={4}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="cursor-pointer px-6 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors shadow"
                    >
                      Submit Inquiry
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setName('');
                        setEmail('');
                        setPhone('');
                        setService('');
                        setMessage('');
                        setStatus('');
                      }}
                      className="px-6 py-2.5 border cursor-pointer border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
                    >
                      Clear Form
                    </button>
                  </div>
                  {status && (
                    <div className={`flex items-center gap-2 p-4 rounded-lg ${
                      status.includes('successfully') 
                        ? 'bg-green-50 border border-green-200 text-green-700' 
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                      {status.includes('successfully') && <FaCheckCircle />}
                      <span className="text-sm font-medium">{status}</span>
                    </div>
                  )}
                </form>
              {/* WhatsApp Chat Button */}
              <div className="mt-6 flex gap-3">
                <a
                  href="https://wa.me/919318469138"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-semibold shadow-md transition-colors"
                  aria-label="Chat on WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.2 5.077 4.363.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.617h-.001a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374A9.86 9.86 0 012.1 12.045C2.111 6.495 6.584 2.021 12.13 2.021c2.637 0 5.112 1.027 6.988 2.896a9.825 9.825 0 012.892 6.995c-.013 5.548-4.486 10.021-10.033 10.021zm8.413-18.294A11.815 11.815 0 0012.13.021C5.495.021.111 5.406.1 12.045c0 2.123.555 4.199 1.607 6.032L.017 23.984a1 1 0 001.225 1.225l5.934-1.689a11.87 11.87 0 005.954 1.523h.005c6.634 0 12.021-5.385 12.033-12.021a11.87 11.87 0 00-3.484-8.606z"/></svg>
                  WhatsApp
                </a>
              </div>
            </div>
            {/* Support Info */}
            <div className="w-full lg:w-2/5 bg-slate-50 p-8 md:p-12 border-l border-slate-200">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-slate-200 rounded-lg">
                      <MdSupportAgent className="text-2xl text-slate-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Need Immediate Help?</h3>
                      <p className="text-sm text-gray-600">Our team is ready to assist</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Response Time</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      We typically respond to all inquiries within <strong>24 hours</strong> during business days.
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-200">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Quick Links</h4>
                    <ul className="space-y-3">
                      <li>
                        <a href="/faq" className="text-sm text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2">
                          → Frequently Asked Questions
                        </a>
                      </li>
                      <li>
                        <a href="/reviews" className="text-sm text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2">
                          → Client Testimonials
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-200">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Support Hours</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      For urgent matters, contact us directly at:<br />
                      <a href="tel:+919318469138" className="font-semibold text-slate-700 hover:text-slate-900">+91 9318469138</a>
                    </p>
                  </div>
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