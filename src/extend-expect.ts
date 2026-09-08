/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import { expect } from 'vitest';

import type { CustomMatchers } from './matchers';
import * as matchers from './matchers';

declare module 'vitest' {
  // Type parameters must match vitest's own `Matchers` declaration exactly, or
  // TypeScript refuses to merge the augmentation (TS2428).
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> extends CustomMatchers<R> {}
}

expect.extend(matchers);
