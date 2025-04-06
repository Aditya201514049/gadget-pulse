import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { getAuth } from 'firebase-admin/auth';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin
initAdmin();

// GET handler to fetch reviews for a product
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };
    
    const reviews = await Review.find({ productId })
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const totalReviews = await Review.countDocuments({ productId });
    
    return NextResponse.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// POST handler to create a new review
export async function POST(request) {
  try {
    await connectDB();
    
    // Get authentication token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify user is authenticated
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const uid = decodedToken.uid;
    const userName = decodedToken.name || 'Anonymous';
    const userPhoto = decodedToken.picture || '';
    
    // Process review data
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['productId', 'rating', 'title', 'comment'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check if product exists
    const product = await Product.findById(data.productId);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      productId: data.productId,
      userId: uid
    });
    
    if (existingReview) {
      return NextResponse.json(
        { message: 'You have already reviewed this product' },
        { status: 409 }
      );
    }
    
    // Create new review
    const review = new Review({
      ...data,
      userId: uid,
      userName,
      userPhoto,
      updatedAt: new Date()
    });
    
    await review.save();
    
    // Update product average rating
    const allReviews = await Review.find({ productId: data.productId });
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    await Product.findByIdAndUpdate(data.productId, {
      averageRating,
      numReviews: allReviews.length
    });
    
    return NextResponse.json({
      message: 'Review submitted successfully',
      review
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
} 