"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ReviewsPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const checkAdminAndFetchReviews = async () => {
      try {
        const response = await fetch('/api/admins/check');
        const data = await response.json();
        
        if (data.isAdmin) {
          setIsAdmin(true);
          fetchReviews();
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
      checkAdminAndFetchReviews();
    } else {
      router.push('/login');
    }
  }, [currentUser, router]);

  const fetchReviews = async () => {
    try {
      // In a production app, you'd fetch from an API endpoint
      // For now, we'll use mock data
      setTimeout(() => {
        const mockReviews = [
          {
            id: "rev1",
            productId: "prod1",
            productName: "Wireless Earbuds",
            productImage: "https://placehold.co/100x100?text=Earbuds",
            userId: "user1",
            userName: "John Smith",
            userEmail: "john@example.com",
            rating: 5,
            title: "Amazing sound quality!",
            content: "These earbuds have incredible sound quality and battery life. The noise cancellation is top-notch.",
            date: "2023-11-05",
            status: "approved"
          },
          {
            id: "rev2",
            productId: "prod2",
            productName: "Smart Watch",
            productImage: "https://placehold.co/100x100?text=Watch",
            userId: "user2",
            userName: "Emily Johnson",
            userEmail: "emily@example.com",
            rating: 4,
            title: "Great watch, but battery could be better",
            content: "I love all the features of this watch, but I wish the battery lasted longer. Otherwise, it's perfect for my needs.",
            date: "2023-10-28",
            status: "approved"
          },
          {
            id: "rev3",
            productId: "prod3",
            productName: "Bluetooth Speaker",
            productImage: "https://placehold.co/100x100?text=Speaker",
            userId: "user3",
            userName: "Michael Brown",
            userEmail: "michael@example.com",
            rating: 2,
            title: "Disappointing audio quality",
            content: "For the price, I expected much better audio quality. It also disconnects frequently.",
            date: "2023-11-12",
            status: "pending"
          },
          {
            id: "rev4",
            productId: "prod4",
            productName: "Smartphone",
            productImage: "https://placehold.co/100x100?text=Phone",
            userId: "user4",
            userName: "Sarah Wilson",
            userEmail: "sarah@example.com",
            rating: 5,
            title: "Best phone I've ever owned",
            content: "This phone exceeds all my expectations. The camera is exceptional and the battery lasts all day.",
            date: "2023-11-10",
            status: "approved"
          },
          {
            id: "rev5",
            productId: "prod5",
            productName: "Laptop",
            productImage: "https://placehold.co/100x100?text=Laptop",
            userId: "user5",
            userName: "David Miller",
            userEmail: "david@example.com",
            rating: 1,
            title: "Complete waste of money",
            content: "This laptop is slow, overheats, and the customer service is terrible. Avoid at all costs!",
            date: "2023-11-15",
            status: "rejected"
          },
          {
            id: "rev6",
            productId: "prod6",
            productName: "Wireless Mouse",
            productImage: "https://placehold.co/100x100?text=Mouse",
            userId: "user6",
            userName: "Lisa Anderson",
            userEmail: "lisa@example.com",
            rating: 4,
            title: "Comfortable and responsive",
            content: "This mouse is very comfortable to use for long periods. The battery life is impressive too.",
            date: "2023-11-08",
            status: "pending"
          }
        ];
        setReviews(mockReviews);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (reviewId, newStatus) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, status: newStatus } 
        : review
    ));
  };

  const openDeleteModal = (reviewId) => {
    setDeleteReviewId(reviewId);
    setShowDeleteModal(true);
  };

  const handleDeleteReview = () => {
    // In a production app, you'd call an API to delete the review
    setReviews(reviews.filter(review => review.id !== deleteReviewId));
    setShowDeleteModal(false);
    setDeleteReviewId(null);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-500";
    if (rating >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(review => {
      // Filter by status
      if (filterStatus !== "all" && review.status !== filterStatus) {
        return false;
      }
      
      // Filter by search term
      const searchLower = searchTerm.toLowerCase();
      return (
        review.productName.toLowerCase().includes(searchLower) ||
        review.userName.toLowerCase().includes(searchLower) ||
        review.title.toLowerCase().includes(searchLower) ||
        review.content.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return sortOrder === "asc" 
          ? a.rating - b.rating 
          : b.rating - a.rating;
      } else if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.date) - new Date(b.date) 
          : new Date(b.date) - new Date(a.date);
      } else {
        return sortOrder === "asc" 
          ? a[sortBy].localeCompare(b[sortBy]) 
          : b[sortBy].localeCompare(a[sortBy]);
      }
    });

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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
        <p className="text-gray-600">Moderate customer reviews and manage visibility.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search reviews..."
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
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm whitespace-nowrap">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Reviews</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm whitespace-nowrap">Sort by:</span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="rating-desc">Highest Rating</option>
                <option value="rating-asc">Lowest Rating</option>
                <option value="userName-asc">Customer Name (A-Z)</option>
                <option value="productName-asc">Product Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={review.productImage}
                            alt={review.productName}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{review.productName}</div>
                          <div className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center ${getRatingColor(review.rating)}`}>
                        <span className="text-lg font-bold mr-1">{review.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{review.title}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{review.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{review.userName}</div>
                      <div className="text-sm text-gray-500">{review.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(review.status)}`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {review.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(review.id, "approved")}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(review.id, "rejected")}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {review.status === "approved" && (
                          <button
                            onClick={() => handleStatusChange(review.id, "rejected")}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Unpublish
                          </button>
                        )}
                        {review.status === "rejected" && (
                          <button
                            onClick={() => handleStatusChange(review.id, "approved")}
                            className="text-green-600 hover:text-green-900"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => openDeleteModal(review.id)}
                          className="text-red-600 hover:text-red-900 ml-2"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No reviews found matching your search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 