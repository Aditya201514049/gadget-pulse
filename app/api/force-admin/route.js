import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import User from '@/models/User';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin
initAdmin();

// GET handler to make the requesting user an admin
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
        { message: 'Invalid token', error: error.message },
        { status: 401 }
      );
    }
    
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    
    console.log("Making user an admin:", uid, email);
    
    // Find or create the user in our DB
    let user = await User.findOne({ uid });
    if (!user) {
      // Create user if it doesn't exist
      user = new User({
        uid: uid,
        email: email,
        displayName: decodedToken.name || 'Admin User',
        photoURL: decodedToken.picture || '',
        isAdmin: true,
        createdAt: new Date()
      });
      await user.save();
      console.log("Created new user record");
    } else {
      // Update user to be admin
      user.isAdmin = true;
      await user.save();
      console.log("Updated existing user record");
    }
    
    // Check if user is already an admin
    let admin = await Admin.findOne({ uid });
    if (admin) {
      return NextResponse.json({
        message: 'User is already an admin',
        admin: admin
      });
    }
    
    // Create admin record for this user
    admin = new Admin({
      uid: uid,
      email: email,
      displayName: decodedToken.name || user.displayName || 'Admin User',
      addedBy: uid, // Self-assigned
      role: 'superadmin', // Give highest role
      permissions: {
        createProducts: true,
        editProducts: true,
        deleteProducts: true,
        manageAdmins: true,
        manageUsers: true
      }
    });
    
    await admin.save();
    console.log("Admin record created successfully");
    
    return NextResponse.json({
      message: 'Admin created successfully',
      admin: admin
    }, { status: 201 });
  } catch (error) {
    console.error('Error making admin:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.toString(), stack: error.stack },
      { status: 500 }
    );
  }
} 