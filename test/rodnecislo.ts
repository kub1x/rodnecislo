/// <reference path="../lib/rodnecislo.d.ts" />

import { rodnecislo, RodneCislo } from '../lib/rodnecislo';

// Test factory function
let rc = rodnecislo('111111/1111');

// Test all methods exist with correct return types
const valid: boolean = rc.isValid();
const possible: boolean = rc.isPossible();
const male: boolean = rc.isMale();
const female: boolean = rc.isFemale();
const gender: 'MALE' | 'FEMALE' = rc.gender();
const year: number = rc.year();
const month: number = rc.month();
const day: number = rc.day();
const birthDate: Date = rc.birthDate();
const birthDateStr: string = rc.birthDateAsString();
const adult: boolean = rc.isAdult();
const adultCustom: boolean = rc.isAdult(21);
const age: number = rc.age();
const dic: string = rc.dic();
const error: string | null = rc.error();

// Test class export for instanceof
const instance = new RodneCislo('111111/1111');
const isInstance: boolean = instance instanceof RodneCislo;
