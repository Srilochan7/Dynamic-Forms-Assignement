// Test database connection and Prisma setup
// Run with: node test-db-connection.js

const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

  try {
    // Test 1: Connect to database
    console.log('📡 Attempting to connect to database...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');

    // Test 2: Check if Product table exists
    console.log('📊 Checking Product table...');
    const productCount = await prisma.product.count();
    console.log(`✅ Product table exists with ${productCount} records`);

    // Test 3: Try to create a test product
    console.log('🧪 Creating test product...');
    const testProduct = await prisma.product.create({
      data: {
        name: `Test Product ${Date.now()}`,
        type: 'Test',
        batteryNeeded: false,
        features: ['Test'],
      },
    });
    console.log('✅ Test product created successfully:', testProduct);

    // Test 4: Clean up test product
    console.log('🧹 Cleaning up test product...');
    await prisma.product.delete({
      where: { id: testProduct.id },
    });
    console.log('✅ Test product cleaned up');

    // Test 5: List all products
    console.log('📋 Listing all products...');
    const allProducts = await prisma.product.findMany();
    console.log(`📊 Found ${allProducts.length} products in database`);

    console.log('🎉 All database tests passed!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
  }
}

// Run the test
testDatabaseConnection(); 