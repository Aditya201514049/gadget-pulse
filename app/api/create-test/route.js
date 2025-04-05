import connectMongo from "../../../lib/mongodb";
import Test from "../../../models/Test";

export async function GET() {
  try {
    await connectMongo();
    
    // Create a test document
    const testDoc = await Test.create({ name: "Test Document" });
    
    return Response.json({ 
      success: true, 
      message: "Test document created successfully", 
      data: testDoc 
    });
  } catch (error) {
    console.error("Error creating test document:", error);
    return Response.json(
      { success: false, error: "Failed to create test document", details: error.message },
      { status: 500 }
    );
  }
} 