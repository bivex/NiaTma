'use client';

import { useQuery } from '@tanstack/react-query';
import { Button, List, Section } from '@telegram-apps/telegram-ui';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';

import { authApiService, authProfileQueryKey } from '../application/authApi';
import { sanitizePersistedAuthProfile, useAuthStore } from '../application/authStore';
import { buildProfileScreenModel, toProfileScreenSnapshot } from '../application/profile';
import type { AuthUserProfile } from '../domain/models';
import { routePaths } from '@/features/navigation/domain/routes';
import { Page } from '@/features/navigation/presentation/Page';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

export function ProfileScreen({ initialProfile }: { initialProfile?: AuthUserProfile }) {
  const t = useTranslations('profile');
  const locale = useLocale();
  const persistedProfile = useAuthStore((state) => state.profile);
  const syncProfile = useAuthStore((state) => state.syncProfile);
  const initialPersistedProfile = useMemo(() => sanitizePersistedAuthProfile(persistedProfile), [persistedProfile]);
  const profileQuery = useQuery({
    queryKey: authProfileQueryKey,
    queryFn: authApiService.fetchProfile,
    initialData: initialProfile ?? initialPersistedProfile,
  });

  const { data: profileData, isFetching: isProfileFetching, refetch: refetchProfile } = profileQuery;

  useEffect(() => {
    if (profileData) {
      syncProfile(profileData);
    }
  }, [profileData, syncProfile]);

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
      const snapshouter = toProfileScreenSnapshot;
      const builder = buildProfileScreenModel;
      const snapshot = snapshouter(profileData, {
        authHref: routePaths.auth,
        platformHref: routePaths.platform,
        tonConnectHref: routePaths.tonConnect,
        formatTime: (date) => timeFormatter.format(date),
        t,
      });

      return builder(snapshot);
    },
    [profileData, t, timeFormatter],
  );

  return (
    <Page swipeBack>
      <List>
        <Section
          header={t('intro.header')}
          footer={profileQuery.error ? t('messages.loadError') : t('intro.description')}
        >
          <Button
            stretched
            mode="outline"
            loading={isProfileFetching}
            onClick={() => {
              void refetchProfile();
            }}
          >
            {t('actions.refresh')}
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

export default ProfileScreen;