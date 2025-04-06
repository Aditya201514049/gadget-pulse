"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ProductsPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const checkAdminAndFetchProducts = async () => {
      try {
        const response = await fetch('/api/admins/check');
        const data = await response.json();
        
        if (data.isAdmin) {
          setIsAdmin(true);
          fetchProducts();
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
      checkAdminAndFetchProducts();
    } else {
      router.push('/login');
    }
  }, [currentUser, router]);

  const fetchProducts = async () => {
    try {
      // In a production app, you'd fetch from an API endpoint
      // For now, we'll use mock data
      setTimeout(() => {
        const mockProducts = [
          {
            id: "prod1",
            name: "Wireless Earbuds",
            price: 99.99,
            category: "Audio",
            stock: 45,
            image: "https://placehold.co/100x100?text=Earbuds",
            createdAt: "2023-10-15",
            featured: true
          },
          {
            id: "prod2",
            name: "Smart Watch",
            price: 249.99,
            category: "Wearables",
            stock: 20,
            image: "https://placehold.co/100x100?text=Watch",
            createdAt: "2023-09-20",
            featured: true
          },
          {
            id: "prod3",
            name: "Bluetooth Speaker",
            price: 79.99,
            category: "Audio",
            stock: 30,
            image: "https://placehold.co/100x100?text=Speaker",
            createdAt: "2023-08-05",
            featured: false
          },
          {
            id: "prod4",
            name: "Smartphone",
            price: 899.99,
            category: "Phones",
            stock: 15,
            image: "https://placehold.co/100x100?text=Phone",
            createdAt: "2023-11-01",
            featured: true
          },
          {
            id: "prod5",
            name: "Laptop",
            price: 1299.99,
            category: "Computers",
            stock: 10,
            image: "https://placehold.co/100x100?text=Laptop",
            createdAt: "2023-10-28",
            featured: false
          },
          {
            id: "prod6",
            name: "Wireless Mouse",
            price: 49.99,
            category: "Accessories",
            stock: 50,
            image: "https://placehold.co/100x100?text=Mouse",
            createdAt: "2023-09-15",
            featured: false
          }
        ];
        setProducts(mockProducts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openDeleteModal = (productId) => {
    setDeleteProductId(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteProduct = () => {
    // In a production app, you'd call an API to delete the product
    setProducts(products.filter(product => product.id !== deleteProductId));
    setShowDeleteModal(false);
    setDeleteProductId(null);
  };

  const toggleFeatured = (productId) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, featured: !product.featured } 
        : product
    ));
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" 
          ? a.price - b.price 
          : b.price - a.price;
      } else if (sortBy === "stock") {
        return sortOrder === "asc" 
          ? a.stock - b.stock 
          : b.stock - a.stock;
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
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product inventory, prices, and details.</p>
        </div>
        <Link
          href="/dashboard/products/add"
          className="btn btn-primary"
        >
          Add New Product
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
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
          <div className="flex items-center gap-2 w-full md:w-auto">
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
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="stock-asc">Stock (Low to High)</option>
              <option value="stock-desc">Stock (High to Low)</option>
              <option value="category-asc">Category (A-Z)</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
            </select>
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
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={product.image}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock > 20 
                          ? 'bg-green-100 text-green-800' 
                          : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? product.stock : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => toggleFeatured(product.id)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          product.featured ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className="sr-only">Toggle featured</span>
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            product.featured ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/dashboard/products/${product.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/products/edit/${product.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => openDeleteModal(product.id)}
                          className="text-red-600 hover:text-red-900"
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
                    No products found matching your search.
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
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 