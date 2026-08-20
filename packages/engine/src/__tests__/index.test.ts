import { describe, it, expect } from 'vitest';
import { ENGINE_VERSION } from '../index.js';

describe('Engine', () => {
  it('exports ENGINE_VERSION', () => {
    expect(ENGINE_VERSION).toBe('0.2.0');
  });
});
