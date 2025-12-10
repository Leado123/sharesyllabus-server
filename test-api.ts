/**
 * API Test Suite for api.sharesyllabus.me
 * Run with: bun run test-api.ts
 */

const SERVER = "https://api.sharesyllabus.me";

interface TestResult {
  name: string;
  success: boolean;
  status?:  number;
  response?: any;
  error?: string;
}

const results: TestResult[] = [];

async function testEndpoint(
  name: string,
  url: string,
  options?:  RequestInit
): Promise<TestResult> {
  console.log(`\n🔄 Testing:  ${name}`);
  console.log(`   URL: ${url}`);
  
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type");
    
    let data;
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    const result: TestResult = {
      name,
      success: response. ok,
      status: response. status,
      response: data,
    };
    
    console.log(`   Status: ${response.status} ${response.ok ? "✅" : "❌"}`);
    console.log(`   Response: `, typeof data === "object" ? JSON.stringify(data, null, 2).substring(0, 200) + "..." : data. substring(0, 200));
    
    results.push(result);
    return result;
  } catch (error) {
    const result: TestResult = {
      name,
      success: false,
      error: error instanceof Error ?  error.message : String(error),
    };
    
    console.log(`   Error: ${result.error} ❌`);
    results.push(result);
    return result;
  }
}

async function runTests() {
  console.log("🚀 Starting API Tests for api.sharesyllabus. me");
  console.log("=".repeat(60));

  // 1. Health Check / Basic Connectivity
  await testEndpoint("Basic Server Connectivity", `${SERVER}/`);

  // 2. Search Endpoint (GET) - Empty query
  await testEndpoint(
    "Search - Empty Query",
    `${SERVER}/search/?q=`,
    { method: "GET" }
  );

  // 3. Search Endpoint (GET) - With query
  await testEndpoint(
    "Search - With Query",
    `${SERVER}/search/?q=math`,
    { method: "GET" }
  );

  // 4. Search with filters
  await testEndpoint(
    "Search - With School Filter",
    `${SERVER}/search/?q=&s=RCCD`,
    { method: "GET" }
  );

  // 5. Get Schools List
  await testEndpoint(
    "Get Schools List",
    `${SERVER}/schools`,
    { method: "GET" }
  );

  // 6. Search Professor (POST)
  await testEndpoint(
    "Search Professor",
    `${SERVER}/search/professor/?q=smith&s=RCCD`,
    { 
      method: "POST",
      headers: { "Content-Type": "application/json" }
    }
  );

  // 7. Get Syllabus by ID (replace with a valid ID if you have one)
  await testEndpoint(
    "Get Syllabus by ID",
    `${SERVER}/syllabus/test-id`,
    { method: "GET" }
  );

  // 8. File Download Endpoint
  await testEndpoint(
    "File Download",
    `${SERVER}/files/test-file.pdf`,
    { method: "GET" }
  );

  // 9. Report Submission (POST) - Will likely fail without valid syllabus ID
  await testEndpoint(
    "Submit Report",
    `${SERVER}/report/test-syllabus-id`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportType: "syllabus",
        reportTitle: "Test Report",
        reportBody: "This is a test report",
        reportBy: "test@example.com",
        syllabusId: "test-syllabus-id"
      })
    }
  );

  // 10. Moderator Login (POST) - Will fail with invalid credentials
  await testEndpoint(
    "Moderator Login",
    `${SERVER}/moderator/login`,
    {
      method: "POST",
      headers: { "Content-Type":  "application/json" },
      body: JSON.stringify({
        username: "test",
        password: "test"
      })
    }
  );

  // 11. Admin - Get Reports (POST) - Requires auth
  await testEndpoint(
    "Admin - Get Reports",
    `${SERVER}/admin/getreports`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "test" })
    }
  );

  // 12. Admin - Get Whole Database (POST) - Requires auth
  const formData = new FormData();
  formData.append("username", "test");
  await testEndpoint(
    "Admin - Get Whole Database",
    `${SERVER}/admin/wholedatabase`,
    {
      method: "POST",
      body:  formData
    }
  );

  // 13. Admin - Get Syllabus (POST) - Requires auth
  await testEndpoint(
    "Admin - Get Syllabus",
    `${SERVER}/admin/getsyllabus/test-id`,
    {
      method: "POST",
      headers: { "Content-Type":  "application/json" },
      body: JSON.stringify({ username: "test" })
    }
  );

  // 14. Create Syllabus (POST) - File upload test
  const uploadFormData = new FormData();
  uploadFormData.append("className", "TEST-101");
  uploadFormData.append("schoolName", "RCCD");
  uploadFormData.append("professor", "Test Professor");
  uploadFormData.append("classLength", "16");
  uploadFormData.append("textbookCost", "$0");
  uploadFormData.append("description", "Test description");
  uploadFormData.append("createdByName", "Test User");
  uploadFormData.append("createdByEmail", "test@example.com");
  // Note: No file attached - this should fail validation
  await testEndpoint(
    "Create Syllabus (No File)",
    `${SERVER}/create`,
    {
      method: "POST",
      body: uploadFormData
    }
  );

  // Print Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total:   ${results.length}`);
  
  console.log("\n📋 Results by endpoint:");
  results.forEach(r => {
    const icon = r.success ? "✅" : "❌";
    const statusInfo = r.status ? `(${r.status})` : r.error ?  `(${r.error})` : "";
    console.log(`   ${icon} ${r.name} ${statusInfo}`);
  });
}

// Run the tests
runTests().catch(console.error);