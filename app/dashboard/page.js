"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        const response = await fetch(`/api/users/${currentUser.uid}`);
        const data = await response.json();
        
        if (data.success) {
          setUserData(data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Welcome, {currentUser?.displayName || userData?.displayName || "User"}!</h2>
                    <p className="text-gray-600">This is your personal dashboard.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-md">
                      <h3 className="font-medium text-indigo-800">Profile</h3>
                      <p className="text-sm text-indigo-600">View and edit your profile information</p>
                      <a href="/profile" className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-500">
                        Go to profile →
                      </a>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-md">
                      <h3 className="font-medium text-purple-800">Settings</h3>
                      <p className="text-sm text-purple-600">Configure your account settings</p>
                      <a href="#" className="mt-2 inline-block text-sm text-purple-600 hover:text-purple-500">
                        Go to settings →
                      </a>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-md">
                      <h3 className="font-medium text-blue-800">Orders</h3>
                      <p className="text-sm text-blue-600">View your order history</p>
                      <a href="#" className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-500">
                        View orders →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 