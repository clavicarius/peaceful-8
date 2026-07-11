# Claude Code Instructions

## Project

Peaceful 8

Cross-platform puzzle game written in TypeScript.

## Primary Goal

Never sacrifice architecture for short-term implementation speed.

## Workflow

Before implementing:

1. Read PROJECT_OVERVIEW.md
2. Read ARCHITECTURE.md
3. Read GAME_ENGINE.md

## Coding Style

Prefer

- pure functions
- immutable data
- composition
- descriptive names

Avoid

- singleton patterns
- duplicated logic
- premature optimization
- hidden side effects

## Tests

Every new feature should include tests.

Every bugfix should include a regression test.

## Documentation

Whenever architecture changes:

Update documentation immediately.

Documentation is part of the implementation.

## Performance

Optimize only after correctness.

Correctness > Readability > Performance.