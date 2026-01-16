/**
 * Core type definitions for mini-jotai
 *
 * This file contains all the fundamental types used throughout the library.
 * Understanding these types is crucial for implementing the atom system.
 */

/**
 * Represents a function that reads atom values from the store.
 * This is passed to atom read functions to allow them to read other atoms.
 */
export type Getter = <Value>(atom: Atom<Value>) => Value;

/**
 * Represents a function that writes/updates atom values in the store.
 * This is passed to atom write functions to allow them to update atoms.
 */
export type Setter = <Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
  ...args: Args
) => Result;

/**
 * Base Atom interface - represents a readable atom.
 * An atom is the fundamental unit of state in Jotai.
 *
 * Key concepts:
 * - Atoms are definitions, not values
 * - The read function defines how to compute the atom's value
 * - Atoms can depend on other atoms via the 'get' function
 *
 * Based on real Jotai:
 * - Primitive atoms have an 'init' property
 * - Derived atoms do NOT have an 'init' property
 * - The Store checks for 'init' to detect primitive atoms
 */
export interface Atom<Value> {
  /**
   * Initial value for primitive atoms.
   * Only present on primitive atoms (created with atom(value)).
   * The Store uses this to detect primitive atoms.
   */
  init?: Value;

  /**
   * The read function computes the atom's current value.
   * It receives a 'get' function to read other atoms.
   *
   * For primitive atoms, this is defaultRead which calls get(this).
   * For derived atoms, this is the user-provided read function.
   */
  read: (get: Getter) => Value;

  /**
   * Optional debug label for development
   */
  debugLabel?: string;
}

/**
 * WritableAtom extends Atom to support updates.
 *
 * Key concepts:
 * - Args: the arguments passed when updating (e.g., new value, or update function)
 * - Result: what the write function returns (usually void)
 * - The write function receives 'get' to read atoms and 'set' to update atoms
 */
export interface WritableAtom<Value, Args extends unknown[], Result>
  extends Atom<Value> {
  /**
   * The write function defines how to update the atom.
   * It receives:
   * - get: to read current values
   * - set: to update atoms
   * - ...args: the arguments passed from the caller
   *
   * TODO: Implement the logic to call this function and propagate updates
   */
  write: (get: Getter, set: Setter, ...args: Args) => Result;
}

/**
 * Primitive atom - the simplest writable atom that holds a value.
 * This is what you get from atom(initialValue).
 *
 * Key characteristics:
 * - Has an 'init' property with the initial value
 * - Uses defaultRead and defaultWrite functions
 * - Can be updated with either a value or an updater function
 */
export type PrimitiveAtom<Value> = WritableAtom<
  Value,
  [Value | ((prev: Value) => Value)],
  void
> & {
  init: Value;
};

/**
 * Helper type to extract the value type from an Atom
 */
export type ExtractAtomValue<AtomType> = AtomType extends Atom<infer Value>
  ? Value
  : never;

/**
 * Helper type to extract the update args from a WritableAtom
 */
export type ExtractAtomArgs<AtomType> = AtomType extends WritableAtom<
  any,
  infer Args,
  any
>
  ? Args
  : never;

/**
 * Helper type to extract the result type from a WritableAtom
 */
export type ExtractAtomResult<AtomType> = AtomType extends WritableAtom<
  any,
  any,
  infer Result
>
  ? Result
  : never;

/**
 * Represents a listener function that gets called when atoms update
 */
export type Listener = () => void;

/**
 * Internal state stored for each atom in the store.
 * This is what you'll store in your WeakMap.
 *
 * TODO: Design what information you need to track for each atom:
 * - Current value
 * - Dependents (atoms that depend on this one)
 * - Dependencies (atoms this one depends on)
 * - Listeners (React components subscribed to changes)
 */
export interface AtomState<Value = unknown> {
  // TODO: Add fields you need to track atom state
  // Hint: Think about what you need for:
  // 1. Storing the current value
  // 2. Tracking dependencies between atoms
  // 3. Notifying subscribers when values change
}
