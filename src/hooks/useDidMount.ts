import { useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}

/**
 * @return True, if component was mounted.
 */
export function useDidMount(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}