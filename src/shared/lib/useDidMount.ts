import { useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}

export function useDidMount(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}