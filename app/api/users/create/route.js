import connectMongo from "@/lib/mongo";
import User from "@/models/User";

export async function POST(request) {
  try {
    // Connect to MongoDB
    await connectMongo();
    
    // Parse request body
    const userData = await request.json();
    
    // Validate required fields
    if (!userData.uid || !userData.email || !userData.displayName) {
      return Response.json(
        { 
          success: false, 
          message: "Missing required fields (uid, email, or displayName)" 
        }, 
        { status: 400 }
      );
    }
    
    // Check if user already exists
    let user = await User.findOne({ uid: userData.uid });
    
    if (user) {
      // Return the existing user
      return Response.json({ 
        success: true, 
        message: "User already exists", 
        user 
      });
    }
    
    // Create new user
    user = await User.create({
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL || "",
      createdAt: new Date()
    });
    
    return Response.json({ 
      success: true, 
      message: "User created successfully", 
      user
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json(
      { 
        success: false, 
        error: "Failed to create user", 
        details: error.message 
      },
      { status: 500 }
    );
  }
} 