/**
 * CommonJS compatibility test
 *
 * This package is ESM-first ("type": "module").
 * CommonJS consumers can use dynamic import().
 *
 * Run with: node test/commonjs-compat.cjs
 */

const assert = require('assert');

async function testCommonJSCompatibility() {
  console.log('Testing CommonJS compatibility via dynamic import()...\n');

  // Dynamic import works in CommonJS
  const { rodnecislo, RodneCislo } = await import('../lib/rodnecislo.js');

  // Test factory function
  console.log('✓ rodnecislo factory function imported');
  const rc = rodnecislo('111213/3121');

  assert.strictEqual(rc.isValid(), true, 'isValid() should return true');
  console.log('✓ isValid() works');

  assert.strictEqual(rc.year(), 2011, 'year() should return 2011');
  console.log('✓ year() works');

  assert.strictEqual(rc.gender(), 'MALE', 'gender() should return MALE');
  console.log('✓ gender() works');

  assert.strictEqual(rc.error(), null, 'error() should return null for valid input');
  console.log('✓ error() works');

  // Test class instantiation
  console.log('✓ RodneCislo class imported');
  const instance = new RodneCislo('111213/3121');

  assert.strictEqual(instance instanceof RodneCislo, true, 'should be instanceof RodneCislo');
  console.log('✓ instanceof RodneCislo works');

  assert.strictEqual(instance.isValid(), true, 'instance.isValid() should return true');
  console.log('✓ class instance methods work');

  console.log('\n✅ All CommonJS compatibility tests passed!');
}

testCommonJSCompatibility().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
