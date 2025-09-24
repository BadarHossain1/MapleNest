'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContactFormProps {
  listing?: any;
  agent?: any;
}

export function ContactForm({ listing, agent }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in ${listing?.title || 'this property'}. Can you provide more information?`,
    preferredContact: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store inquiry in localStorage for demo purposes
    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    const newInquiry = {
      id: Date.now(),
      ...formData,
      listingId: listing?.id,
      agentId: agent?.id,
      timestamp: new Date().toISOString()
    };
    inquiries.push(newInquiry);
    localStorage.setItem('inquiries', JSON.stringify(inquiries));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Message Sent!
        </h3>
        <p className="text-gray-600 mb-6">
          {agent?.name || 'The agent'} will get back to you shortly.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setIsSubmitted(false);
            setFormData(prev => ({
              ...prev,
              name: '',
              email: '',
              phone: ''
            }));
          }}
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your phone number"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredContact">Preferred Contact Method</Label>
        <select
          id="preferredContact"
          name="preferredContact"
          value={formData.preferredContact}
          onChange={(e) => setFormData(prev => ({ ...prev, preferredContact: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="text">Text Message</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us about your interest in this property..."
        />
      </div>

      <div className="space-y-3">
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>

        {agent && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        By submitting this form, you agree to be contacted by the listing agent 
        or their representatives regarding this property.
      </p>
    </form>
  );
}