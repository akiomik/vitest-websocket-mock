# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Breaking:** Vitest 5 or later is now required (`peerDependencies` moved from `>=4` to `>=5`). Vitest 5 no longer depends on `@vitest/expect`, which the custom matcher types used to be declared against, so augmenting that module no longer reaches Vitest's assertions. The augmentation now targets `vitest` itself, and because Vitest 4 and 5 declare `Matchers` with different type parameters, a single build cannot type-check against both.
- The matcher types are now declared via `declare module 'vitest'` and imported from `vitest` instead of `@vitest/expect`.

## [0.7.0] - 2026-07-12

### Changed

- Matcher error messages no longer embed a manually generated `Difference:` section; Vitest's reporter now renders the diff from the `actual` / `expected` returned by matchers ([#75](https://github.com/akiomik/vitest-websocket-mock/issues/75)).
- Matcher error messages are now built as plain text without ANSI color codes, so color detection (e.g. AI-agent environments) can no longer make them differ between environments ([#76](https://github.com/akiomik/vitest-websocket-mock/issues/76)). Note that the value formatting inside messages still comes from Vitest's `stringify` and may change across Vitest versions. If you snapshot these messages in your own tests, you will need to update those snapshots.
- Remove the `@vitest/utils` runtime dependency.
- Unpin `vitest` and `@vitest/coverage-v8` from `4.1.1` (dev dependencies), which were pinned to avoid the local/CI snapshot divergence under AI coding agents ([#59](https://github.com/akiomik/vitest-websocket-mock/issues/59)).

## [0.6.0] - 2026-07-12

### Changed

- **BREAKING**: Raise the `vitest` peer dependency requirement from `>=3` to `>=4`.

### Fixed

- Fix `examples/redux-saga` build error and run example builds in CI.

### Security

- Pin `vitest` to `4.1.1` to fix a critical CVE ([GHSA-5xrq-8626-4rwp](https://github.com/advisories/GHSA-5xrq-8626-4rwp)).
- Update `tsup` and `vite` (dev dependencies) to fix vulnerable dependencies.
- Update `vite` in examples to fix a vulnerable dependency.

[Unreleased]: https://github.com/akiomik/vitest-websocket-mock/compare/v0.7.0...HEAD
[0.7.0]: https://github.com/akiomik/vitest-websocket-mock/releases/tag/v0.7.0
[0.6.0]: https://github.com/akiomik/vitest-websocket-mock/releases/tag/v0.6.0
