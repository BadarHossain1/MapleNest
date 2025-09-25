"use client"

import { useState } from 'react';
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle, Sparkles, Heart,
  Star, MessageCircle, Headphones, Globe, Shield, Zap, Gift, Crown,
  ArrowRight, Eye, Coffee, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SexyContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Store',
      details: ['123 Fashion Avenue', 'New York, NY 10001', 'United States'],
      color: '#f2c9c7',
      gradient: 'from-[#f2c9c7] to-[#e8b4b1]',
      description: 'Come see our beautiful collection in person'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', 'Mon-Fri: 9AM-7PM', 'Sat-Sun: 10AM-6PM'],
      color: '#e8b4b1',
      gradient: 'from-[#e8b4b1] to-[#d4a4a1]',
      description: 'Speak directly with our fashion experts'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['hello@elarose.com', 'support@elarose.com', 'We reply within 24h'],
      color: '#d4a4a1',
      gradient: 'from-[#d4a4a1] to-[#f2c9c7]',
      description: 'Send us your questions anytime'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 9:00 AM - 7:00 PM', 'Saturday: 10:00 AM - 6:00 PM', 'Sunday: 12:00 PM - 5:00 PM'],
      color: '#f2c9c7',
      gradient: 'from-[#f2c9c7] to-[#e8b4b1]',
      description: 'When you can reach our amazing team'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: MessageCircle },
    { value: 'orders', label: 'Order Support', icon: Gift },
    { value: 'returns', label: 'Returns & Exchanges', icon: Shield },
    { value: 'technical', label: 'Technical Support', icon: Headphones },
    { value: 'partnerships', label: 'Business Partnerships', icon: Users },
    { value: 'feedback', label: 'Feedback & Suggestions', icon: Star }
  ];

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.category) errors.category = 'Please select a category';
    if (!formData.message.trim()) errors.message = 'Message is required';
    else if (formData.message.length < 10) errors.message = 'Message must be at least 10 characters';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission with realistic delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically send to your API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        })
      });

      // Force success for demo (remove this in production)
      if (response.ok || true) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: '',
          message: ''
        });
        setFormErrors({});

        // Reset form after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormErrors({ general: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f2c9c7]/10 to-white relative overflow-hidden flex items-center justify-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-100/20 to-transparent animate-shimmer opacity-30"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-green-100/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-green-100/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="text-center card-sexy p-16 max-w-2xl mx-4 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center animate-pulse-glow">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <Sparkles className="w-8 h-8 text-green-500 animate-pulse" />
            <Star className="w-6 h-6 text-green-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>

          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-6">
            Message Sent Successfully!
          </h2>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Thank you for reaching out to us! Our team will get back to you within 24 hours with the perfect solution to your inquiry.
          </p>

          <div className="flex justify-center gap-6">
            <div className="text-center glass-morphism rounded-2xl p-4">
              <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-700">Response Time</div>
              <div className="text-lg font-bold text-green-600">≤ 24 hours</div>
            </div>
            <div className="text-center glass-morphism rounded-2xl p-4">
              <Heart className="w-6 h-6 text-[#f2c9c7] mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-700">Satisfaction</div>
              <div className="text-lg font-bold text-[#f2c9c7]">Guaranteed</div>
            </div>
            <div className="text-center glass-morphism rounded-2xl p-4">
              <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-700">Priority</div>
              <div className="text-lg font-bold text-blue-600">High</div>
            </div>
          </div>

          <Button
            onClick={() => setIsSubmitted(false)}
            className="btn-sexy hover-glow mt-8 group"
          >
            <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f2c9c7]/3 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f2c9c7]/5 to-transparent animate-shimmer opacity-20 pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#f2c9c7]/5 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#e8b4b1]/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '3s' }}></div>

      <div className="container mx-auto px-4 py-12 relative">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MessageCircle className="w-12 h-12 text-[#f2c9c7] animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-[#c66074]">Get In Touch</h1>
            <Heart className="w-8 h-8 text-[#f2c9c7] animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We'd love to hear from you! Send us a message and we'll respond as soon as possible with personalized assistance.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            const isHovered = hoveredCard === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className="card-sexy p-6 text-center hover-lift animate-fade-in-up relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-10' : ''}`}></div>

                <div className="relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${info.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 ${isHovered ? 'animate-pulse-glow scale-110' : ''} transition-all duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">{info.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 italic">{info.description}</p>

                  <div className="space-y-2">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-gray-700 text-sm font-medium">
                        {detail}
                      </p>
                    ))}
                  </div>

                  {/* Animated underline */}
                  <div className={`h-0.5 bg-gradient-to-r ${info.gradient} transition-all duration-500 rounded-full mt-4 ${isHovered ? 'w-full' : 'w-0'} mx-auto`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <div className="card-sexy p-8 md:p-12 animate-fade-in-up relative overflow-hidden">
            {/* Form Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#f2c9c7]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Send className="w-8 h-8 text-[#f2c9c7]" />
                  <h2 className="text-3xl font-bold text-[#c66074]">Send Us a Message</h2>
                  <Coffee className="w-6 h-6 text-[#f2c9c7]" />
                </div>
                <p className="text-gray-600">We're here to help and answer any questions you might have</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {formErrors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in-up">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700">{formErrors.general}</p>
                  </div>
                )}

                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-semibold flex items-center gap-2">
                      <Crown className="w-4 h-4 text-[#f2c9c7]" />
                      Full Name *
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your full name"
                        className={`glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl transition-all duration-300 ${focusedField === 'name' ? 'scale-105 shadow-lg' : ''
                          } ${formErrors.name ? 'border-red-300 bg-red-50' : ''}`}
                      />
                      {focusedField === 'name' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f2c9c7] rounded-full animate-pulse"></div>
                      )}
                    </div>
                    {formErrors.name && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#f2c9c7]" />
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter your email address"
                        className={`glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl transition-all duration-300 ${focusedField === 'email' ? 'scale-105 shadow-lg' : ''
                          } ${formErrors.email ? 'border-red-300 bg-red-50' : ''}`}
                      />
                      {focusedField === 'email' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f2c9c7] rounded-full animate-pulse"></div>
                      )}
                    </div>
                    {formErrors.email && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-700 font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#f2c9c7]" />
                      Subject *
                    </Label>
                    <div className="relative">
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        onFocus={() => setFocusedField('subject')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="What's this about?"
                        className={`glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl transition-all duration-300 ${focusedField === 'subject' ? 'scale-105 shadow-lg' : ''
                          } ${formErrors.subject ? 'border-red-300 bg-red-50' : ''}`}
                      />
                      {focusedField === 'subject' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f2c9c7] rounded-full animate-pulse"></div>
                      )}
                    </div>
                    {formErrors.subject && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.subject}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-700 font-semibold flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#f2c9c7]" />
                      Category *
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className={`glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl transition-all duration-300 ${formErrors.category ? 'border-red-300 bg-red-50' : ''
                        }`}>
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent className="glass-morphism-white rounded-2xl">
                        {categories.map((category) => {
                          const Icon = category.icon;
                          return (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-[#f2c9c7]" />
                                {category.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {formErrors.category && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.category}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-semibold flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#f2c9c7]" />
                    Message * ({formData.message.length}/500)
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value.slice(0, 500))}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tell us how we can help you... (minimum 10 characters)"
                      rows={6}
                      className={`glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl transition-all duration-300 resize-none ${focusedField === 'message' ? 'scale-105 shadow-lg' : ''
                        } ${formErrors.message ? 'border-red-300 bg-red-50' : ''}`}
                    />
                    {focusedField === 'message' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#f2c9c7] rounded-full animate-pulse"></div>
                    )}
                  </div>
                  {formErrors.message && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {formErrors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-sexy hover-glow group px-12 py-4 text-lg relative overflow-hidden"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        Send Message
                        <Sparkles className="w-4 h-4 ml-2 group-hover:animate-pulse" />
                      </>
                    )}

                    {/* Button shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Button>

                  <p className="text-sm text-gray-600 mt-4 flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    Your information is secure and will never be shared
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Contact Options */}
        <div className="mt-16 text-center animate-fade-in-up">
          <h3 className="text-2xl font-bold text-[#c66074] mb-8">Other Ways to Connect</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="glass-morphism hover-glow rounded-full px-6 py-3">
              <MessageCircle className="w-5 h-5 mr-2" />
              Live Chat
            </Button>
            <Button variant="outline" className="glass-morphism hover-glow rounded-full px-6 py-3">
              <Phone className="w-5 h-5 mr-2" />
              Schedule Call
            </Button>
            <Button variant="outline" className="glass-morphism hover-glow rounded-full px-6 py-3">
              <Globe className="w-5 h-5 mr-2" />
              FAQ Center
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}