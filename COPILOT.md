# GitHub Copilot Instructions

## General

This repository uses:

- TypeScript strict
- React
- Vite
- Vitest

Never disable TypeScript checks.

## Engine

The Engine contains:

- board
- chess rules
- validation
- solver interfaces

The Engine must never depend on React.

## UI

React components should only render data.

Business logic belongs in packages/engine.

## Commits

Prefer small focused commits.

## Functions

Prefer functions below 40 lines.

Extract reusable logic.

## Naming

Use meaningful names.

Avoid abbreviations.

## Comments

Explain WHY.

Avoid comments describing WHAT.

## Tests

New logic requires tests.