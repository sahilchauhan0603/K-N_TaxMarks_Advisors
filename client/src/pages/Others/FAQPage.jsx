import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I get started with K&N TaxMark Advisors?",
      answer: "Simply contact us through our website or call us. Our team will guide you through the process based on your needs. We begin with a free consultation to understand your requirements and provide a tailored solution."
    },
    {
      question: "What services do you offer?",
      answer: "We offer comprehensive financial and business services including:",
      list: [
        "Tax Planning and Consultation",
        "ITR Filing for Individuals and Businesses",
        "GST Registration and Filing",
        "Business Advisory Services",
        "Trademark Registration & Legal Services",
        "Accounting and Bookkeeping"
      ]
    },
    {
      question: "How can I contact support?",
      answer: "You can email us at kntaxmarkadvisors@gmail.com or call +91 9318469138 for support. Our team is available Monday to Saturday from 9:30 AM to 6:30 PM."
    },
    {
      question: "What are your service charges?",
      answer: "Our pricing varies based on the service complexity and requirements. We offer competitive and transparent pricing with no hidden charges. Contact us for a customized quote based on your specific needs."
    },
    {
      question: "How long does it take to file an ITR?",
      answer: "The time required depends on the complexity of your financial situation. Simple returns can be filed within 24-48 hours, while more complex cases may take 3-5 business days after receiving all necessary documents."
    },
    {
      question: "Do you provide assistance during tax audits?",
      answer: "Yes, we provide comprehensive support during tax audits, including documentation preparation, representation, and guidance throughout the process to ensure compliance and minimize liabilities."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out; }
        .faq-active .faq-answer { max-height: 500px; transition: max-height 0.5s ease-in; }
        .faq-icon { transition: transform 0.3s ease; }
        .faq-active .faq-icon { transform: rotate(180deg); }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className={`flex flex-col items-center mb-12 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-lg mb-6 border-2 border-blue-200">
            <svg className="w-14 h-14 text-blue-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
            </svg>
          </div> */}
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4 text-center">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-700 text-center max-w-2xl">Find answers to common queries about our services and support. Can't find what you're looking for? Contact us directly.</p>
        </div>

        {/* Search Bar */}
        <div className={`mb-8 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white rounded-xl shadow-md p-3 flex items-center">
            <svg className="w-6 h-6 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search questions..." 
              className="w-full py-2 px-2 outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex items-center">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Expert Guidance</h3>
                  <p className="text-sm text-gray-600">Get answers from qualified professionals</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex items-center">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">24/7 Support</h3>
                  <p className="text-sm text-gray-600">We're here to help you anytime</p>
                </div>
              </div>
            </div>
            
            {/* FAQ Items */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`border border-blue-100 rounded-xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'faq-active bg-blue-50 shadow-md' : 'bg-white'}`}
                >
                  <button 
                    className="w-full flex justify-between items-center p-5 text-left font-medium text-gray-800 hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span className="pr-4">{faq.question}</span>
                    <svg className="faq-icon w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="faq-answer">
                    <div className="p-5 pt-0 text-gray-600">
                      <p>{faq.answer}</p>
                      {faq.list && (
                        <ul className="mt-3 space-y-2 pl-5">
                          {faq.list.map((item, i) => (
                            <li key={i} className="list-disc">{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Visual element */}
            <div className="rounded-xl overflow-hidden mt-8 shadow-md">
              <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-700"></div>
              <div className="p-6 bg-blue-50 text-black flex flex-col md:flex-row items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
                  <p>Contact our team for more information or personalized support.</p>
                </div>
                <Link 
                  to="/contact-us" 
                  className="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-700 font-medium rounded-lg transition duration-200 transform hover:-translate-y-1 hover:shadow-lg"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="bg-white rounded-2xl shadow-xl mt-8 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Quick Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="mailto:kntaxmarkadvisors@gmail.com" className="flex items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-blue-700">Email Us</span>
            </a>
            <a href="tel:+919318469138" className="flex items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-blue-700">Call Us</span>
            </a>
            <Link to="/contact-us" className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>Live Chat</span>
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2023 K&N TaxMark Advisors. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;