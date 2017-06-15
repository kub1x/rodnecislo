export function rodnecislo(rc: string): RodneCislo;

export interface RodneCislo {
  isValid(): boolean

  isMale(): boolean
  isFemale(): boolean

  year(): number
  month(): number
  day(): number

  birthDate(): Date
  birthDateAsString(): string

  isAdult(adulthood?: number): boolean
  age(): number

  dic(): string
}
