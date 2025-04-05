"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, googleProvider, signInWithPopup } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined" || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Register a new user
  const register = async (email, password, name) => {
    if (!auth) throw new Error("Auth not initialized");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Save user to MongoDB
      try {
        const response = await fetch('/api/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: name,
            photoURL: userCredential.user.photoURL || '',
          }),
        });
        
        if (!response.ok) {
          console.error('Failed to save user data to MongoDB');
        }
      } catch (error) {
        console.error('Error saving user to MongoDB:', error);
      }
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  // Login user with email and password
  const login = async (email, password) => {
    if (!auth) throw new Error("Auth not initialized");
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) throw new Error("Auth not initialized");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save user to MongoDB
      try {
        const response = await fetch('/api/users/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'Google User',
            photoURL: user.photoURL || '',
          }),
        });
        
        if (!response.ok) {
          console.error('Failed to save Google user data to MongoDB');
        }
      } catch (error) {
        console.error('Error saving Google user to MongoDB:', error);
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    if (!auth) throw new Error("Auth not initialized");
    return signOut(auth);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    signInWithGoogle,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
} 