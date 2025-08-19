/**
 * Test runner utilities for organizing and running tests
 */

/**
 * Run tests for a specific module with setup and teardown
 */
const runModuleTests = async (moduleName, testFn, setup = null, teardown = null) => {
  describe(moduleName, () => {
    let moduleInstance;
    
    beforeAll(async () => {
      if (setup) {
        moduleInstance = await setup();
      }
    });
    
    afterAll(async () => {
      if (teardown && moduleInstance) {
        await teardown(moduleInstance);
      }
    });
    
    testFn(moduleInstance);
  });
};

/**
 * Create test suite for API endpoints
 */
const createAPITestSuite = (endpoint, methods = ['GET', 'POST']) => {
  return {
    testGet: methods.includes('GET') ? (testFn) => {
      describe(`GET ${endpoint}`, testFn);
    } : null,
    
    testPost: methods.includes('POST') ? (testFn) => {
      describe(`POST ${endpoint}`, testFn);
    } : null,
    
    testPut: methods.includes('PUT') ? (testFn) => {
      describe(`PUT ${endpoint}`, testFn);
    } : null,
    
    testDelete: methods.includes('DELETE') ? (testFn) => {
      describe(`DELETE ${endpoint}`, testFn);
    } : null,
  };
};

/**
 * Test data validation helper
 */
const validateTestData = (data, schema) => {
  const errors = [];
  
  Object.keys(schema).forEach(key => {
    if (schema[key].required && !(key in data)) {
      errors.push(`Missing required field: ${key}`);
    }
    
    if (key in data && schema[key].type && typeof data[key] !== schema[key].type) {
      errors.push(`Invalid type for ${key}: expected ${schema[key].type}, got ${typeof data[key]}`);
    }
  });
  
  return errors;
};

/**
 * Performance test helper
 */
const performanceTest = async (testName, testFn, maxDuration = 1000) => {
  const startTime = Date.now();
  await testFn();
  const duration = Date.now() - startTime;
  
  expect(duration).toBeLessThan(maxDuration);
  console.log(`Performance test "${testName}": ${duration}ms`);
};

module.exports = {
  runModuleTests,
  createAPITestSuite,
  validateTestData,
  performanceTest,
};