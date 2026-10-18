# ADR-0003: Player and Level Designer Modes

Status: Accepted  
Date: 2026-10-18

## Context

The first web prototype combined puzzle play and board editing in one view. Players need access to
repository levels, while level authoring and generation are development tasks and must not ship as
an end-user feature.

## Decision

- The web UI has separate Player mode and Level Designer views.
- Player mode is the default and only mode in production builds. The designer is exposed only when
  Vite's `import.meta.env.DEV` compile-time flag is true and is loaded on demand.
- The checked-in `apps/web/src/levels.json` is the player catalog and uses the level JSON schema in
  `LEVEL_SYSTEM.md`.
- Designer operations use immutable engine boards and the engine's solver/difficulty validator.
  The UI does not duplicate chess attack or puzzle validity rules.
- Generated levels use four fixed clues for Easy and two for Medium, with at least one solution.
  Hard and Extra-hard require a unique solution, as enforced by `validateLevelByDifficulty`.
- Editing, importing, deleting, and generating changes only browser state. Explicit JSON export is
  the persistence boundary. Developers manually copy the reviewed export into the checked-in level
  catalog and use the normal Git workflow.
- Deletion requires confirmation. The current application stores no player progress, so existing
  progress cannot be invalidated; future persistence must account for stable IDs and level versions.

## Consequences

Production builds cannot navigate to or render the designer; the compile-time development guard
also permits the designer module to be removed from production output. Development builds provide
the designer without a server-side filesystem API or automatic Git operations. Persisting new levels
requires an explicit download and manual repository update.

## Alternatives considered

- **Authentication:** not needed for a local developer-only tool and would add user/account
  infrastructure.
- **Automatic repository writes or commits:** rejected because browser builds must not write to the
  repository or perform Git operations.
- **Separate CLI/entry point:** deferred; a development-only web view reuses the existing board UI
  and engine with less duplication.
