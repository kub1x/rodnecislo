export function rodnecislo(rc: string): RodneCislo;

export class RodneCislo {
  constructor(value: string);

  isPossible(): boolean;
  isValid(): boolean;

  isMale(): boolean;
  isFemale(): boolean;
  gender(): 'MALE' | 'FEMALE';

  year(): number;
  month(): number;
  day(): number;

  birthDate(): Date;
  birthDateAsString(): string;

  isAdult(adulthood?: number): boolean;
  age(): number;

  dic(): string;

  error(): string | null;
}
