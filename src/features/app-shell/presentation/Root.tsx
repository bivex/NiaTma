'use client';

import { type PropsWithChildren } from 'react';
import { AppRoot, Placeholder } from '@telegram-apps/telegram-ui';
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
      <div style={showTabBar ? { paddingBottom: 80 } : undefined}>
        {children}
      </div>
      {showTabBar && <BottomTabBar />}
    </>
  );
}

export function Root(props: PropsWithChildren) {
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <QueryProvider>
        <RootInner>
          <TabBarLayout {...props} />
        </RootInner>
      </QueryProvider>
    </ErrorBoundary>
  ) : (
    <Placeholder header="Loading" />
  );
}
