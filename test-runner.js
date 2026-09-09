import {
  calculateMaterialArea,
  calculateMaterialCost,
  calculateCuttingDistance,
  calculateMachiningTime,
  calculateMachineCost,
  calculateTotalJobCost,
  computeJobEstimates
} from './src/utils/calculations.js';

import { validateJobInputs } from './src/utils/validation.js';
import { findSimilarJobs } from './src/utils/smartEstimation.js';
import { SAMPLE_JOBS } from './src/constants/sampleJobs.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`PASS: ${testName}`);
    passed++;
  } else {
    console.error(`FAIL: ${testName}`);
    failed++;
  }
}

console.log('--- Testing Calculations ---');
// Test 1: Area calculation (800mm x 600mm = 480,000 mm² = 0.48 m²)
const area = calculateMaterialArea(800, 600);
assert(area.areaSqMm === 480000, 'Material area in mm² should be 480,000');
assert(area.areaSqM === 0.48, 'Material area in m² should be 0.48');

// Test 2: Material cost (0.48 m² * ₹450 = ₹216)
const matCost = calculateMaterialCost(0.48, 450);
assert(matCost === 216, 'Material cost should be 216');

// Test 3: Machine hourly cost
// e.g. 0.5 hours (30 min) at ₹600/hr = ₹300
const macCost = calculateMachineCost(0.5, 600);
assert(macCost === 300, 'Machine cost should be 300 for 0.5 hrs at 600/hr');

// Test 4: Total job cost
const totalCost = calculateTotalJobCost(216, 300);
assert(totalCost === 516, 'Total job cost should equal matCost + macCost');

// Test 5: Full computeJobEstimates
const estimates = computeJobEstimates({
  length: 800,
  width: 600,
  thickness: 18,
  cuttingDepth: 18,
  toolDiameter: 6,
  feedRate: 2400,
  operations: 3,
  materialCostPerSqM: 450,
  machineHourlyCost: 600
});
assert(estimates.areaSqM === 0.48, 'Full compute: areaSqM = 0.48');
assert(estimates.materialCost === 216, 'Full compute: materialCost = 216');
assert(estimates.machiningTimeMinutes > 0, 'Full compute: machiningTimeMinutes > 0');
assert(estimates.machineCost > 0, 'Full compute: machineCost > 0');
assert(estimates.totalCost === Math.round((estimates.materialCost + estimates.machineCost) * 100) / 100, 'Full compute: totalCost = materialCost + machineCost');

console.log('\n--- Testing Validation Rules ---');
// Test 6: Valid inputs
const validRes = validateJobInputs({
  jobName: 'Test Job',
  materialType: 'MDF',
  length: 800,
  width: 600,
  thickness: 18,
  cuttingDepth: 18,
  toolDiameter: 6,
  feedRate: 2000,
  operations: 2,
  materialCostPerSqM: 450,
  machineHourlyCost: 600
});
assert(validRes.isValid === true, 'Valid inputs should pass validation');

// Test 7: Feed rate <= 0
const zeroFeedRes = validateJobInputs({
  jobName: 'Test Job',
  materialType: 'MDF',
  length: 800,
  width: 600,
  thickness: 18,
  cuttingDepth: 18,
  toolDiameter: 6,
  feedRate: 0,
  operations: 2,
  materialCostPerSqM: 450,
  machineHourlyCost: 600
});
assert(zeroFeedRes.isValid === false, 'Zero feed rate must fail validation');
assert(zeroFeedRes.errors.feedRate === 'Feed rate must be greater than zero.', 'Correct feed rate error message');

// Test 8: Cutting depth > material thickness
const deepCutRes = validateJobInputs({
  jobName: 'Test Job',
  materialType: 'MDF',
  length: 800,
  width: 600,
  thickness: 18,
  cuttingDepth: 25,
  toolDiameter: 6,
  feedRate: 2000,
  operations: 2,
  materialCostPerSqM: 450,
  machineHourlyCost: 600
});
assert(deepCutRes.isValid === false, 'Cutting depth > thickness must fail validation');
assert(deepCutRes.errors.cuttingDepth === 'Cutting depth cannot exceed material thickness.', 'Correct depth error message');

// Test 9: Zero or negative tool diameter
const zeroToolRes = validateJobInputs({
  jobName: 'Test Job',
  materialType: 'MDF',
  length: 800,
  width: 600,
  thickness: 18,
  cuttingDepth: 10,
  toolDiameter: 0,
  feedRate: 2000,
  operations: 2,
  materialCostPerSqM: 450,
  machineHourlyCost: 600
});
assert(zeroToolRes.isValid === false, 'Zero tool diameter must fail validation');
assert(zeroToolRes.errors.toolDiameter === 'Tool diameter must be greater than zero.', 'Correct tool error message');

console.log('\n--- Testing Smart Estimation ---');
// Test 10: Smart Estimation matching sample MDF job
const smartEst = findSimilarJobs({
  materialType: 'MDF',
  length: 850, // close to 800
  width: 620,  // close to 600
  toolDiameter: 6.0,
  operations: 3
}, SAMPLE_JOBS);
assert(smartEst.hasData === true, 'Smart estimation should find matching MDF sample job');
assert(smartEst.similarCount >= 1, 'Similar count should be at least 1');
assert(smartEst.typicalTimeRange.includes('minute'), 'Typical time range should include minutes');
assert(smartEst.costRange.includes('₹'), 'Cost range should include rupee symbol');

// Test 11: Smart Estimation with unknown material or no match
const smartEstNoMatch = findSimilarJobs({
  materialType: 'Titanium',
  length: 2000,
  width: 2000,
  toolDiameter: 25,
  operations: 10
}, SAMPLE_JOBS);
assert(smartEstNoMatch.hasData === false, 'No match should return hasData = false');
assert(smartEstNoMatch.message === 'Not enough historical data for a reliable comparison.', 'Empty state message matches specification');

console.log(`\n============================`);
console.log(`Tests Run: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED!');
}
