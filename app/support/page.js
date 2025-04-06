"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [activeTab, setActiveTab] = useState("contact");
  const [expandedFaqs, setExpandedFaqs] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // This would normally submit to an API endpoint
    console.log("Form submitted:", formData);
    
    // Simulate successful submission
    setFormStatus({
      type: "success",
      message: "Thank you for your message! We'll get back to you shortly."
    });
    
    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setFormStatus({ type: "", message: "" });
    }, 5000);
  };

  const toggleFaq = (id) => {
    setExpandedFaqs((prev) => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const faqs = [
    {
      id: 1,
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'Orders' section. Click on the specific order you want to track, and you'll find the current status and tracking information if available."
    },
    {
      id: 2,
      question: "What is your return policy?",
      answer: "We accept returns within 30 days of delivery for most products. Items must be in their original condition with all packaging and accessories. To initiate a return, go to your order history and follow the return instructions."
    },
    {
      id: 3,
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within the continental US. Express shipping is available for 1-2 business day delivery. International shipping times vary by destination, usually between 7-14 business days."
    },
    {
      id: 4,
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. International shipping costs and delivery times vary based on the destination and the size/weight of the order. You can see the shipping options at checkout."
    },
    {
      id: 5,
      question: "How do I reset my password?",
      answer: "To reset your password, click on the 'Login' button and then select 'Forgot Password?' Follow the instructions sent to your email address to create a new password."
    },
    {
      id: 6,
      question: "Do you offer warranty on products?",
      answer: "Yes, most products come with a manufacturer's warranty. The warranty period varies by product and is indicated on the product page. For warranty claims, please contact our support team with your order details."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Support Center
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500">
              We're here to help with any questions or issues you might have.
            </p>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8 justify-center" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("contact")}
                className={`${
                  activeTab === "contact"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Contact Us
              </button>
              <button
                onClick={() => setActiveTab("faq")}
                className={`${
                  activeTab === "faq"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                FAQ
              </button>
            </nav>
          </div>
          
          {activeTab === "contact" ? (
            <div className="bg-white shadow rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Contact information */}
                <div className="bg-indigo-700 py-10 px-6 sm:px-10 rounded-l-lg">
                  <div className="max-w-lg mx-auto">
                    <h2 className="text-2xl font-bold text-white">Get in touch</h2>
                    <p className="mt-3 text-indigo-200">
                      Have questions or need assistance? Reach out to our support team through any of these channels.
                    </p>
                    <dl className="mt-8 space-y-6">
                      <dt><span className="sr-only">Email</span></dt>
                      <dd className="flex">
                        <svg className="flex-shrink-0 h-6 w-6 text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="ml-3 text-indigo-50">support@gadgetpulse.com</span>
                      </dd>
                      <dt><span className="sr-only">Phone number</span></dt>
                      <dd className="flex">
                        <svg className="flex-shrink-0 h-6 w-6 text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="ml-3 text-indigo-50">+1 (555) 123-4567</span>
                      </dd>
                      <dt><span className="sr-only">Hours</span></dt>
                      <dd className="flex">
                        <svg className="flex-shrink-0 h-6 w-6 text-indigo-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="ml-3 text-indigo-50">
                          Monday-Friday: 9AM-6PM EST<br />
                          Saturday: 10AM-4PM EST<br />
                          Sunday: Closed
                        </span>
                      </dd>
                    </dl>
                    <div className="mt-8 border-t border-indigo-600 pt-8">
                      <p className="text-indigo-200 text-sm">
                        For urgent matters, please call our customer service line directly.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact form */}
                <div className="py-10 px-6 sm:px-10">
                  <div className="max-w-lg mx-auto">
                    <h3 className="text-lg font-medium text-gray-900">Send us a message</h3>
                    <div className="mt-6">
                      {formStatus.message && (
                        <div className={`mb-4 p-4 rounded-md ${formStatus.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                          <p className={`text-sm ${formStatus.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                            {formStatus.message}
                          </p>
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="block w-full py-3 px-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <div className="mt-1">
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="block w-full py-3 px-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                            Subject
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="subject"
                              id="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              className="block w-full py-3 px-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Message
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="message"
                              name="message"
                              rows={4}
                              value={formData.message}
                              onChange={handleChange}
                              className="block w-full py-3 px-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6 sm:p-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border-b border-gray-200 pb-6">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="flex w-full justify-between items-center text-left"
                      >
                        <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                        <span className="ml-6 h-7 flex items-center">
                          <svg
                            className={`${expandedFaqs.includes(faq.id) ? "-rotate-180" : "rotate-0"} h-6 w-6 transform text-indigo-500`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>
                      {expandedFaqs.includes(faq.id) && (
                        <div className="mt-2 pr-12">
                          <p className="text-base text-gray-500">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-10 text-center">
                  <p className="text-base text-gray-500">
                    Can't find the answer you're looking for? Contact our support team for assistance.
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => setActiveTab("contact")}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Help resources */}
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <div className="text-indigo-600 mx-auto h-12 w-12 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">User Guides</h3>
              <p className="text-sm text-gray-500 mb-4">
                Detailed guides on how to set up and use your new gadgets.
              </p>
              <Link href="/guides" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                Browse guides →
              </Link>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <div className="text-indigo-600 mx-auto h-12 w-12 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Community Forum</h3>
              <p className="text-sm text-gray-500 mb-4">
                Join discussions and get help from other gadget enthusiasts.
              </p>
              <Link href="/forum" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                Join community →
              </Link>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <div className="text-indigo-600 mx-auto h-12 w-12 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-sm text-gray-500 mb-4">
                Step-by-step video guides for popular products.
              </p>
              <Link href="/tutorials" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                Watch videos →
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; {new Date().getFullYear()} Gadget Pulse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 