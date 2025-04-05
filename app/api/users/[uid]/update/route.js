import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(request, { params }) {
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
    
    // Get update data from request
    const updates = await request.json();
    
    // Validate updates
    if (Object.keys(updates).length === 0) {
      return Response.json(
        { success: false, message: "No update data provided" },
        { status: 400 }
      );
    }
    
    // Find and update user by UID
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-__v");
    
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    return Response.json({ 
      success: true, 
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json(
      { 
        success: false, 
        error: "Failed to update user", 
        details: error.message 
      },
      { status: 500 }
    );
  }
} 