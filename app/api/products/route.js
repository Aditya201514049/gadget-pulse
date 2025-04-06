import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Admin from '@/models/Admin';
import { getAuth } from 'firebase-admin/auth';
import { slugify } from '@/lib/utils';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin
initAdmin();

// GET handler to fetch all products or filtered products
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = {};
    
    // Apply filters if provided
    if (searchParams.has('category')) {
      query.category = searchParams.get('category');
    }
    
    if (searchParams.has('brand')) {
      query.brand = searchParams.get('brand');
    }
    
    if (searchParams.has('minPrice') && searchParams.has('maxPrice')) {
      query.price = { 
        $gte: Number(searchParams.get('minPrice')), 
        $lte: Number(searchParams.get('maxPrice')) 
      };
    }
    
    if (searchParams.has('featured')) {
      query.featured = searchParams.get('featured') === 'true';
    }
    
    if (searchParams.has('search')) {
      query.$text = { $search: searchParams.get('search') };
    }
    
    // Pagination
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };
    
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const totalProducts = await Product.countDocuments(query);
    
    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// POST handler to create a new product
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
    
    // Check if user is an admin
    const admin = await Admin.findOne({ uid });
    if (!admin) {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }
    
    // Process product data
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'brand', 'category', 'price', 'images', 'specifications'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Generate slug from name
    const slug = slugify(data.name);
    
    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return NextResponse.json(
        { message: 'A product with this name already exists' },
        { status: 409 }
      );
    }
    
    // Create new product
    const product = new Product({
      ...data,
      slug,
      createdBy: uid,
      updatedAt: new Date()
    });
    
    await product.save();
    
    return NextResponse.json({
      message: 'Product created successfully',
      product
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
} 