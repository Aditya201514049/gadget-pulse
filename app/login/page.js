"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Login() {
  const [error, setError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const { currentUser, signInWithGoogle } = useAuth();

  // Use useEffect for navigation instead of in the render function
  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setGoogleLoading(true);
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.");
      console.error(error);
    }
    
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex flex-col items-center justify-center p-4">
      {/* Top decorative element */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-500 to-purple-500 transform -skew-y-3"></div>
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden z-10">
        {/* Card header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white text-center">
          <h1 className="text-2xl font-bold">Gadget Pulse</h1>
        </div>
        
        <div className="p-8">
          {/* Avatar */}
          <div className="flex justify-center -mt-12 mb-5">
            <div className="rounded-full bg-white p-2 shadow-lg">
              <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 w-20 h-20 flex items-center justify-center text-white text-2xl font-bold">
                GP
              </div>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">BETA</div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-600 mt-1">Sign in to continue to your account</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-md">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleGoogleSignIn} 
            disabled={googleLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            {googleLoading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              <>
                <svg
                  className="h-5 w-5 mr-2"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>
          
          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <div className="px-4 text-gray-500 text-sm font-medium">Quick Access</div>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="group">
              <Link href="/favorites" className="block">
                <div className="bg-blue-50 group-hover:bg-blue-100 rounded-xl p-4 flex flex-col items-center transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="mt-2 text-sm font-medium text-gray-700">Favorites</span>
                </div>
              </Link>
            </div>
            <div className="group">
              <Link href="/orders" className="block">
                <div className="bg-purple-50 group-hover:bg-purple-100 rounded-xl p-4 flex flex-col items-center transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="mt-2 text-sm font-medium text-gray-700">Orders</span>
                </div>
              </Link>
            </div>
            <div className="group">
              <Link href="/settings" className="block">
                <div className="bg-indigo-50 group-hover:bg-indigo-100 rounded-xl p-4 flex flex-col items-center transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="mt-2 text-sm font-medium text-gray-700">Settings</span>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/support" className="text-blue-500 hover:text-blue-700 font-medium transition-colors">Support</Link>
            <span className="text-gray-300">|</span>
            <Link href="/about" className="text-blue-500 hover:text-blue-700 font-medium transition-colors">About</Link>
            <span className="text-gray-300">|</span>
            <Link href="/theme" className="text-blue-500 hover:text-blue-700 font-medium transition-colors">Theme</Link>
          </div>
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2023 Gadget Pulse. All rights reserved.</p>
      </footer>
    </div>
  );
} 