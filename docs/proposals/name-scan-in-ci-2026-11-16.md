# Proposal: the name scan in GitHub's checks

**Status: proposed, 16 Nov 2026. Nothing is built.** Asked for by the maintainer the same day: run
the name scan in this repository's GitHub checks with a repository secret, as the paid site does. It
must fail closed and never print a name.

## What changes, in short

- **A new check, "names", runs on every pull request.** It scans the lines and file names the pull
  request adds, the same command run on the engineer's machine today. It runs with every other check.
- **The list lives in one repository secret, `NAME_SCAN_LIST`.** The maintainer pastes it once. The
  check writes it to a temporary file on GitHub's machine, scans, and deletes the file.
- **It fails closed.** A missing or empty secret, an unreadable list, or a diff git can't give fails
  the check with "cannot run". It never passes without having scanned.
- **It never prints a name.** It prints only file, line and kind, as the scan does today. The list is
  never printed, and the secret is never written into the log.
- **The scan before every push stays.** CI is a second lock, not a replacement. It also catches a push
  where the local scan was missed.

## Where to paste the secret

1. On this repository's GitHub page, open **Settings → Secrets and variables → Actions**, and press
   **New repository secret**.
2. **Name:** `NAME_SCAN_LIST`
3. **Secret:** the whole text of the list file, as it is: one entry a line, comments and the
   copyright allowance kept. Open the file in Notepad, select all, copy, paste.
4. Press **Add secret**. GitHub never shows it again, to anyone.

To change the list later, edit the same secret (**Update**). The local file and the secret are then two
copies. They need to change together. See "What this changes in the rules" below.

## The workflow, as it would be built

A new file, `.github/workflows/names.yml`, its own workflow so the secret goes to this one job only:

```yaml
# The name scan in GitHub's checks (proposal docs/proposals/name-scan-in-ci-2026-11-16.md).
# The list is the repository secret NAME_SCAN_LIST. It is written to a temporary file, scanned
# against, and deleted. It is never printed. The scan prints file, line and kind only.
name: Name scan

on:
  pull_request:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  names:
    name: names
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      # No npm ci: the scan uses Node's own modules only, so no package code runs beside the secret.
      - name: Name scan (the list is never printed)
        env:
          NAME_SCAN_LIST: ${{ secrets.NAME_SCAN_LIST }}
          BASE: ${{ github.base_ref }}
        run: |
          set -eu
          if [ -z "${NAME_SCAN_LIST:-}" ]; then
            echo "name scan: cannot run (the NAME_SCAN_LIST secret is not set or not available). No result."
            exit 2
          fi
          umask 077
          list="$RUNNER_TEMP/names.txt"
          printf '%s\n' "$NAME_SCAN_LIST" > "$list"
          unset NAME_SCAN_LIST
          if [ -n "${BASE:-}" ]; then
            WB_NAMES_LIST="$list" node scripts/check-names.mjs --added "origin/$BASE"
          else
            WB_NAMES_LIST="$list" node scripts/check-names.mjs
          fi
      - name: Remove the list
        if: always()
        run: rm -f "$RUNNER_TEMP/names.txt"
```

**What each guard is for:**

- **Passed through `env`, never typed into the script.** `${{ secrets.… }}` inside `run:` would paste
  the list into the script text. Through `env` it stays a value the shell reads. GitHub also hides
  any secret it sees in the log, but this design doesn't lean on that.
- **No `set -x`, no `echo` of the list, no `cat`.** Nothing in the step prints the list.
- **Empty means stop.** The first test ends the run with exit 2 if the secret is missing. A pull
  request from a fork gets no secrets from GitHub, so it fails here too, closed, never passing
  unscanned. (Every pull request here comes from this repository's own branches.)
- **Never `pull_request_target`.** That event would hand the secret to code from a fork.
- **No packages installed in this job.** Only the checkout and Node itself run beside the secret.
- **The scan's own rules hold.** `scripts/check-names.mjs` is unchanged. Exit 0 is clean, 1 is a
  finding (the check fails and names the file and line), and 2 is "could not run" (the check fails).
- **Run by hand, it scans every tracked file**, as `node scripts/check-names.mjs` does on the machine.

**To make it block a merge,** the maintainer adds the check `names` to main's required checks
(**Settings → Branches → main → Require status checks**), beside `checks`. That is her hand, not the
engineer's.

## What this changes in the rules

The process rule *The name scan runs before every push* (PROCESS_RULES_for_ShellB.md) says two things
this would make untrue: "It cannot run in GitHub's checks, because the list is private", and "The list
is never copied". When built, the rule is amended in place, the old lines struck and kept:

- It runs in GitHub's checks as `names`, from the repository secret `NAME_SCAN_LIST`, and on the
  engineer's machine before every push. Both are kept.
- The list exists in two places, the maintainer's file and the secret, and she changes both together.
  The secret is written to a temporary file for the scan and removed after it, never printed.

The comment at the top of `scripts/check-names.mjs` and the note in `.github/workflows/checks.yml`
that says the scan can't run in GitHub change the same way. CLAUDE.md and the README get one line each.

## Lane, and what I need from you

- **Lane 3.** It's CI, a rules file and a secret.
- **This pull request is the proposal only, lane 1.**
- **Your answers:**
  1. Is the name `NAME_SCAN_LIST` right, or does the paid site use another one you'd like to match?
     (I can't read the paid site's repository to check.)
  2. Should it also run on every push to main, scanning every tracked file? I'd say not yet: a full
     scan may turn up old lines already accepted. The by-hand run covers it.
  3. Will you mark `names` a required check once it has passed on one pull request?

**Before it's built:** you paste the secret. The first build pull request then shows the check
passing, and shows it failing closed on a run with the secret held back. That second run would come
from a test branch whose workflow reads a secret name that doesn't exist; I'd delete that branch after.
