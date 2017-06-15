/// <reference path="../src/lib/rodnecislo.d.ts" />

import { rodnecislo } from '../src/lib/rodnecislo';

let rc = rodnecislo('111111/1111');
rc.isValid();
rc.isMale();
rc.isFemale();
rc.year();
rc.month();
rc.day();
rc.birthDate();
rc.birthDateAsString();
rc.isAdult();
rc.age();
rc.dic();
