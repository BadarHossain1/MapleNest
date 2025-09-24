'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Home, 
  MapPin, 
  TrendingUp, 
  Calculator,
  MessageSquare,
  Lightbulb,
  Search,
  Star,
  Clock,
  ArrowLeft,
  Mic,
  MicOff,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface QuickAction {
  icon: React.ElementType;
  label: string;
  prompt: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    icon: Home,
    label: "Find Properties",
    prompt: "Help me find a 3-bedroom house in Toronto under $800K",
    color: "bg-blue-500"
  },
  {
    icon: Calculator,
    label: "Mortgage Calculator",
    prompt: "Calculate mortgage payments for a $600K home with 20% down",
    color: "bg-green-500"
  },
  {
    icon: MapPin,
    label: "Neighborhood Info",
    prompt: "Tell me about the best neighborhoods in Vancouver for families",
    color: "bg-purple-500"
  },
  {
    icon: TrendingUp,
    label: "Market Trends",
    prompt: "What are the current real estate market trends in Canada?",
    color: "bg-orange-500"
  }
];

const exampleQuestions = [
  "What's the average home price in Montreal?",
  "How do I get pre-approved for a mortgage?",
  "What are the best investment properties in Calgary?",
  "Compare rental yields in different Canadian cities",
  "What documents do I need to buy a house?",
  "How much should I budget for closing costs?"
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: '1',
      type: 'assistant',
      content: "👋 Hi! I'm **PropertyGPT**, your intelligent real estate assistant for Canada. I'm here to help you with property searches, market insights, mortgage calculations, and everything related to Canadian real estate. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Find properties in my budget",
        "Calculate mortgage payments",
        "Compare neighborhoods",
        "Market analysis"
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(content),
        timestamp: new Date(),
        suggestions: generateSuggestions(content)
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('price') || lowerPrompt.includes('cost')) {
      return `Based on current market data, here's what I found about pricing:\n\n**Average Home Prices in Major Canadian Cities:**\n• Toronto: $1.2M - $1.5M\n• Vancouver: $1.3M - $1.8M\n• Montreal: $450K - $650K\n• Calgary: $450K - $600K\n• Ottawa: $550K - $750K\n\nThese prices vary significantly by neighborhood and property type. Would you like me to provide more specific information for a particular area or property type?`;
    }
    
    if (lowerPrompt.includes('mortgage') || lowerPrompt.includes('calculate')) {
      return `I can help you calculate mortgage payments! Here's a quick example:\n\n**For a $600K home with 20% down ($120K):**\n• Loan amount: $480K\n• Monthly payment (25yr, 5.5%): ~$2,900\n• Total interest: ~$390K\n\n**Additional costs to consider:**\n• Property taxes: $4K-$8K/year\n• Home insurance: $1K-$2K/year\n• Utilities: $150-$300/month\n\nWould you like me to calculate payments for a specific scenario?`;
    }
    
    if (lowerPrompt.includes('neighborhood') || lowerPrompt.includes('area')) {
      return `Here are some excellent neighborhoods to consider:\n\n**For Families:**\n• **North York (Toronto)** - Great schools, parks\n• **Burnaby (Vancouver)** - Family-friendly, transit access\n• **Nepean (Ottawa)** - Suburban feel, good amenities\n\n**For Young Professionals:**\n• **King West (Toronto)** - Vibrant nightlife, condos\n• **Yaletown (Vancouver)** - Urban living, waterfront\n• **Plateau (Montreal)** - Arts scene, cafes\n\n**Investment Opportunities:**\n• **Kitchener-Waterloo** - Tech growth\n• **Hamilton** - Emerging market\n• **Laval** - Affordable with growth potential\n\nWhat type of lifestyle are you looking for?`;
    }
    
    if (lowerPrompt.includes('market') || lowerPrompt.includes('trend')) {
      return `**Current Canadian Real Estate Market Trends (2025):**\n\n📈 **Key Insights:**\n• Interest rates stabilizing around 5-6%\n• Supply shortage continues in major cities\n• Strong immigration driving demand\n• Shift toward smaller, affordable markets\n\n🏙️ **Hot Markets:**\n• Atlantic Canada seeing growth\n• Kitchener-Waterloo tech expansion\n• Calgary recovering strongly\n\n💡 **Buyer Tips:**\n• Consider pre-construction for better pricing\n• Look at emerging neighborhoods\n• Factor in future transit developments\n\nWould you like detailed analysis for a specific city or region?`;
    }
    
    // Default response
    return `I'd be happy to help you with that! As your Canadian real estate assistant, I can provide information about:\n\n🏠 **Property Search** - Find homes matching your criteria\n💰 **Financial Planning** - Mortgage calculations and budgeting\n📊 **Market Analysis** - Current trends and pricing\n🗺️ **Location Insights** - Neighborhood comparisons\n📋 **Process Guidance** - Buying/selling procedures\n\nCould you provide more details about what you're looking for? For example:\n• Your budget range\n• Preferred cities or regions\n• Property type (house, condo, etc.)\n• Timeline for buying/selling`;
  };

  const generateSuggestions = (prompt: string): string[] => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('price') || lowerPrompt.includes('cost')) {
      return [
        "Compare prices across cities",
        "Show price trends over time",
        "Calculate affordability",
        "Find properties in my budget"
      ];
    }
    
    if (lowerPrompt.includes('mortgage')) {
      return [
        "Calculate different scenarios",
        "Explain mortgage types",
        "Find mortgage pre-approval",
        "Compare lenders"
      ];
    }
    
    return [
      "Show me similar properties",
      "Calculate monthly costs",
      "Compare neighborhoods",
      "Schedule a viewing"
    ];
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Add speech recognition logic here
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PropertyGPT</h1>
                  <p className="text-sm text-gray-600">AI Real Estate Assistant</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSendMessage(action.prompt)}
                      className="w-full p-3 text-left rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <action.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-emerald-700">
                          {action.label}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Example Questions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  Popular Questions
                </h3>
                <div className="space-y-2">
                  {exampleQuestions.slice(0, 4).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(question)}
                      className="w-full text-left text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 p-2 rounded transition-all duration-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[700px] flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        message.type === 'user' 
                          ? 'bg-blue-500' 
                          : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className={`flex-1 max-w-3xl ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white rounded-br-md'
                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                        }`}>
                          <div className="prose prose-sm max-w-none">
                            {message.content.split('\n').map((line, index) => (
                              <div key={index} className={message.type === 'user' ? 'text-white' : ''}>
                                {line.startsWith('**') && line.endsWith('**') ? (
                                  <strong>{line.replace(/\*\*/g, '')}</strong>
                                ) : line.startsWith('•') ? (
                                  <div className="ml-4">{line}</div>
                                ) : line.startsWith('#') ? (
                                  <h3 className="font-semibold mt-2 mb-1">{line.replace(/^#+\s/, '')}</h3>
                                ) : (
                                  line
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {message.type === 'assistant' && (
                            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                              <Button variant="ghost" size="sm" onClick={() => copyMessage(message.content)}>
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                              <span className="text-xs text-gray-500 ml-auto">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Suggestions */}
                        {message.suggestions && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSendMessage(suggestion)}
                                className="text-xs hover:bg-emerald-50 hover:border-emerald-300"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-500">PropertyGPT is typing...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex gap-4 items-end"
                >
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me anything about Canadian real estate..."
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={toggleListening}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                        isListening ? 'text-red-500' : 'text-gray-400'
                      }`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
                
                <p className="text-xs text-gray-500 mt-2 text-center">
                  PropertyGPT can make mistakes. Please verify important information.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}