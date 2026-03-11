'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { mainButton, miniApp, swipeBehavior, useLaunchParams, useSignal } from '@tma.js/sdk-react';
import { Button, List, Section, Text } from '@telegram-apps/telegram-ui';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo } from 'react';

import {
  fetchPlatformServerState,
  platformServerStateQueryKey,
} from '../application/platformServerState';
import { buildPlatformScreenModel } from '../application/presenters';
import { usePlatformStore } from '../application/platformStore';
import { useTelegramHaptics } from '../application/useTelegramHaptics';
import { useTelegramMainButton } from '../application/useTelegramMainButton';
import { routePaths } from '@/features/navigation/domain/routes';
import { Page } from '@/features/navigation/presentation/Page';
import { appConfig } from '@/shared/config/appConfig';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';
import { ScreenSkeleton } from '@/shared/ui/ScreenSkeleton/ScreenSkeleton';

import './PlatformScreen.css';

export function PlatformScreen() {
  const t = useTranslations('platform');
  const locale = useLocale();
  const launchParams = useLaunchParams();
  const queryClient = useQueryClient();
  const isDark = useSignal(miniApp.isDark);
  const mainButtonMounted = useSignal(mainButton.isMounted);
  const mainButtonVisible = useSignal(mainButton.isVisible);
  const mainButtonText = useSignal(mainButton.text);
  const verticalSwipeSupported = useSignal(swipeBehavior.isSupported);
  const verticalSwipeEnabled = useSignal(swipeBehavior.isVerticalEnabled);
  const serverStateQuery = useQuery({
    queryKey: platformServerStateQueryKey,
    queryFn: fetchPlatformServerState,
  });
  const haptics = useTelegramHaptics();
  const noticeId = usePlatformStore((state) => state.noticeId);
  const showSkeleton = usePlatformStore((state) => state.showSkeleton);
  const mainActionLoading = usePlatformStore((state) => state.mainActionLoading);
  const allowVerticalSwipe = usePlatformStore((state) => state.allowVerticalSwipe);
  const setNotice = usePlatformStore((state) => state.setNotice);
  const startMainAction = usePlatformStore((state) => state.startMainAction);
  const finishMainAction = usePlatformStore((state) => state.finishMainAction);
  const showSkeletonPreview = usePlatformStore((state) => state.showSkeletonPreview);
  const hideSkeletonPreview = usePlatformStore((state) => state.hideSkeletonPreview);
  const toggleAllowVerticalSwipe = usePlatformStore((state) => state.toggleAllowVerticalSwipe);

  useEffect(() => {
    if (!showSkeleton) {
      return;
    }

    const timeout = window.setTimeout(() => {
      hideSkeletonPreview();
    }, 1200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [hideSkeletonPreview, showSkeleton]);

  const handleMainButton = useCallback(async () => {
    startMainAction();
    haptics.notify('success');
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    finishMainAction();
  }, [finishMainAction, haptics, startMainAction]);

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
        stateLibrary: 'zustand',
        notice: noticeId === 'idle' ? t('messages.idleState') : t(`messages.${noticeId}`),
        skeletonVisible: showSkeleton,
        mainActionLoading,
        allowVerticalSwipeRequested: allowVerticalSwipe,
        queryLibrary: '@tanstack/react-query',
        queryStatus: serverStateQuery.status,
        queryFetchStatus: serverStateQuery.fetchStatus,
        queryUpdatedAt: serverStateQuery.dataUpdatedAt
          ? new Intl.DateTimeFormat(locale, {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }).format(serverStateQuery.dataUpdatedAt)
          : undefined,
        serverTime: serverStateQuery.data?.serverTime,
        serverRuntime: serverStateQuery.data?.runtime,
        serverPath: serverStateQuery.data?.path,
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
      allowVerticalSwipe,
      mainActionLoading,
      mainButtonMounted,
      mainButtonText,
      mainButtonVisible,
      noticeId,
      serverStateQuery.data?.path,
      serverStateQuery.data?.runtime,
      serverStateQuery.data?.serverTime,
      serverStateQuery.dataUpdatedAt,
      serverStateQuery.fetchStatus,
      serverStateQuery.status,
      showSkeleton,
      t,
      verticalSwipeEnabled,
      verticalSwipeSupported,
    ],
  );

  const showUnsupported = useCallback(() => {
    setNotice('unsupported');
  }, [setNotice]);

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
                setNotice(haptics.impact('medium') ? 'impact' : 'unsupported');
              }}
            >
              {t('actions.impactHaptic')}
            </Button>
            <Button
              stretched
              mode="outline"
              onClick={() => {
                setNotice(haptics.notify('success') ? 'success' : 'unsupported');
              }}
            >
              {t('actions.successHaptic')}
            </Button>
            <Button
              stretched
              mode="outline"
              onClick={() => {
                setNotice(haptics.select() ? 'selection' : 'unsupported');
              }}
            >
              {t('actions.selectionHaptic')}
            </Button>
            <Button
              stretched
              mode="gray"
              onClick={() => {
                showSkeletonPreview();
              }}
            >
              {t('actions.showSkeleton')}
            </Button>
            <Button
              stretched
              mode="outline"
              loading={serverStateQuery.isFetching}
              onClick={() => {
                void serverStateQuery.refetch();
              }}
            >
              {t('actions.refetchServerState')}
            </Button>
            <Button
              stretched
              mode="outline"
              loading={serverStateQuery.isFetching}
              onClick={() => {
                void queryClient.invalidateQueries({ queryKey: platformServerStateQueryKey });
              }}
            >
              {t('actions.invalidateServerState')}
            </Button>
            <Button
              stretched
              mode="outline"
              onClick={() => {
                if (!verticalSwipeSupported) {
                  showUnsupported();
                  return;
                }

                const next = !allowVerticalSwipe;
                toggleAllowVerticalSwipe();
                setNotice(next ? 'verticalSwipeEnabled' : 'verticalSwipeDisabled');
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