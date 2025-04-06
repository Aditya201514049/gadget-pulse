"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Favorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would normally fetch favorites from an API
    // For now, we'll use mock data
    const fetchFavorites = async () => {
      try {
        // Simulating API call with setTimeout
        setTimeout(() => {
          const mockFavorites = [
            {
              id: '1',
              name: 'Wireless Earbuds',
              price: 99.99,
              image: 'https://placehold.co/200x200?text=Earbuds',
              rating: 4.5
            },
            {
              id: '2',
              name: 'Smart Watch',
              price: 249.99,
              image: 'https://placehold.co/200x200?text=Watch',
              rating: 4.8
            },
            {
              id: '3',
              name: 'Bluetooth Speaker',
              price: 79.99,
              image: 'https://placehold.co/200x200?text=Speaker',
              rating: 4.2
            }
          ];
          setFavorites(mockFavorites);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const removeFavorite = (id) => {
    // This would normally call an API to remove the favorite
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white p-6 rounded-lg shadow">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Favorites</h1>
              
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : favorites.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {favorites.map((favorite) => (
                    <div key={favorite.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-md transition-all hover:shadow-lg">
                      <div className="relative pb-48 overflow-hidden">
                        <img
                          className="absolute inset-0 h-full w-full object-cover"
                          src={favorite.image}
                          alt={favorite.name}
                        />
                      </div>
                      <div className="p-4">
                        <h2 className="text-lg font-semibold text-gray-900">{favorite.name}</h2>
                        <div className="flex items-center mt-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(favorite.rating) 
                                    ? 'text-yellow-400' 
                                    : i < favorite.rating 
                                      ? 'text-yellow-300' 
                                      : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-sm text-gray-500">{favorite.rating}</span>
                          </div>
                          <span className="text-indigo-600 font-semibold ml-auto">${favorite.price}</span>
                        </div>
                        <div className="flex justify-between mt-4">
                          <Link 
                            href={`/product/${favorite.id}`}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => removeFavorite(favorite.id)}
                            className="text-sm font-medium text-red-600 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No favorites yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Start exploring products and add some favorites!</p>
                  <div className="mt-6">
                    <Link
                      href="/"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Explore Products
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