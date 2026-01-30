/**
 * CommonJS compatibility test
 *
 * Tests that the package can be required from CommonJS.
 * Run with: node test/commonjs-compat.cjs
 */

const assert = require('assert');

async function testCommonJSCompatibility() {
  console.log('Testing CommonJS compatibility...\n');

  // Test require() on package root
  console.log('Testing require("../")...');
  const pkg = require('../');

  assert.strictEqual(typeof pkg.rodnecislo, 'function', 'rodnecislo should be exported');
  console.log('✓ require("../") works');
  console.log('✓ rodnecislo factory function exported');

  assert.strictEqual(typeof pkg.RodneCislo, 'function', 'RodneCislo should be exported');
  console.log('✓ RodneCislo class exported');

  // Test factory function
  const rc = pkg.rodnecislo('111213/3121');

  assert.strictEqual(rc.isValid(), true, 'isValid() should return true');
  console.log('✓ isValid() works');

  assert.strictEqual(rc.year(), 2011, 'year() should return 2011');
  console.log('✓ year() works');

  assert.strictEqual(rc.gender(), 'MALE', 'gender() should return MALE');
  console.log('✓ gender() works');

  assert.strictEqual(rc.error(), null, 'error() should return null for valid input');
  console.log('✓ error() works');

  // Test class instantiation
  const instance = new pkg.RodneCislo('111213/3121');

  assert.strictEqual(instance instanceof pkg.RodneCislo, true, 'should be instanceof RodneCislo');
  console.log('✓ instanceof RodneCislo works');

  assert.strictEqual(instance.isValid(), true, 'instance.isValid() should return true');
  console.log('✓ class instance methods work');

  console.log('\n✅ All CommonJS compatibility tests passed!');
}

testCommonJSCompatibility().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
