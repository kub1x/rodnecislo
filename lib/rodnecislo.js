'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RodneCislo = RodneCislo;
exports.rodnecislo = rodnecislo;
// rodnecislo.js
// version : 0.0.1
// authors : Jakub Podlaha
// license : MIT
// github.com/kub1x/rodnecislo

/**
 * PIN_RE = RegExp pro rodné číslo (Personal Identification Number). Lomítko je moznou součástí.
 *
 * 1 - 00-99 pro první dvojčíslí (ročník)
 * 2 - pro druhé dvojčíslí
 *   a - 01-12 (měsíc muž)
 *   b - 21-32 (měsíc muž, viz: *@)
 *   c - 51-62 (měsíc žena)
 *   d - 71-82 (měsíc žena, viz: *@)
 * 3 - 01-31 pro třetí dvojčíslí (den)
 * 4 - lomítko
 * 5 - 000-9999 pro část za lomítkem
 *
 * *@: Od roku 2004 (zákonem č. 53/2004 Sb.) je zavedena možnost v případě, že
 * jsou v nějaký den vyčerpána všechna platná čtyřčíslí, použít alternativní
 * rodné číslo, u kterého mají muži k číslu měsíce přičteno číslo 20 a ženy 70.
 *
 * / |   1   |      2a      |       2b      |       2c      |       2d       |             3          |4 |    5   | /
 * /^\d{0,2}((0[1-9]|1[0-2])|(2[1-9]|3[0-2])|(5[1-9]|6[0-2])|(7[1-9]|8[0-2]))(0[1-9]|[1-2][0-9]|3[01])\/?[0-9]{3,4}$/;
 */

/**
 * HISTORY
 * before 1953
 *  - format "yymmdd/xxx"
 *  - women have mm+50
 *  - xxx is birth order in the day
 *
 * after 1953
 *  - format "yymmdd/xxxc"
 *  - women have mm+50
 *  - whole pin is divisible by 11
 *  - if (+"yymmddxxx" % 11 === 10 && "c" === "0") then the pin is valid
 *
 * after 1985
 *  - the "pin % 11 === 10" exception was removed
 *
 * after 2004
 *  - men can also have mm+20
 *  - women can also have mm+70
 *
 * THUS
 * - short format  =>  before 1953
 * - long format and yy < 53  =>  yyyy = 20yy
 * - who knows what comes after 2053...
 *
 */

var GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

var MONTH_OFFSET = 1;
var DEFAULT_ADULTHOOD = 18;

function RodneCislo(value) {

  // PIN parts
  var _yy = void 0,
      _mm = void 0,
      _dd = void 0,

  // Parsed birthdate
  _D = void 0,
      _M = void 0,
      _YYYY = void 0;
  // Gender
  var _gender = 'MALE';
  // PIN attributes
  var _longFormat = false;
  // Validation
  var _error = null;

  this.year = function () {
    return +_YYYY;
  };
  this.month = function () {
    return +_M;
  };
  this.day = function () {
    return +_D;
  };

  this.birthDate = function () {
    return new Date(_YYYY, _M, _D);
  };
  this.birthDateAsString = function () {
    return _D + '.' + (_M + MONTH_OFFSET) + '.' + _YYYY;
  };

  this.gender = function () {
    return _gender;
  };
  this.isMale = function () {
    return _gender === GENDER.MALE;
  };
  this.isFemale = function () {
    return _gender === GENDER.FEMALE;
  };

  this.isValid = function () {
    return !_error;
  };
  this.error = function () {
    return _error;
  };

  this.isAdult = function () {
    var adulthood = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_ADULTHOOD;


    // Current date parsed (ignoring +1 timezone)
    var now = new Date();
    var CYYYY = now.getFullYear();
    var CM = now.getMonth();
    var CD = now.getDate();

    // Yes.. we colud do some hacky one liner, but
    // this just feels less hackturbating.

    if (CYYYY - _YYYY < +adulthood) {
      return false;
    }
    if (CYYYY - _YYYY > +adulthood) {
      return true;
    }

    // We're on the year of the adulthood bday.

    if (CM < _M) {
      return false;
    }
    if (CM > _M) {
      return true;
    }

    // We're on the MONTH of the adulthood bday.

    if (CD < _D) {
      return false;
    }
    if (CD > _D) {
      return true;
    }

    // HAPPY BIRTHDAY!!! And also wait for tomorrow shall we..?
    return false;
  };

  /**
   * with OR without slash '/' between date part and distinction part
   * with 3 OR 4 digits of distinction part
   */
  var RODNECISLO_RE = /(\d\d)(\d\d)(\d\d)\/?(\d\d\d\d?)/;
  var MATCH_YY = 1;
  var MATCH_MM = 2;
  var MATCH_DD = 3;
  var MATCH_XX = 4;

  var LONG_XX_LENGTH = 4;

  var BEGIN = 0;
  var LAST = -1;

  var MODULO = 11;
  var MODULO_RESULT = 0;
  var MODULO_EXCEPTION_VALUE = 10;
  var MODULO_EXCEPTION_CHECK = 0;

  var YEAR53 = 53;
  var CENT19 = 1900;
  var CENT20 = 2000;

  var WOMAN_MM_ADDITION = 50;
  var EXTRA_MM_ADDITION = 20;

  var MONTH_MIN = 1;
  var MONTH_MAX = 12;

  function parse(inputText) {

    var match = RODNECISLO_RE.exec(inputText);

    if (!match) {
      _error = 'Didn\'t match RegEx';
      return;
    }

    _longFormat = match[MATCH_XX].length === LONG_XX_LENGTH;

    var whole = void 0,
        test = void 0,
        check = void 0;

    try {
      // Birth date parsed
      _yy = +match[MATCH_YY];
      _mm = +match[MATCH_MM];
      _dd = +match[MATCH_DD];

      if (_longFormat) {
        whole = '' + match[MATCH_YY] + match[MATCH_MM] + match[MATCH_DD] + match[MATCH_XX];
        test = +whole.slice(BEGIN, LAST); // all but last
        check = +whole.slice(LAST); // the last digit
        whole = +whole; // all of it
      }
    } catch (e) {
      _error = 'Failed to parse input string';
    }

    // Modulo condition
    if (_longFormat) {
      if (whole % MODULO === MODULO_RESULT) {
        // good old classic
      } else if (test % MODULO === MODULO_EXCEPTION_VALUE && check === MODULO_EXCEPTION_CHECK) {
        // the rare 1000 cases
      } else {
        _error = 'Failed the modulo condition';
      }
    }

    // Year
    _YYYY = _yy;
    if (!_longFormat && _yy <= YEAR53) {
      // since ever - 31.12.1953
      _YYYY += CENT19;
    } else if (_longFormat && _yy > YEAR53) {
      // 1.1.1954 - 31.12.1999
      _YYYY += CENT19;
    } else if (_longFormat && _yy <= YEAR53) {
      // 1.1.2000 - 31.12.2053
      _YYYY += CENT20;
    } else {
      // NOTE This never happends as it would be the same as for 1954-2000
      // 1.1.2054 - until ever
      _error = 'We didn\'t think about this yet...';
    }

    // Month and Gender
    if (_mm > WOMAN_MM_ADDITION) {
      _gender = GENDER.FEMALE;
      _mm -= WOMAN_MM_ADDITION;
    }

    if (_mm > EXTRA_MM_ADDITION) {
      _mm %= EXTRA_MM_ADDITION;
    }

    if (_mm < MONTH_MIN || _mm > MONTH_MAX) {
      _error = 'Invalid month';
    }

    // Ok
    _M = _mm - MONTH_OFFSET;
    _D = _dd;

    // Final birthdate validation
    // try {
    //   new Date(_YYYY, _M, _D);
    // } catch (e) {
    //   _error = 'Invalid birth date';
    // }
  } // .parse();

  parse(value);

  return this;
} // RodneCislo

function rodnecislo(value) {
  return new RodneCislo(value);
}

rodnecislo.version = '0.0.1';