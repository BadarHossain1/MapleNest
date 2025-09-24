'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1100));
        setLoading(false);
        alert('Account created (demo)');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-emerald-50 py-12">
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                <div className="hidden md:flex flex-col justify-center items-start p-6">
                    <h2 className="text-3xl font-extrabold text-emerald-600">Create your account</h2>
                    <p className="mt-4 text-gray-600">Get personalized alerts, save favourites and manage listings you care about.</p>
                    <div className="mt-6 w-full">
                        <img src="/signup-illustration.svg" alt="illustration" className="w-full opacity-90" />
                    </div>
                </div>

                <div className="p-2">
                    <div className="text-center md:text-left mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">Sign up</h3>
                        <p className="text-sm text-gray-500">Start your journey with MapleNest — it's quick and easy.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Full name</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-200 p-2 focus:ring-2 focus:ring-emerald-200" />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 block w-full rounded-md border-gray-200 p-2 focus:ring-2 focus:ring-emerald-200" />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-1 block w-full rounded-md border-gray-200 p-2 focus:ring-2 focus:ring-emerald-200" />
                        </div>

                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="agree" className="h-4 w-4" required />
                            <label htmlFor="agree" className="text-sm text-gray-600">I agree to the Terms and Privacy Policy</label>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</Button>
                    </form>

                    <div className="mt-6 text-sm text-gray-600">
                        Already have an account? <Link href="/login" className="text-emerald-600 font-medium hover:underline">Log in</Link>
                    </div>

                    <div className="mt-4">
                        <Link href="/" className="text-sm text-gray-500 hover:underline">Back to home</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
