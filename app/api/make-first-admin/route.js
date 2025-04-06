import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import User from '@/models/User';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin
initAdmin();

// GET handler to make the first user an admin
export async function GET(request) {
  try {
    await connectDB();
    
    // Get authentication token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify user is authenticated
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const uid = decodedToken.uid;
    
    // Find the user in our DB
    const user = await User.findOne({ uid });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found in database' },
        { status: 404 }
      );
    }
    
    // Check if user is already an admin
    const existingAdmin = await Admin.findOne({ uid });
    if (existingAdmin) {
      return NextResponse.json({
        message: 'User is already an admin',
        admin: existingAdmin
      });
    }
    
    // Create admin record for this user
    const newAdmin = new Admin({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Admin User',
      addedBy: user.uid, // Self-assigned
      role: 'superadmin', // First user gets highest permissions
      permissions: {
        createProducts: true,
        editProducts: true,
        deleteProducts: true,
        manageAdmins: true,
        manageUsers: true
      }
    });
    
    await newAdmin.save();
    
    // Update user record
    user.isAdmin = true;
    await user.save();
    
    return NextResponse.json({
      message: 'Admin created successfully',
      admin: newAdmin
    }, { status: 201 });
  } catch (error) {
    console.error('Error making admin:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
} 