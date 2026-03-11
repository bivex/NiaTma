'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  authProfileQueryKey,
  authSessionQueryKey,
  authTonProofPayloadQueryKey,
  fetchAuthSession,
  fetchTonProofPayload,
  linkAuthWallet,
  unlinkAuthWallet,
  verifyTonProofSession,
} from '@/features/auth/application/authApi';
import { resolvePostAuthPath } from '@/features/auth/application/navigation';
import { sanitizePersistedAuthSessionStatus, useAuthStore } from '@/features/auth/application/authStore';
import { buildTonConnectScreenModel } from '@/features/ton-connect/application/presenters';
import { routePaths } from '@/features/navigation/domain/routes';
import { openExternalLink } from '@/features/navigation/infrastructure/telegram';
import { AppLink } from '@/features/navigation/presentation/AppLink';
import { Page } from '@/features/navigation/presentation/Page';
import { useTonWalletSnapshot } from '@/features/ton-connect/infrastructure/telegram';
import type { DisplayDataRow } from '@/shared/domain/display-data';
import { bem } from '@/shared/lib/bem';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

import './TonConnectScreen.css';

const [, e] = bem('ton-connect-page');

function TonConnectScreenContent() {
  const rawWallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWalletSnapshot();
  const screen = buildTonConnectScreenModel(wallet);
  const t = useTranslations('tonConnect');
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const handledProofRef = useRef<string | undefined>(undefined);
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
    queryFn: fetchAuthSession,
    initialData: initialSessionStatus,
  });
  const tonProofPayloadQuery = useQuery({
    queryKey: authTonProofPayloadQueryKey,
    queryFn: fetchTonProofPayload,
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (sessionQuery.data) {
      syncSessionStatus(sessionQuery.data);
    }
  }, [sessionQuery.data, syncSessionStatus]);

  useEffect(() => {
    if (tonProofPayloadQuery.isPending && !tonProofPayloadQuery.data) {
      tonConnectUI.setConnectRequestParameters({ state: 'loading' });
      return;
    }

    if (tonProofPayloadQuery.data?.payload) {
      tonConnectUI.setConnectRequestParameters({
        state: 'ready',
        value: { tonProof: tonProofPayloadQuery.data.payload },
      });
      return;
    }

    tonConnectUI.setConnectRequestParameters(null);
  }, [tonConnectUI, tonProofPayloadQuery.data, tonProofPayloadQuery.isPending]);

  useEffect(
    () => () => {
      tonConnectUI.setConnectRequestParameters(null);
    },
    [tonConnectUI],
  );

  useEffect(() => {
    if (!rawWallet) {
      handledProofRef.current = undefined;
    }
  }, [rawWallet]);

  const walletPayload = useMemo(() => {
    const address = wallet?.account.address?.trim();

    if (!address) {
      return undefined;
    }

    const currentWallet = wallet;

    if (!currentWallet) {
      return undefined;
    }

    return {
      address,
      chain: currentWallet.account.chain,
      publicKey: currentWallet.account.publicKey,
      provider: currentWallet.provider?.name || currentWallet.provider?.appName,
    };
  }, [wallet]);

  const refreshAuth = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: authSessionQueryKey }),
      queryClient.invalidateQueries({ queryKey: authProfileQueryKey }),
    ]);
  };

  const verifyMutation = useMutation({
    mutationFn: verifyTonProofSession,
    onSuccess: async (status) => {
      syncSessionStatus(status);
      setNotice(t('messages.tonProofSuccess'));
      await refreshAuth();

      if (postAuthPath) {
        router.replace(postAuthPath);
      }
    },
    onError: async () => {
      handledProofRef.current = undefined;
      setNotice(t('messages.tonProofError'));
      await queryClient.invalidateQueries({ queryKey: authTonProofPayloadQueryKey });
    },
  });

  const linkMutation = useMutation({
    mutationFn: linkAuthWallet,
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
    mutationFn: unlinkAuthWallet,
    onSuccess: async (status) => {
      syncSessionStatus(status);
      setNotice(t('messages.unlinkSuccess'));
      await refreshAuth();
    },
    onError: () => {
      setNotice(t('messages.unlinkError'));
    },
  });

  const handleWalletStatusChange = useCallback(
    async (nextWallet: ReturnType<typeof useTonWallet>) => {
      const tonProofReply = nextWallet?.connectItems?.tonProof;

      if (!nextWallet || !tonProofReply) {
        return;
      }

      if (!('proof' in tonProofReply)) {
        setNotice(t('messages.tonProofRejected'));
        return;
      }

      if (!nextWallet.account.publicKey) {
        setNotice(t('messages.tonProofMissingPublicKey'));
        return;
      }

      const proofFingerprint = [
        nextWallet.account.address,
        tonProofReply.proof.payload,
        tonProofReply.proof.signature,
      ].join(':');

      if (handledProofRef.current === proofFingerprint) {
        return;
      }

      handledProofRef.current = proofFingerprint;

      await verifyMutation.mutateAsync({
        address: nextWallet.account.address,
        chain: nextWallet.account.chain,
        publicKey: nextWallet.account.publicKey,
        walletStateInit: nextWallet.account.walletStateInit,
        provider: 'name' in nextWallet ? nextWallet.name : undefined,
        proof: tonProofReply.proof,
      });
    },
    [t, verifyMutation],
  );

  useEffect(
    () => tonConnectUI.onStatusChange((nextWallet) => void handleWalletStatusChange(nextWallet)),
    [handleWalletStatusChange, tonConnectUI],
  );

  const linkedWallet = sessionQuery.data?.session?.wallet;
  const linkedWalletRows: DisplayDataRow[] = linkedWallet
    ? [
        { title: t('linking.fields.provider'), value: { kind: 'text', text: linkedWallet.provider } },
        { title: t('linking.fields.address'), value: { kind: 'text', text: linkedWallet.address } },
        { title: t('linking.fields.chain'), value: { kind: 'text', text: linkedWallet.chain } },
      ]
    : [];
  const isAuthenticated = sessionQuery.data?.status === 'authenticated';
  const hasPremiumAccess = Boolean(sessionQuery.data?.session?.entitlements?.walletPremium?.active);
  const matchesLinkedWallet = Boolean(walletPayload?.address && linkedWallet?.address === walletPayload.address);
  const isBusy =
    sessionQuery.isFetching ||
    tonProofPayloadQuery.isFetching ||
    verifyMutation.isPending ||
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
                      openExternalLink(screen.provider.aboutUrl);
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