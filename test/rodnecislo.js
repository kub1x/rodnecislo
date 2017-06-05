import test from 'ava';
import 'babel-core/register';

import { rodnecislo, RodneCislo } from '../src/lib/';

test('constructor returns RodneCislo', (t) => {
  const v = rodnecislo();

  t.truthy(v);
  t.true(v instanceof RodneCislo);
});

test('rodne cislo is invalid for invalid values', (t) => {
  t.false(rodnecislo().isValid());
  t.false(rodnecislo('').isValid());
  t.false(rodnecislo('sadf').isValid());
  t.false(rodnecislo('123').isValid());
  t.false(rodnecislo('000000/0000').isValid());
});

test('rodne cislo is valid for valid values', (t) => {
  t.true(rodnecislo('110124/041').isValid());
  t.true(rodnecislo('110124/0415').isValid());
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

test('rodne cislo finds out who is adult', (t) => {
  t.true(rodnecislo('770124/0415').isAdult());
  t.false(rodnecislo('110124/0415').isAdult());
});
