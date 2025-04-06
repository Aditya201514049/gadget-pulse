/**
 * This script directly sets a user as an admin in MongoDB
 * Run with: node scripts/set-admin.js YOUR_EMAIL@example.com
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Log MongoDB connection string (masked for security)
const connectionString = process.env.DB_URI;
if (!connectionString) {
  console.error('DB_URI not found in .env.local file');
  process.exit(1);
}

console.log('Using MongoDB connection string (masked): ' + 
  connectionString.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://****:****@'));

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address as an argument');
  console.error('Usage: node scripts/set-admin.js your-email@example.com');
  process.exit(1);
}

console.log(`Will make user with email ${email} an admin`);

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

// Connect to MongoDB
mongoose.connect(connectionString)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Create models
    const User = mongoose.model('User', UserSchema);
    const Admin = mongoose.model('Admin', AdminSchema);
    
    // Try to find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`⛔ User with email ${email} not found in database`);
      mongoose.connection.close();
      return;
    }
    
    console.log(`✅ Found user: ${user.displayName || 'No name'} (${user.email})`);
    console.log(`   User ID (uid): ${user.uid}`);
    
    // Update user document
    await User.updateOne(
      { _id: user._id },
      { isAdmin: true }
    );
    console.log(`✅ Updated user document: isAdmin = true`);
    
    // Check if admin record exists
    let admin = await Admin.findOne({ uid: user.uid });
    
    if (admin) {
      console.log(`✅ User already has an admin record`);
    } else {
      // Create admin record
      admin = new Admin({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Admin User',
        addedBy: user.uid, // Self-assigned
        role: 'superadmin',
        permissions: {
          createProducts: true,
          editProducts: true,
          deleteProducts: true,
          manageAdmins: true,
          manageUsers: true
        }
      });
      
      await admin.save();
      console.log(`✅ Created new admin record with superadmin role`);
    }
    
    console.log(`\n🎉 SUCCESS: User ${email} is now an admin with full permissions!`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Error connecting to database:', err);
    process.exit(1);
  }); 