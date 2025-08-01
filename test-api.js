// Simple test script to debug the API route
// Run this with: node test-api.js

const testProduct = {
  name: "Test Product",
  type: "Electronics",
  batteryNeeded: true,
  batteryType: "Lithium-ion",
  features: ["Wireless", "Portable"],
  imageUrl: "https://example.com/image.jpg"
};

async function testAPI() {
  try {
    console.log("🧪 Testing POST /api/products...");
    console.log("📦 Sending data:", JSON.stringify(testProduct, null, 2));

    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProduct),
    });

    const result = await response.json();
    
    console.log("📊 Response status:", response.status);
    console.log("📄 Response body:", JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log("✅ API test successful!");
    } else {
      console.log("❌ API test failed!");
    }

  } catch (error) {
    console.error("💥 Test error:", error);
  }
}

// Test GET endpoint
async function testGET() {
  try {
    console.log("\n🧪 Testing GET /api/products...");

    const response = await fetch('http://localhost:3000/api/products');
    const result = await response.json();
    
    console.log("📊 Response status:", response.status);
    console.log("📄 Response body:", JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log("✅ GET test successful!");
    } else {
      console.log("❌ GET test failed!");
    }

  } catch (error) {
    console.error("💥 GET test error:", error);
  }
}

// Run tests
testAPI().then(() => {
  setTimeout(testGET, 1000); // Wait 1 second before testing GET
}); 