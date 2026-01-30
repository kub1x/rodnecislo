/**
 * CommonJS compatibility test
 *
 * Tests that the package can be required from CommonJS.
 * This file is .cjs to ensure it runs in CommonJS mode.
 */

const test = require('ava');

test('CJS require: package exports rodnecislo and RodneCislo', t => {
  const pkg = require('../');

  t.is(typeof pkg.rodnecislo, 'function', 'rodnecislo should be a function');
  t.is(typeof pkg.RodneCislo, 'function', 'RodneCislo should be a function');
});

test('CJS require: rodnecislo factory function works', t => {
  const { rodnecislo } = require('../');

  const rc = rodnecislo('111213/3121');
  t.true(rc.isValid());
  t.is(rc.year(), 2011);
  t.is(rc.gender(), 'MALE');
  t.is(rc.error(), null);
});

test('CJS require: RodneCislo class can be instantiated', t => {
  const { RodneCislo } = require('../');

  const rc = new RodneCislo('111213/3121');
  t.true(rc instanceof RodneCislo);
  t.true(rc.isValid());
});

test('CJS require: all public methods are accessible', t => {
  const { rodnecislo } = require('../');

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

  // Other methods
  t.is(typeof rc.dic(), 'string');
  t.true(rc.error() === null || typeof rc.error() === 'string');
});
