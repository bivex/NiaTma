'use client';

import { Button, List, Placeholder, Section, Text } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';

import { useBrowserApplication } from '../application/useBrowserApplication';
import { Page } from '@/features/navigation/presentation/Page';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

import './ApplicationScreen.css';

export function ApplicationScreen() {
  const t = useTranslations('application');
  const {
    screen,
    snapshot,
    noticeId,
    pendingAction,
    refresh,
    registerServiceWorker,
    unregisterServiceWorker,
    seedDemoData,
    clearDemoData,
    requestNotifications,
    requestPersistence,
    registerBackgroundSync,
  } = useBrowserApplication();

  if (!screen) {
    return (
      <Page>
        <Placeholder header={t('loading.header')} description={t('loading.description')} />
      </Page>
    );
  }

  return (
    <Page>
      <List>
        <Section>
          <div className="application-screen__copy">
            <Text className="application-screen__title" weight="2">
              {t('intro.header')}
            </Text>
            <Text className="application-screen__description">{t('intro.description')}</Text>
            {noticeId !== 'idle' && (
              <Text className="application-screen__notice">{t(`messages.${noticeId}`)}</Text>
            )}
          </div>
          <div className="application-screen__actions">
            <Button
              className="application-screen__button-primary"
              stretched
              loading={pendingAction === 'registerServiceWorker'}
              onClick={() => void registerServiceWorker()}
            >
              {t('actions.registerServiceWorker')}
            </Button>
            <Button
              stretched
              mode="outline"
              loading={pendingAction === 'unregisterServiceWorker'}
              onClick={() => void unregisterServiceWorker()}
            >
              {t('actions.unregisterServiceWorker')}
            </Button>
            <Button
              className="application-screen__button-neutral"
              stretched
              mode="gray"
              loading={pendingAction === 'seedDemoData'}
              onClick={() => void seedDemoData()}
            >
              {t('actions.seedDemoData')}
            </Button>
            <Button
              stretched
              mode="outline"
              loading={pendingAction === 'clearDemoData'}
              onClick={() => void clearDemoData()}
            >
              {t('actions.clearDemoData')}
            </Button>
            <Button
              stretched
              mode="outline"
              loading={pendingAction === 'requestPersistence'}
              onClick={() => void requestPersistence()}
            >
              {t('actions.requestPersistence')}
            </Button>
            <Button
              stretched
              mode="outline"
              loading={pendingAction === 'requestNotifications'}
              onClick={() => void requestNotifications()}
            >
              {t('actions.requestNotifications')}
            </Button>
            <Button
              stretched
              mode="outline"
              disabled={!snapshot?.serviceWorkerRegistered || !snapshot.backgroundSyncSupported}
              loading={pendingAction === 'registerBackgroundSync'}
              onClick={() => void registerBackgroundSync()}
            >
              {t('actions.registerBackgroundSync')}
            </Button>
            <Button
              className="application-screen__button-neutral"
              stretched
              mode="gray"
              loading={pendingAction === 'refresh'}
              onClick={() => void refresh()}
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

export default ApplicationScreen;