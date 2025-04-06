"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function Settings() {
  const { currentUser } = useAuth();
  const [saved, setSaved] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: {
      showProfile: true,
      shareActivity: false
    },
    theme: "light",
    language: "english"
  });

  const handleNotificationChange = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
    setSaved(false);
  };

  const handlePrivacyChange = (type) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [type]: !prev.privacy[type]
      }
    }));
    setSaved(false);
  };

  const handleThemeChange = (e) => {
    setSettings(prev => ({
      ...prev,
      theme: e.target.value
    }));
    setSaved(false);
  };

  const handleLanguageChange = (e) => {
    setSettings(prev => ({
      ...prev,
      language: e.target.value
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // This would normally save settings to an API
    console.log("Saving settings:", settings);
    setSaved(true);
    
    // Clear saved message after 3 seconds
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                
                <button
                  onClick={handleSave}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save Changes
                </button>
              </div>
              
              {saved && (
                <div className="mb-6 bg-green-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Settings saved successfully!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-8">
                {/* Notifications Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive order updates and promotions via email</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('email')}
                        className={`${
                          settings.notifications.email ? 'bg-indigo-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                      >
                        <span className="sr-only">Email notifications</span>
                        <span
                          aria-hidden="true"
                          className={`${
                            settings.notifications.email ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                        <p className="text-sm text-gray-500">Receive real-time updates on your device</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('push')}
                        className={`${
                          settings.notifications.push ? 'bg-indigo-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                      >
                        <span className="sr-only">Push notifications</span>
                        <span
                          aria-hidden="true"
                          className={`${
                            settings.notifications.push ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                        <p className="text-sm text-gray-500">Receive order updates via text message</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleNotificationChange('sms')}
                        className={`${
                          settings.notifications.sms ? 'bg-indigo-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                      >
                        <span className="sr-only">SMS notifications</span>
                        <span
                          aria-hidden="true"
                          className={`${
                            settings.notifications.sms ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Privacy Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Show Profile</h3>
                        <p className="text-sm text-gray-500">Allow other users to view your profile</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePrivacyChange('showProfile')}
                        className={`${
                          settings.privacy.showProfile ? 'bg-indigo-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                      >
                        <span className="sr-only">Show profile</span>
                        <span
                          aria-hidden="true"
                          className={`${
                            settings.privacy.showProfile ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Share Activity</h3>
                        <p className="text-sm text-gray-500">Share your shopping and review activity</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePrivacyChange('shareActivity')}
                        className={`${
                          settings.privacy.shareActivity ? 'bg-indigo-600' : 'bg-gray-200'
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                      >
                        <span className="sr-only">Share activity</span>
                        <span
                          aria-hidden="true"
                          className={`${
                            settings.privacy.shareActivity ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Preferences Section */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="theme" className="block text-sm font-medium text-gray-700">Theme</label>
                      <select
                        id="theme"
                        name="theme"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={settings.theme}
                        onChange={handleThemeChange}
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System Default</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                      <select
                        id="language"
                        name="language"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={settings.language}
                        onChange={handleLanguageChange}
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                        <option value="japanese">Japanese</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 