'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rodnecislo = require('./rodnecislo.js');

Object.keys(_rodnecislo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _rodnecislo[key];
    }
  });
});