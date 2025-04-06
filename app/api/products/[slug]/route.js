import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Admin from '@/models/Admin';
import { getAuth } from 'firebase-admin/auth';
import { slugify } from '@/lib/utils';
import { initAdmin } from '@/lib/firebase-admin';

// Initialize Firebase Admin
initAdmin();

// GET handler to fetch a single product
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const slug = params.slug;
    
    const product = await Product.findOne({ slug });
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// PUT handler to update a product
export async function PUT(request, { params }) {
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
    
    const slug = params.slug;
    
    // Find the product
    const product = await Product.findOne({ slug });
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Process product data
    const data = await request.json();
    
    // Check if name is being changed, if so, update slug
    let newSlug = slug;
    if (data.name && data.name !== product.name) {
      newSlug = slugify(data.name);
      
      // Check if new slug already exists (except for this product)
      const existingProduct = await Product.findOne({ 
        slug: newSlug,
        _id: { $ne: product._id }
      });
      
      if (existingProduct) {
        return NextResponse.json(
          { message: 'A product with this name already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update product
    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      { 
        ...data, 
        slug: newSlug,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    return NextResponse.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a product
export async function DELETE(request, { params }) {
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
    
    const slug = params.slug;
    
    // Find and delete the product
    const product = await Product.findOneAndDelete({ slug });
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
} 