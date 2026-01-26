import React, { useState, useRef, useEffect } from 'react';
import axios from '../utils/axios';

// Markdown formatter for AI responses
const formatAIResponse = (text) => {
  if (!text) return '';
  
  // Convert markdown to HTML-like JSX elements
  let formattedText = text;
  
  // Handle bold text **text** or __text__
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formattedText = formattedText.replace(/__(.*?)__/g, '<strong>$1</strong>');
  
  // Handle italic text *text* or _text_
  formattedText = formattedText.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em>$1</em>');
  formattedText = formattedText.replace(/(?<!_)_(?!_)([^_]+)_(?!_)/g, '<em>$1</em>');
  
  // Handle bullet points
  formattedText = formattedText.replace(/^\* (.+)/gm, '• $1');
  formattedText = formattedText.replace(/^- (.+)/gm, '• $1');
  
  // Handle numbered lists
  formattedText = formattedText.replace(/^(\d+)\. (.+)/gm, '$1. $2');
  
  // Handle code blocks `code`
  formattedText = formattedText.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  return formattedText;
};

// Component to render formatted text
const FormattedText = ({ text, className }) => {
  const formattedText = formatAIResponse(text);
  
  // Split text by HTML tags and render accordingly
  const renderFormattedText = (text) => {
    const parts = text.split(/(<\/?(?:strong|em|code)>)/g);
    let isStrong = false;
    let isEm = false;
    let isCode = false;
    
    return parts.map((part, index) => {
      if (part === '<strong>') {
        isStrong = true;
        return null;
      } else if (part === '</strong>') {
        isStrong = false;
        return null;
      } else if (part === '<em>') {
        isEm = true;
        return null;
      } else if (part === '</em>') {
        isEm = false;
        return null;
      } else if (part === '<code>') {
        isCode = true;
        return null;
      } else if (part === '</code>') {
        isCode = false;
        return null;
      } else if (part) {
        let elementClass = className;
        if (isStrong) {
          return <strong key={index} className={elementClass}>{part}</strong>;
        } else if (isEm) {
          return <em key={index} className={elementClass}>{part}</em>;
        } else if (isCode) {
          return <code key={index} className={`${elementClass} bg-gray-100 px-1 py-0.5 rounded text-xs font-mono`}>{part}</code>;
        } else {
          return <span key={index} className={elementClass}>{part}</span>;
        }
      }
      return null;
    }).filter(Boolean);
  };
  
  // Split by line breaks and render each line
  const lines = formattedText.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, lineIndex) => (
        <div key={lineIndex} className="leading-relaxed">
          {renderFormattedText(line)}
        </div>
      ))}
    </div>
  );
};

const AIChatbot = ({ isOpen, onClose, serviceName = "General" }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Service-specific quick suggestions
  const getQuickSuggestions = (serviceName) => {
    const suggestions = {
      'ITR Filing': [
        "What documents do I need for ITR filing?",
        "How much does ITR filing cost?",
        "What are the ITR filing deadlines?",
        "Can you help with refund processing?"
      ],
      'GST Filing': [
        "What is GST registration process?",
        "How much does GST filing cost?",
        "What are GST return filing deadlines?",
        "Can you help with ITC reconciliation?"
      ],
      'Tax Planning': [
        "How can I save tax legally?",
        "What are the best tax-saving investments?",
        "How much does tax planning cost?",
        "Can you help with year-round strategies?"
      ],
      'Trademark': [
        "How do I register a trademark?",
        "What is the trademark registration cost?",
        "How long does trademark registration take?",
        "Can you help with trademark search?"
      ],
      'Business Advisory': [
        "How to incorporate a company?",
        "What is company incorporation cost?",
        "What are MSME registration benefits?",
        "Can you help with business setup?"
      ]
    };
    return suggestions[serviceName] || [
      "What services do you offer?",
      "How much do your services cost?",
      "How can I get started?",
      "Can you help me choose the right service?"
    ];
  };

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: `Hello! I'm your AI assistant for ${serviceName} services. I can help you with questions about tax filing, documentation, processes, pricing, and more. How can I assist you today?`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: getQuickSuggestions(serviceName)
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, serviceName, messages.length]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call your backend API that integrates with Gemini
      const response = await axios.post('/api/chatbot/ask', {
        message: inputMessage,
        serviceName: serviceName,
        chatHistory: messages.slice(-5) // Send last 5 messages for context
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact our support team for immediate assistance.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    const welcomeMessage = {
      id: Date.now(),
      text: `Hello! I'm your AI assistant for ${serviceName} services. I can help you with questions about tax filing, documentation, processes, pricing, and more. How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: getQuickSuggestions(serviceName)
    };
    setMessages([welcomeMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 pointer-events-none">
      <div className={`bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 pointer-events-auto relative ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px] max-h-[calc(100vh-120px)]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-red-500 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white text-black bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs text-blue-100">{serviceName} Support</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 cursor-pointer hover:bg-white hover:text-black hover:bg-opacity-20 rounded transition-colors"
            >
              <svg className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-1 cursor-pointer hover:bg-white hover:text-black hover:bg-opacity-20 rounded transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Container */}
            <div className="overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ height: 'calc(100% - 160px)', paddingBottom: '8px' }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-red-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}>
                    {message.sender === 'bot' ? (
                      <>
                        <FormattedText text={message.text} className="text-sm" />
                        {message.suggestions && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-gray-600 font-medium">Quick questions you can ask:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setInputMessage(suggestion);
                                    inputRef.current?.focus();
                                  }}
                                  className="text-xs px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full border border-blue-200 transition-colors cursor-pointer"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    )}
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-none shadow-sm px-4 py-2 max-w-xs">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white text-black rounded-b-lg">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Need Info? Ask me..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="1"
                    style={{ minHeight: '40px', maxHeight: '60px' }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
                <button
                  onClick={clearChat}
                  className="p-2 text-red-500 hover:text-red-700 cursor-pointer transition-colors"
                  title="Clear chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 mb-0">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIChatbot;