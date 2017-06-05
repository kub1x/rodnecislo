<h1 align="center">rodnecislo</h1>

<p align="center">
  <a href="https://npmjs.org/package/rodnecislo">
    <img src="https://img.shields.io/npm/v/rodnecislo.svg" alt="NPM Version">
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

<p align="center">
A package for handling Czech and Slovak Personal ID Number (PIN). This number is used in
Czech and Slovak Republic as a primary unique person identifier by most, if not all, 
government institutions. It consists of two parts birth date with gender mark and a 
control number. It is commonly known as "rodné číslo" hence the library name. 
</p>


## Install

```sh
npm install rodnecislo
```

## Usage

```javascript
import { rodnecislo } from 'rodnecislo';

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

rc.toDIC()     // "CZ1112133121" - Czech Tax Identification Number (DIč)
```

## Definitions and legislation

### Sources
Specification comes mainly from following links: 
 * https://sk.wikipedia.org/wiki/Rodn%C3%A9_%C4%8D%C3%ADslo
 * https://cs.wikipedia.org/wiki/Rodn%C3%A9_%C4%8D%C3%ADslo
 * http://lorenc.info/3MA381/overeni-spravnosti-rodneho-cisla.htm

### RegExp
RegExp for rodné číslo (Personal Identification Number). With/without slash.

```
  |   1   |      2a      |       2b      |       2c      |       2d       |             3          |4 |    5   |
/^\d{0,2}((0[1-9]|1[0-2])|(2[1-9]|3[0-2])|(5[1-9]|6[0-2])|(7[1-9]|8[0-2]))(0[1-9]|[1-2][0-9]|3[01])\/?[0-9]{3,4}$/;
```

Explanation: 
* 1 - 00-99 birth year
* 2 birth month
  * a - 01-12 man
  * b - 21-32 man\*
  * c - 51-62 woman
  * d - 71-82 woman\*
* 3 - 01-31 birth day
* 4 - slash
* 5 - 000-9999 birth number and control number

 > * Since 2004 (law nr. 53/2004) it is possible to add extra 20 to the month number in case the number 
 > of newborns exceeds all the possible combinations of birth date/birth number divisible by 11. 

### Historical evolution

* Before 1953
  - PIN has format `"yymmdd/xxx"`
  - Women have `mm+50`
  - xxx is birth number on the date
  - eg: "516231/016" is woman, born on 31 Dec 1951 as a 16th baby *(not sure if the check numbers are separate for men/women)*
* After 1953
  - PIN has format `"yymmdd/xxxc"`
  - Women have `mm+50`
  - Whole PIN must be divisible by 11 OR
  - if `(+"yymmddxxx" % 11 === 10 && "c" === "0")` then the PIN is valid
* After 1985
  - the `(+"yymmddxxx" % 11 === 10 && "c" === "0")` exception was removed. every new PIN must be divisible by 11. 
* 1993 Czechoslovakia split into Czech Republic and Slovak Republic, the legislation might vary from this point on. 
* After 2004
  - Men can also have `mm+20`
  - Women can also have `mm+70`

So to flatten the knowledge: 
* short/long PIN
  - short format  =>  before 1953
  - long format and yy < 53  =>  yyyy = 20yy
  - who knows what comes after 2053...
* month/gender
  - month is 51-62 or 71-82 - it is a woman subtract 50 and 20
  - month is 01-12 or 21-32 - it is a man subtract 20
* modulo condition
  - short PIN - no modulo condition
  - whole PIN divisible by 11 - valid PIN
  - whole PIN without last digit modulo 11 equals 10 AND last digit is 0 or "zero" AND year is 54-85 - valid PIN
  
### Age and Adultood
I'm currently veryfying with legal offices, whether a person is adult from the midnight of his/her birthday or the day after. 


## Author

Jakub Podlaha j.podlaha@gmail.com

## License

- **MIT** : http://opensource.org/licenses/MIT

## Contributing

Contributions are highly welcome! This repo is commitizen friendly — please read about it [here](http://commitizen.github.io/cz-cli/).

----

## Dev notes

Generated using:
https://github.com/d4rkr00t/generator-np

Watched using:
https://travis-ci.org/kub1x/rodnecislo

Deployed using:
https://github.com/conventional-changelog/conventional-github-releaser
