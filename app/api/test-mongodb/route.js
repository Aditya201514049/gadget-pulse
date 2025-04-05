import connectMongo from "../../../lib/mongodb";

export async function GET() {
  try {
    await connectMongo();
    return Response.json({ success: true, message: "MongoDB connected successfully!" });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return Response.json(
      { success: false, error: "Failed to connect to MongoDB", details: error.message },
      { status: 500 }
    );
  }
} 