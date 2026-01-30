# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.0] - 2026-01-30

### Added
- TypeScript: `error()` method in type definitions
- TypeScript: `gender()` method in type definitions
- TypeScript: Export `RodneCislo` as class (enables `instanceof` checks)
- Package: `exports` field with explicit `require` condition for CommonJS
- Package: `sideEffects: false` for tree-shaking support in bundlers
- Package: `engines` field specifying Node.js >=12.0.0
- Tests: ESM import tests for built output
- Tests: CommonJS `require()` compatibility tests
- Tests: Explicit tests for `gender()` method
- Tests: Explicit tests for `error()` method
- Tests: TypeScript `import type` test

### Changed
- Build: Babel now preserves ES modules (`modules: false`) instead of converting to CommonJS
- Build: Replaced deprecated `babel-eslint` with `@babel/eslint-parser`
- Package: Improved npm keywords for discoverability (added "Slovak", "birth number", "rodné číslo", etc.)
- Package: Fixed `main` field to point to actual file (`lib/rodnecislo.js`)
- Docs: Fixed typo in README ("higer" → "higher")
- Docs: Updated Node.js version requirement from v10 to v12
- Refactor: Removed unnecessary try-catch in `#parseRawInput`
- Refactor: Improved error message in `#parseBirthYear` edge case
- Tests: Rewrote negative age test for clarity (fixed misleading variable names)
- Tests: Improved test isolation by avoiding repeated `rodnecislo()` calls

### Fixed
- ESM imports now work correctly (was broken due to Babel outputting CommonJS with `"type": "module"`)

## [1.7.0] and earlier

See [GitHub releases](https://github.com/kub1x/rodnecislo/releases) for previous versions.
