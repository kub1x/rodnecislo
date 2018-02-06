<h1 align="center">rodnecislo</h1>

<p align="center">
  <a href="https://npmjs.org/package/rodnecislo">
    <img src="https://img.shields.io/npm/v/rodnecislo.svg" alt="NPM Version">
  </a>
  <a href="https://npmjs.org/package/rodnecislo">
    <img src="https://img.shields.io/npm/dm/rodnecislo.svg" alt="NPM downloads">
  </a>
  <a href="http://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/npm/l/rodnecislo.svg" alt="License">
  </a>
  <a href="https://github.com/kub1x/rodnecislo/issues">
    <img src="https://img.shields.io/github/issues/kub1x/rodnecislo.svg" alt="Github Issues">
  </a>
  <a href="https://travis-ci.org/kub1x/rodnecislo">
    <img src="https://img.shields.io/travis/kub1x/rodnecislo.svg" alt="Travis Status">
  </a>
  <a href="https://coveralls.io/github/kub1x/rodnecislo">
    <img src="https://img.shields.io/coveralls/kub1x/rodnecislo.svg" alt="Coveralls">
  </a>
  <a href="http://commitizen.github.io/cz-cli/">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen Friendly">
  </a>
  <a href="https://greenkeeper.io/">
    <img src="https://badges.greenkeeper.io/kub1x/rodnecislo.svg" alt="Greenkeeper badge">
  </a>

</p>

A npm package for validating and deriving information from [Czech and Slovak National Identification Number](https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic_and_Slovakia).
This number is used in Czech and Slovak Republic as the primary unique identifier for every person
by most, if not all, government institutions, banks, etc. It consists of two parts: *birth date*
(with *gender mark*) and *serial number* with *check digit*. It is commonly known as *Birth Number*
or *rodné číslo* in both Czech and Slovak hence the library name.

## Install

Works with nodejs v6 and higer (ES2015).

```sh
npm install rodnecislo
```

## Usage

```javascript
import { rodnecislo } from 'rodnecislo';
// or using require:
// let { rodnecislo } = require("rodnecislo")

let rc = rodnecislo('111213/3121');

rc.isMale();   // true
rc.isFemale(); // false

rc.year();     // 2011
rc.month();    // 11 - zero based month
rc.day();      // 13

rc.birthDate() // new Date(2011, 11, 13) - "Tue Dec 13 2011 00:00:00 GMT+0100 (CET)"
rc.birthDateAsString() // "13.12.2011" - the Czech date format

rc.isValid()   // true

rc.isAdult()   // false - by default checks if current date is above 18 years old
rc.isAdult(21) // false - for US

rc.age()       // 5 - age today (it is 5.6.2017 ;)

rc.dic()       // "CZ1112133121" - Czech Tax Identification Number (DIč)
```

## Definitions and legislation

### Dictionary
* *birth number* - a National identification number in Czech and Slovak republic
* *birth date part* - first 6 digits of *birth number*, typically divided with *serial number* with slash '/'
* *serial number* - 3 digits diferentiating people born on the same day, occurs after '/'
* *check digit* - last digit of the *birth number*, making it divisible by 11 (with exceptions)
* *DIC* - czech VAT number

### Sources
Specification comes mainly from following links:
 * [Rodné číslo - sk wiki](https://sk.wikipedia.org/wiki/Rodn%C3%A9_%C4%8D%C3%ADslo)
 * [Rodné číslo - cz wiki](https://cs.wikipedia.org/wiki/Rodn%C3%A9_%C4%8D%C3%ADslo)
 * [National identification number - Czech and Slovak birth number - en wiki](https://en.wikipedia.org/wiki/National_identification_number#Czech_Republic_and_Slovakia)
 * [Educational web of Miroslav Lorenc](http://lorenc.info/3MA381/overeni-spravnosti-rodneho-cisla.htm)
 * [Czech Civil Code](http://obcanskyzakonik.justice.cz/images/pdf/NOZ_interaktiv.pdf)

### RegExp
RegExp for *rodné číslo*. With/without slash.

```
  |   1   |      2a      |       2b      |       2c      |       2d       |             3          |4 |    5   |
/^\d{0,2}((0[1-9]|1[0-2])|(2[1-9]|3[0-2])|(5[1-9]|6[0-2])|(7[1-9]|8[0-2]))(0[1-9]|[1-2][0-9]|3[01])\/?[0-9]{3,4}$/;
```

Explanation:
* 1 - 00-99 birth year
* 2 birth month
  - a - 01-12 for men
  - b - 21-32 for men\*
  - c - 51-62 for women
  - d - 71-82 for women\*
* 3 - 01-31 birth day
* 4 - slash
* 5 - 000-9999 serial and check digit

> \* Since 2004 (law nr. 53/2004) it is possible to add extra 20 to the month number in case the number
> of newborns exceeds all the possible combinations of birth date/birth number divisible by 11.

### Historical evolution

* Before 1953
  - People in Czechoslovakia have *Personal ID Card Number* or
    *Work ID Card Number*. It isn't called *birth number*/*rodne cislo* yet.
  - It has format `yymmdd/sss`
  - Women have `mm+50`
  - `sss` is *serial number* for people born on the same day
  - Eg: `516231/016` is *birth number* of a woman, born on 31 Dec 1951
* After 1953
  - *Birth number* is official now
  - It has format: `yymmdd/sssc`
  - Women have: `mm+50`
  - Whole PIN must be divisible by 11 OR
  - If `(yymmddsss % 11 == 10 && c == 0)` then the *birth number* is valid
* After 1985
  - The `(yymmddsss % 11 == 10 && c == 0)` exception was removed
  - ... every new *birth number* must be divisible by 11 as a whole from now on
* In 1993 [Czechoslovakia split into Czech Republic and Slovak Republic](https://en.wikipedia.org/wiki/Dissolution_of_Czechoslovakia)
  - the legislation might differ from this point on
* After 2004
  - Men can also have `mm+20`
  - Women can also have `mm+70`

So to flatten the knowledge:
* Short/long version
  - Short version was used before 1953
  - Long version AND `yy >= 54` THEN `yyyy = 19yy`
  - Long version AND `yy < 53` THEN `yyyy = 20yy`
  - Who knows what comes in 2053...
* Month/Gender
  - Month is `51-62` OR `71-82` - it is a woman subtract `50` and `20`
  - Month is `01-12` OR `21-32` - it is a man subtract `20`
* Modulo condition
  - Short *birth number* - no modulo condition
  - Whole *birth number* is divisible by 11 - valid *birth number*
  - Whole *birth number* without *check digit* modulo `11` equals `10` AND *check digit* is `0` AND year is `54-85` - valid *birth number*

### Age and Adultood

According to *Civil code §601 law n. 89/2012* and *§30 of New Civil Code* an
age is reached at midnight which is starting the birthday. So on the first
seconds of your 18th birthday you can start drinking in Czech.


### VAT Identification Number

In Czech the personal [VAT Identification Number](https://en.wikipedia.org/wiki/VAT_identification_number#European_Union_VAT_identification_numbers)
is derived from *Birth Number* by adding `CZ` prefix and ommitting the slash.
It is called [Daňové identifikační číslo (DIČ)](https://cs.wikipedia.org/wiki/Da%C5%88ov%C3%A9_identifika%C4%8Dn%C3%AD_%C4%8D%C3%ADslo)
hence the `.dic()` method.


## TODOs

### Knowledge
 * What happens to *birth number* in 2053?
 * How many colisions in *birth number* are there?

### Programming
 * Add optional support for momentjs.com
 * Build into jQuery plugin


## Author

Jakub Podlaha j.podlaha@gmail.com


## License

- **MIT** : http://opensource.org/licenses/MIT


## Contributing

Contributions are highly welcome! Really! This repo is *trying to be ;-)* commitizen friendly — please read about it [here](http://commitizen.github.io/cz-cli/).

----

## Dev notes

Generated using:
https://github.com/d4rkr00t/generator-np

Watched using:
https://travis-ci.org/kub1x/rodnecislo

Deployed using:
https://github.com/conventional-changelog/conventional-github-releaser
