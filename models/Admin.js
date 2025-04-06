import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin', // Could be 'superadmin' or other roles in the future
    required: true
  },
  addedBy: {
    type: String, // UID of admin who added this admin
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  },
  permissions: {
    createProducts: {
      type: Boolean,
      default: true
    },
    editProducts: {
      type: Boolean,
      default: true
    },
    deleteProducts: {
      type: Boolean,
      default: true
    },
    manageAdmins: {
      type: Boolean,
      default: false // Only superadmin can manage other admins by default
    },
    manageUsers: {
      type: Boolean,
      default: true
    }
  }
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema); 