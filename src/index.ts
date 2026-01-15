/**
 * Main entry point for mini-jotai
 * 
 * This file exports the public API of the library.
 */

// Core atom creation
export { atom } from './atom';

// Store
export { Store, createStore } from './store';

// React integration
export { Provider } from './Provider';
export { useAtom, useAtomValue, useSetAtom } from './hooks';

// Types (for TypeScript users)
export type {
  Atom,
  WritableAtom,
  PrimitiveAtom,
  Getter,
  Setter,
  ExtractAtomValue,
  ExtractAtomArgs,
  ExtractAtomResult,
} from './types';

