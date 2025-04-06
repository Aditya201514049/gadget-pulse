import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import User from '@/models/User';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin
initAdmin();

// GET handler to fetch all admins (only accessible to admins with manageAdmins permission)
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
    
    // Check if user is an admin with appropriate permissions
    const admin = await Admin.findOne({ uid });
    if (!admin || !admin.permissions.manageAdmins) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required with manageAdmins permission' },
        { status: 403 }
      );
    }
    
    // Apply pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    const admins = await Admin.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const totalAdmins = await Admin.countDocuments();
    
    return NextResponse.json({
      admins,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalAdmins / limit),
        totalAdmins
      }
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// POST handler to add a new admin (only accessible to admins with manageAdmins permission)
export async function POST(request) {
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
    
    // Check if the first admin is being created
    const adminsCount = await Admin.countDocuments();
    const isFirstAdmin = adminsCount === 0;
    
    if (!isFirstAdmin) {
      // If not the first admin, check if user is an admin with appropriate permissions
      const admin = await Admin.findOne({ uid });
      if (!admin || !admin.permissions.manageAdmins) {
        return NextResponse.json(
          { message: 'Unauthorized - Admin access required with manageAdmins permission' },
          { status: 403 }
        );
      }
    }
    
    // Process admin data
    const data = await request.json();
    
    // Validate required fields
    if (!data.email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Find the user by email in Firebase
    let userRecord;
    try {
      userRecord = await getAuth().getUserByEmail(data.email);
    } catch (error) {
      return NextResponse.json(
        { message: 'User not found with this email' },
        { status: 404 }
      );
    }
    
    // Check if user is already an admin
    const existingAdmin = await Admin.findOne({ uid: userRecord.uid });
    if (existingAdmin) {
      return NextResponse.json(
        { message: 'User is already an admin' },
        { status: 409 }
      );
    }
    
    // Create new admin
    const newAdmin = new Admin({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || 'Admin User',
      addedBy: isFirstAdmin ? userRecord.uid : uid, // First admin adds themselves
      role: isFirstAdmin ? 'superadmin' : 'admin',
      permissions: {
        ...data.permissions,
        // First admin gets full permissions
        manageAdmins: isFirstAdmin ? true : (data.permissions?.manageAdmins || false)
      }
    });
    
    await newAdmin.save();
    
    // Update user record to mark as admin
    await User.findOneAndUpdate(
      { uid: userRecord.uid },
      { isAdmin: true }
    );
    
    return NextResponse.json({
      message: 'Admin added successfully',
      admin: newAdmin
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding admin:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
} 