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
export function atom<Value>(initialValue: Value): PrimitiveAtom<Value> {
  const primitiveAtom: PrimitiveAtom<Value> = {
    init: initialValue,
    read: (get) => 
    write: (get, set, args) => set(primitiveAtom, args),
  };

  return primitiveAtom;
}

/**
 * Creates a read-only derived atom.
 * This atom computes its value based on other atoms.
 *
 * Usage:
 *   const doubleCountAtom = atom((get) => get(countAtom) * 2);
 *
 * TODO: Implement this function
 * Hints:
 * - Return an object that implements the Atom interface
 * - The read function is provided by the user
 * - No write function needed (read-only)
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
 * TODO: Implement this function
 * Hints:
 * - Return an object that implements the WritableAtom interface
 * - Both read and write functions are provided by the user
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
 * TODO: Implement the actual logic here
 * This function needs to handle three cases:
 * 1. atom(value) - primitive atom
 * 2. atom(readFn) - read-only derived atom
 * 3. atom(readFn, writeFn) - writable derived atom
 *
 * Hints:
 * - Check the type of the first argument to determine which case
 * - For primitive atoms, create read/write functions that work with the initial value
 * - For derived atoms, use the provided functions
 * - Each atom should be a unique object (used as a key in WeakMap)
 */
export function atom<Value, Args extends unknown[], Result>(
  read: Value | ((get: Getter) => Value),
  write?: (get: Getter, set: Setter, ...args: Args) => Result
) {
  // TODO: Implement the atom creation logic
  //
  // Key questions to answer:
  // 1. How do you distinguish between atom(value) and atom(readFn)?
  // 2. How do you create a read function for primitive atoms?
  // 3. How do you create a write function for primitive atoms?
  // 4. What object structure should you return?
  //
  // Remember: The atom itself is just a definition/config object.
  // The actual state will be stored in the Store (store.ts).

  throw new Error("atom() not implemented yet - this is for you to implement!");
}
