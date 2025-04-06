"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminsPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [deleteAdminId, setDeleteAdminId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const checkAdminAndFetchAdmins = async () => {
      try {
        const response = await fetch('/api/admins/check');
        const data = await response.json();
        
        if (data.isAdmin) {
          setIsAdmin(true);
          fetchAdmins();
        } else {
          setIsAdmin(false);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setLoading(false);
      }
    };

    if (currentUser) {
      checkAdminAndFetchAdmins();
    } else {
      router.push('/login');
    }
  }, [currentUser, router]);

  const fetchAdmins = async () => {
    try {
      // In a production app, you'd fetch from an API endpoint
      // For now, we'll use mock data
      setTimeout(() => {
        const mockAdmins = [
          {
            id: "adm1",
            name: "John Doe",
            email: "john.doe@example.com",
            role: "Super Admin",
            status: "active",
            dateAdded: "2023-01-15",
            lastLogin: "2023-11-28"
          },
          {
            id: "adm2",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            role: "Admin",
            status: "active",
            dateAdded: "2023-03-22",
            lastLogin: "2023-11-27"
          },
          {
            id: "adm3",
            name: "Mike Johnson",
            email: "mike.johnson@example.com",
            role: "Product Manager",
            status: "inactive",
            dateAdded: "2023-05-10",
            lastLogin: "2023-10-15"
          },
          {
            id: "adm4",
            name: "Sarah Williams",
            email: "sarah.williams@example.com",
            role: "Content Editor",
            status: "active",
            dateAdded: "2023-06-18",
            lastLogin: "2023-11-26"
          }
        ];
        setAdmins(mockAdmins);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching admins:", error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusToggle = (adminId) => {
    setAdmins(admins.map(admin => 
      admin.id === adminId 
        ? { ...admin, status: admin.status === "active" ? "inactive" : "active" } 
        : admin
    ));
  };

  const openDeleteModal = (adminId) => {
    setDeleteAdminId(adminId);
    setShowDeleteModal(true);
  };

  const handleDeleteAdmin = () => {
    // In a production app, you'd call an API to delete the admin
    // Check if trying to delete yourself
    const adminToDelete = admins.find(admin => admin.id === deleteAdminId);
    if (adminToDelete.email === currentUser.email) {
      setFormError("You cannot remove yourself as an admin.");
      return;
    }
    
    setAdmins(admins.filter(admin => admin.id !== deleteAdminId));
    setShowDeleteModal(false);
    setDeleteAdminId(null);
    setFormError("");
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    
    if (!newAdminEmail) {
      setFormError("Please enter an email address.");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(newAdminEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    
    if (admins.some(admin => admin.email === newAdminEmail)) {
      setFormError("This email is already registered as an admin.");
      return;
    }
    
    // In a production app, you'd call an API to add the admin
    const newAdmin = {
      id: `adm${admins.length + 1}`,
      name: newAdminEmail.split('@')[0].replace('.', ' '),
      email: newAdminEmail,
      role: "Admin",
      status: "active",
      dateAdded: new Date().toISOString().split('T')[0],
      lastLogin: "-"
    };
    
    setAdmins([...admins, newAdmin]);
    setNewAdminEmail("");
    setShowAddModal(false);
    setFormError("");
  };

  // Filter admins
  const filteredAdmins = admins
    .filter(admin => {
      const searchLower = searchTerm.toLowerCase();
      return (
        admin.name.toLowerCase().includes(searchLower) ||
        admin.email.toLowerCase().includes(searchLower) ||
        admin.role.toLowerCase().includes(searchLower)
      );
    });

  const getStatusBadgeClass = (status) => {
    return status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
            <p className="mb-6 text-gray-600">You don't have permission to access this page. Please contact an administrator.</p>
            <Link href="/dashboard" className="btn btn-primary">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600">Manage admin users and their permissions.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary"
        >
          Add New Admin
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-800 font-medium text-lg">
                            {admin.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                          <div className="text-sm text-gray-500">{admin.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{admin.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(admin.status)}`}>
                        {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.dateAdded}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleStatusToggle(admin.id)}
                          className={`${
                            admin.status === "active" ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"
                          }`}
                        >
                          {admin.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => openDeleteModal(admin.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No admins found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Admin</h3>
            {formError && (
              <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <p>{formError}</p>
              </div>
            )}
            <form onSubmit={handleAddAdmin}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="email@example.com"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  An invitation will be sent to this email address.
                </p>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewAdminEmail("");
                    setFormError("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Add Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Remove Admin</h3>
            {formError && (
              <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                <p>{formError}</p>
              </div>
            )}
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this admin? They will lose all admin access to the system.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteAdminId(null);
                  setFormError("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAdmin}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Remove Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 