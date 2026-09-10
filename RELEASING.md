# Releasing

Publishing is automated: `.github/workflows/publish.yml` runs on `release: published`
and does `npm ci && npm publish`, authenticating to npm with OIDC trusted
publishing. There is no npm token to manage. Creating the GitHub release is
therefore the point of no return.

## Steps

1. Make sure `main` is green and clean, and that no dependency PR you intend to
   include is still open.

2. Bump the version on a branch named `chore-bump-version-to-X.Y.Z`:

   ```bash
   git switch -c chore-bump-version-to-X.Y.Z
   npm version X.Y.Z --no-git-tag-version
   ```

   `npm version` updates `package.json` and both version fields in
   `package-lock.json`. Then edit `CHANGELOG.md` by hand:

   - insert `## [X.Y.Z] - YYYY-MM-DD` directly under `## [Unreleased]`, leaving
     `## [Unreleased]` empty;
   - repoint the `[Unreleased]` compare link at the new tag and add an
     `[X.Y.Z]` release link above the previous one.

   The diff should touch those three files and nothing else.

3. Open a PR titled `chore: bump version to X.Y.Z`, wait for CI, and merge it.
   The repository merges with merge commits, so individual commit messages land
   on `main`.

4. Create the release from `main`. The notes are the changelog section for this
   version with `###` promoted to `##`:

   ```bash
   gh release create vX.Y.Z --target main --title vX.Y.Z --notes-file notes.md
   ```

5. Watch the publish run and confirm the version is live:

   ```bash
   gh run list --workflow=publish.yml --limit 1
   npm view vitest-websocket-mock version
   ```

## Choosing the version

The project is on 0.x, where SemVer permits breaking changes in a minor. The
history follows that: 0.6.0 and 0.7.0 both carried breaking changes, and so did
0.8.0 (Vitest 5 became the required peer). Use a minor for anything that changes
the public API, the supported Vitest range, or the shipped types, and a patch
only for fixes that leave all of those alone.

Mark the breaking commit per [Conventional Commits][cc]: `!` before the `:` and
a `BREAKING CHANGE:` footer.

[cc]: https://www.conventionalcommits.org/en/v1.0.0/
