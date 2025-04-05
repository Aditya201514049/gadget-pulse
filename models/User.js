import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
  photoURL: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bio: {
    type: String,
    default: ""
  },
  phoneNumber: {
    type: String,
    default: ""
  }
});

export default mongoose.models.User || mongoose.model("User", UserSchema); 