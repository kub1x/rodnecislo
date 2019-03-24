import sinon from 'sinon';
import test from 'ava';

import { rodnecislo, RodneCislo } from '../src/lib/rodnecislo';

// Mock new Date()

const NOW_SEC = 1485865800000; // 31.1.2017 13:30

let clock;

test.before(() => {
  clock = sinon.useFakeTimers(NOW_SEC);
});

test.after(() => {
  clock.restore();
});

// Tests

test('constructor returns RodneCislo', (t) => {
  const v = rodnecislo();

  t.truthy(v);
  t.true(v instanceof RodneCislo);
});

test('rodne cislo is invalid for invalid values', (t) => {
  t.false(rodnecislo().isValid());
  t.false(rodnecislo({}).isValid());
  t.false(rodnecislo([]).isValid());
  t.false(rodnecislo('').isValid());
  t.false(rodnecislo('/').isValid());
  t.false(rodnecislo('sadf').isValid());
  t.false(rodnecislo('123').isValid());
  t.false(rodnecislo('000000/0000').isValid());
  t.false(rodnecislo('110124/0422').isValid()); // Invalid modulo 11 condition
  t.false(rodnecislo('521111/1114').isValid()); // Birth date in future is invalid
  t.true(rodnecislo('521111/1114').isPossible()); // Birth date in future is possible
});

test('rodne cislo is valid for valid values', (t) => {
  t.true(rodnecislo('111111/111').isValid());
  t.true(rodnecislo('110124/041').isValid());
  t.true(rodnecislo('110124/0415').isValid());
  t.true(rodnecislo('110124/0426').isValid());
});

test('rodne cislo determines years by PIN length', (t) => {
  const YEAR_SHORT = 1911;
  const YEAR_LONG = 2011;

  t.is(rodnecislo('110124/041').year(), YEAR_SHORT);
  t.is(rodnecislo('110124/0426').year(), YEAR_LONG);
  t.is(rodnecislo('110124/0422').year(), YEAR_LONG); // even for invalid PINs
});

test('rodne cislo parses the birth date', (t) => {
  const PIN = '110124/0415';
  const YEAR = 2011;
  const MONTH_INDEX = 0;
  const MONTH = 1;
  const DAY = 24;
  const BIRTH_DATE = `${DAY}.${MONTH}.${YEAR}`;

  t.is(rodnecislo(PIN).year(), YEAR);
  t.is(rodnecislo(PIN).month(), MONTH_INDEX);
  t.is(rodnecislo(PIN).day(), DAY);
  t.is(rodnecislo(PIN).birthDate().toUTCString(), new Date(YEAR, MONTH_INDEX, DAY).toUTCString());
  t.is(rodnecislo(PIN).birthDateAsString(), BIRTH_DATE);
});

test('rodne cislo finds out who is adult (over 18)', (t) => {
  t.true(rodnecislo('990130/1113').isAdult());
  t.true(rodnecislo('990131/1112').isAdult());
  t.false(rodnecislo('990201/1119').isAdult());

  const US_ADULTHOOD_AGE = 21;

  t.true(rodnecislo('960130/1413').isAdult(US_ADULTHOOD_AGE));
  t.true(rodnecislo('960131/1412').isAdult(US_ADULTHOOD_AGE));
  t.false(rodnecislo('960201/1419').isAdult(US_ADULTHOOD_AGE));
});

test('rodne cislo returns age', (t) => {
  const Y17 = 17;
  const Y18 = 18;

  t.is(rodnecislo('990130/1113').age(), Y18);
  t.is(rodnecislo('990131/1112').age(), Y18);
  t.is(rodnecislo('990201/1119').age(), Y17);
});

test('rodne cislo returns negative age when born tomorrow', (t) => {
  const Y100 = 100;
  const MONTH_INDEX = 0;
  const DAY_INCREMENT = 0;
  const REQUIRED_AGE = -1;
  const MODULO11 = 11;

  const now = new Date();
  const YY = now.getFullYear() % Y100; // Last two digits
  const MM = now.getMonth() + MONTH_INDEX; // Months starts from 0
  const DD = now.getDate() + DAY_INCREMENT; // Tomorrow!

  let RC = `${YY}${MM}${DD}0000`; // Add four digits suffix

  RC += MODULO11 - RC % MODULO11; // Fix the modulo condition

  t.is(rodnecislo(RC).age(), REQUIRED_AGE);
});

test('rodne cislo generates DIC', (t) => {
  t.is(rodnecislo('990130/1113').dic(), 'CZ9901301113');
  t.is(rodnecislo('990131/1112').dic(), 'CZ9901311112');
  t.is(rodnecislo('990201/1119').dic(), 'CZ9902011119');
});

test('rodne cislo enables +20 offset only for year >=2004', (t) => {
  t.false(rodnecislo('222222/222').isValid());
  t.false(rodnecislo('222222/2222').isValid());
  t.true(rodnecislo('222222/2222').isPossible());
});

