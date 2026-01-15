/**
 * Store implementation
 * 
 * The Store is the heart of mini-jotai. It:
 * - Holds the actual state for all atoms
 * - Manages dependencies between atoms
 * - Notifies subscribers when atoms change
 * - Handles the get/set operations
 * 
 * This is the most complex part of the implementation!
 */

import type { Atom, WritableAtom, AtomState, Listener } from './types';

/**
 * The Store class manages all atom state and subscriptions.
 * 
 * Key responsibilities:
 * 1. Store atom values (use WeakMap<Atom, AtomState>)
 * 2. Track dependencies between atoms
 * 3. Recompute derived atoms when dependencies change
 * 4. Notify React components when atoms they use change
 * 
 * TODO: Implement this class
 */
export class Store {
  /**
   * Stores the state for each atom.
   * WeakMap is used so atoms can be garbage collected when no longer referenced.
   * 
   * TODO: Initialize this in the constructor
   */
  private atomStateMap: WeakMap<Atom<unknown>, AtomState>;

  /**
   * Stores listeners (React components) subscribed to each atom.
   * 
   * TODO: Initialize this in the constructor
   */
  private listeners: WeakMap<Atom<unknown>, Set<Listener>>;

  constructor() {
    // TODO: Initialize the WeakMaps
    throw new Error('Store constructor not implemented yet');
  }

  /**
   * Gets the current value of an atom.
   * This is the 'get' function passed to atom read functions.
   * 
   * Key challenges:
   * 1. If atom has no state yet, need to compute it for the first time
   * 2. Need to track dependencies (which atoms does this atom read?)
   * 3. For derived atoms, call their read function
   * 4. For primitive atoms, return stored value
   * 
   * TODO: Implement this method
   * 
   * @param atom - The atom to read
   * @returns The current value of the atom
   */
  get<Value>(atom: Atom<Value>): Value {
    // TODO: Implement atom reading logic
    //
    // Hints:
    // 1. Check if atom already has state in atomStateMap
    // 2. If not, create initial state
    // 3. Call atom.read(this.get.bind(this)) to compute value
    // 4. Store the value in atomStateMap
    // 5. Track dependencies (which atoms were read during computation)
    // 6. Return the value
    
    throw new Error('Store.get() not implemented yet');
  }

  /**
   * Sets/updates an atom's value.
   * This is the 'set' function passed to atom write functions.
   * 
   * Key challenges:
   * 1. Call the atom's write function
   * 2. Invalidate dependent atoms (atoms that depend on this one)
   * 3. Notify listeners that the atom changed
   * 4. Handle cascading updates (updating one atom might affect others)
   * 
   * TODO: Implement this method
   * 
   * @param atom - The atom to update
   * @param args - Arguments to pass to the atom's write function
   * @returns The result of the write function
   */
  set<Value, Args extends unknown[], Result>(
    atom: WritableAtom<Value, Args, Result>,
    ...args: Args
  ): Result {
    // TODO: Implement atom writing logic
    //
    // Hints:
    // 1. Call atom.write(this.get.bind(this), this.set.bind(this), ...args)
    // 2. Track which atoms were modified during the write
    // 3. Invalidate/recompute dependent atoms
    // 4. Notify all listeners of changed atoms
    // 5. Return the result from atom.write()
    
    throw new Error('Store.set() not implemented yet');
  }

  /**
   * Subscribe to atom changes.
   * When the atom's value changes, the listener function is called.
   * 
   * This is used by React hooks to re-render when atoms change.
   * 
   * TODO: Implement this method
   * 
   * @param atom - The atom to subscribe to
   * @param listener - Function to call when atom changes
   * @returns Unsubscribe function
   */
  subscribe<Value>(atom: Atom<Value>, listener: Listener): () => void {
    // TODO: Implement subscription logic
    //
    // Hints:
    // 1. Add the listener to the listeners WeakMap for this atom
    // 2. Return a function that removes the listener when called
    // 3. Make sure to handle the case where this is the first listener for an atom
    
    throw new Error('Store.subscribe() not implemented yet');
  }

  /**
   * Optional: Reset an atom to its initial state.
   * Useful for testing and cleanup.
   * 
   * @param atom - The atom to reset
   */
  reset<Value>(atom: Atom<Value>): void {
    // TODO: Optional - implement reset logic
    // This is useful but not essential for basic functionality
  }

  /**
   * Optional: Get a snapshot of all atom states.
   * Useful for debugging and dev tools.
   */
  getDebugState(): Map<string, unknown> {
    // TODO: Optional - implement debug state extraction
    // This is useful but not essential for basic functionality
    return new Map();
  }
}

/**
 * Creates a new store instance.
 * In real Jotai, there's a default store, but you can create custom stores.
 * 
 * @returns A new Store instance
 */
export function createStore(): Store {
  return new Store();
}

