import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request, { params }) {
  try {
    // Connect to MongoDB
    await connectMongo();
    
    const { uid } = params;
    
    if (!uid) {
      return Response.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }
    
    // Find user by UID
    const user = await User.findOne({ uid }).select("-__v");
    
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    return Response.json({ 
      success: true, 
      user
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json(
      { 
        success: false, 
        error: "Failed to fetch user", 
        details: error.message 
      },
      { status: 500 }
    );
  }
} 