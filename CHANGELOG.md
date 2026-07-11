# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.0] - 2026-07-12

### Changed

- **BREAKING**: Raise the `vitest` peer dependency requirement from `>=3` to `>=4`.

### Fixed

- Fix `examples/redux-saga` build error and run example builds in CI.

### Security

- Pin `vitest` to `4.1.1` to fix a critical CVE ([GHSA-5xrq-8626-4rwp](https://github.com/advisories/GHSA-5xrq-8626-4rwp)).
- Update `tsup` and `vite` (dev dependencies) to fix vulnerable dependencies.
- Update `vite` in examples to fix a vulnerable dependency.

[Unreleased]: https://github.com/akiomik/vitest-websocket-mock/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/akiomik/vitest-websocket-mock/releases/tag/v0.6.0
