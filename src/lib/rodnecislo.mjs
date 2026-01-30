// rodnecislo.mjs
// authors : Jakub Podlaha
// license : MIT
// repo: github.com/kub1x/rodnecislo

const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

const MONTH_OFFSET = 1;
const DEFAULT_ADULTHOOD = 18;
const AGE_WHEN_BORN = 0;

/**
 * with OR without slash '/' between date part and distinction part
 * with 3 OR 4 digits of distinction part
 */
const RODNECISLO_RE = /^(\d\d)(\d\d)(\d\d)\/?(\d\d\d\d?)$/;
const MATCH_YY = 1;
const MATCH_MM = 2;
const MATCH_DD = 3;
const MATCH_XX = 4;

const LONG_XX_LENGTH = 4;

const BEGIN = 0;
const LAST = -1;

const MODULO = 11;
const MODULO_RESULT = 0;
const MODULO_EXCEPTION_VALUE = 10;
const MODULO_EXCEPTION_CHECK = 0;

const YEAR53 = 53;
const CENT19 = 1900;
const CENT20 = 2000;

const WOMAN_MM_ADDITION = 50;
const EXTRA_MM_ADDITION = 20;


class RodneCislo {
  #yy;
  #mm;
  #dd;
  #xxx;

  #D;
  #M;
  #YYYY;

  #gender = GENDER.MALE;

  #longFormat = false;
  #error = null;
  
  constructor(value) {
    this.year = () => this.#YYYY;
    this.month = () => this.#M;
    this.day = () => this.#D;

    this.birthDate = () => new Date(this.#YYYY, this.#M, this.#D);
    this.birthDateAsString = () => `${this.#D}.${this.#M + MONTH_OFFSET}.${this.#YYYY}`;

    this.dic = () => `CZ${this.#yy}${this.#mm}${this.#dd}${this.#xxx}`;

    this.gender = () => this.#gender;
    this.isMale = () => this.#gender === GENDER.MALE;
    this.isFemale = () => this.#gender === GENDER.FEMALE;

    this.isValid = () => !this.#error && this.age() >= AGE_WHEN_BORN;
    this.isPossible = () => !this.#error;
    this.error = () => this.#error;

    this.isAdult = (adulthood = DEFAULT_ADULTHOOD) => this.age() >= adulthood;

    this.#parseRawInput(value);
    this.#parseBirthDate();
  }

  age() {
    // Current date parsed (ignoring +1 timezone)
    const now = new Date();
    const CYYYY = now.getFullYear();
    const CM = now.getMonth();
    const CD = now.getDate();

    let age = CYYYY - this.#YYYY;

    if (CM > this.#M) { return age; }
    if (CM < this.#M) { return --age; }

    // We're on the MONTH of the bday.

    // NOTE In Czech you reach certain age at the beginning of your birthday.
    return (CD >= this.#D) ? age : --age;
  }

  #parseRawInput(inputText) {
    const match = RODNECISLO_RE.exec(inputText);

    if (!match) {
      this.#error = 'Didn\'t match RegEx';
      return false;
    }

    this.#longFormat = match[MATCH_XX].length === LONG_XX_LENGTH;

    // Birth date parsed
    this.#yy = match[MATCH_YY];
    this.#mm = match[MATCH_MM];
    this.#dd = match[MATCH_DD];
    this.#xxx = match[MATCH_XX];

    if (this.#longFormat) {
      const whole = `${match[MATCH_YY]}${match[MATCH_MM]}${match[MATCH_DD]}${match[MATCH_XX]}`;
      const test = +whole.slice(BEGIN, LAST); // all but last
      const check = +whole.slice(LAST); // the last digit

      if (+whole % MODULO === MODULO_RESULT) {
        // good old classic
      } else if (test % MODULO === MODULO_EXCEPTION_VALUE && check === MODULO_EXCEPTION_CHECK) {
        // the rare 1000 cases
      } else {
        this.#error = 'Failed the modulo condition';
        return false;
      }
    }
    return true;
  }

  #parseBirthYear() {
    this.#YYYY = +this.#yy;
    if (!this.#longFormat && this.#YYYY <= YEAR53) {
      // since ever - 31.12.1953
      this.#YYYY += CENT19;
    } else if (this.#longFormat && this.#YYYY > YEAR53) {
      // 1.1.1954 - 31.12.1999
      this.#YYYY += CENT19;
    } else if (this.#longFormat && this.#YYYY <= YEAR53) {
      // 1.1.2000 - 31.12.2053
      this.#YYYY += CENT20;
    } else {
      // Short format with year > 53: malformed input or regex didn't match
      this.#error = this.#error || 'Invalid birth year format';
      return false;
    }
    return true;
  }

  #parseBirthMonth() {
    // Month and Gender
    this.#M = +this.#mm;

    // Women have month + 50
    if (this.#M > WOMAN_MM_ADDITION) {
      this.#gender = GENDER.FEMALE;
      this.#M -= WOMAN_MM_ADDITION;
    }

    // Sometimes men/women get extra month + 20
    if (this.#M > EXTRA_MM_ADDITION) {
      this.#M -= EXTRA_MM_ADDITION;
    }

    // Ok
    this.#M -= MONTH_OFFSET;
    this.#D = +this.#dd;

    return true;
  }

  #doesBirthdateExist() {
    const date = new Date(this.#YYYY, this.#M, this.#D);
    const convertedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    const givenDate = `${this.#YYYY}-${this.#M}-${this.#D}`;

    // Final birthdate validation
    if (givenDate !== convertedDate) {
      this.#error = 'Invalid birth date';
      return false;
    }
    return true;
  }

  #parseBirthDate() {
    return this.#parseBirthYear()
      && this.#parseBirthMonth()
      && this.#doesBirthdateExist();
  }

} // RodneCislo

function rodnecislo(value) {
  return new RodneCislo(value);
};

export { rodnecislo, RodneCislo };
