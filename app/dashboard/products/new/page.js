"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function NewProduct() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    price: "",
    discountPrice: "",
    stock: "1",
    featured: false,
    images: [],
    specifications: {}
  });
  
  // Available categories for dropdown
  const categories = [
    "Smartphones",
    "Laptops",
    "Tablets",
    "Cameras",
    "Headphones",
    "Speakers",
    "Wearables",
    "Gaming",
    "TVs",
    "Home Appliances",
    "Other"
  ];

  // Available specification fields based on category
  const specificationFields = {
    Smartphones: ["Display", "Processor", "RAM", "Storage", "Battery", "Camera", "OS"],
    Laptops: ["Display", "Processor", "RAM", "Storage", "Graphics", "Battery", "OS"],
    Tablets: ["Display", "Processor", "RAM", "Storage", "Battery", "Camera", "OS"],
    Cameras: ["Sensor", "Resolution", "Lens", "ISO Range", "Video", "Battery"],
    Headphones: ["Type", "Driver", "Frequency Response", "Impedance", "Battery", "Connectivity"],
    Speakers: ["Power Output", "Frequency Response", "Connectivity", "Battery"],
    Wearables: ["Display", "Compatibility", "Battery", "Sensors", "Water Resistance"],
    Gaming: ["Platform", "Genre", "Multiplayer", "Release Date"],
    TVs: ["Display Type", "Resolution", "Size", "HDR", "Smart Features", "Connectivity"],
    "Home Appliances": ["Power", "Capacity", "Features", "Energy Rating"],
    Other: ["Type", "Features"]
  };

  // State for image uploads
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // Specs state
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    async function checkAdminStatus() {
      try {
        // Get the auth token
        const token = await currentUser.getIdToken();
        
        // Check if user is admin
        const response = await fetch('/api/admins/check', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          setIsAdmin(true);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error('Error checking admin status', error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [currentUser, router]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const addSpecField = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpecField = (index) => {
    const newSpecs = [...specs];
    newSpecs.splice(index, 1);
    setSpecs(newSpecs);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    
    try {
      // In a real application, you would upload these files to a storage service
      // For now, we'll simulate uploaded URLs
      const urls = files.map((file) => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...urls]);
      
      setFormData({
        ...formData,
        images: [...formData.images, ...urls]
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      setError("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newUrls = [...imageUrls];
    newUrls.splice(index, 1);
    setImageUrls(newUrls);
    
    setFormData({
      ...formData,
      images: newUrls
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    try {
      // Format specifications from the specs array to an object
      const specificationsObj = {};
      specs.forEach((spec) => {
        if (spec.key && spec.value) {
          specificationsObj[spec.key] = spec.value;
        }
      });
      
      // Validate form data
      if (!formData.name || !formData.description || !formData.brand || 
          !formData.category || !formData.price || formData.images.length === 0) {
        throw new Error("Please fill in all required fields");
      }
      
      // Get the auth token
      const token = await currentUser.getIdToken();
      
      // Prepare data for API
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : 0,
        stock: parseInt(formData.stock),
        specifications: specificationsObj
      };
      
      // Submit data to API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create product");
      }
      
      const data = await response.json();
      setSuccess(true);
      
      // Redirect to the new product page after a short delay
      setTimeout(() => {
        router.push(`/dashboard/products/${data.product.slug}`);
      }, 2000);
    } catch (error) {
      console.error("Error creating product:", error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-sm text-gray-500">
            You don&apos;t have admin access to create products.
          </p>
          <p className="mt-4">
            <Link href="/dashboard" className="text-primary hover:text-primary-focus">
              Return to Dashboard
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
        <Link 
          href="/dashboard/products"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Product created successfully! Redirecting...</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-md">
        <div className="p-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Basic Information */}
          <div className="sm:col-span-6">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            <p className="mt-1 text-sm text-gray-500">Product details and attributes.</p>
          </div>
          
          {/* Product Name */}
          <div className="sm:col-span-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name*
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          {/* Description */}
          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description*
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">Detailed description of the product.</p>
          </div>
          
          {/* Brand & Category */}
          <div className="sm:col-span-3">
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
              Brand*
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="brand"
                id="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          <div className="sm:col-span-3">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category*
            </label>
            <div className="mt-1">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Price & Discount Price */}
          <div className="sm:col-span-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price*
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700">
              Discount Price (Optional)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="discountPrice"
                id="discountPrice"
                value={formData.discountPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="focus:ring-primary focus:border-primary block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock*
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="stock"
                id="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          
          {/* Featured */}
          <div className="sm:col-span-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="featured" className="font-medium text-gray-700">
                  Featured Product
                </label>
                <p className="text-gray-500">Featured products appear on the homepage.</p>
              </div>
            </div>
          </div>
          
          {/* Product Images */}
          <div className="sm:col-span-6">
            <h2 className="text-lg font-medium text-gray-900">Product Images</h2>
            <p className="mt-1 text-sm text-gray-500">Upload product images (at least one is required).</p>
          </div>
          
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">
              Images*
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-focus focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                    <span>Upload images</span>
                    <input 
                      id="images" 
                      name="images" 
                      type="file" 
                      multiple
                      onChange={handleImageUpload}
                      className="sr-only"
                      accept="image/*" 
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            
            {/* Image preview */}
            {imageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={url} 
                      alt={`Upload ${index + 1}`} 
                      className="h-24 w-full object-cover rounded-md" 
                    />
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Specifications */}
          <div className="sm:col-span-6">
            <h2 className="text-lg font-medium text-gray-900">Specifications</h2>
            <p className="mt-1 text-sm text-gray-500">Add technical specifications for the product.</p>
          </div>

          {specs.map((spec, index) => (
            <div key={index} className="sm:col-span-6 grid grid-cols-12 gap-3">
              <div className="col-span-5">
                <label className="block text-sm font-medium text-gray-700">
                  {index === 0 ? 'Specification' : ''}
                </label>
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g. RAM, Processor, etc."
                />
              </div>
              <div className="col-span-5">
                <label className="block text-sm font-medium text-gray-700">
                  {index === 0 ? 'Value' : ''}
                </label>
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  className="mt-1 shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g. 8GB, Intel i7, etc."
                />
              </div>
              <div className="col-span-2 flex items-end">
                {index === 0 ? (
                  <button
                    type="button"
                    onClick={addSpecField}
                    className="mt-1 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeSpecField(index)}
                    className="mt-1 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Recommended specifications based on category */}
          {formData.category && specificationFields[formData.category] && (
            <div className="sm:col-span-6">
              <h3 className="text-sm font-medium text-gray-700">Recommended specifications for {formData.category}:</h3>
              <div className="mt-1 text-sm text-gray-500">
                <ul className="list-disc pl-5 space-y-1">
                  {specificationFields[formData.category].map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
} 