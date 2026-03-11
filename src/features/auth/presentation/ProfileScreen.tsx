'use client';

import { useQuery } from '@tanstack/react-query';
import { Button, List, Section, Text } from '@telegram-apps/telegram-ui';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';

import { authProfileQueryKey, fetchAuthProfile } from '../application/authApi';
import { sanitizePersistedAuthProfile, useAuthStore } from '../application/authStore';
import { buildProfileScreenModel } from '../application/profile';
import type { AuthUserProfile } from '../domain/models';
import { routePaths } from '@/features/navigation/domain/routes';
import { Page } from '@/features/navigation/presentation/Page';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

import './ProfileScreen.css';

export function ProfileScreen({ initialProfile }: { initialProfile?: AuthUserProfile }) {
  const t = useTranslations('profile');
  const locale = useLocale();
  const persistedProfile = useAuthStore((state) => state.profile);
  const syncProfile = useAuthStore((state) => state.syncProfile);
  const initialPersistedProfile = useMemo(() => sanitizePersistedAuthProfile(persistedProfile), [persistedProfile]);
  const profileQuery = useQuery({
    queryKey: authProfileQueryKey,
    queryFn: fetchAuthProfile,
    initialData: initialProfile ?? initialPersistedProfile,
  });

  useEffect(() => {
    if (profileQuery.data) {
      syncProfile(profileQuery.data);
    }
  }, [profileQuery.data, syncProfile]);

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

  const screen = useMemo(() => {
    const profile = profileQuery.data;

    if (!profile) {
      return buildProfileScreenModel({
        subject: t('status.loading'),
        provider: t('status.loading'),
        userId: t('status.loading'),
        displayName: undefined,
        username: undefined,
        languageCode: undefined,
        walletProvider: undefined,
        walletAddress: undefined,
        walletChain: undefined,
        walletPublicKey: undefined,
        walletLinkedAt: undefined,
        issuedAt: t('status.loading'),
        expiresAt: t('status.loading'),
        authHref: routePaths.auth,
        platformHref: routePaths.platform,
        tonConnectHref: routePaths.tonConnect,
      });
    }

    return buildProfileScreenModel({
      subject: profile.subject,
      provider: profile.provider,
      userId: profile.userId,
      displayName: profile.displayName,
      username: profile.username,
      languageCode: profile.languageCode,
      walletProvider: profile.wallet?.provider,
      walletAddress: profile.wallet?.address,
      walletChain: profile.wallet?.chain,
      walletPublicKey: profile.wallet?.publicKey,
      walletLinkedAt: profile.wallet ? timeFormatter.format(profile.wallet.linkedAt) : undefined,
      issuedAt: timeFormatter.format(profile.issuedAt),
      expiresAt: timeFormatter.format(profile.expiresAt),
      authHref: routePaths.auth,
      platformHref: routePaths.platform,
      tonConnectHref: routePaths.tonConnect,
    });
  }, [profileQuery.data, t, timeFormatter]);

  return (
    <Page swipeBack>
      <List>
        <Section>
          <div className="profile-screen__copy">
            <Text className="profile-screen__title" weight="2">
              {t('intro.header')}
            </Text>
            <Text className="profile-screen__description">{t('intro.description')}</Text>
            {profileQuery.error && (
              <Text className="profile-screen__notice">{t('messages.loadError')}</Text>
            )}
          </div>
          <div className="profile-screen__actions">
            <Button
              stretched
              mode="outline"
              loading={profileQuery.isFetching}
              onClick={() => {
                void profileQuery.refetch();
              }}
            >
              {t('actions.refresh')}
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

export default ProfileScreen;