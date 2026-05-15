'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { initData, useRawInitData, useSignal } from '@tma.js/sdk-react';
import { Button, List, Section, Subheadline } from '@telegram-apps/telegram-ui';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import {
  authApiService,
  authSessionQueryKey,
} from '../application/authApi';
import { sanitizePersistedAuthSessionStatus, useAuthStore } from '../application/authStore';
import { resolvePostAuthPath } from '../application/navigation';
import { buildAuthScreenModel, toAuthScreenSnapshot } from '../application/presenters';
import { routePaths } from '@/features/navigation/domain/routes';
import { Page } from '@/features/navigation/presentation/Page';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

export function AuthScreen() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const rawInitData = useRawInitData();
  const initDataUser = useSignal(initData.user);
  const [notice, setNotice] = useState<string>();
  const persistedSessionStatus = useAuthStore((state) => state.sessionStatus);
  const syncSessionStatus = useAuthStore((state) => state.syncSessionStatus);
  const postAuthPath = useMemo(() => resolvePostAuthPath(searchParams.get('next')), [searchParams]);
  const tonConnectHref = useMemo(
    () => (postAuthPath ? `${routePaths.tonConnect}?next=${encodeURIComponent(postAuthPath)}` : routePaths.tonConnect),
    [postAuthPath],
  );
  const initialSessionStatus = useMemo(
    () => sanitizePersistedAuthSessionStatus(persistedSessionStatus),
    [persistedSessionStatus],
  );
  const sessionQuery = useQuery({
    queryKey: authSessionQueryKey,
    queryFn: authApiService.fetchSession,
    initialData: initialSessionStatus,
  });

  const {
    data: sessionData,
    isPending: sessionPending,
    isFetching: sessionFetching,
    refetch: refetchSessionStatus,
  } = sessionQuery;

  useEffect(() => {
    if (sessionData) {
      syncSessionStatus(sessionData);
    }
  }, [sessionData, syncSessionStatus]);

  const refreshSession = async () => {
    await queryClient.invalidateQueries({ queryKey: authSessionQueryKey });
  };

  const telegramMutation = useMutation({
    mutationFn: () => authApiService.signInWithTelegram(rawInitData || ''),
    onSuccess: async (status) => {
      syncSessionStatus(status);
      setNotice(t('messages.telegramSuccess'));
      await refreshSession();

      if (postAuthPath) {
        router.replace(postAuthPath);
      }
    },
    onError: () => {
      setNotice(t('messages.telegramError'));
    },
  });

  const devLoginMutation = useMutation({
    mutationFn: authApiService.signInWithDevLogin,
    onSuccess: async (status) => {
      syncSessionStatus(status);
      setNotice(t('messages.devSuccess'));
      await refreshSession();

      if (postAuthPath) {
        router.replace(postAuthPath);
      }
    },
    onError: () => {
      setNotice(t('messages.devError'));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApiService.logoutSession,
    onSuccess: async (status) => {
      syncSessionStatus(status);
      setNotice(t('messages.logoutSuccess'));
      await refreshSession();
    },
    onError: () => {
      setNotice(t('messages.logoutError'));
    },
  });

  const session = sessionData?.session;
  const displayName = [session?.user.firstName, session?.user.lastName].filter(Boolean).join(' ') || undefined;
  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    [locale],
  );

  const screen = useMemo(
    () => {
      const snapshouter = toAuthScreenSnapshot;
      const builder = buildAuthScreenModel;
      const snapshot = snapshouter(sessionData, {
        rawInitDataPresent: Boolean(rawInitData),
        isPending: sessionPending,
        t,
        formatTime: (date) => timeFormatter.format(date),
        initDataUserFirstName: initDataUser?.first_name,
        initDataHref: routePaths.initData,
        platformHref: routePaths.platform,
        profileHref: routePaths.profile,
        tonConnectHref: routePaths.tonConnect,
      });

      return builder(snapshot);
    },
    [
      initDataUser?.first_name,
      rawInitData,
      sessionData,
      sessionPending,
      t,
      timeFormatter,
    ],
  );

  const isBusy =
    sessionFetching || telegramMutation.isPending || devLoginMutation.isPending || logoutMutation.isPending;

  return (
    <Page swipeBack>
      <List>
        <Section
          header={t('intro.header')}
          footer={notice || t('intro.description')}
        >
          <Button
            stretched
            mode="filled"
            loading={telegramMutation.isPending}
            disabled={!rawInitData || !(sessionData?.capabilities.telegramAuthAvailable ?? false)}
            onClick={() => {
              void telegramMutation.mutateAsync();
            }}
          >
            {t('actions.telegramSignIn')}
          </Button>
          <Button
            stretched
            mode="outline"
            loading={devLoginMutation.isPending}
            disabled={!(sessionData?.capabilities.devLoginAvailable ?? false)}
            onClick={() => {
              void devLoginMutation.mutateAsync();
            }}
          >
            {t('actions.devSignIn')}
          </Button>
          <Button
            stretched
            mode="outline"
            onClick={() => {
              router.push(tonConnectHref);
            }}
          >
            {t('actions.walletSignIn')}
          </Button>
          <Button
            stretched
            mode="outline"
            loading={sessionFetching}
            onClick={() => {
              void refetchSessionStatus();
            }}
          >
            {t('actions.refreshSession')}
          </Button>
          <Button
            stretched
            mode="gray"
            loading={logoutMutation.isPending}
            disabled={isBusy || sessionData?.status !== 'authenticated'}
            onClick={() => {
              void logoutMutation.mutateAsync();
            }}
          >
            {t('actions.logout')}
          </Button>
        </Section>

        {screen.sections.map((section) => (
          <DisplayData
            key={section.id}
            header={t(`sections.${section.id}.header`)}
            footer={t(`sections.${section.id}.footer`)}
            rows={section.rows.map((row) => ({
              title: t(`fields.${row.field}`),
              value: row.value,
            }))}
          />
        ))}
      </List>
    </Page>
  );
}

export default AuthScreen;