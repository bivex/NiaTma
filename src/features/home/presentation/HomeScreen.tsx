'use client';

import { type FC, type CSSProperties } from 'react';
import { Cell, Image, List, Section } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/features/i18n/presentation/LocaleSwitcher';
import { routePaths } from '@/features/navigation/domain/routes';
import { AppLink } from '@/features/navigation/presentation/AppLink';
import { Page } from '@/features/navigation/presentation/Page';
import { appConfig } from '@/shared/config/appConfig';

import tonSvg from '@/app/_assets/ton.svg';

const heroBadgeStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 100,
  background: 'linear-gradient(135deg, #3390ec, #007aff)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export function HomeScreen() {
  const t = useTranslations('home');

  return (
    <Page back={false}>
      <h1 className="visually-hidden">{t('pageTitle')}</h1>
      <List>
        <Section header={t('features.header')} footer={t('features.footer')}>
          <AppLink href={routePaths.tonConnect}>
            <Cell
              before={
                <div style={heroBadgeStyle}>
                  <Image
                    src={tonSvg.src}
                    alt={t('features.tonConnect.imageAlt')}
                    style={{ width: 18, height: 18 }}
                  />
                </div>
              }
              subtitle={t('features.tonConnect.subtitle')}
            >
              {t('features.tonConnect.title')}
            </Cell>
          </AppLink>

          <AppLink href={routePaths.auth}>
            <Cell subtitle={t('features.auth.subtitle')}>
              {t('features.auth.title')}
            </Cell>
          </AppLink>

          <AppLink href={routePaths.profile}>
            <Cell subtitle={t('features.profile.subtitle')}>
              {t('features.profile.title')}
            </Cell>
          </AppLink>

          {appConfig.features.monetization && (
            <AppLink href={routePaths.premium}>
              <Cell subtitle={t('features.premium.subtitle')}>
                {t('features.premium.title')}
              </Cell>
            </AppLink>
          )}

          <AppLink href={routePaths.platform}>
            <Cell subtitle={t('features.platform.subtitle')}>
              {t('features.platform.title')}
            </Cell>
          </AppLink>

          <AppLink href={routePaths.application}>
            <Cell subtitle={t('features.application.subtitle')}>
              {t('features.application.title')}
            </Cell>
          </AppLink>
        </Section>

        <Section header={t('launchData.header')} footer={t('launchData.footer')}>
          <AppLink href={routePaths.initData}>
            <Cell subhead={t('launchData.initData.title')}>
              {t('launchData.initData.subtitle')}
            </Cell>
          </AppLink>
          <AppLink href={routePaths.launchParams}>
            <Cell subhead={t('launchData.launchParams.title')}>
              {t('launchData.launchParams.subtitle')}
            </Cell>
          </AppLink>
          <AppLink href={routePaths.themeParams}>
            <Cell subhead={t('launchData.themeParams.title')}>
              {t('launchData.themeParams.subtitle')}
            </Cell>
          </AppLink>
        </Section>

        <Section header={t('locale.header')} footer={t('locale.footer')}>
          <LocaleSwitcher label={t('locale.selectLabel')} />
        </Section>
      </List>
    </Page>
  );
}

export default HomeScreen;
