<big><h1 align="center">rodnecislo</h1></big>

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
  <br/>
  <a href="https://travis-ci.org/kub1x/rodnecislo">
    <img src="https://img.shields.io/travis/kub1x/rodnecislo.svg" alt="Travis Status">
  </a>
  <a href="https://coveralls.io/github/kub1x/rodnecislo">
    <img src="https://img.shields.io/coveralls/kub1x/rodnecislo.svg" alt="Coveralls">
  </a>
  <a href="http://commitizen.github.io/cz-cli/">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen Friendly">
  </a>
</p>

<p align="center"><big>
A package for handling Czech Personal ID
</big></p>


## Features

[![Greenkeeper badge](https://badges.greenkeeper.io/kub1x/rodnecislo.svg)](https://greenkeeper.io/)
// TODO

## Install

```sh
npm install rodnecislo
```

## Usage

```javascript
import { rodnecislo } from 'rodnecislo';

let rc = rodnecislo('110124/0415');

rc.isMale();   // true
rc.isFemale(); // false

rc.year();     // 2011
rc.month();    // 0 - just like with Date object
rc.day();      // 24

rc.birthDate() // Date 24-01-2011
rc.birthDateAsString() // "24.01.2011" - the Czech format

rc.isValid()   // true
rc.isAdult()   // false - by default checks if current date is above 18 years old
rc.isAdult(21) // false - for US

```

## Author

Jakub Podlaha j.podlaha@gmail.com

## License

- **MIT** : http://opensource.org/licenses/MIT

## Contributing

Contributions are highly welcome! This repo is commitizen friendly — please read about it [here](http://commitizen.github.io/cz-cli/).

----

## Dev notes

Format specifications
 * https://sk.wikipedia.org/wiki/Rodn%C3%A9_%C4%8D%C3%ADslo
 * https://cs.wikipedia.org/wiki/Rodn%C3%A9_%C4%8D%C3%ADslo
 * http://lorenc.info/3MA381/overeni-spravnosti-rodneho-cisla.htm

Generated using:
https://github.com/d4rkr00t/generator-np

Watched using:
https://travis-ci.org/kub1x/rodnecislo

Deployed using:
https://github.com/conventional-changelog/conventional-github-releaser
