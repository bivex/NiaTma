'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import {
  hideBackNavigation,
  onBackNavigation,
  showBackNavigation,
} from '../infrastructure/telegram';

export function usePageNavigation(back = true) {
  const router = useRouter();

  useEffect(() => {
    if (back) {
      showBackNavigation();
    } else {
      hideBackNavigation();
    }
  }, [back]);

  useEffect(() => {
    return onBackNavigation(() => {
      router.back();
    });
  }, [router]);
}