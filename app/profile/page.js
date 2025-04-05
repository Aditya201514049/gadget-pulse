"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    phoneNumber: ""
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        const response = await fetch(`/api/users/${currentUser.uid}`);
        const data = await response.json();
        
        if (data.success) {
          setUserData(data.user);
          setFormData({
            displayName: data.user.displayName || "",
            bio: data.user.bio || "",
            phoneNumber: data.user.phoneNumber || ""
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage({ text: "", type: "" });
    
    try {
      const response = await fetch(`/api/users/${currentUser.uid}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUserData(data.user);
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setIsEditing(false);
      } else {
        setMessage({ text: "Failed to update profile. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ text: "An error occurred. Please try again later.", type: "error" });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {message.text && (
                    <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                        {message.text}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      id="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      id="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
                    >
                      {updateLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {message.text && (
                    <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className={`text-sm ${message.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                        {message.text}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData?.displayName || "Not provided"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData?.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{userData?.phoneNumber || "Not provided"}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Member since</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
                        </dd>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Bio</h2>
                    <div className="mt-4 text-sm text-gray-500">
                      {userData?.bio || "No bio provided yet."}
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