"use client"

import { useState, useEffect, createContext, useContext } from 'react';
import { useUser } from '@clerk/nextjs';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { user: clerkUser, isLoaded } = useUser();

    // Fetch user data from MongoDB using Clerk session
    useEffect(() => {
        const fetchUserFromMongoDB = async () => {
            if (!isLoaded) {
                return; // Wait for Clerk to load
            }

            if (!clerkUser) {
                // User is not logged in via Clerk
                setUser(null);
                setIsLoading(false);
                return;
            }

            // Get email from Clerk user
            const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;
            if (!userEmail) {
                console.error('No email found in Clerk user');
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                console.log('Fetching user from MongoDB with email:', userEmail);

                // Fetch user data from MongoDB using environment variable
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await fetch(`${apiUrl}/api/users/email/${encodeURIComponent(userEmail)}`);

                console.log('Response status:', response.status);

                if (response.ok) {
                    const result = await response.json();
                    console.log('MongoDB response:', result);

                    if (result.success && result.data) {
                        const mongoUser = result.data;
                        console.log('Setting user with role:', mongoUser.role);
                        setUser({
                            fullName: mongoUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}`,
                            email: mongoUser.email,
                            phone: mongoUser.phone || clerkUser.phoneNumbers[0]?.phoneNumber || '',
                            location: mongoUser.location || '',
                            country: mongoUser.country || '',
                            role: mongoUser.role, // This is the key field from MongoDB
                            isLoggedIn: true,
                            id: clerkUser.id,
                            firstName: clerkUser.firstName,
                            lastName: clerkUser.lastName,
                            imageUrl: clerkUser.imageUrl
                        });
                    } else {
                        console.error('Failed to fetch user from MongoDB:', result.message);
                        setUser(null);
                    }
                } else if (response.status === 404) {
                    // User not found in MongoDB, create them from Clerk data
                    console.log('User not found in MongoDB, creating from Clerk data...');

                    const createResponse = await fetch(`${apiUrl}/api/users/clerk-auth`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: userEmail,
                            firstName: clerkUser.firstName,
                            lastName: clerkUser.lastName,
                            phone: clerkUser.phoneNumbers[0]?.phoneNumber || '',
                            imageUrl: clerkUser.imageUrl,
                            clerkId: clerkUser.id
                        })
                    });

                    if (createResponse.ok) {
                        const createResult = await createResponse.json();
                        console.log('User created successfully:', createResult);

                        if (createResult.success && createResult.data) {
                            const mongoUser = createResult.data;
                            setUser({
                                fullName: mongoUser.fullName || `${clerkUser.firstName} ${clerkUser.lastName}`,
                                email: mongoUser.email,
                                phone: mongoUser.phone || clerkUser.phoneNumbers[0]?.phoneNumber || '',
                                location: mongoUser.location || '',
                                country: mongoUser.country || '',
                                role: mongoUser.role,
                                isLoggedIn: true,
                                id: clerkUser.id,
                                firstName: clerkUser.firstName,
                                lastName: clerkUser.lastName,
                                imageUrl: clerkUser.imageUrl
                            });
                        } else {
                            throw new Error(createResult.message || 'Failed to create user');
                        }
                    } else {
                        throw new Error('Failed to create user account');
                    }
                } else {
                    const errorText = await response.text();
                    console.error('Failed to fetch user from MongoDB. Status:', response.status, 'Error:', errorText);
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user from MongoDB:', error);
                console.error('This might be a network issue or the backend server is not running');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserFromMongoDB();
    }, [clerkUser, isLoaded]);

    const login = (userData) => {
        // This function is now mainly for manual override, 
        // normal login happens automatically via Clerk session
        const userWithLoginStatus = { ...userData, isLoggedIn: true };
        setUser(userWithLoginStatus);
    };

    const logout = () => {
        setUser(null);
        // Don't clear localStorage since we're using Clerk session
        // Clerk logout should be handled separately
    };

    const updateUser = (updates) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
        }
    };

    const isLoggedIn = user?.isLoggedIn || false;

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}