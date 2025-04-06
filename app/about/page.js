"use client";

import Header from "@/components/Header";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Hero section */}
          <div className="bg-indigo-600 rounded-lg overflow-hidden">
            <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                  About Gadget Pulse
                </h1>
                <p className="mt-6 text-xl text-indigo-100 max-w-prose mx-auto">
                  A modern marketplace for tech enthusiasts, offering the latest gadgets with honest reviews and competitive prices.
                </p>
              </div>
            </div>
          </div>

          {/* Mission section */}
          <div className="bg-white shadow rounded-lg px-6 py-8 mt-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <div className="prose prose-indigo prose-lg mx-auto">
              <p>
                At Gadget Pulse, we believe that technology should enhance our lives without unnecessary complexity or inflated prices. Our mission is to create a marketplace where tech enthusiasts and everyday consumers alike can discover, evaluate, and purchase quality gadgets with confidence.
              </p>
              <p>
                We've built a platform that prioritizes honest reviews, detailed specifications, and competitive pricing, allowing our customers to make informed decisions about their technology purchases.
              </p>
            </div>
          </div>

          {/* Values section */}
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white shadow rounded-lg px-6 py-8">
              <div className="text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Trust & Transparency</h3>
              <p className="text-gray-600">
                We believe in honest reviews and clear product information. Every product on our platform goes through a verification process to ensure accuracy.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg px-6 py-8">
              <div className="text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We curate products that represent the best of what technology has to offer, from established brands to promising startups with groundbreaking ideas.
              </p>
            </div>

            <div className="bg-white shadow rounded-lg px-6 py-8">
              <div className="text-indigo-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                We're building a community of tech enthusiasts who share insights, experiences, and recommendations to help each other make the best choices.
              </p>
            </div>
          </div>

          {/* Team section */}
          <div className="bg-white shadow rounded-lg px-6 py-8 mt-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Team</h2>
            <p className="text-lg text-gray-600 mb-10">
              Gadget Pulse is powered by a team of technology enthusiasts, e-commerce experts, and customer experience specialists who share a passion for making technology accessible to everyone.
            </p>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                  <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Alex Chen</h3>
                <p className="text-sm text-gray-500">Founder & CEO</p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                  <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Sarah Kim</h3>
                <p className="text-sm text-gray-500">CTO</p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-24 w-24 rounded-full overflow-hidden bg-gray-200">
                  <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Michael Rodriguez</h3>
                <p className="text-sm text-gray-500">Head of Product</p>
              </div>
            </div>
          </div>

          {/* Contact section */}
          <div className="bg-white shadow rounded-lg px-6 py-8 mt-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Headquarters</h3>
                <p className="mt-2 text-gray-600">
                  123 Tech Avenue<br />
                  San Francisco, CA 94103<br />
                  United States
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Get in Touch</h3>
                <p className="mt-2 text-gray-600">
                  Email: support@gadgetpulse.com<br />
                  Phone: +1 (555) 123-4567
                </p>
                <div className="mt-4">
                  <Link
                    href="/support"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
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