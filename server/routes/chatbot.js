const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Service-specific context for better responses
const SERVICE_CONTEXTS = {
  'ITR Filing': {
    expertise: 'Income Tax Return filing, tax deductions, exemptions, refunds, and compliance',
    commonQuestions: 'ITR forms, filing deadlines, required documents, tax calculations, refund status'
  },
  'GST Filing': {
    expertise: 'GST registration, returns filing, input tax credit, compliance, and penalties',
    commonQuestions: 'GST rates, return types, filing deadlines, input credit, invoicing'
  },
  'Business Advisory': {
    expertise: 'Business planning, compliance, registrations, and strategic advisory',
    commonQuestions: 'Company formation, licenses, compliance requirements, business structure'
  },
  'Tax Planning': {
    expertise: 'Tax optimization, investment planning, deductions, and savings strategies',
    commonQuestions: 'Tax saving investments, deductions under 80C, tax planning strategies'
  },
  'TradeMark': {
    expertise: 'Trademark registration, intellectual property protection, and brand compliance',
    commonQuestions: 'Trademark process, classes, renewals, opposition, infringement'
  },
  'General': {
    expertise: 'General tax and business advisory services',
    commonQuestions: 'Service offerings, pricing, processes, and support'
  }
};

// Generate system prompt based on service
const generateSystemPrompt = (serviceName) => {
  const context = SERVICE_CONTEXTS[serviceName] || SERVICE_CONTEXTS['General'];
  
  return `You are an AI assistant for K-N TaxMarks Advisors, a professional tax and business advisory firm. 

Your role: Expert advisor specializing in ${context.expertise}.

Key guidelines:
1. Provide accurate, helpful information about ${serviceName} services
2. Be professional, friendly, and concise
3. Focus on: ${context.commonQuestions}
4. If asked about services outside your expertise, acknowledge and suggest contacting our team
5. Always encourage contacting our professionals for personalized advice
6. Mention that we offer comprehensive services and can schedule consultations
7. Keep responses informative but not overly technical
8. If unsure about specific regulations or current rates, recommend consulting our experts

Company info:
- K-N TaxMarks Advisors
- Professional tax consultants and business advisors
- Services: ITR Filing, GST Filing, Business Advisory, Tax Planning, Trademark Registration
- We provide end-to-end solutions with expert guidance

Remember: You're helping potential clients understand our services and processes, not providing legal advice.`;
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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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
    console.log(`Chatbot Query [${serviceName}]: ${message.substring(0, 100)}...`);

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