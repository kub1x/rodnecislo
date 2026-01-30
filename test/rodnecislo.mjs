import sinon from 'sinon';
import test from 'ava';

import { rodnecislo, RodneCislo } from '../src/lib/rodnecislo.mjs';

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
  t.true(rodnecislo('9206278653').isValid());
  t.false(rodnecislo('9206278653415161131868186').isValid());
  t.false(rodnecislo('9206278653fwefwefewfe').isValid());
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

test('rodne cislo returns error messages', (t) => {
  // Valid input - no error
  t.is(rodnecislo('110124/0415').error(), null);

  // Invalid inputs have errors
  t.not(rodnecislo('invalid').error(), null);
  t.not(rodnecislo('').error(), null);
  t.not(rodnecislo('123').error(), null);

  // Failed modulo condition
  t.is(rodnecislo('110124/0422').error(), 'Failed the modulo condition');

  // Invalid birth date (e.g., 31st of February)
  t.is(rodnecislo('110231/0410').error(), 'Invalid birth date');
});

test('rodne cislo determines gender', (t) => {
  // Male: month 01-12 or 21-32
  const male = rodnecislo('850215/1988');
  t.is(male.gender(), 'MALE');
  t.true(male.isMale());
  t.false(male.isFemale());

  // Male with +20 offset
  const maleOffset = rodnecislo('852215/7886');
  t.is(maleOffset.gender(), 'MALE');

  // Female: month 51-62 or 71-82
  const female = rodnecislo('855215/5117');
  t.is(female.gender(), 'FEMALE');
  t.false(female.isMale());
  t.true(female.isFemale());

  // Female with +20 offset
  const femaleOffset = rodnecislo('857215/5075');
  t.is(femaleOffset.gender(), 'FEMALE');
});

// Issue #53: Removed 2004 year limit for +20 addition to month. It seems
// to be backward applicable. 
// See: https://github.com/kub1x/rodnecislo/issues/53
//
// Law: Zákon č. 133/2000 Sb. - Head III - § 13 - odst. (5)
//      https://www.zakonyprolidi.cz/cs/2000-133#p13-5
test.skip('rodne cislo enables +20 offset only for year >=2004', (t) => {
  t.false(rodnecislo('222222/222').isValid());
  t.false(rodnecislo('222222/2222').isValid());
  t.true(rodnecislo('222222/2222').isPossible());
});

test('fix reported issue #53', (t) => {
  // Muž,Občan,1985-02-15,850215/1988 - VALID
  t.true(rodnecislo('850215/1988').isValid());
  t.is(rodnecislo('850215/1988').birthDate().toUTCString(), new Date(1985, 1, 15).toUTCString());
  // Muž,Cudzinec,1985-02-15,852215/7886 - NOT VALID BUT SHOULD BE
  t.true(rodnecislo('852215/7886').isValid());
  t.is(rodnecislo('852215/7886').birthDate().toUTCString(), new Date(1985, 1, 15).toUTCString());
  // Žena,Občan,1985-02-15,855215/5117 - VALID
  t.true(rodnecislo('855215/5117').isValid());
  t.is(rodnecislo('855215/5117').birthDate().toUTCString(), new Date(1985, 1, 15).toUTCString());
  // Žena,Cudzinec,1985-02-15,857215/5075 - NOT VALID BUT SHOULD BE
  t.true(rodnecislo('857215/5075').isValid());
  t.is(rodnecislo('857215/5075').birthDate().toUTCString(), new Date(1985, 1, 15).toUTCString());

  // Muž,Občan,1940-03-15,400315/913 - VALID
  t.true(rodnecislo('400315/913').isValid());
  t.is(rodnecislo('400315/913').birthDate().toUTCString(), new Date(1940, 2, 15).toUTCString());
  // Muž,Cudzinec,1940-03-15,402315/854 - NOT VALID BUT SHOULD BE
  t.true(rodnecislo('402315/854').isValid());
  t.is(rodnecislo('402315/854').birthDate().toUTCString(), new Date(1940, 2, 15).toUTCString());
  // Žena,Občan,1940-03-15,405315/657 - VALID
  t.true(rodnecislo('405315/657').isValid());
  t.is(rodnecislo('405315/657').birthDate().toUTCString(), new Date(1940, 2, 15).toUTCString());
  // Žena,Cudzinec,1940-03-15,407315/758 - NOT VALID BUT SHOULD BE
  t.true(rodnecislo('407315/758').isValid());
  t.is(rodnecislo('407315/758').birthDate().toUTCString(), new Date(1940, 2, 15).toUTCString());
});
