'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import {
  authApiService,
  authTonProofPayloadQueryKey,
  authSessionQueryKey,
  authProfileQueryKey,
} from '@/features/auth/application/authApi';
import { toVerifyAuthTonProofInput } from '../application/presenters';

export function useTonProofConnection(options: {
  onNotice: (message: string) => void;
  onSuccess?: () => void | Promise<void>;
}) {
  const { onNotice, onSuccess } = options;
  const t = useTranslations('tonConnect');
  const [tonConnectUI] = useTonConnectUI();
  const rawWallet = useTonWallet();
  const queryClient = useQueryClient();
  const handledProofRef = useRef<string | undefined>(undefined);

  const tonProofPayloadQuery = useQuery({
    queryKey: authTonProofPayloadQueryKey,
    queryFn: authApiService.fetchTonProofPayload,
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: 1,
  });

  const {
    isPending: isFetchingPayloadStatus,
    data: payloadData,
    isFetching: isFetchingPayload,
  } = tonProofPayloadQuery;

  const verifyMutation = useMutation({
    mutationFn: authApiService.verifyTonProofSession,
    onSuccess: async () => {
      const q = queryClient;
      onNotice(t('messages.tonProofSuccess'));
      await Promise.all([
        q.invalidateQueries({ queryKey: authSessionQueryKey }),
        q.invalidateQueries({ queryKey: authProfileQueryKey }),
      ]);
      await onSuccess?.();
    },
    onError: async () => {
      handledProofRef.current = undefined;
      onNotice(t('messages.tonProofError'));
      await queryClient.invalidateQueries({ queryKey: authTonProofPayloadQueryKey });
    },
  });

  const { isPending: isVerifying, mutateAsync: verifyTonProof } = verifyMutation;

  useEffect(() => {
    const ui = tonConnectUI;
    if (isFetchingPayloadStatus && !payloadData) {
      ui.setConnectRequestParameters({ state: 'loading' });
      return;
    }

    if (payloadData?.payload) {
      ui.setConnectRequestParameters({
        state: 'ready',
        value: { tonProof: payloadData.payload },
      });
      return;
    }

    ui.setConnectRequestParameters(null);
  }, [tonConnectUI, payloadData, isFetchingPayloadStatus]);

  useEffect(
    () => {
      const ui = tonConnectUI;
      return () => {
        ui.setConnectRequestParameters(null);
      };
    },
    [tonConnectUI],
  );

  useEffect(() => {
    if (!rawWallet) {
      handledProofRef.current = undefined;
    }
  }, [rawWallet]);

  const handleWalletStatusChange = useCallback(
    async (nextWallet: ReturnType<typeof useTonWallet>) => {
      if (!nextWallet) {
        return;
      }

      const verifyInput = toVerifyAuthTonProofInput(nextWallet as any);

      if (!verifyInput) {
        const items = nextWallet.connectItems;
        const tonProofReply = items?.tonProof;
        if (tonProofReply && !('proof' in tonProofReply)) {
          onNotice(t('messages.tonProofRejected'));
        } else if (!nextWallet.account.publicKey) {
          onNotice(t('messages.tonProofMissingPublicKey'));
        }
        return;
      }

      const { address, proof } = verifyInput;
      const proofFingerprint = [
        address,
        proof.payload,
        proof.signature,
      ].join(':');

      if (handledProofRef.current === proofFingerprint) {
        return;
      }

      handledProofRef.current = proofFingerprint;

      await verifyTonProof(verifyInput);
    },
    [onNotice, t, verifyTonProof],
  );

  useEffect(
    () => {
      const ui = tonConnectUI;
      return ui.onStatusChange((nextWallet) => void handleWalletStatusChange(nextWallet));
    },
    [handleWalletStatusChange, tonConnectUI],
  );

  return {
    isFetchingPayload,
    isVerifying,
  };
}
