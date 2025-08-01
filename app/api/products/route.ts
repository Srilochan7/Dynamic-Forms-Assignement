import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Add a simple GET endpoint for testing
export async function GET() {
  console.log("🔍 GET /api/products called");
  
  try {
    // Test database connection first
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`✅ GET: Found ${products.length} products`);
    
    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
      message: "API route is working correctly"
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("💥 GET Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error",
      message: "API route is accessible but database error occurred"
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log("🚀 POST /api/products called");
  console.log("📋 Request URL:", req.url);
  console.log("📋 Request method:", req.method);
  console.log("📋 Request headers:", Object.fromEntries(req.headers.entries()));
  
  try {
    // Parse request body
    const body = await req.json();
    console.log("📦 Request Body:", JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.name || !body.type) {
      console.log("❌ Validation failed: Missing required fields");
      console.log("❌ Received body:", body);
      return NextResponse.json({
        success: false,
        error: "Missing required fields: name and type are required",
        received: body
      }, { status: 400 });
    }

    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Prepare data for Prisma
    const productData = {
      name: body.name,
      type: body.type,
      batteryNeeded: body.batteryNeeded ?? false,
      batteryType: body.batteryType || null,
      features: body.features || [],
      imageUrl: body.imageUrl || null,
    };

    console.log("🔧 Data being sent to Prisma:", JSON.stringify(productData, null, 2));

    // Create product in database
    const newProduct = await prisma.product.create({
      data: productData,
    });

    console.log("✅ Product created successfully:", JSON.stringify(newProduct, null, 2));

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: "Product created successfully"
    }, { status: 201 });

  } catch (error: any) {
    console.error("💥 POST Error:", error);
    console.error("💥 Error stack:", error.stack);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: "A product with this name already exists"
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      message: "API route is accessible but error occurred during processing"
    }, { status: 500 });
  }
}
