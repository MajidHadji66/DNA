"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Shield, Calendar, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 relative">
                        <div className="absolute -bottom-12 left-8">
                            <div className="bg-white p-1 rounded-full">
                                <div className="bg-gray-100 rounded-full p-4 border-4 border-white">
                                    <User size={48} className="text-gray-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 pb-8 px-8">
                        <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
                        <p className="text-gray-500 mt-1">{user.role}</p>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                                <Shield className="text-blue-600 mt-1" size={24} />
                                <div>
                                    <h3 className="font-semibold text-blue-900">Account Status</h3>
                                    <p className="text-blue-700 text-sm mt-1">Active & Verified Researcher</p>
                                </div>
                            </div>

                            <div className="bg-indigo-50 p-4 rounded-xl flex items-start gap-3">
                                <Calendar className="text-indigo-600 mt-1" size={24} />
                                <div>
                                    <h3 className="font-semibold text-indigo-900">Member Since</h3>
                                    <p className="text-indigo-700 text-sm mt-1">
                                        {new Date(user.joined).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-100 pt-8">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 text-sm text-gray-600">
                                    <span>Usage Quota</span>
                                    <span className="font-medium">Unlimited</span>
                                </div>
                                <div className="flex justify-between items-center py-2 text-sm text-gray-600">
                                    <span>API Access</span>
                                    <span className="font-medium text-green-600">Enabled</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
