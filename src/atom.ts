/**
 * Atom creation functions
 *
 * This module provides the factory functions for creating atoms.
 * Atoms are the building blocks of Jotai's state management.
 */

import type {
  Atom,
  PrimitiveAtom,
  WritableAtom,
  Getter,
  Setter,
} from "./types";

/**
 * Creates a primitive atom with an initial value.
 * This is the most basic atom - it holds a value that can be read and written.
 *
 * Usage:
 *   const countAtom = atom(0);
 *   const nameAtom = atom('John');
 *
 * TODO: Implement this function
 * Hints:
 * - Return an object that implements the PrimitiveAtom interface
 * - The read function should return the current value
 * - The write function should update the value
 * - Think about how the store will actually hold the value (not here, but in store.ts)
 *
 * @param initialValue - The initial value of the atom
 * @returns A primitive atom
 */
export function atom<Value>(initialValue: Value): PrimitiveAtom<Value>;

/**
 * Creates a read-only derived atom.
 * This atom computes its value based on other atoms.
 *
 * Usage:
 *   const doubleCountAtom = atom((get) => get(countAtom) * 2);
 *
 * @param read - Function that computes the atom's value
 * @returns A read-only atom
 */
export function atom<Value>(read: (get: Getter) => Value): Atom<Value>;

/**
 * Creates a writable derived atom.
 * This atom can compute its value AND define custom write behavior.
 *
 * Usage:
 *   const doubleCountAtom = atom(
 *     (get) => get(countAtom) * 2,
 *     (get, set, newValue: number) => set(countAtom, newValue / 2)
 *   );
 *
 * @param read - Function that computes the atom's value
 * @param write - Function that defines how to update the atom
 * @returns A writable derived atom
 */
export function atom<Value, Args extends unknown[], Result>(
  read: (get: Getter) => Value,
  write: (get: Getter, set: Setter, ...args: Args) => Result
): WritableAtom<Value, Args, Result>;

/**
 * Implementation of the atom function (handles all overloads above)
 *
 * This function creates atom configuration objects based on the real Jotai implementation.
 *
 * Key insights from real Jotai:
 * 1. Primitive atoms have an 'init' property
 * 2. Primitive atoms use defaultRead and defaultWrite functions
 * 3. The read/write functions use 'this' binding to reference the atom itself
 * 4. The Store checks for 'init' to detect primitive atoms
 */
export function atom<Value, Args extends unknown[], Result>(
  read?: Value | ((get: Getter) => Value),
  write?: (get: Getter, set: Setter, ...args: Args) => Result
) {
  const config = {} as WritableAtom<Value, Args, Result> & { init?: Value };

  if (typeof read === "function") {
    // Derived atom (read-only or writable)
    config.read = read as (get: Getter) => Value;
  } else {
    // Primitive atom
    config.init = read;
    config.read = defaultRead as (get: Getter) => Value;
    config.write = defaultWrite as unknown as (
      get: Getter,
      set: Setter,
      ...args: Args
    ) => Result;
  }

  if (write) {
    // Writable derived atom or write-only atom
    config.write = write;
  }

  return config;
}

/**
 * Default read function for primitive atoms.
 *
 * This is called by the Store when reading a primitive atom.
 * It calls get(this) which asks the Store to return the stored value.
 *
 * The Store will detect that this atom has 'init' and return the stored value
 * without calling read() again (avoiding circular reference).
 */
function defaultRead<Value>(this: Atom<Value>, get: Getter): Value {
  return get(this);
}

/**
 * Default write function for primitive atoms.
 *
 * Handles both direct values and updater functions:
 * - setCount(5) - direct value
 * - setCount(c => c + 1) - updater function
 *
 * The Store will detect that this atom has 'init' and update the stored value
 * without calling write() again (avoiding circular reference).
 */
function defaultWrite<Value>(
  this: PrimitiveAtom<Value>,
  get: Getter,
  set: Setter,
  arg: Value | ((prev: Value) => Value)
): void {
  return set(
    this,
    typeof arg === "function" ? (arg as (prev: Value) => Value)(get(this)) : arg
  );
}
