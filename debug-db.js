// Database debugging script
// Run this with: node debug-db.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

async function testDatabase() {
  try {
    console.log("🔍 Testing database connection...");
    
    // Test connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");
    
    // Test if we can query the Product table
    const productCount = await prisma.product.count();
    console.log(`📊 Found ${productCount} products in database`);
    
    // Test creating a product
    console.log("🧪 Testing product creation...");
    const testProduct = await prisma.product.create({
      data: {
        name: "Debug Test Product",
        type: "Test",
        batteryNeeded: false,
        features: ["Debug", "Test"],
      },
    });
    console.log("✅ Test product created:", testProduct);
    
    // Clean up - delete the test product
    await prisma.product.delete({
      where: { id: testProduct.id },
    });
    console.log("🧹 Test product cleaned up");
    
  } catch (error) {
    console.error("❌ Database test failed:", error);
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Database disconnected");
  }
}

testDatabase(); 