/**
 * @copyright Romain Bertrand 2018
 * @copyright Akiomi Kamakura 2023
 */

import { expect } from 'vitest';

import type { CustomMatchers } from './matchers';
import * as matchers from './matchers';

declare module '@vitest/expect' {
  // biome-ignore lint/suspicious/noExplicitAny: matches vitest's own Assertion<T = any> signature
  interface Assertion<T = any> extends CustomMatchers<T> {}

  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend(matchers);
