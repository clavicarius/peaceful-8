import { describe, it, expect } from 'vitest';
import { queenAttacks, rookAttacks, bishopAttacks, knightAttacks, canAttack } from '../attacks.js';
import type { Position } from '../types.js';

const pos = (row: number, col: number): Position => ({ row, col });

describe('queenAttacks', () => {
  it('attacks same row', () => {
    expect(queenAttacks(pos(3, 0), pos(3, 7))).toBe(true);
  });
  it('attacks same col', () => {
    expect(queenAttacks(pos(0, 4), pos(7, 4))).toBe(true);
  });
  it('attacks diagonal', () => {
    expect(queenAttacks(pos(0, 0), pos(7, 7))).toBe(true);
    expect(queenAttacks(pos(0, 7), pos(7, 0))).toBe(true);
  });
  it('does not attack unrelated square', () => {
    expect(queenAttacks(pos(0, 0), pos(1, 2))).toBe(false);
  });
});

describe('rookAttacks', () => {
  it('attacks same row', () => {
    expect(rookAttacks(pos(2, 0), pos(2, 5))).toBe(true);
  });
  it('attacks same col', () => {
    expect(rookAttacks(pos(0, 3), pos(6, 3))).toBe(true);
  });
  it('does not attack diagonal', () => {
    expect(rookAttacks(pos(0, 0), pos(3, 3))).toBe(false);
  });
});

describe('bishopAttacks', () => {
  it('attacks diagonal', () => {
    expect(bishopAttacks(pos(0, 0), pos(5, 5))).toBe(true);
    expect(bishopAttacks(pos(3, 5), pos(0, 2))).toBe(true);
  });
  it('does not attack same row', () => {
    expect(bishopAttacks(pos(3, 0), pos(3, 5))).toBe(false);
  });
  it('does not attack same col', () => {
    expect(bishopAttacks(pos(0, 3), pos(5, 3))).toBe(false);
  });
});

describe('knightAttacks', () => {
  it('attacks L-shapes', () => {
    const source = pos(4, 4);
    expect(knightAttacks(source, pos(2, 3))).toBe(true);
    expect(knightAttacks(source, pos(2, 5))).toBe(true);
    expect(knightAttacks(source, pos(6, 3))).toBe(true);
    expect(knightAttacks(source, pos(6, 5))).toBe(true);
    expect(knightAttacks(source, pos(3, 2))).toBe(true);
    expect(knightAttacks(source, pos(3, 6))).toBe(true);
    expect(knightAttacks(source, pos(5, 2))).toBe(true);
    expect(knightAttacks(source, pos(5, 6))).toBe(true);
  });
  it('does not attack same row', () => {
    expect(knightAttacks(pos(4, 4), pos(4, 6))).toBe(false);
  });
  it('does not attack diagonal', () => {
    expect(knightAttacks(pos(4, 4), pos(6, 6))).toBe(false);
  });
});

describe('canAttack', () => {
  it('dispatches correctly for queen', () => {
    expect(canAttack('queen', pos(0, 0), pos(7, 7))).toBe(true);
  });
  it('dispatches correctly for knight', () => {
    expect(canAttack('knight', pos(0, 0), pos(1, 2))).toBe(true);
  });
});
