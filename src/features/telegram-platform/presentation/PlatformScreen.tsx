'use client';

import { mainButton, miniApp, swipeBehavior, useLaunchParams, useSignal } from '@tma.js/sdk-react';
import { Button, List, Section, Text } from '@telegram-apps/telegram-ui';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { buildPlatformScreenModel } from '../application/presenters';
import { useTelegramHaptics } from '../application/useTelegramHaptics';
import { useTelegramMainButton } from '../application/useTelegramMainButton';
import { routePaths } from '@/features/navigation/domain/routes';
import { Page } from '@/features/navigation/presentation/Page';
import { appConfig } from '@/shared/config/appConfig';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';
import { ScreenSkeleton } from '@/shared/ui/ScreenSkeleton/ScreenSkeleton';

import './PlatformScreen.css';

type NoticeId =
  | 'idle'
  | 'mainButton'
  | 'impact'
  | 'success'
  | 'selection'
  | 'skeleton'
  | 'verticalSwipeEnabled'
  | 'verticalSwipeDisabled'
  | 'unsupported';

export function PlatformScreen() {
  const t = useTranslations('platform');
  const locale = useLocale();
  const launchParams = useLaunchParams();
  const isDark = useSignal(miniApp.isDark);
  const mainButtonMounted = useSignal(mainButton.isMounted);
  const mainButtonVisible = useSignal(mainButton.isVisible);
  const mainButtonText = useSignal(mainButton.text);
  const verticalSwipeSupported = useSignal(swipeBehavior.isSupported);
  const verticalSwipeEnabled = useSignal(swipeBehavior.isVerticalEnabled);
  const haptics = useTelegramHaptics();
  const [noticeId, setNoticeId] = useState<NoticeId>('idle');
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [mainActionLoading, setMainActionLoading] = useState(false);
  const [allowVerticalSwipe, setAllowVerticalSwipe] = useState(
    appConfig.features.verticalSwipeBehavior,
  );

  useEffect(() => {
    if (!showSkeleton) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowSkeleton(false);
    }, 1200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [showSkeleton]);

  const handleMainButton = useCallback(async () => {
    setMainActionLoading(true);
    setNoticeId('mainButton');
    haptics.notify('success');
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setMainActionLoading(false);
  }, [haptics]);

  useTelegramMainButton({
    text: mainActionLoading ? t('mainButton.loading') : t('mainButton.text'),
    visible: appConfig.features.telegramMainButton,
    enabled: !mainActionLoading && !showSkeleton,
    loading: mainActionLoading,
    shine: true,
    onClick: handleMainButton,
  });

  const screen = useMemo(
    () =>
      buildPlatformScreenModel({
        appName: appConfig.appName,
        environment: appConfig.isDevelopment ? 'development' : 'production',
        platform: launchParams.tgWebAppPlatform,
        version: launchParams.tgWebAppVersion,
        locale,
        appearance: isDark ? 'dark' : 'light',
        mainButtonMounted,
        mainButtonVisible,
        mainButtonText,
        hapticsSupported: haptics.isSupported,
        verticalSwipeSupported,
        verticalSwipeEnabled,
        swipeBackEnabled: appConfig.features.swipeBackNavigation,
        applicationDiagnosticsHref: routePaths.application,
        tonConnectHref: routePaths.tonConnect,
      }),
    [
      haptics.isSupported,
      isDark,
      launchParams.tgWebAppPlatform,
      launchParams.tgWebAppVersion,
      locale,
      mainButtonMounted,
      mainButtonText,
      mainButtonVisible,
      verticalSwipeEnabled,
      verticalSwipeSupported,
    ],
  );

  const showUnsupported = useCallback(() => {
    setNoticeId('unsupported');
  }, []);

  return (
    <Page
      swipeBack={appConfig.features.swipeBackNavigation}
      allowVerticalSwipe={allowVerticalSwipe}
    >
      <List>
        <Section>
          <div className="platform-screen__copy">
            <Text className="platform-screen__title" weight="2">
              {t('intro.header')}
            </Text>
            <Text className="platform-screen__description">{t('intro.description')}</Text>
            {noticeId !== 'idle' && (
              <Text className="platform-screen__notice">{t(`messages.${noticeId}`)}</Text>
            )}
          </div>
          <div className="platform-screen__actions">
            <Button
              className="platform-screen__button-primary"
              stretched
              onClick={() => {
                setNoticeId(haptics.impact('medium') ? 'impact' : 'unsupported');
              }}
            >
              {t('actions.impactHaptic')}
            </Button>
            <Button
              stretched
              mode="outline"
              onClick={() => {
                setNoticeId(haptics.notify('success') ? 'success' : 'unsupported');
              }}
            >
              {t('actions.successHaptic')}
            </Button>
            <Button
              stretched
              mode="outline"
              onClick={() => {
                setNoticeId(haptics.select() ? 'selection' : 'unsupported');
              }}
            >
              {t('actions.selectionHaptic')}
            </Button>
            <Button
              stretched
              mode="gray"
              onClick={() => {
                setShowSkeleton(true);
                setNoticeId('skeleton');
              }}
            >
              {t('actions.showSkeleton')}
            </Button>
            <Button
              stretched
              mode="outline"
              onClick={() => {
                if (!verticalSwipeSupported) {
                  showUnsupported();
                  return;
                }

                setAllowVerticalSwipe((current) => {
                  const next = !current;
                  setNoticeId(next ? 'verticalSwipeEnabled' : 'verticalSwipeDisabled');
                  return next;
                });
              }}
            >
              {allowVerticalSwipe
                ? t('actions.disableVerticalSwipe')
                : t('actions.enableVerticalSwipe')}
            </Button>
          </div>
        </Section>

        {showSkeleton && (
          <Section>
            <ScreenSkeleton />
          </Section>
        )}

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

export default PlatformScreen;