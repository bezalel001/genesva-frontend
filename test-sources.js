// Simple test script to check data sources
const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/genes/stats/summary');
    const data = await response.json();
    console.log(`✅ API: ${data.total_genes} genes available`);
    return true;
  } catch (error) {
    console.log(`❌ API: ${error.message}`);
    return false;
  }
};

const testHealthCheck = async () => {
  try {
    const response = await fetch('http://localhost:8000/health');
    const data = await response.json();
    console.log(`✅ Backend health: ${data.status}`);
    return true;
  } catch (error) {
    console.log(`❌ Backend health: ${error.message}`);
    return false;
  }
};

console.log('Testing data sources...');
await testHealthCheck();
await testAPI();