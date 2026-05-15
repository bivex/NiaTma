'use client';

import { type PropsWithChildren } from 'react';
import { AppRoot, Placeholder } from '@telegram-apps/telegram-ui';

import { useAppShell } from '@/features/app-shell/application/useAppShell';
import { useDidMount } from '@/shared/lib/useDidMount';
import { QueryProvider } from '@/shared/query/presentation/QueryProvider';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { ErrorPage } from '@/shared/ui/ErrorPage';

function RootInner({ children }: PropsWithChildren) {
  const viewModel = useAppShell();

  return (
    <AppRoot appearance={viewModel.appearance} platform={viewModel.platform}>
      {children}
    </AppRoot>
  );
}

export function Root(props: PropsWithChildren) {
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <QueryProvider>
        <RootInner {...props} />
      </QueryProvider>
    </ErrorBoundary>
  ) : (
    <Placeholder header="Loading" />
  );
}