/**
 * React hooks for using atoms
 * 
 * These hooks are the main API for using mini-jotai in React components.
 * They connect React's rendering system with the atom store.
 */

import { useEffect, useReducer, useCallback } from 'react';
import type { Atom, WritableAtom, ExtractAtomArgs, ExtractAtomValue } from './types';
import { useStore } from './Provider';

/**
 * Hook to read and write an atom's value.
 * This is the most common hook - it returns [value, setValue] like useState.
 * 
 * Usage:
 *   const [count, setCount] = useAtom(countAtom);
 *   setCount(count + 1);
 * 
 * TODO: Implement this hook
 * 
 * Key challenges:
 * 1. Read the current value from the store
 * 2. Subscribe to changes and re-render when the atom updates
 * 3. Return a setter function that updates the atom
 * 4. Clean up subscription on unmount
 * 
 * Hints:
 * - Use useStore() to get the store
 * - Use useReducer or useState to trigger re-renders
 * - Use useEffect to subscribe to atom changes
 * - Return [value, setValue] tuple
 * 
 * @param atom - The writable atom to use
 * @returns Tuple of [value, setValue]
 */
export function useAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>
): [Value, (...args: Args) => Result];

/**
 * Overload for read-only atoms (no setter returned)
 */
export function useAtom<Value>(atom: Atom<Value>): [Value, never];

/**
 * Implementation of useAtom
 */
export function useAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result> | Atom<Value>
) {
  // TODO: Implement useAtom
  //
  // Step-by-step approach:
  // 1. Get the store using useStore()
  // 2. Use useReducer to force re-renders: const [, rerender] = useReducer(c => c + 1, 0)
  // 3. Read the current value: store.get(atom)
  // 4. Subscribe to changes in useEffect:
  //    - Call store.subscribe(atom, rerender)
  //    - Return the unsubscribe function for cleanup
  // 5. Create a setter function using useCallback:
  //    - Check if atom is writable (has 'write' property)
  //    - Call store.set(atom, ...args)
  // 6. Return [value, setter]
  
  throw new Error('useAtom not implemented yet');
}

/**
 * Hook to read an atom's value without subscribing to updates.
 * Use this when you only need to read once, not track changes.
 * 
 * Usage:
 *   const count = useAtomValue(countAtom);
 * 
 * TODO: Implement this hook
 * 
 * This is similar to useAtom but:
 * - Only returns the value (not a tuple)
 * - Still subscribes to updates (needs to re-render when atom changes)
 * 
 * @param atom - The atom to read
 * @returns The current value
 */
export function useAtomValue<Value>(atom: Atom<Value>): Value {
  // TODO: Implement useAtomValue
  //
  // Hints:
  // - Very similar to useAtom, but only return the value
  // - Still need to subscribe and re-render on changes
  // - Can you reuse useAtom internally?
  
  throw new Error('useAtomValue not implemented yet');
}

/**
 * Hook to get a setter function for an atom without subscribing to its value.
 * Use this when you only need to update an atom, not read it.
 * This avoids unnecessary re-renders.
 * 
 * Usage:
 *   const setCount = useSetAtom(countAtom);
 *   setCount(10);
 * 
 * TODO: Implement this hook
 * 
 * This is different from useAtom because:
 * - Doesn't read the value
 * - Doesn't subscribe to changes
 * - Never causes re-renders
 * - Only returns the setter function
 * 
 * @param atom - The writable atom
 * @returns The setter function
 */
export function useSetAtom<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>
): (...args: Args) => Result {
  // TODO: Implement useSetAtom
  //
  // Hints:
  // - Get the store using useStore()
  // - Create a stable setter function using useCallback
  // - The setter should call store.set(atom, ...args)
  // - No subscription needed!
  // - No value reading needed!
  
  throw new Error('useSetAtom not implemented yet');
}

/**
 * Advanced: Hook to atomically update multiple atoms.
 * This is useful for batch updates to avoid intermediate renders.
 * 
 * This is an optional advanced feature - implement the basic hooks first!
 */
export function useAtomCallback<Args extends unknown[], Result>(
  callback: (get: <V>(atom: Atom<V>) => V, set: <V, A extends unknown[], R>(atom: WritableAtom<V, A, R>, ...args: A) => R, ...args: Args) => Result
): (...args: Args) => Result {
  // TODO: Optional - implement batch updates
  // This is advanced functionality, focus on basic hooks first
  throw new Error('useAtomCallback not implemented yet - this is optional');
}

