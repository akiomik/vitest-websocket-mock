# Contributing

## Commits

Commit messages follow [Conventional Commits 1.0.0][cc].

A change that breaks the public API — the exported types, the matcher
signatures, or the supported Vitest range — must be marked as one: `!` before
the `:` in the subject, plus a `BREAKING CHANGE:` footer saying what breaks.
Nothing verifies this. Whether a change is breaking is a judgement only the
author can make, and it is the easiest rule here to miss, because nearly every
commit is a routine dependency bump that never needs it.

## Changelog

`CHANGELOG.md` follows [Keep a Changelog][kac], and the project is versioned
with [Semantic Versioning][semver].

Write your entry under `## [Unreleased]` in the same pull request as the change.
Releases do not write entries; they only move that section under a version
heading. The project is on 0.x, where a breaking change takes a minor.

## Releasing

See [RELEASING.md](RELEASING.md).

[cc]: https://www.conventionalcommits.org/en/v1.0.0/
[kac]: https://keepachangelog.com/en/1.1.0/
[semver]: https://semver.org/spec/v2.0.0.html
