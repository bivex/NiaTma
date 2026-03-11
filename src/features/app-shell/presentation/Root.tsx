'use client';

import { type PropsWithChildren } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { AppRoot } from '@telegram-apps/telegram-ui';

import { useAppShell } from '@/features/app-shell/application/useAppShell';
import { useDidMount } from '@/shared/lib/useDidMount';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { ErrorPage } from '@/shared/ui/ErrorPage';

import './styles.css';

function RootInner({ children }: PropsWithChildren) {
  const viewModel = useAppShell();

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <AppRoot
        appearance={viewModel.appearance}
        platform={viewModel.platform}
      >
        {children}
      </AppRoot>
    </TonConnectUIProvider>
  );
}

export function Root(props: PropsWithChildren) {
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className="root__loading">Loading</div>
  );
}