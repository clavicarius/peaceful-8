import { describe, expect, it } from 'vitest';
import config from '../vite.config';

describe('Vite configuration', () => {
  it('uses the preview path as the public base', () => {
    expect(config.base).toBe('/peaceful-8/preview/');
  });
});
