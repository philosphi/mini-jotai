/**
 * Provider component for React integration
 * 
 * The Provider component creates a React context that holds the store.
 * This allows different parts of your React tree to use different stores,
 * or to use a default global store.
 */

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { Store, createStore } from './store';

/**
 * React context that holds the store instance.
 * Components access the store through this context.
 */
const StoreContext = createContext<Store | null>(null);

/**
 * Props for the Provider component
 */
export interface ProviderProps {
  children: ReactNode;
  /**
   * Optional custom store. If not provided, a new store is created.
   */
  store?: Store;
}

/**
 * Provider component that makes a store available to all child components.
 * 
 * Usage:
 *   <Provider>
 *     <App />
 *   </Provider>
 * 
 * Or with a custom store:
 *   const myStore = createStore();
 *   <Provider store={myStore}>
 *     <App />
 *   </Provider>
 * 
 * TODO: Implement this component
 * 
 * Hints:
 * - Use useRef to create a store instance that persists across renders
 * - Only create the store once (on first render)
 * - Use StoreContext.Provider to pass the store down
 */
export function Provider({ children, store: storeProp }: ProviderProps) {
  // TODO: Implement the Provider component
  //
  // Key points:
  // 1. If storeProp is provided, use it
  // 2. Otherwise, create a store using useRef (so it's stable across renders)
  // 3. Wrap children in StoreContext.Provider
  // 4. Pass the store as the context value
  
  throw new Error('Provider not implemented yet');
}

/**
 * Hook to access the store from context.
 * This is used internally by useAtom and other hooks.
 * 
 * If no Provider is found, returns a default global store.
 * This allows using atoms without a Provider (like real Jotai).
 * 
 * TODO: Implement this hook
 * 
 * @returns The store instance
 */
export function useStore(): Store {
  // TODO: Implement store access logic
  //
  // Hints:
  // 1. Use useContext to get the store from StoreContext
  // 2. If no store in context, create/return a default global store
  // 3. The default store should be a singleton (same instance every time)
  
  throw new Error('useStore not implemented yet');
}

/**
 * Default global store instance.
 * Used when no Provider is present in the tree.
 * This is lazily created on first access.
 */
let defaultStore: Store | null = null;

/**
 * Gets or creates the default global store.
 * 
 * @returns The default store instance
 */
export function getDefaultStore(): Store {
  if (!defaultStore) {
    defaultStore = createStore();
  }
  return defaultStore;
}

