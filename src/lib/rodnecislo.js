// rodnecislo.js
// version : 0.0.1
// authors : Jakub Podlaha
// license : MIT
// github.com/kub1x/rodnecislo

const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

const MONTH_OFFSET = 1;
const DEFAULT_ADULTHOOD = 18;

export function RodneCislo(value) {

  // PIN parts
  let _yy, _mm, _dd, _xxx,
  // Parsed birthdate
    _D, _M, _YYYY;
  // Gender
  let _gender = 'MALE';
  // PIN attributes
  let _longFormat = false;
  // Validation
  let _error = null;

  this.year = () => _YYYY;
  this.month = () => _M;
  this.day = () => _D;

  this.birthDate = () => new Date(_YYYY, _M, _D);
  this.birthDateAsString = () => `${_D}.${_M + MONTH_OFFSET}.${_YYYY}`;

  this.gender = () => _gender;
  this.isMale = () => _gender === GENDER.MALE;
  this.isFemale = () => _gender === GENDER.FEMALE;

  this.isValid = () => !_error;
  this.error = () => _error;

  this.isAdult = (adulthood = DEFAULT_ADULTHOOD) => this.age() >= adulthood;

  this.age = () => {
    // Current date parsed (ignoring +1 timezone)
    const now = new Date();
    const CYYYY = now.getFullYear();
    const CM = now.getMonth();
    const CD = now.getDate();

    let age = CYYYY - _YYYY;

    if (CM > _M) { return age; }
    if (CM < _M) { return --age; }

    // We're on the MONTH of the bday.

    return (CD > _D) ? age : --age;
  };

  this.toDIC = () => `CZ${_yy}${_mm}${_dd}${_xxx}`;


  /**
   * with OR without slash '/' between date part and distinction part
   * with 3 OR 4 digits of distinction part
   */
  const RODNECISLO_RE = /(\d\d)(\d\d)(\d\d)\/?(\d\d\d\d?)/;
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

  function parseRawInput(inputText) {
    const match = RODNECISLO_RE.exec(inputText);

    if (!match) {
      _error = 'Didn\'t match RegEx';
      return false;
    }

    _longFormat = match[MATCH_XX].length === LONG_XX_LENGTH;

    let whole, test, check;

    try {
      // Birth date parsed
      _yy = match[MATCH_YY];
      _mm = match[MATCH_MM];
      _dd = match[MATCH_DD];
      _xxx = match[MATCH_XX];

      if (_longFormat) {
        whole = `${match[MATCH_YY]}${match[MATCH_MM]}${match[MATCH_DD]}${match[MATCH_XX]}`;
        test = +whole.slice(BEGIN, LAST); // all but last
        check = +whole.slice(LAST);       // the last digit
        whole = +whole;                   // all of it
      }

    } catch (e) {
      _error = 'Failed to parse input string';
      return false;
    }

    if (_longFormat) {
      if (whole % MODULO === MODULO_RESULT) {
        // good old classic
      } else if (test % MODULO === MODULO_EXCEPTION_VALUE && check === MODULO_EXCEPTION_CHECK) {
        // the rare 1000 cases
      } else {
        _error = 'Failed the modulo condition';
        return false;
      }
    }
    return true;
  }

  const YEAR53 = 53;
  const CENT19 = 1900;
  const CENT20 = 2000;

  const WOMAN_MM_ADDITION = 50;
  const EXTRA_MM_ADDITION = 20;

  function isDateValid(y, m, d) {
    const date = new Date(y, m, d);
    const convertedDate = `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
    const givenDate = `${y}${m}${d}`;

    return (givenDate === convertedDate);
  }

  function parseBirthDate() {
    // Year
    _YYYY = +_yy;
    if (!_longFormat && _YYYY <= YEAR53) {
      // since ever - 31.12.1953
      _YYYY += CENT19;
    } else if (_longFormat && _YYYY > YEAR53) {
      // 1.1.1954 - 31.12.1999
      _YYYY += CENT19;
    } else if (_longFormat && _YYYY <= YEAR53) {
      // 1.1.2000 - 31.12.2053
      _YYYY += CENT20;
    } else {
      // NOTE This never happends as it would be the same as for 1954-2000
      // 1.1.2054 - until ever
      _error = 'We didn\'t think about this yet...';
      return false;
    }

    // Month and Gender
    _M = +_mm;

    // Women have month + 50
    if (_M > WOMAN_MM_ADDITION) {
      _gender = GENDER.FEMALE;
      _M %= WOMAN_MM_ADDITION;
    }

    // Sometimes men/women get extra month + 20
    _M %= EXTRA_MM_ADDITION;

    // Ok
    _M -= MONTH_OFFSET;
    _D = +_dd;

    // Final birthdate validation
    if (!isDateValid(_YYYY, _M, _D)) {
      _error = 'Invalid birth date';
      return false;
    }

    return true;
  }

  parseRawInput(value);
  parseBirthDate();

  return this;

} // RodneCislo

export function rodnecislo(value) {
  return new RodneCislo(value);
}

rodnecislo.version = '0.0.1';
