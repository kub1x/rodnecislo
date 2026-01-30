function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classPrivateMethodInitSpec(e, a) { _checkPrivateRedeclaration(e, a), a.add(e); }
function _classPrivateFieldInitSpec(e, t, a) { _checkPrivateRedeclaration(e, t), t.set(e, a); }
function _checkPrivateRedeclaration(e, t) { if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object"); }
function _classPrivateFieldSet(s, a, r) { return s.set(_assertClassBrand(s, a), r), r; }
function _classPrivateFieldGet(s, a) { return s.get(_assertClassBrand(s, a)); }
function _assertClassBrand(e, t, n) { if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n; throw new TypeError("Private element is not present on this object"); }
// rodnecislo.mjs
// authors : Jakub Podlaha
// license : MIT
// repo: github.com/kub1x/rodnecislo

var GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};
var MONTH_OFFSET = 1;
var DEFAULT_ADULTHOOD = 18;
var AGE_WHEN_BORN = 0;

/**
 * with OR without slash '/' between date part and distinction part
 * with 3 OR 4 digits of distinction part
 */
var RODNECISLO_RE = /^(\d\d)(\d\d)(\d\d)\/?(\d\d\d\d?)$/;
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
var _yy = /*#__PURE__*/new WeakMap();
var _mm = /*#__PURE__*/new WeakMap();
var _dd = /*#__PURE__*/new WeakMap();
var _xxx = /*#__PURE__*/new WeakMap();
var _D = /*#__PURE__*/new WeakMap();
var _M = /*#__PURE__*/new WeakMap();
var _YYYY = /*#__PURE__*/new WeakMap();
var _gender = /*#__PURE__*/new WeakMap();
var _longFormat = /*#__PURE__*/new WeakMap();
var _error = /*#__PURE__*/new WeakMap();
var _RodneCislo_brand = /*#__PURE__*/new WeakSet();
var RodneCislo = /*#__PURE__*/function () {
  function RodneCislo(value) {
    var _this = this;
    _classCallCheck(this, RodneCislo);
    _classPrivateMethodInitSpec(this, _RodneCislo_brand);
    _classPrivateFieldInitSpec(this, _yy, void 0);
    _classPrivateFieldInitSpec(this, _mm, void 0);
    _classPrivateFieldInitSpec(this, _dd, void 0);
    _classPrivateFieldInitSpec(this, _xxx, void 0);
    _classPrivateFieldInitSpec(this, _D, void 0);
    _classPrivateFieldInitSpec(this, _M, void 0);
    _classPrivateFieldInitSpec(this, _YYYY, void 0);
    _classPrivateFieldInitSpec(this, _gender, GENDER.MALE);
    _classPrivateFieldInitSpec(this, _longFormat, false);
    _classPrivateFieldInitSpec(this, _error, null);
    this.year = function () {
      return _classPrivateFieldGet(_YYYY, _this);
    };
    this.month = function () {
      return _classPrivateFieldGet(_M, _this);
    };
    this.day = function () {
      return _classPrivateFieldGet(_D, _this);
    };
    this.birthDate = function () {
      return new Date(_classPrivateFieldGet(_YYYY, _this), _classPrivateFieldGet(_M, _this), _classPrivateFieldGet(_D, _this));
    };
    this.birthDateAsString = function () {
      return "".concat(_classPrivateFieldGet(_D, _this), ".").concat(_classPrivateFieldGet(_M, _this) + MONTH_OFFSET, ".").concat(_classPrivateFieldGet(_YYYY, _this));
    };
    this.dic = function () {
      return "CZ".concat(_classPrivateFieldGet(_yy, _this)).concat(_classPrivateFieldGet(_mm, _this)).concat(_classPrivateFieldGet(_dd, _this)).concat(_classPrivateFieldGet(_xxx, _this));
    };
    this.gender = function () {
      return _classPrivateFieldGet(_gender, _this);
    };
    this.isMale = function () {
      return _classPrivateFieldGet(_gender, _this) === GENDER.MALE;
    };
    this.isFemale = function () {
      return _classPrivateFieldGet(_gender, _this) === GENDER.FEMALE;
    };
    this.isValid = function () {
      return !_classPrivateFieldGet(_error, _this) && _this.age() >= AGE_WHEN_BORN;
    };
    this.isPossible = function () {
      return !_classPrivateFieldGet(_error, _this);
    };
    this.error = function () {
      return _classPrivateFieldGet(_error, _this);
    };
    this.isAdult = function () {
      var adulthood = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_ADULTHOOD;
      return _this.age() >= adulthood;
    };
    _assertClassBrand(_RodneCislo_brand, this, _parseRawInput).call(this, value);
    _assertClassBrand(_RodneCislo_brand, this, _parseBirthDate).call(this);
  }
  return _createClass(RodneCislo, [{
    key: "age",
    value: function age() {
      // Current date parsed (ignoring +1 timezone)
      var now = new Date();
      var CYYYY = now.getFullYear();
      var CM = now.getMonth();
      var CD = now.getDate();
      var age = CYYYY - _classPrivateFieldGet(_YYYY, this);
      if (CM > _classPrivateFieldGet(_M, this)) {
        return age;
      }
      if (CM < _classPrivateFieldGet(_M, this)) {
        return --age;
      }

      // We're on the MONTH of the bday.

      // NOTE In Czech you reach certain age at the beginning of your birthday.
      return CD >= _classPrivateFieldGet(_D, this) ? age : --age;
    }
  }]);
}(); // RodneCislo
function _parseRawInput(inputText) {
  var match = RODNECISLO_RE.exec(inputText);
  if (!match) {
    _classPrivateFieldSet(_error, this, 'Didn\'t match RegEx');
    return false;
  }
  _classPrivateFieldSet(_longFormat, this, match[MATCH_XX].length === LONG_XX_LENGTH);

  // Birth date parsed
  _classPrivateFieldSet(_yy, this, match[MATCH_YY]);
  _classPrivateFieldSet(_mm, this, match[MATCH_MM]);
  _classPrivateFieldSet(_dd, this, match[MATCH_DD]);
  _classPrivateFieldSet(_xxx, this, match[MATCH_XX]);
  if (_classPrivateFieldGet(_longFormat, this)) {
    var whole = "".concat(match[MATCH_YY]).concat(match[MATCH_MM]).concat(match[MATCH_DD]).concat(match[MATCH_XX]);
    var test = +whole.slice(BEGIN, LAST); // all but last
    var check = +whole.slice(LAST); // the last digit

    if (+whole % MODULO === MODULO_RESULT) {
      // good old classic
    } else if (test % MODULO === MODULO_EXCEPTION_VALUE && check === MODULO_EXCEPTION_CHECK) {
      // the rare 1000 cases
    } else {
      _classPrivateFieldSet(_error, this, 'Failed the modulo condition');
      return false;
    }
  }
  return true;
}
function _parseBirthYear() {
  _classPrivateFieldSet(_YYYY, this, +_classPrivateFieldGet(_yy, this));
  if (!_classPrivateFieldGet(_longFormat, this) && _classPrivateFieldGet(_YYYY, this) <= YEAR53) {
    // since ever - 31.12.1953
    _classPrivateFieldSet(_YYYY, this, _classPrivateFieldGet(_YYYY, this) + CENT19);
  } else if (_classPrivateFieldGet(_longFormat, this) && _classPrivateFieldGet(_YYYY, this) > YEAR53) {
    // 1.1.1954 - 31.12.1999
    _classPrivateFieldSet(_YYYY, this, _classPrivateFieldGet(_YYYY, this) + CENT19);
  } else if (_classPrivateFieldGet(_longFormat, this) && _classPrivateFieldGet(_YYYY, this) <= YEAR53) {
    // 1.1.2000 - 31.12.2053
    _classPrivateFieldSet(_YYYY, this, _classPrivateFieldGet(_YYYY, this) + CENT20);
  } else {
    // Short format with year > 53: malformed input or regex didn't match
    _classPrivateFieldSet(_error, this, _classPrivateFieldGet(_error, this) || 'Invalid birth year format');
    return false;
  }
  return true;
}
function _parseBirthMonth() {
  // Month and Gender
  _classPrivateFieldSet(_M, this, +_classPrivateFieldGet(_mm, this));

  // Women have month + 50
  if (_classPrivateFieldGet(_M, this) > WOMAN_MM_ADDITION) {
    _classPrivateFieldSet(_gender, this, GENDER.FEMALE);
    _classPrivateFieldSet(_M, this, _classPrivateFieldGet(_M, this) - WOMAN_MM_ADDITION);
  }

  // Sometimes men/women get extra month + 20
  if (_classPrivateFieldGet(_M, this) > EXTRA_MM_ADDITION) {
    _classPrivateFieldSet(_M, this, _classPrivateFieldGet(_M, this) - EXTRA_MM_ADDITION);
  }

  // Convert to 0-based month index
  _classPrivateFieldSet(_M, this, _classPrivateFieldGet(_M, this) - MONTH_OFFSET);
  _classPrivateFieldSet(_D, this, +_classPrivateFieldGet(_dd, this));

  // Invalid month values (outside 01-12, 21-32, 51-62, 71-82) will result
  // in invalid dates caught by #doesBirthdateExist()
  return true;
}
function _doesBirthdateExist() {
  var date = new Date(_classPrivateFieldGet(_YYYY, this), _classPrivateFieldGet(_M, this), _classPrivateFieldGet(_D, this));
  var convertedDate = "".concat(date.getFullYear(), "-").concat(date.getMonth(), "-").concat(date.getDate());
  var givenDate = "".concat(_classPrivateFieldGet(_YYYY, this), "-").concat(_classPrivateFieldGet(_M, this), "-").concat(_classPrivateFieldGet(_D, this));

  // Final birthdate validation
  if (givenDate !== convertedDate) {
    _classPrivateFieldSet(_error, this, 'Invalid birth date');
    return false;
  }
  return true;
}
function _parseBirthDate() {
  return _assertClassBrand(_RodneCislo_brand, this, _parseBirthYear).call(this) && _assertClassBrand(_RodneCislo_brand, this, _parseBirthMonth).call(this) && _assertClassBrand(_RodneCislo_brand, this, _doesBirthdateExist).call(this);
}
function rodnecislo(value) {
  return new RodneCislo(value);
}
;
export { rodnecislo, RodneCislo };