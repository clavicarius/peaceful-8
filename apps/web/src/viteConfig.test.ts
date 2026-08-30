import { describe, expect, it } from 'vitest';
import config from '../vite.config';

describe('Vite configuration', () => {
  it('uses the repository path as the public base', () => {
    expect(config.base).toBe('/peaceful-8/');
  });
});
