declare function rodnecislo(rc: string): rodnecislo.RodneCislo;

declare namespace rodnecislo {
  interface RodneCislo extends Object {
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
}

export = rodnecislo
