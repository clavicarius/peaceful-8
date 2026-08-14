# AGENTS.md

# Peaceful 8

## Purpose

Welcome to the **Peaceful 8** project.

This repository contains the source code for a cross-platform logic puzzle game inspired by chess.

The objective of every puzzle is to place eight chess pieces on a chessboard so that **no piece attacks another piece**.

The project is designed to be highly modular, testable and extensible.

---

# Project Goals

The project has four primary goals.

1. Build a fun and relaxing puzzle game.
2. Separate game logic from presentation.
3. Support automatic puzzle generation.
4. Maintain high code quality and excellent documentation.

---

# Before You Start

Before implementing new functionality, always read the following documentation in this order:

1. PROJECT_OVERVIEW.md
2. VISION.md
3. GAME_DESIGN.md
4. ARCHITECTURE.md
5. DEVELOPMENT_PLAN.md

These documents define the architecture and should always take precedence over implementation decisions.

---

# Architecture Principles

The project follows a strict separation of responsibilities.

```
UI
│
├── Presentation
│
└── Game Engine
      │
      ├── Solver
      ├── Generator
      └── Storage
```

The Game Engine must never depend on UI code.

The UI may consume the Game Engine but must never contain game rules.

---

# Core Components

## Engine

Responsible for:

- board representation
- chess pieces
- movement rules
- attack detection
- puzzle validation
- game state

The Engine must remain completely deterministic.

---

## Solver

Responsible for:

- solving puzzles
- validating generated puzzles
- providing hints
- checking uniqueness of solutions

---

## Generator

Responsible for:

- creating complete valid boards
- removing pieces
- assigning difficulty
- exporting puzzles

The Generator should always use the Solver to validate generated puzzles.

---

## UI

Responsible for:

- rendering the board
- animations
- drag & drop
- touch input
- menus
- settings

The UI must never implement chess rules.

---

# Development Philosophy

Always prefer:

- simplicity
- readability
- maintainability
- deterministic behaviour

Avoid unnecessary abstractions.

Introduce new dependencies only when they provide significant long-term value.

---

# Coding Standards

Use:

- TypeScript
- strict mode
- ESLint
- Prettier

General rules:

- small functions
- descriptive names
- immutable data where practical
- no duplicated logic
- no magic numbers

---

# Testing Strategy

Every important feature should include tests.

Required test categories:

## Unit Tests

- chess movement
- attack detection
- board validation
- solver logic
- generator logic

## Integration Tests

- loading puzzles
- solving puzzles
- saving progress

## End-to-End Tests

- complete gameplay
- drag & drop
- mobile interactions

Bug fixes should include regression tests whenever possible.

---

# Documentation

Every architectural change must update the corresponding documentation.

Possible files include:

- PROJECT_OVERVIEW.md
- GAME_DESIGN.md
- ARCHITECTURE.md
- LEVEL_SYSTEM.md
- GAME_ENGINE.md

Documentation is considered part of the implementation.

---

# Milestones

Current roadmap:

## M1

Project Foundation

- repository
- CI
- documentation
- project structure

---

## M2

Game Engine

- board
- pieces
- attack detection
- validation

---

## M3

Playable Prototype

- board UI
- drag & drop
- conflict highlighting

---

## M4

Solver

- puzzle solving
- validation
- hints

---

## M5

Puzzle Generator

- automatic generation
- difficulty estimation
- uniqueness validation

---

## M6

Minimum Viable Product

- campaign
- 100 levels
- save progress
- settings

---

## M7

Mobile Release

- Android
- iOS
- offline support

---

## M8

Community Features

- Daily Puzzle
- statistics
- achievements

---

## M9

Advanced Features

- Level Editor
- puzzle sharing
- visual themes

---

## M10

Version 1.0

- release preparation
- optimization
- bug fixing

---

# Pull Request Guidelines

Every Pull Request should answer the following questions:

- What was changed?
- Why was it changed?
- Does it include tests?
- Does it update documentation?
- Does it preserve the architecture?

---

# AI Agent Guidelines

When implementing new functionality:

1. Read the relevant documentation first.
2. Prefer modifying existing modules instead of creating duplicates.
3. Keep the Engine independent from any UI framework.
4. Write tests before or alongside implementation.
5. Update documentation if architecture changes.
6. Keep commits small and focused.
7. Avoid speculative features.
8. Prefer composition over inheritance.
9. Preserve backwards compatibility where practical.
10. Do not introduce breaking changes without documenting them.

---

# Definition of Done

A task is considered complete when:

- implementation is finished
- tests pass
- lint passes
- formatting passes
- documentation is updated
- no duplicated logic exists
- architecture remains consistent

---

# Long-Term Vision

Peaceful 8 should become a high-quality puzzle platform capable of generating virtually unlimited logic puzzles.

Future ideas include:

- multiple board sizes
- additional chess pieces
- seasonal events
- cloud synchronization
- online leaderboards
- community puzzle sharing

Every implementation should support this long-term vision without unnecessarily increasing complexity.
