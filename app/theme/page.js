"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function Theme() {
  const { currentUser } = useAuth();
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [saved, setSaved] = useState(false);

  // This would normally load the user's theme preference from storage or API
  useEffect(() => {
    // For now, we'll just check for system preference or default to light
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light';
      setSelectedTheme(savedTheme);
      
      // Apply the theme to the HTML element
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const themes = [
    {
      id: "light",
      name: "Light",
      description: "Clean and bright interface with light backgrounds and dark text.",
      colors: [
        { name: "Background", color: "#ffffff" },
        { name: "Text", color: "#1F2937" },
        { name: "Primary", color: "#3B82F6" },
        { name: "Secondary", color: "#8B5CF6" }
      ]
    },
    {
      id: "dark",
      name: "Dark",
      description: "Dark interface with light text, easy on the eyes in low-light environments.",
      colors: [
        { name: "Background", color: "#1F2937" },
        { name: "Text", color: "#F9FAFB" },
        { name: "Primary", color: "#60A5FA" },
        { name: "Secondary", color: "#A78BFA" }
      ]
    },
    {
      id: "sunset",
      name: "Sunset",
      description: "Warm color palette inspired by evening sunsets.",
      colors: [
        { name: "Background", color: "#F8FAFC" },
        { name: "Text", color: "#334155" },
        { name: "Primary", color: "#F59E0B" },
        { name: "Secondary", color: "#DB2777" }
      ]
    },
    {
      id: "forest",
      name: "Forest",
      description: "Nature-inspired green theme with earth tones.",
      colors: [
        { name: "Background", color: "#F5F7F5" },
        { name: "Text", color: "#2D3B2D" },
        { name: "Primary", color: "#059669" },
        { name: "Secondary", color: "#65A30D" }
      ]
    },
    {
      id: "ocean",
      name: "Ocean",
      description: "Peaceful blue tones inspired by ocean depths.",
      colors: [
        { name: "Background", color: "#F5F9FF" },
        { name: "Text", color: "#1E3A5F" },
        { name: "Primary", color: "#0369A1" },
        { name: "Secondary", color: "#14B8A6" }
      ]
    },
    {
      id: "lavender",
      name: "Lavender",
      description: "Soothing purple and lavender accents.",
      colors: [
        { name: "Background", color: "#FAF5FF" },
        { name: "Text", color: "#4B2E83" },
        { name: "Primary", color: "#8B5CF6" },
        { name: "Secondary", color: "#EC4899" }
      ]
    }
  ];

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    setSaved(false);
    
    // Preview the theme immediately
    document.documentElement.setAttribute('data-theme', themeId);
  };

  const saveThemePreference = () => {
    // This would normally save to an API or user preferences
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', selectedTheme);
    }
    
    // Apply the theme
    document.documentElement.setAttribute('data-theme', selectedTheme);
    
    // Show saved confirmation
    setSaved(true);
    
    // Hide confirmation message after 3 seconds
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
                <h1 className="text-2xl font-bold text-gray-900">Theme Preferences</h1>
                <button
                  onClick={saveThemePreference}
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save Theme
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
                        Theme preference saved successfully!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-gray-600 mb-8">
                Customize your experience by selecting a theme that suits your style. Your theme preference will be applied across all Gadget Pulse pages.
              </p>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {themes.map((theme) => (
                  <div key={theme.id} className="relative">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedTheme === theme.id
                          ? "border-indigo-500 ring-2 ring-indigo-500"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                      onClick={() => handleThemeChange(theme.id)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{theme.name}</h3>
                        {selectedTheme === theme.id && (
                          <svg className="h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-4">{theme.description}</p>
                      
                      <div className="flex space-x-2">
                        {theme.colors.map((color, index) => (
                          <div key={index} className="relative group">
                            <div
                              className="h-8 w-8 rounded-full border border-gray-200"
                              style={{ backgroundColor: color.color }}
                            ></div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {color.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">System Preferences</h2>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Use device theme settings</h3>
                    <p className="text-sm text-gray-500">Automatically switch between light and dark themes based on your device settings.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleThemeChange(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')}
                    className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                  >
                    Use System Theme
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
} 