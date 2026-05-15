'use client';

import { type PropsWithChildren } from 'react';
import { AppRoot } from '@telegram-apps/telegram-ui';
import { usePathname } from 'next/navigation';

import { BottomTabBar } from '@/features/app-shell/presentation/BottomTabBar';
import { useAppShell } from '@/features/app-shell/application/useAppShell';
import { useDidMount } from '@/shared/lib/useDidMount';
import { QueryProvider } from '@/shared/query/presentation/QueryProvider';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { ErrorPage } from '@/shared/ui/ErrorPage';
import { tabPaths } from '@/features/navigation/domain/routes';

function RootInner({ children }: PropsWithChildren) {
  const viewModel = useAppShell();

  return (
    <AppRoot appearance={viewModel.appearance} platform={viewModel.platform}>
      {children}
    </AppRoot>
  );
}

function TabBarLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const showTabBar = (tabPaths as readonly string[]).includes(pathname);

  return (
    <>
      <div style={showTabBar ? { paddingBottom: 'calc(50px + env(safe-area-inset-bottom, 0px))' } : undefined}>
        {children}
      </div>
      {showTabBar && <BottomTabBar />}
    </>
  );
}

function SsrShell() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: 'var(--tg-theme-text-color, #111)',
        background: 'var(--tg-theme-secondary-bg-color, #fff)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>NiaTma</div>
        <div style={{ fontSize: 14, opacity: 0.6 }}>Loading...</div>
      </div>
    </div>
  );
}

export function Root(props: PropsWithChildren) {
  const didMount = useDidMount();

  if (!didMount) {
    return <SsrShell />;
  }

  return (
    <ErrorBoundary fallback={ErrorPage}>
      <QueryProvider>
        <RootInner>
          <TabBarLayout {...props} />
        </RootInner>
      </QueryProvider>
    </ErrorBoundary>
  );
}
