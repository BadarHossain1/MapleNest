'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    User,
    Building,
    MessageSquare,
    Calendar,
    DollarSign,
    Home as HomeIcon,
    CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        inquiryType: 'general',
        propertyType: '',
        budget: '',
        location: '',
        message: '',
        preferredContact: 'email',
        bestTimeToCall: 'morning',
        newsletter: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md mx-4"
                >
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
                    <p className="text-gray-600 mb-8">
                        Your message has been sent successfully. Our team will get back to you within 24 hours.
                    </p>
                    <div className="space-y-3">
                        <Button onClick={() => setIsSubmitted(false)} className="w-full">
                            Send Another Message
                        </Button>
                        <Link href="/">
                            <Button variant="outline" className="w-full">
                                Return to Home
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors w-fit">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-emerald-600 rounded-2xl p-8 text-white h-fit">
                            <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
                            <p className="text-emerald-100 mb-8">
                                Ready to find your dream home? Our expert team is here to help you navigate Canada&apos;s real estate market.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Phone</h3>
                                        <p className="text-emerald-100">+1 (416) 555-0123</p>
                                        <p className="text-emerald-100">+1 (604) 555-0456</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p className="text-emerald-100">info@maplenest.ca</p>
                                        <p className="text-emerald-100">support@maplenest.ca</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Offices</h3>
                                        <p className="text-emerald-100 mb-2">
                                            Toronto: 123 Bay Street<br />
                                            Toronto, ON M5K 1A1
                                        </p>
                                        <p className="text-emerald-100">
                                            Vancouver: 456 Robson Street<br />
                                            Vancouver, BC V6B 2B5
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Business Hours</h3>
                                        <p className="text-emerald-100">
                                            Monday - Friday: 8:00 AM - 8:00 PM<br />
                                            Saturday: 9:00 AM - 6:00 PM<br />
                                            Sunday: 10:00 AM - 4:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="mt-8 pt-8 border-t border-emerald-500">
                                <h3 className="font-semibold mb-4">Follow Us</h3>
                                <div className="flex gap-3">
                                    {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                                        <button
                                            key={social}
                                            className="w-10 h-10 bg-emerald-500 hover:bg-emerald-400 rounded-lg flex items-center justify-center transition-colors"
                                        >
                                            <span className="text-xs font-bold">{social.charAt(0)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
                                <p className="text-gray-600">
                                    Fill out the form below and we&apos;ll get back to you as soon as possible.
                                    Let us help you find your perfect Canadian home.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="John"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="+1 (416) 555-0123"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Inquiry Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Inquiry Type *
                                        </label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <select
                                                name="inquiryType"
                                                value={formData.inquiryType}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                                            >
                                                <option value="general">General Inquiry</option>
                                                <option value="buying">Buying Property</option>
                                                <option value="selling">Selling Property</option>
                                                <option value="renting">Renting Property</option>
                                                <option value="valuation">Property Valuation</option>
                                                <option value="investment">Investment Opportunity</option>
                                                <option value="mortgage">Mortgage Assistance</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Property Type
                                        </label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <select
                                                name="propertyType"
                                                value={formData.propertyType}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                                            >
                                                <option value="">Select Property Type</option>
                                                <option value="house">House</option>
                                                <option value="condo">Condo/Apartment</option>
                                                <option value="townhouse">Townhouse</option>
                                                <option value="commercial">Commercial</option>
                                                <option value="land">Land/Lot</option>
                                                <option value="investment">Investment Property</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Budget Range (CAD)
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <select
                                                name="budget"
                                                value={formData.budget}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                                            >
                                                <option value="">Select Budget Range</option>
                                                <option value="under-300k">Under $300K</option>
                                                <option value="300k-500k">$300K - $500K</option>
                                                <option value="500k-750k">$500K - $750K</option>
                                                <option value="750k-1m">$750K - $1M</option>
                                                <option value="1m-1.5m">$1M - $1.5M</option>
                                                <option value="1.5m-2m">$1.5M - $2M</option>
                                                <option value="over-2m">Over $2M</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Location
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="Toronto, Vancouver, Montreal..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-vertical"
                                        placeholder="Tell us about your real estate needs, questions, or how we can help you..."
                                    ></textarea>
                                </div>

                                {/* Contact Preferences */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Contact Method
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="preferredContact"
                                                    value="email"
                                                    checked={formData.preferredContact === 'email'}
                                                    onChange={handleInputChange}
                                                    className="mr-2 text-emerald-600"
                                                />
                                                Email
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="preferredContact"
                                                    value="phone"
                                                    checked={formData.preferredContact === 'phone'}
                                                    onChange={handleInputChange}
                                                    className="mr-2 text-emerald-600"
                                                />
                                                Phone Call
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="preferredContact"
                                                    value="text"
                                                    checked={formData.preferredContact === 'text'}
                                                    onChange={handleInputChange}
                                                    className="mr-2 text-emerald-600"
                                                />
                                                Text Message
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Best Time to Call
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <select
                                                name="bestTimeToCall"
                                                value={formData.bestTimeToCall}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none"
                                            >
                                                <option value="morning">Morning (8 AM - 12 PM)</option>
                                                <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                                                <option value="evening">Evening (5 PM - 8 PM)</option>
                                                <option value="anytime">Anytime</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Newsletter */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="newsletter"
                                        checked={formData.newsletter}
                                        onChange={handleInputChange}
                                        className="mr-3 h-4 w-4 text-emerald-600 rounded"
                                    />
                                    <label className="text-sm text-gray-700">
                                        Subscribe to our newsletter for market updates and new listings
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 text-lg font-semibold flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Sending Message...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>

                {/* Map Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-20 bg-white rounded-2xl shadow-xl overflow-hidden max-w-7xl mx-auto"
                >
                    <div className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Locations</h3>
                        <p className="text-gray-600 mb-8">
                            Visit our offices in Toronto and Vancouver, or connect with us virtually from anywhere in Canada.
                        </p>
                    </div>

                    {/* Mock Map */}
                    <div className="h-96 bg-gradient-to-br from-emerald-100 to-cyan-100 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                                <p className="text-gray-600">Interactive map would be displayed here</p>
                                <p className="text-sm text-gray-500">Toronto & Vancouver office locations</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}