import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin
initAdmin();

// GET handler to check if a user is an admin
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
    
    // Check if user is an admin
    const admin = await Admin.findOne({ uid });
    if (!admin) {
      return NextResponse.json(
        { message: 'User is not an admin', isAdmin: false },
        { status: 403 }
      );
    }
    
    // Return admin information
    return NextResponse.json({
      message: 'User is an admin',
      isAdmin: true,
      admin: {
        id: admin._id,
        email: admin.email,
        displayName: admin.displayName,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
} 