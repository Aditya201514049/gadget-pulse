"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would normally fetch orders from an API
    // For now, we'll use mock data
    const fetchOrders = async () => {
      try {
        // Simulating API call with setTimeout
        setTimeout(() => {
          const mockOrders = [
            {
              id: 'ORD123456',
              date: '2023-11-15',
              total: 329.98,
              status: 'Delivered',
              items: [
                {
                  id: '1',
                  name: 'Wireless Earbuds',
                  price: 99.99,
                  quantity: 1,
                  image: 'https://placehold.co/100x100?text=Earbuds',
                },
                {
                  id: '2',
                  name: 'Smart Watch',
                  price: 229.99,
                  quantity: 1,
                  image: 'https://placehold.co/100x100?text=Watch',
                }
              ]
            },
            {
              id: 'ORD789012',
              date: '2023-10-28',
              total: 79.99,
              status: 'Delivered',
              items: [
                {
                  id: '3',
                  name: 'Bluetooth Speaker',
                  price: 79.99,
                  quantity: 1,
                  image: 'https://placehold.co/100x100?text=Speaker',
                }
              ]
            },
            {
              id: 'ORD345678',
              date: '2023-12-02',
              total: 1299.99,
              status: 'Processing',
              items: [
                {
                  id: '4',
                  name: 'Smartphone',
                  price: 1299.99,
                  quantity: 1,
                  image: 'https://placehold.co/100x100?text=Phone',
                }
              ]
            }
          ];
          setOrders(mockOrders);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h1>
              
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-wrap justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500">
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="border-t border-gray-200">
                        <ul className="divide-y divide-gray-200">
                          {order.items.map((item) => (
                            <li key={item.id} className="p-4 flex items-center">
                              <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-center object-cover"
                                />
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between">
                                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                  <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between items-center">
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View Order Details
                        </Link>
                        {order.status === "Processing" && (
                          <button
                            className="text-sm font-medium text-red-600 hover:text-red-500"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Your order history will appear here once you make a purchase.</p>
                  <div className="mt-6">
                    <Link
                      href="/"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Shop Now
                    </Link>
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