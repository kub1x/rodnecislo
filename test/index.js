import test from 'ava';
import 'babel-core/register';

import rodnecislo from '../src/lib/';

test('rodnecislo', (t) => {
  t.is(rodnecislo(), true);
});
