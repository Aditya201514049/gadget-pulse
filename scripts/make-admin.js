// Script to make an existing user an admin
import mongoose from 'mongoose';
import User from '../models/User';
import Admin from '../models/Admin';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const email = process.argv[2]; // Get email from command line argument

if (!email) {
  console.error('Please provide an email address as an argument');
  process.exit(1);
}

async function makeAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    console.log(`Found user: ${user.displayName} (${user.email})`);
    
    // Check if the user is already an admin
    const existingAdmin = await Admin.findOne({ uid: user.uid });
    
    if (existingAdmin) {
      console.log('User is already an admin');
      
      // Update user.isAdmin if it's not set to true
      if (!user.isAdmin) {
        await User.updateOne({ _id: user._id }, { isAdmin: true });
        console.log('Updated user.isAdmin to true');
      }
      
      process.exit(0);
    }
    
    // Create a new admin record
    const admin = new Admin({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'Admin User',
      addedBy: user.uid, // Self-appointed
      role: 'superadmin', // Give highest permissions
      permissions: {
        createProducts: true,
        editProducts: true,
        deleteProducts: true,
        manageAdmins: true,
        manageUsers: true
      }
    });
    
    await admin.save();
    console.log('Admin record created successfully');
    
    // Update the user record
    await User.updateOne({ _id: user._id }, { isAdmin: true });
    console.log('User record updated to reflect admin status');
    
    console.log('Successfully made user an admin');
  } catch (error) {
    console.error('Error making user admin:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

makeAdmin(); 