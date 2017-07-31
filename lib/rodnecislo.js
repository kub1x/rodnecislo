'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RodneCislo = RodneCislo;
exports.rodnecislo = rodnecislo;
// rodnecislo.js
// version : 1.0.0
// authors : Jakub Podlaha
// license : MIT
// github.com/kub1x/rodnecislo

var GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

var MONTH_OFFSET = 1;
var DEFAULT_ADULTHOOD = 18;

function RodneCislo(value) {
  var _this = this;

  // PIN parts and Parsed birthdate
  var _yy = void 0,
      _mm = void 0,
      _dd = void 0,
      _xxx = void 0,
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
    return _YYYY;
  };
  this.month = function () {
    return _M;
  };
  this.day = function () {
    return _D;
  };

  this.birthDate = function () {
    return new Date(_YYYY, _M, _D);
  };
  this.birthDateAsString = function () {
    return _D + '.' + (_M + MONTH_OFFSET) + '.' + _YYYY;
  };

  this.dic = function () {
    return 'CZ' + _yy + _mm + _dd + _xxx;
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
    return _this.age() >= adulthood;
  };

  this.age = function () {
    // Current date parsed (ignoring +1 timezone)
    var now = new Date();
    var CYYYY = now.getFullYear();
    var CM = now.getMonth();
    var CD = now.getDate();

    var age = CYYYY - _YYYY;

    if (CM > _M) {
      return age;
    }
    if (CM < _M) {
      return --age;
    }

    // We're on the MONTH of the bday.

    // NOTE In Czech you reach certain age at the beginning of your birthday.
    return CD >= _D ? age : --age;
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

  function parseRawInput(inputText) {
    var match = RODNECISLO_RE.exec(inputText);

    if (!match) {
      _error = 'Didn\'t match RegEx';
      return false;
    }

    _longFormat = match[MATCH_XX].length === LONG_XX_LENGTH;

    var whole = void 0,
        test = void 0,
        check = void 0;

    try {
      // Birth date parsed
      _yy = match[MATCH_YY];
      _mm = match[MATCH_MM];
      _dd = match[MATCH_DD];
      _xxx = match[MATCH_XX];

      if (_longFormat) {
        whole = '' + match[MATCH_YY] + match[MATCH_MM] + match[MATCH_DD] + match[MATCH_XX];
        test = +whole.slice(BEGIN, LAST); // all but last
        check = +whole.slice(LAST); // the last digit
        whole = +whole; // all of it
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

  var YEAR53 = 53;
  var CENT19 = 1900;
  var CENT20 = 2000;
  var YEAR2004 = 2004;

  var WOMAN_MM_ADDITION = 50;
  var EXTRA_MM_ADDITION = 20;

  function isDateValid(y, m, d) {
    var date = new Date(y, m, d);
    var convertedDate = '' + date.getFullYear() + date.getMonth() + date.getDate();
    var givenDate = '' + y + m + d;

    return givenDate === convertedDate;
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
    if (_M > EXTRA_MM_ADDITION) {
      if (_YYYY >= YEAR2004) {
        _M %= EXTRA_MM_ADDITION;
      } else {
        // NOTE
        _error = 'Addition of month+20 is allowed for year >= 2004 only.';
        return false;
      }
    }

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

function rodnecislo(value) {
  return new RodneCislo(value);
}