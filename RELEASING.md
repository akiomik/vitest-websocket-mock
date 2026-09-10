# Releasing

Publishing is automated: `.github/workflows/publish.yml` runs on `release: published`
and does `npm ci && npm publish`, authenticating to npm with OIDC trusted
publishing. There is no npm token to manage. Creating the GitHub release is
therefore the point of no return.

Throughout, `X.Y.Z` is the new version and `N` the number of the bump PR.

## Steps

1. Make sure `main` is green and clean, and that no dependency PR you intend to
   include is still open.

2. Bump the version on a branch named `chore-bump-version-to-X.Y.Z`:

   ```bash
   git switch -c chore-bump-version-to-X.Y.Z
   npm version X.Y.Z --no-git-tag-version
   (cd examples/hooks && npm install --package-lock-only)
   (cd examples/redux-saga && npm install --package-lock-only)
   ```

   `npm version` updates `package.json` and both version fields in
   `package-lock.json`. The examples need the second pair of commands because
   they link the root package with `file:../..`, and npm copies its manifest —
   `version` and `peerDependencies` included — into their lockfiles under the
   `../..` entry. Skipping this leaves them pointing at the previous release;
   0.7.0 shipped that way.

   Then edit `CHANGELOG.md` by hand:

   - insert `## [X.Y.Z] - YYYY-MM-DD` directly under `## [Unreleased]`, leaving
     `## [Unreleased]` empty;
   - repoint the `[Unreleased]` compare link at the new tag and add an
     `[X.Y.Z]` release link above the previous one.

3. Open a PR titled `chore: bump version to X.Y.Z`, wait for CI, and merge it.
   The repository merges with merge commits, so individual commit messages land
   on `main`.

4. Create the release from the bump PR's merge commit, not from `main`, so that
   anything merged in the meantime cannot end up inside the tag:

   ```bash
   awk '/^## \[X.Y.Z\]/{f=1;next} /^## \[/{f=0} f' CHANGELOG.md \
     | sed 's/^### /## /' > notes.md

   gh release create vX.Y.Z \
     --target "$(gh pr view N --json mergeCommit --jq .mergeCommit.oid)" \
     --title vX.Y.Z --notes-file notes.md
   ```

   The `awk` pulls out this version's changelog section and the `sed` promotes
   its `###` headings to `##`, matching how previous releases were written.

5. Confirm the publish. Select the run by tag — `--limit 1` alone can hand you
   the *previous* release's run if this one has not been queued yet, which looks
   identical to success:

   ```bash
   gh run list --workflow=publish.yml --branch vX.Y.Z
   npm view vitest-websocket-mock@X.Y.Z version
   ```

   `npm view` can lag behind for a few minutes on the `latest` tag even after the
   run succeeds; asking for the exact version, as above, bypasses that.

## Choosing the version

The project is on 0.x, where SemVer permits breaking changes in a minor. The
history follows that: 0.6.0 and 0.7.0 both carried breaking changes, and so did
0.8.0 (Vitest 5 became the required peer). Use a minor for anything that changes
the public API, the supported Vitest range, or the shipped types, and a patch
only for fixes that leave all of those alone.

Mark the breaking commit per [Conventional Commits][cc]: `!` before the `:` and
a `BREAKING CHANGE:` footer.

[cc]: https://www.conventionalcommits.org/en/v1.0.0/
