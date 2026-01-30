/**
 * Module loading tests
 *
 * These tests verify that the package can be properly imported
 * using ES modules from the built lib directory.
 */

import test from 'ava';

// Test ESM import from built lib
test('ESM import: rodnecislo factory function works', async t => {
  const { rodnecislo } = await import('../lib/rodnecislo.js');

  const rc = rodnecislo('111213/3121');
  t.true(rc.isValid());
  t.is(rc.year(), 2011);
  t.is(rc.gender(), 'MALE');
});

test('ESM import: RodneCislo class can be instantiated', async t => {
  const { RodneCislo } = await import('../lib/rodnecislo.js');

  const rc = new RodneCislo('111213/3121');
  t.true(rc instanceof RodneCislo);
  t.true(rc.isValid());
});

test('ESM import: all public methods are accessible', async t => {
  const { rodnecislo } = await import('../lib/rodnecislo.js');

  const rc = rodnecislo('111213/3121');

  // Validation methods
  t.is(typeof rc.isValid(), 'boolean');
  t.is(typeof rc.isPossible(), 'boolean');

  // Gender methods
  t.is(typeof rc.isMale(), 'boolean');
  t.is(typeof rc.isFemale(), 'boolean');
  t.true(['MALE', 'FEMALE'].includes(rc.gender()));

  // Date methods
  t.is(typeof rc.year(), 'number');
  t.is(typeof rc.month(), 'number');
  t.is(typeof rc.day(), 'number');
  t.true(rc.birthDate() instanceof Date);
  t.is(typeof rc.birthDateAsString(), 'string');

  // Age methods
  t.is(typeof rc.age(), 'number');
  t.is(typeof rc.isAdult(), 'boolean');
  t.is(typeof rc.isAdult(21), 'boolean');

  // Other methods
  t.is(typeof rc.dic(), 'string');
  t.true(rc.error() === null || typeof rc.error() === 'string');
});

test('ESM import: error() returns null for valid input', async t => {
  const { rodnecislo } = await import('../lib/rodnecislo.js');

  const rc = rodnecislo('111213/3121');
  t.is(rc.error(), null);
});

test('ESM import: error() returns string for invalid input', async t => {
  const { rodnecislo } = await import('../lib/rodnecislo.js');

  const rc = rodnecislo('invalid');
  t.is(typeof rc.error(), 'string');
  t.false(rc.isValid());
});
