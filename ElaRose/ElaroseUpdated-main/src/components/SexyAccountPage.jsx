"use client"

import React, { useState, useEffect } from 'react';
import {
  User, Package, Settings, LogOut, Edit, Camera, Save, X, MapPin, Phone, Mail,
  CheckCircle, Clock, AlertCircle, Truck, Heart, Star, Crown, Sparkles,
  Shield, Gift, Zap, TrendingUp, Eye, MessageCircle, Bell, CreditCard,
  Calendar, Award, Target, Palette
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import CustomerSupportModal from '@/components/ui/customer-support-modal';

export default function SexyAccountPage() {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { getUserOrders, loading: ordersLoading } = useOrders();

  // State management
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [animatingCard, setAnimatingCard] = useState(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    username: '',
    phone: '',
    location: '',
    country: ''
  });

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    darkMode: false,
    language: 'English'
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Support modal state
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportOrder, setSupportOrder] = useState(null);

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!clerkUser?.id) return;

      try {
        setLoading(true);

        // First, set data from Clerk metadata as fallback
        const clerkMetadata = clerkUser.unsafeMetadata || {};
        const fallbackUser = {
          id: clerkUser.id,
          fullName: clerkMetadata.fullName || (clerkUser?.firstName && clerkUser?.lastName ? `${clerkUser.firstName} ${clerkUser.lastName}` : '') || '',
          email: clerkUser?.emailAddresses?.[0]?.emailAddress || '',
          username: clerkMetadata.username || clerkUser?.username || '',
          phone: clerkMetadata.phone || clerkUser?.phoneNumbers?.[0]?.phoneNumber || '',
          location: clerkMetadata.location || '',
          country: clerkMetadata.country || '',
          profileImage: clerkMetadata.profileImage || clerkUser?.imageUrl || '',
          isEmailVerified: clerkUser?.emailAddresses?.[0]?.verification?.status === 'verified',
          memberSince: clerkUser?.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString() : 'Unknown',
          totalOrders: 0,
          loyaltyPoints: 150,
          favoriteCategories: ['Dresses', 'Accessories'],
          recentActivity: []
        };

        // Set fallback data immediately
        setUserData(fallbackUser);
        setProfileForm({
          fullName: fallbackUser.fullName,
          username: fallbackUser.username,
          phone: fallbackUser.phone,
          location: fallbackUser.location,
          country: fallbackUser.country
        });

        // Try to fetch from database (optional)
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const response = await fetch(`${apiUrl}/api/users`);

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              const dbUser = result.data.find(u => u.id === clerkUser.id);
              if (dbUser) {
                console.log('Found user in database, updating with DB data');
                setUserData({ ...fallbackUser, ...dbUser });
                setProfileForm({
                  fullName: dbUser.fullName || fallbackUser.fullName,
                  username: dbUser.username || fallbackUser.username,
                  phone: dbUser.phone || fallbackUser.phone,
                  location: dbUser.location || fallbackUser.location,
                  country: dbUser.country || fallbackUser.country
                });
              }
            }
          }
        } catch (dbError) {
          console.log('Database not available, using Clerk metadata:', dbError.message);
        }

      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && clerkUser) {
      fetchUserData();
    }
  }, [clerkUser, isLoaded]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!clerkUser?.emailAddresses?.[0]?.emailAddress) return;

      const userEmail = clerkUser.emailAddresses[0].emailAddress;
      const result = await getUserOrders(userEmail);

      if (result.success) {
        setOrders(result.data || []);
        // Update total orders count
        setUserData(prev => prev ? { ...prev, totalOrders: result.data?.length || 0 } : null);
      } else {
        console.error('Error fetching orders:', result.error);
      }
    };

    if (isLoaded && clerkUser) {
      fetchOrders();
    }
  }, [clerkUser, isLoaded, getUserOrders]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Update Clerk metadata
      if (clerkUser) {
        await clerkUser.update({
          unsafeMetadata: {
            ...clerkUser.unsafeMetadata,
            ...profileForm
          }
        });
      }

      // Update local state
      setUserData(prev => ({ ...prev, ...profileForm }));
      setEditingProfile(false);

      // Show success animation
      setAnimatingCard('profile');
      setTimeout(() => setAnimatingCard(null), 1000);

    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !clerkUser) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Update profile image via Clerk
      await clerkUser.setProfileImage({ file });

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Error uploading image:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      color: '#f2c9c7',
      description: 'Manage your personal information'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      color: '#e8b4b1',
      description: 'Track your order history'
    },
    // { 
    //   id: 'settings', 
    //   label: 'Settings', 
    //   icon: Settings, 
    //   color: '#d4a4a1',
    //   description: 'Customize your preferences'
    // },
    // { 
    //   id: 'rewards', 
    //   label: 'Rewards', 
    //   icon: Gift, 
    //   color: '#f2c9c7',
    //   description: 'Your loyalty points & rewards'
    // }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[#f2c9c7]/10 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f2c9c7]/5 to-transparent animate-shimmer opacity-30"></div>
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#f2c9c7]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#f2c9c7]/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-4 py-12">
          {/* Header Skeleton */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="w-32 h-32 bg-gradient-to-br from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full mx-auto mb-6 loading-shimmer"></div>
            <div className="h-8 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-64 mx-auto mb-4 loading-shimmer"></div>
            <div className="h-5 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-48 mx-auto loading-shimmer"></div>
          </div>

          {/* Tabs Skeleton */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-2 p-2 card-sexy rounded-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 w-24 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full loading-shimmer"></div>
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-sexy p-8 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="h-6 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-3/4 mb-4 loading-shimmer"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full loading-shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-5/6 loading-shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-4/6 loading-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#f2c9c7]/10 to-white">
        <div className="text-center card-sexy p-12 max-w-lg animate-fade-in-up">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-[#c66074] mb-4">Profile Unavailable</h2>
          <p className="text-gray-600 mb-8">We couldn't load your profile information.</p>
          <Button onClick={() => window.location.reload()} className="btn-sexy hover-glow">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Image & Basic Info */}
            <div className={`card-sexy p-8 animate-fade-in-up ${animatingCard === 'profile' ? 'animate-pulse-glow' : ''}`}>
              <h3 className="text-2xl font-bold text-[#c66074] mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-[#f2c9c7]" />
                Profile Information
              </h3>

              {/* Profile Image Upload */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#f2c9c7] to-[#e8b4b1] p-1 animate-pulse-glow">
                    <img
                      src={userData.profileImage || '/default-avatar.png'}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover bg-white"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>

                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#f2c9c7] to-[#e8b4b1] rounded-full flex items-center justify-center cursor-pointer hover-lift shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="text-white text-sm font-semibold">{uploadProgress}%</div>
                    </div>
                  )}
                </div>

                <h4 className="text-xl font-bold text-gray-800 mt-4">{userData.fullName}</h4>
                <p className="text-gray-600 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  {userData.email}
                  {userData.isEmailVerified && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </p>

                {/* Member Stats */}
                <div className="flex justify-center gap-6 mt-6">
                  <div className="text-center glass-morphism rounded-2xl p-4">
                    <Award className="w-6 h-6 text-[#f2c9c7] mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-800">{userData.totalOrders}</div>
                    <div className="text-sm text-gray-600">Orders</div>
                  </div>
                  {/* <div className="text-center glass-morphism rounded-2xl p-4">
                    <Star className="w-6 h-6 text-[#f2c9c7] mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-800">{userData.loyaltyPoints}</div>
                    <div className="text-sm text-gray-600">Points</div>
                  </div> */}
                  <div className="text-center glass-morphism rounded-2xl p-4">
                    <Calendar className="w-6 h-6 text-[#f2c9c7] mx-auto mb-2" />
                    <div className="text-lg font-bold text-gray-800">{userData.memberSince}</div>
                    <div className="text-sm text-gray-600">Member</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Profile Form */}
            <div className="card-sexy p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#c66074] flex items-center gap-3">
                  <Edit className="w-6 h-6 text-[#f2c9c7]" />
                  Personal Details
                </h3>

                <Button
                  onClick={() => editingProfile ? handleSaveProfile() : setEditingProfile(true)}
                  className={`btn-sexy hover-glow ${editingProfile ? 'bg-green-500 hover:bg-green-600' : ''}`}
                  disabled={saving}
                >
                  {saving ? (
                    <>Saving...</>
                  ) : editingProfile ? (
                    <><Save className="w-4 h-4 mr-2" /> Save</>
                  ) : (
                    <><Edit className="w-4 h-4 mr-2" /> Edit</>
                  )}
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="fullName" className="text-gray-700 font-semibold">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    disabled={!editingProfile}
                    className="glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="username" className="text-gray-700 font-semibold">Username</Label>
                  <Input
                    id="username"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    disabled={!editingProfile}
                    className="glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-semibold">Phone Number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f2c9c7]" />
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      disabled={!editingProfile}
                      className="glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl pl-11"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-700 font-semibold">Location</Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#f2c9c7]" />
                    <Input
                      id="location"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      disabled={!editingProfile}
                      className="glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl pl-11"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="country" className="text-gray-700 font-semibold">Country</Label>
                  <Input
                    id="country"
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                    disabled={!editingProfile}
                    className="glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl mt-2"
                  />
                </div>
              </div>

              {editingProfile && (
                <div className="flex gap-3 mt-8">
                  <Button
                    onClick={() => setEditingProfile(false)}
                    variant="outline"
                    className="flex-1 glass-morphism hover-glow rounded-xl"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex-1 btn-sexy hover-glow"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-8">
            <div className="text-center animate-fade-in-up">
              <h3 className="text-3xl font-bold text-[#c66074] mb-4 flex items-center justify-center gap-3">
                <Package className="w-8 h-8 text-[#f2c9c7]" />
                Your Orders
              </h3>
              <p className="text-gray-600">Track and manage your order history</p>
            </div>

            {ordersLoading ? (
              <div className="grid gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card-sexy p-6 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="h-6 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-1/3 mb-4 loading-shimmer"></div>
                    <div className="h-4 bg-gradient-to-r from-[#f2c9c7]/20 to-[#f2c9c7]/40 rounded-full w-2/3 loading-shimmer"></div>
                  </div>
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="grid gap-6">
                {orders.map((order, index) => (
                  <div key={order._id} className="card-sexy p-6 hover-lift animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">Order #{order._id.slice(-6)}</h4>
                        <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#f2c9c7]">৳{(order.totalAmount ?? getOrderItemsTotal(order)).toFixed ? (order.totalAmount ?? getOrderItemsTotal(order)).toFixed(2) : (order.totalAmount ?? getOrderItemsTotal(order))}</p>
                        <Badge className={`${getOrderStatusColor(order.status)} text-white`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-gray-600">{order.items?.length || 0} items</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-morphism hover-glow rounded-xl"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-morphism hover-glow rounded-xl bg-gradient-to-r from-[#f2c9c7]/10 to-[#e8b4b1]/10 border-[#f2c9c7]/30 hover:border-[#f2c9c7] text-[#8B5446] hover:text-[#f2c9c7]"
                          onClick={() => {
                            setSupportOrder(order);
                            setShowSupportModal(true);
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message Support
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-fade-in-up">
                <div className="card-sexy p-12 max-w-lg mx-auto">
                  <Package className="w-16 h-16 text-[#f2c9c7] mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-[#c66074] mb-4">No Orders Yet</h3>
                  <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
                  <Button className="btn-sexy hover-glow" onClick={() => window.location.href = '/'}>
                    Start Shopping
                  </Button>
                </div>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card-sexy p-8 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-[#c66074] mb-6 flex items-center gap-3">
                <Bell className="w-6 h-6 text-[#f2c9c7]" />
                Notifications
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between glass-morphism rounded-2xl p-4">
                  <div>
                    <p className="font-semibold text-gray-800">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive order updates via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between glass-morphism rounded-2xl p-4">
                  <div>
                    <p className="font-semibold text-gray-800">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Get text alerts for shipping updates</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between glass-morphism rounded-2xl p-4">
                  <div>
                    <p className="font-semibold text-gray-800">Marketing Emails</p>
                    <p className="text-sm text-gray-600">Receive promotions and deals</p>
                  </div>
                  <Switch
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="card-sexy p-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-2xl font-bold text-[#c66074] mb-6 flex items-center gap-3">
                <Palette className="w-6 h-6 text-[#f2c9c7]" />
                Preferences
              </h3>

              <div className="space-y-6">
                <div className="glass-morphism rounded-2xl p-4">
                  <Label className="font-semibold text-gray-800 mb-3 block">Language</Label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="w-full glass-morphism border-[#f2c9c7]/30 focus:border-[#f2c9c7] rounded-xl p-3"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Español</option>
                    <option value="French">Français</option>
                    <option value="German">Deutsch</option>
                  </select>
                </div>

                <div className="flex items-center justify-between glass-morphism rounded-2xl p-4">
                  <div>
                    <p className="font-semibold text-gray-800">Dark Mode</p>
                    <p className="text-sm text-gray-600">Switch to dark theme</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'rewards':
        return (
          <div className="space-y-8">
            <div className="text-center animate-fade-in-up">
              <h3 className="text-3xl font-bold text-[#c66074] mb-4 flex items-center justify-center gap-3">
                <Crown className="w-8 h-8 text-[#f2c9c7]" />
                Loyalty Rewards
              </h3>
              <p className="text-gray-600">Earn points with every purchase and unlock exclusive benefits</p>
            </div>

            {/* Points Balance */}
            <div className="card-sexy p-8 text-center animate-fade-in-up">
              <div className="w-24 h-24 bg-gradient-to-br from-[#f2c9c7] to-[#e8b4b1] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h4 className="text-4xl font-bold text-[#c66074] mb-2">{userData.loyaltyPoints}</h4>
              <p className="text-gray-600 mb-6">Loyalty Points Available</p>

              <div className="grid grid-cols-3 gap-6">
                <div className="text-center glass-morphism rounded-2xl p-4">
                  <TrendingUp className="w-6 h-6 text-[#f2c9c7] mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">+{userData.totalOrders * 10}</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>
                <div className="text-center glass-morphism rounded-2xl p-4">
                  <Target className="w-6 h-6 text-[#f2c9c7] mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">Gold</div>
                  <div className="text-sm text-gray-600">Current Tier</div>
                </div>
                <div className="text-center glass-morphism rounded-2xl p-4">
                  <Gift className="w-6 h-6 text-[#f2c9c7] mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">50</div>
                  <div className="text-sm text-gray-600">Next Reward</div>
                </div>
              </div>
            </div>

            {/* Available Rewards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-sexy p-6 hover-lift animate-fade-in-up">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Free Shipping</h4>
                    <p className="text-gray-600">50 points</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Get free shipping on your next order</p>
                <Button className="w-full btn-sexy hover-glow" disabled={userData.loyaltyPoints < 50}>
                  Redeem
                </Button>
              </div>

              <div className="card-sexy p-6 hover-lift animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">10% Discount</h4>
                    <p className="text-gray-600">100 points</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Get 10% off your entire purchase</p>
                <Button className="w-full btn-sexy hover-glow" disabled={userData.loyaltyPoints < 100}>
                  Redeem
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Sum up the line item totals for an order (price * quantity)
  const getOrderItemsTotal = (order) => {
    if (!order || !order.items) return 0;
    return order.items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.quantity) || 0;
      return sum + price * qty;
    }, 0);
  };

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
            <Crown className="w-12 h-12 text-[#f2c9c7] animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-[#c66074]">My Account</h1>
            <Sparkles className="w-8 h-8 text-[#f2c9c7] animate-pulse" />
          </div>
          <p className="text-muted-foreground text-lg">Manage your profile, orders, and preferences</p>
        </div>

        {/* Sexy Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-2 p-2 card-sexy rounded-full animate-fade-in-up">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isHovered = hoveredTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover-lift ${isActive
                    ? 'bg-gradient-to-r from-[#f2c9c7] to-[#e8b4b1] text-white shadow-lg animate-pulse-glow scale-105'
                    : 'glass-morphism hover-glow hover:scale-105'
                    }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-white' : isHovered ? 'scale-110' : ''
                    }`} style={{ color: !isActive && isHovered ? tab.color : undefined }} />

                  <span className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-700'
                    }`}>
                    {tab.label}
                  </span>

                  {isActive && (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="relative">
          {renderTabContent()}
        </div>

        {/* Sign Out Button */}
        <div className="text-center mt-16 animate-fade-in-up">
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="glass-morphism hover-glow group rounded-2xl px-8 py-3"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="card-sexy max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#c66074]">Order Details</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrder(null);
                }}
                className="glass-morphism hover-glow rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-8">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-[#8B5446]">Order ID</Label>
                  <p className="font-mono text-lg mt-1">{selectedOrder._id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#8B5446]">Date</Label>
                  <p className="text-lg mt-1">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#8B5446]">Status</Label>
                  <Badge className={`${getOrderStatusColor(selectedOrder.status)} text-white mt-2`}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#8B5446]">Total</Label>
                  <p className="text-2xl font-bold text-[#c66074] mt-1">৳{(selectedOrder.totalAmount ?? getOrderItemsTotal(selectedOrder)).toFixed(2)}</p>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="text-xl font-bold text-[#8B5446] mb-6">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-6 p-6 glass-morphism rounded-xl">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={item.productImage || item.image || '/placeholder-product.jpg'}
                          alt={item.name || 'Product'}
                          className="w-full h-full object-cover rounded-lg border-2 border-[#f2c9c7]/20"
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#8B5446] text-lg mb-2">{item.name}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {item.size && <p>Size: <span className="font-medium">{item.size}</span></p>}
                          {item.color && <p>Color: <span className="font-medium">{item.colorName || item.color}</span></p>}
                          <p>Quantity: <span className="font-medium">{item.quantity}</span></p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-xl text-[#f2c9c7] mb-1">৳{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">৳{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Shipping Info */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="text-xl font-bold text-[#8B5446] mb-6">Shipping Address</h3>
                  <div className="glass-morphism p-6 rounded-xl">
                    <p className="font-semibold text-lg mb-2">{selectedOrder.shippingAddress.fullName}</p>
                    <div className="space-y-1 text-gray-700">
                      <p>{selectedOrder.shippingAddress.streetAddress}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                      {selectedOrder.shippingAddress.phone && (
                        <p className="mt-3 text-sm text-gray-600">Phone: <span className="font-medium">{selectedOrder.shippingAddress.phone}</span></p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customer Support Modal */}
      <CustomerSupportModal
        isOpen={showSupportModal}
        onClose={() => {
          setShowSupportModal(false);
          setSupportOrder(null);
        }}
        order={supportOrder}
        user={userData}
      />
    </div>
  );
}