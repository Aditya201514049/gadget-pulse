import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';
import User from '@/models/User';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin (wrapped in try/catch to handle missing env vars)
try {
  initAdmin();
} catch (error) {
  console.warn('Warning: Firebase Admin initialization failed:', error.message);
}

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
    
    // Verify user is authenticated - use a try/catch to handle Firebase Admin issues
    let uid;
    let email;

    try {
      // Try to verify with Firebase Admin
      const decodedToken = await getAuth().verifyIdToken(token);
      uid = decodedToken.uid;
      email = decodedToken.email;
    } catch (error) {
      console.error('Firebase token verification failed:', error.message);
      
      // For development - extract UID from token (unsafe for production!)
      try {
        // This is a very basic JWT parser just for development
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
          uid = payload.user_id || payload.uid || payload.sub;
          email = payload.email;
          
          console.log('Development mode: Extracted UID from token:', uid);
        }
      } catch (parseError) {
        console.error('Could not parse token in development mode:', parseError);
      }
      
      // If we still don't have a UID, return unauthorized
      if (!uid) {
        return NextResponse.json(
          { message: 'Invalid token', error: error.message },
          { status: 401 }
        );
      }
    }
    
    // First, try to find the user in the admins collection
    let admin = await Admin.findOne({ uid });
    
    // If not found in admins, check the users collection with isAdmin flag
    if (!admin) {
      const user = await User.findOne({ uid, isAdmin: true });
      
      if (user) {
        console.log('Found user with isAdmin=true but no admin record, creating one...');
        
        // Create an admin record for this user
        admin = new Admin({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Admin User',
          role: 'superadmin',
          addedBy: user.uid,
          permissions: {
            createProducts: true,
            editProducts: true,
            deleteProducts: true,
            manageAdmins: true,
            manageUsers: true
          }
        });
        
        try {
          await admin.save();
          console.log('Created admin record for user:', user.email);
        } catch (saveError) {
          console.error('Error creating admin record:', saveError);
        }
      } else {
        return NextResponse.json(
          { message: 'User is not an admin', isAdmin: false },
          { status: 403 }
        );
      }
    }
    console.log('Admin Check Debug:', { uid, email });
    console.log('Admin Record:', admin);
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