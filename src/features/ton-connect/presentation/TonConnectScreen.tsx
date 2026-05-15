'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TonConnectButton, TonConnectUIProvider } from '@tonconnect/ui-react';
import {
  Avatar,
  Button,
  Cell,
  List,
  Navigation,
  Placeholder,
  Section,
  Text,
  Title,
} from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import {
  authApiService,
  authProfileQueryKey,
  authSessionQueryKey,
  authTonProofPayloadQueryKey,
} from '@/features/auth/application/authApi';
import { resolvePostAuthPath } from '@/features/auth/application/navigation';
import { sanitizePersistedAuthSessionStatus, useAuthStore } from '@/features/auth/application/authStore';
import {
  buildTonConnectScreenModel,
  toAuthLinkedWalletInput,
  toVerifyAuthTonProofInput,
} from '@/features/ton-connect/application/presenters';
import { routePaths } from '@/features/navigation/domain/routes';
import { telegramNavigationService } from '@/features/navigation/infrastructure/telegram';
import { AppLink } from '@/features/navigation/presentation/AppLink';
import { Page } from '@/features/navigation/presentation/Page';
import { useTonWalletSnapshot } from '@/features/ton-connect/infrastructure/telegram';
import type { DisplayDataRow } from '@/shared/domain/display-data';
import { bem } from '@/shared/lib/bem';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

import './TonConnectScreen.css';

import { useTonProofConnection } from '../application/useTonProofConnection';

const [, e] = bem('ton-connect-page');

function TonConnectScreenContent() {
  const wallet = useTonWalletSnapshot();
  const screen = buildTonConnectScreenModel(wallet);
  const t = useTranslations('tonConnect');
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState<string>();
  const persistedSessionStatus = useAuthStore((state) => state.sessionStatus);
  const syncSessionStatus = useAuthStore((state) => state.syncSessionStatus);
  const postAuthPath = useMemo(() => resolvePostAuthPath(searchParams.get('next')), [searchParams]);

  const initialSessionStatus = useMemo(
    () => sanitizePersistedAuthSessionStatus(persistedSessionStatus),
    [persistedSessionStatus],
  );

  const sessionQuery = useQuery({
    queryKey: authSessionQueryKey,
    queryFn: authApiService.fetchSession,
    initialData: initialSessionStatus,
  });

  const { data: sessionData, isFetching: isSessionFetching } = sessionQuery;

  const { isFetchingPayload, isVerifying } = useTonProofConnection({
    onNotice: setNotice,
    onSuccess: async () => {
      const r = router;
      if (postAuthPath) {
        r.replace(postAuthPath);
      }
    },
  });

  useEffect(() => {
    const sync = syncSessionStatus;
    if (sessionData) {
      sync(sessionData);
    }
  }, [sessionData, syncSessionStatus]);

  const walletPayload = useMemo(() => toAuthLinkedWalletInput(wallet), [wallet]);

  const refreshAuth = async () => {
    const q = queryClient;
    await Promise.all([
      q.invalidateQueries({ queryKey: authSessionQueryKey }),
      q.invalidateQueries({ queryKey: authProfileQueryKey }),
    ]);
  };

  const linkMutation = useMutation({
    mutationFn: authApiService.linkWallet,
    onSuccess: async (status) => {
      syncSessionStatus(status);
      setNotice(t('messages.linkSuccess'));
      await refreshAuth();
    },
    onError: () => {
      setNotice(t('messages.linkError'));
    },
  });

  const unlinkMutation = useMutation({
    mutationFn: authApiService.unlinkWallet,
    onSuccess: async (status) => {
      syncSessionStatus(status);
      setNotice(t('messages.unlinkSuccess'));
      await refreshAuth();
    },
    onError: () => {
      setNotice(t('messages.unlinkError'));
    },
  });

  const { session } = sessionData || {};
  const linkedWallet = session?.wallet;
  const linkedWalletRows: DisplayDataRow[] = linkedWallet
    ? [
        { title: t('linking.fields.provider'), value: { kind: 'text', text: linkedWallet.provider } },
        { title: t('linking.fields.address'), value: { kind: 'text', text: linkedWallet.address } },
        { title: t('linking.fields.chain'), value: { kind: 'text', text: linkedWallet.chain } },
      ]
    : [];
  const isAuthenticated = sessionData?.status === 'authenticated';
  const entitlements = session?.entitlements;
  const walletPremium = entitlements?.walletPremium;
  const hasPremiumAccess = Boolean(walletPremium?.active);
  const matchesLinkedWallet = Boolean(walletPayload?.address && linkedWallet?.address === walletPayload.address);
  const isBusy =
    isSessionFetching ||
    isFetchingPayload ||
    isVerifying ||
    linkMutation.isPending ||
    unlinkMutation.isPending;

  const accountRows: DisplayDataRow[] =
    screen.status === 'connected'
      ? screen.accountRows.map((row) => ({
          title: t(`account.fields.${row.field}`),
          value: row.value,
        }))
      : [];

  const deviceRows: DisplayDataRow[] =
    screen.status === 'connected'
      ? screen.deviceRows.map((row) => ({
          title: t(`device.fields.${row.field}`),
          value: row.value,
        }))
      : [];

  return (
    <Page>
      <List>
        <Section>
          {screen.status === 'disconnected' ? (
            <Placeholder
              className={e('placeholder')}
              header={t('disconnected.header')}
              description={
                <>
                  <Text>{t('disconnected.description')}</Text>
                  <TonConnectButton className={e('button')} />
                </>
              }
            />
          ) : (
            <>
              {screen.provider?.imageUrl && (
                <Cell
                  before={
                    <Avatar
                      src={screen.provider.imageUrl}
                      alt={t('provider.logoAlt')}
                      width={60}
                      height={60}
                    />
                  }
                  after={<Navigation>{t('provider.aboutWallet')}</Navigation>}
                  subtitle={screen.provider.appName}
                  onClick={(event) => {
                    event.preventDefault();
                    if (screen.provider?.aboutUrl) {
                      telegramNavigationService.openExternalLink(screen.provider.aboutUrl);
                    }
                  }}
                >
                  <Title level="3">{screen.provider.name}</Title>
                </Cell>
              )}
              <TonConnectButton className={e('button-connected')} />
            </>
          )}

          {notice && <Text className={e('notice')}>{notice}</Text>}

          {sessionQuery.data?.session?.provider === 'ton' && (
            <Text className={e('notice')}>
              {t('linking.walletFirstActive')}
              {hasPremiumAccess && (
                <>
                  {' '}
                  <AppLink href={routePaths.premium}>{t('linking.premiumLink')}</AppLink>
                </>
              )}
            </Text>
          )}

          <div className={e('actions')}>
            <Button
              stretched
              className={e('button-link')}
              loading={linkMutation.isPending}
              disabled={isBusy || !walletPayload || !isAuthenticated}
              onClick={() => {
                if (walletPayload) {
                  void linkMutation.mutateAsync(walletPayload);
                }
              }}
            >
              {matchesLinkedWallet ? t('actions.relinkWallet') : t('actions.linkWallet')}
            </Button>
            <Button
              stretched
              mode="outline"
              loading={unlinkMutation.isPending}
              disabled={isBusy || !linkedWallet || !isAuthenticated}
              onClick={() => {
                void unlinkMutation.mutateAsync();
              }}
            >
              {t('actions.unlinkWallet')}
            </Button>
          </div>

          {!isAuthenticated && (
            <Text className={e('notice')}>
              {t('linking.signInPrompt')}{' '}
              <AppLink href={routePaths.auth}>{t('linking.signInLink')}</AppLink>
            </Text>
          )}
        </Section>

        {linkedWalletRows.length > 0 && (
          <DisplayData header={t('linking.header')} footer={t('linking.footer')} rows={linkedWalletRows} />
        )}
        {screen.status === 'connected' && <DisplayData header={t('account.header')} rows={accountRows} />}
        {screen.status === 'connected' && <DisplayData header={t('device.header')} rows={deviceRows} />}
      </List>
    </Page>
  );
}

export function TonConnectScreen() {
  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <TonConnectScreenContent />
    </TonConnectUIProvider>
  );
}

export default TonConnectScreen;