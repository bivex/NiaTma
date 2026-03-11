'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { initData, useRawInitData, useSignal } from '@tma.js/sdk-react';
import { Button, List, Section, Text } from '@telegram-apps/telegram-ui';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import {
  authSessionQueryKey,
  fetchAuthSession,
  logoutAuthSession,
  signInWithDevLogin,
  signInWithTelegram,
} from '../application/authApi';
import { buildAuthScreenModel } from '../application/presenters';
import { routePaths } from '@/features/navigation/domain/routes';
import { Page } from '@/features/navigation/presentation/Page';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

import './AuthScreen.css';

export function AuthScreen() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const queryClient = useQueryClient();
  const rawInitData = useRawInitData();
  const initDataUser = useSignal(initData.user);
  const [notice, setNotice] = useState<string>();
  const sessionQuery = useQuery({
    queryKey: authSessionQueryKey,
    queryFn: fetchAuthSession,
  });

  const refreshSession = async () => {
    await queryClient.invalidateQueries({ queryKey: authSessionQueryKey });
  };

  const telegramMutation = useMutation({
    mutationFn: () => signInWithTelegram(rawInitData || ''),
    onSuccess: async () => {
      setNotice(t('messages.telegramSuccess'));
      await refreshSession();
    },
    onError: () => {
      setNotice(t('messages.telegramError'));
    },
  });

  const devLoginMutation = useMutation({
    mutationFn: signInWithDevLogin,
    onSuccess: async () => {
      setNotice(t('messages.devSuccess'));
      await refreshSession();
    },
    onError: () => {
      setNotice(t('messages.devError'));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutAuthSession,
    onSuccess: async () => {
      setNotice(t('messages.logoutSuccess'));
      await refreshSession();
    },
    onError: () => {
      setNotice(t('messages.logoutError'));
    },
  });

  const session = sessionQuery.data?.session;
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
    () =>
      buildAuthScreenModel({
        rawInitDataPresent: Boolean(rawInitData),
        telegramAuthAvailable: sessionQuery.data?.capabilities.telegramAuthAvailable ?? false,
        sessionSigningConfigured: sessionQuery.data?.capabilities.sessionSigningConfigured ?? false,
        devLoginAvailable: sessionQuery.data?.capabilities.devLoginAvailable ?? false,
        sessionStatus: sessionQuery.isPending ? t('status.loading') : sessionQuery.data?.status || t('status.anonymous'),
        sessionProvider: session?.provider,
        sessionSubject: session?.sub,
        sessionDisplayName: displayName || initDataUser?.first_name,
        sessionUsername: session?.user.username,
        sessionIssuedAt: session ? timeFormatter.format(session.issuedAt) : undefined,
        sessionExpiresAt: session ? timeFormatter.format(session.expiresAt) : undefined,
        initDataHref: routePaths.initData,
        platformHref: routePaths.platform,
        profileHref: routePaths.profile,
      }),
    [
      displayName,
      initDataUser?.first_name,
      rawInitData,
      session,
      sessionQuery.data?.capabilities.devLoginAvailable,
      sessionQuery.data?.capabilities.sessionSigningConfigured,
      sessionQuery.data?.capabilities.telegramAuthAvailable,
      sessionQuery.data?.status,
      sessionQuery.isPending,
      t,
      timeFormatter,
    ],
  );

  const isBusy =
    sessionQuery.isFetching || telegramMutation.isPending || devLoginMutation.isPending || logoutMutation.isPending;

  return (
    <Page swipeBack>
      <List>
        <Section>
          <div className="auth-screen__copy">
            <Text className="auth-screen__title" weight="2">
              {t('intro.header')}
            </Text>
            <Text className="auth-screen__description">{t('intro.description')}</Text>
            {notice && <Text className="auth-screen__notice">{notice}</Text>}
          </div>
          <div className="auth-screen__actions">
            <Button
              className="auth-screen__button-primary"
              stretched
              loading={telegramMutation.isPending}
              disabled={!rawInitData || !(sessionQuery.data?.capabilities.telegramAuthAvailable ?? false)}
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
              disabled={!(sessionQuery.data?.capabilities.devLoginAvailable ?? false)}
              onClick={() => {
                void devLoginMutation.mutateAsync();
              }}
            >
              {t('actions.devSignIn')}
            </Button>
            <Button
              stretched
              mode="outline"
              loading={sessionQuery.isFetching}
              onClick={() => {
                void sessionQuery.refetch();
              }}
            >
              {t('actions.refreshSession')}
            </Button>
            <Button
              stretched
              mode="gray"
              loading={logoutMutation.isPending}
              disabled={isBusy || sessionQuery.data?.status !== 'authenticated'}
              onClick={() => {
                void logoutMutation.mutateAsync();
              }}
            >
              {t('actions.logout')}
            </Button>
          </div>
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