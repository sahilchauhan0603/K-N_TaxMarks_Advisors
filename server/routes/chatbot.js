const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Service-specific context for better responses
const SERVICE_CONTEXTS = {
  'ITR Filing': {
    name: 'Income Tax Return (ITR) Filing',
    description: 'Professional ITR filing services for individuals, businesses, and professionals with expert review and maximum refund optimization.',
    services: [
      {
        name: 'Individual & Business ITR Filing',
        price: '₹2,499 - ₹4,999',
        description: 'Complete ITR filing for salaried employees, self-employed individuals, and businesses with expert review and validation.',
        features: ['Form 16/16A verification', 'Income computation', 'Deduction optimization', 'Refund maximization', 'Error-free filing']
      },
      {
        name: 'ITR Document Preparation',
        price: '₹1,999',
        description: 'End-to-end document collection, preparation, and review for accurate filing and record maintenance.',
        features: ['Document collection assistance', 'Digital record management', 'Computation worksheets', 'Supporting schedules', 'Audit trail maintenance']
      },
      {
        name: 'Refund & Notice Handling',
        price: '₹3,499',
        description: 'Expert assistance for tax refunds, notice responses, and income tax department communications.',
        features: ['Refund status tracking', 'Notice analysis & response', 'Department communication', 'Rectification requests', 'Appeal assistance']
      }
    ],
    process: [
      'Document collection and verification',
      'Income computation and validation',
      'Deduction identification and optimization',
      'Return preparation and review',
      'Online filing and acknowledgment',
      'Refund tracking and follow-up'
    ],
    benefits: [
      'Expert team of CAs and tax professionals',
      'Timely filing with deadline reminders',
      'Maximum eligible refund optimization',
      'Secure and confidential data handling',
      'End-to-end support and guidance',
      'Error-free filing guarantee'
    ],
    documents: [
      'PAN Card and Aadhaar Card',
      'Form 16/16A (for salaried)',
      'Bank statements and interest certificates',
      'Investment proofs (80C, 80D, etc.)',
      'House property documents',
      'Business income/P&L statements'
    ],
    deadlines: 'July 31st for individuals, September 30th for audit cases',
    faqs: [
      'What is the difference between ITR-1 and ITR-2?',
      'Can I file ITR after the due date?',
      'How long does refund processing take?',
      'What documents are required for ITR filing?'
    ]
  },
  
  'GST Filing': {
    name: 'Goods and Services Tax (GST) Filing',
    description: 'Comprehensive GST compliance services including registration, return filing, and reconciliation for businesses of all sizes.',
    services: [
      {
        name: 'GST Registration & Amendments',
        price: '₹1,999',
        description: 'Hassle-free GST registration and seamless amendments to keep your business compliant.',
        features: ['Online GST registration', 'Amendment services', 'Compliance check', 'Documentation support', 'Status tracking']
      },
      {
        name: 'GST Return Filing',
        price: '₹2,999',
        description: 'Accurate monthly/quarterly GST return filing to ensure compliance and maximize input tax credits.',
        features: ['GSTR-1, GSTR-3B filing', 'Input tax credit optimization', 'Reconciliation support', 'Penalty avoidance', 'Timely submissions']
      },
      {
        name: 'GST Resolution & Reconciliation',
        price: '₹3,999',
        description: 'Comprehensive input tax credit reconciliation and resolution of GST-related issues.',
        features: ['ITC reconciliation', 'Mismatch resolution', 'Notice handling', 'Audit support', 'Compliance review']
      }
    ],
    process: [
      'Business analysis and GST applicability check',
      'Registration/return preparation',
      'Invoice and purchase reconciliation',
      'Input tax credit optimization',
      'Online filing and compliance check',
      'Monthly compliance monitoring'
    ],
    benefits: [
      'Expert GST professionals and CAs',
      'Timely filing with auto-reminders',
      'Maximum ITC optimization',
      'Penalty and interest avoidance',
      'Comprehensive compliance support',
      'Regular updates on GST changes'
    ],
    documents: [
      'Business registration documents',
      'PAN and Aadhaar of proprietor/directors',
      'Bank account statements',
      'Sales and purchase invoices',
      'Rent agreement/property documents',
      'Previous GST returns (if applicable)'
    ],
    compliance: 'Monthly GSTR-3B by 20th, Quarterly GSTR-1 filing',
    faqs: [
      'What is the GST registration threshold?',
      'How to claim input tax credit?',
      'What are the penalties for late filing?',
      'Can I file GST returns myself?'
    ]
  },
  
  'Tax Planning': {
    name: 'Strategic Tax Planning & Advisory',
    description: 'Comprehensive tax planning services to minimize tax liability and optimize financial growth through strategic planning.',
    services: [
      {
        name: 'Year-round Tax Strategies',
        price: '₹6,999',
        description: 'Ongoing tax-saving strategies and investment guidance to maximize your financial benefits throughout the year.',
        features: ['Monthly tax planning', 'Investment advisory', 'Quarterly reviews', 'Strategy adjustments', 'Tax-saving recommendations']
      },
      {
        name: 'Personal & Corporate Tax Planning',
        price: '₹8,999',
        description: 'Customized tax planning for individuals and corporations to optimize tax efficiency and compliance.',
        features: ['Individual tax strategy', 'Corporate restructuring', 'Investment planning', 'Succession planning', 'Risk assessment']
      },
      {
        name: 'Tax Compliance & Advisory',
        price: '₹4,999',
        description: 'Expert advisory on tax compliance, regulatory changes, and strategic tax decisions.',
        features: ['Compliance monitoring', 'Regulatory updates', 'Strategic advice', 'Risk mitigation', 'Advisory support']
      }
    ],
    process: [
      'Financial situation analysis',
      'Tax liability assessment',
      'Strategy development and planning',
      'Investment recommendation',
      'Implementation and monitoring',
      'Regular review and optimization'
    ],
    benefits: [
      'Significant tax savings opportunities',
      'Expert financial and tax advisory',
      'Customized planning strategies',
      'Ongoing support and monitoring',
      'Compliance with all regulations',
      'Wealth optimization guidance'
    ],
    strategies: [
      '80C investments (ELSS, PPF, etc.)',
      'Health insurance (80D) optimization',
      'Home loan benefits (24b, 80EE)',
      'NPS and pension planning',
      'Capital gains planning',
      'Business expense optimization'
    ],
    faqs: [
      'How much tax can I save with proper planning?',
      'What are the best tax-saving investments?',
      'When should I start tax planning?',
      'How does tax planning differ for businesses?'
    ]
  },
  
  'Trademark': {
    name: 'Trademark Registration & IP Protection',
    description: 'Complete intellectual property protection services including trademark search, registration, and dispute resolution.',
    services: [
      {
        name: 'Trademark Search & Registration',
        price: '₹5,999',
        description: 'Comprehensive trademark search and registration process to protect your brand identity.',
        features: ['Detailed trademark search', 'Application filing', 'Class determination', 'Objection handling', 'Registration certificate']
      },
      {
        name: 'IP Protection & Dispute Resolution',
        price: '₹12,999',
        description: 'Advanced IP protection services including monitoring, enforcement, and dispute resolution.',
        features: ['IP portfolio management', 'Infringement monitoring', 'Opposition handling', 'Legal proceedings', 'Renewal management']
      },
      {
        name: 'Legal Documentation & Compliance',
        price: '₹8,999',
        description: 'Complete legal documentation and compliance support for trademark and IP matters.',
        features: ['Legal documentation', 'Compliance monitoring', 'Renewal reminders', 'Assignment deeds', 'Licensing agreements']
      }
    ],
    process: [
      'Trademark availability search',
      'Application preparation and filing',
      'Examination and objection response',
      'Publication and opposition handling',
      'Registration and certificate issuance',
      'Ongoing maintenance and renewals'
    ],
    benefits: [
      'Expert IP lawyers and consultants',
      'Comprehensive brand protection',
      'Fast-track registration options',
      'Ongoing monitoring and support',
      'Legal dispute resolution',
      'International filing assistance'
    ],
    classes: 'Trademark registration available in 45 different classes covering goods and services',
    timeline: '12-18 months for complete registration process',
    faqs: [
      'How long does trademark registration take?',
      'What can be trademarked?',
      'How much does trademark registration cost?',
      'Do I need a trademark for my business?'
    ]
  },
  
  'Business Advisory': {
    name: 'Business Advisory & Incorporation',
    description: 'Complete business setup and advisory services for startups, MSMEs, and established companies.',
    services: [
      {
        name: 'Startup & MSME Registration',
        price: '₹7,999',
        description: 'End-to-end startup registration and MSME certification for new businesses and entrepreneurs.',
        features: ['Company incorporation', 'MSME registration', 'Startup India registration', 'Compliance setup', 'Banking assistance']
      },
      {
        name: 'Company Incorporation',
        price: '₹15,999',
        description: 'Professional company incorporation services with complete legal and regulatory compliance.',
        features: ['Private/Public company setup', 'ROC compliance', 'Share structure planning', 'Board setup', 'Statutory registers']
      },
      {
        name: 'Legal & Financial Advisory',
        price: '₹9,999',
        description: 'Ongoing legal and financial advisory for business growth, compliance, and strategic decisions.',
        features: ['Legal compliance', 'Financial planning', 'Business strategy', 'Risk assessment', 'Regulatory guidance']
      }
    ],
    process: [
      'Business structure consultation',
      'Name reservation and approval',
      'Documentation and filing',
      'Registration and certification',
      'Banking and compliance setup',
      'Ongoing support and advisory'
    ],
    benefits: [
      'Expert business consultants and lawyers',
      'Fast-track incorporation process',
      'Complete compliance support',
      'Ongoing business advisory',
      'Government liaison services',
      'Cost-effective solutions'
    ],
    entities: [
      'Private Limited Company',
      'Limited Liability Partnership (LLP)',
      'One Person Company (OPC)',
      'Partnership Firm',
      'Proprietorship',
      'Section 8 Company (NGO)'
    ],
    faqs: [
      'Which business structure is best for me?',
      'How long does company incorporation take?',
      'What are the ongoing compliance requirements?',
      'What documents are needed for incorporation?'
    ]
  },
  
  'General': {
    name: 'K-N TaxMarks Advisors - Complete Tax & Business Solutions',
    description: 'Professional tax consultants and business advisors providing end-to-end solutions with expert guidance.',
    overview: 'We are a leading tax and business advisory firm offering comprehensive services in ITR Filing, GST compliance, Tax Planning, Trademark registration, and Business advisory. Our team of experienced CAs, tax professionals, and legal experts ensures accurate, timely, and cost-effective solutions for individuals and businesses.',
    specialties: [
      'Income Tax Return filing and planning',
      'GST registration and compliance',
      'Strategic tax planning and advisory',
      'Trademark and IP protection',
      'Business incorporation and advisory'
    ],
    whyChooseUs: [
      'Team of qualified CAs and tax experts',
      'End-to-end service solutions',
      'Timely and accurate compliance',
      'Cost-effective pricing',
      'Personalized client service',
      'Technology-driven processes'
    ]
  }
};

// Generate system prompt based on service
const generateSystemPrompt = (serviceName) => {
  const serviceContext = SERVICE_CONTEXTS[serviceName] || SERVICE_CONTEXTS['General'];
  
  let prompt = `You are an AI assistant for K-N TaxMarks Advisors, specializing in ${serviceContext.name}. 

${serviceContext.description}

`;

  // Add service-specific information if available
  if (serviceContext.services) {
    prompt += `Our Services:\n`;
    serviceContext.services.forEach(service => {
      prompt += `• ${service.name} (${service.price}): ${service.description}\n`;
      if (service.features) {
        prompt += `  Key Features: ${service.features.join(', ')}\n`;
      }
    });
    prompt += `\n`;
  }

  // Add process information
  if (serviceContext.process) {
    prompt += `Our Process:\n${serviceContext.process.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\n`;
  }

  // Add benefits
  if (serviceContext.benefits) {
    prompt += `Why Choose Us:\n${serviceContext.benefits.map(benefit => `• ${benefit}`).join('\n')}\n\n`;
  }

  // Add service-specific details
  if (serviceContext.documents) {
    prompt += `Required Documents: ${serviceContext.documents.join(', ')}\n\n`;
  }
  
  if (serviceContext.timeline) {
    prompt += `Timeline: ${serviceContext.timeline}\n\n`;
  }
  
  if (serviceContext.deadlines) {
    prompt += `Important Deadlines: ${serviceContext.deadlines}\n\n`;
  }

  // Add FAQs if available
  if (serviceContext.faqs) {
    prompt += `Common Questions:\n${serviceContext.faqs.map(faq => `• ${faq}`).join('\n')}\n\n`;
  }

  // Add overview for general context
  if (serviceContext.overview) {
    prompt += `About Us: ${serviceContext.overview}\n\n`;
  }

  prompt += `Guidelines for responses:
1. Be helpful, professional, and friendly
2. Focus on ${serviceContext.name} when applicable
3. Provide accurate information about our services and processes
4. Always mention specific pricing when available${serviceContext.services ? ': ' + serviceContext.services.map(s => `${s.name} - ${s.price}`).join(', ') : ''}
5. Always encourage users to reach out for personalized consultation
6. Mention that we offer comprehensive services and can schedule consultations
7. Keep responses informative but not overly technical
8. If unsure about specific regulations or current rates, recommend consulting our experts

Company Info:
- K-N TaxMarks Advisors - Professional tax consultants and business advisors
- Complete Services: ITR Filing (₹2,499-₹4,999), GST Filing (₹1,999-₹3,999), Tax Planning (₹4,999-₹8,999), Trademark (₹5,999-₹12,999), Business Advisory (₹7,999-₹15,999)
- We provide end-to-end solutions with expert guidance
- Team of qualified CAs, tax professionals, and legal experts

Remember: You're helping potential clients understand our services and processes, not providing legal advice. Always suggest consulting our experts for specific situations and personalized advice.`;

  return prompt;
};

// POST /api/chatbot/ask
router.post('/ask', async (req, res) => {
  try {
    const { message, serviceName = 'General', chatHistory = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'AI service is temporarily unavailable. Please contact our support team.' 
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build conversation context
    let conversationContext = generateSystemPrompt(serviceName);
    
    // Add recent chat history for context
    if (chatHistory.length > 0) {
      conversationContext += "\n\nRecent conversation:\n";
      chatHistory.forEach(msg => {
        if (msg.sender === 'user') {
          conversationContext += `User: ${msg.text}\n`;
        } else if (msg.sender === 'bot') {
          conversationContext += `Assistant: ${msg.text}\n`;
        }
      });
    }

    conversationContext += `\n\nUser's current question: ${message}\n\nPlease provide a helpful response:`;

    // Generate response
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const text = response.text();

    // Log the interaction (optional, for analytics)
    // console.log(`Chatbot Query [${serviceName}]: ${message.substring(0, 100)}...`);

    res.json({ 
      response: text,
      serviceName: serviceName,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    
    // Handle different types of errors
    if (error.message?.includes('API key')) {
      return res.status(500).json({ 
        error: 'AI service configuration issue. Please contact our support team.' 
      });
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return res.status(429).json({ 
        error: 'AI service is temporarily busy. Please try again in a moment or contact our support team.' 
      });
    }

    // Generic error response
    res.status(500).json({ 
      error: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our support team for immediate assistance.' 
    });
  }
});

// GET /api/chatbot/health - Health check endpoint
router.get('/health', (req, res) => {
  const isConfigured = !!process.env.GEMINI_API_KEY;
  res.json({ 
    status: 'active',
    configured: isConfigured,
    services: Object.keys(SERVICE_CONTEXTS)
  });
});

module.exports = router;