// Script to make an existing user an admin
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

// Define schemas directly for this script
const UserSchema = new mongoose.Schema({
  uid: String,
  email: String,
  displayName: String,
  isAdmin: Boolean
});

const AdminSchema = new mongoose.Schema({
  uid: String,
  email: String,
  displayName: String,
  role: String,
  addedBy: String,
  permissions: {
    createProducts: Boolean,
    editProducts: Boolean,
    deleteProducts: Boolean,
    manageAdmins: Boolean,
    manageUsers: Boolean
  }
});

// Email is required - get from command line or use default
const email = process.argv[2]; 

if (!email) {
  console.error('Please provide an email address as an argument');
  process.exit(1);
}

async function makeAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URI);
    console.log('Connected to MongoDB');
    
    // Get models
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
    
    // Find the user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    console.log(`Found user: ${user.displayName || 'User'} (${user.email})`);
    
    // Check if the user is already an admin
    const existingAdmin = await Admin.findOne({ uid: user.uid });
    
    if (existingAdmin) {
      console.log('User is already an admin in Admin collection');
      
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
    process.exit(0);
  }
}

makeAdmin(); 