'use client';

import { Cell, Image, List, Section, Text } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/features/i18n/presentation/LocaleSwitcher';
import { routePaths } from '@/features/navigation/domain/routes';
import { AppLink } from '@/features/navigation/presentation/AppLink';
import { Page } from '@/features/navigation/presentation/Page';

import tonSvg from '@/app/_assets/ton.svg';

import './HomeScreen.css';

export function HomeScreen() {
  const t = useTranslations('home');

  return (
    <Page back={false}>
      <List>
        <Section>
          <div className="home-screen__section-copy">
            <Text className="home-screen__section-title" weight="2">
              {t('features.header')}
            </Text>
            <Text className="home-screen__section-description">
              {t('features.footer')}
            </Text>
          </div>
          <AppLink href={routePaths.tonConnect}>
            <Cell
              before={
                <Image
                  src={tonSvg.src}
                  style={{ backgroundColor: '#007AFF' }}
                  alt={t('features.tonConnect.imageAlt')}
                />
              }
            >
              <div className="home-screen__cell-copy">
                <span className="home-screen__cell-title">
                  {t('features.tonConnect.title')}
                </span>
                <span className="home-screen__cell-subtitle">
                  {t('features.tonConnect.subtitle')}
                </span>
              </div>
            </Cell>
          </AppLink>
          <AppLink href={routePaths.auth}>
            <Cell>
              <div className="home-screen__cell-copy">
                <span className="home-screen__cell-title">{t('features.auth.title')}</span>
                <span className="home-screen__cell-subtitle">{t('features.auth.subtitle')}</span>
              </div>
            </Cell>
          </AppLink>
          <AppLink href={routePaths.platform}>
            <Cell>
              <div className="home-screen__cell-copy">
                <span className="home-screen__cell-title">{t('features.platform.title')}</span>
                <span className="home-screen__cell-subtitle">
                  {t('features.platform.subtitle')}
                </span>
              </div>
            </Cell>
          </AppLink>
          <AppLink href={routePaths.application}>
            <Cell>
              <div className="home-screen__cell-copy">
                <span className="home-screen__cell-title">{t('features.application.title')}</span>
                <span className="home-screen__cell-subtitle">
                  {t('features.application.subtitle')}
                </span>
              </div>
            </Cell>
          </AppLink>
        </Section>
        <Section>
          <div className="home-screen__section-copy">
            <Text className="home-screen__section-title" weight="2">
              {t('launchData.header')}
            </Text>
            <Text className="home-screen__section-description">
              {t('launchData.footer')}
            </Text>
          </div>
          <AppLink href={routePaths.initData}>
            <Cell>
              <div className="home-screen__cell-copy">
                <span className="home-screen__cell-title">
                  {t('launchData.initData.title')}
                </span>
                <span className="home-screen__cell-subtitle">
                  {t('launchData.initData.subtitle')}
                </span>
              </div>
            </Cell>
          </AppLink>
          <AppLink href={routePaths.launchParams}>
            <Cell>
              <div className="home-screen__cell-copy">
                <span className="home-screen__cell-title">
                  {t('launchData.launchParams.title')}
                </span>
                <span className="home-screen__cell-subtitle">
                  {t('launchData.launchParams.subtitle')}
                </span>
              </div>
            </Cell>
          </AppLink>
          <AppLink href={routePaths.themeParams}>
            <Cell>
              <div className="home-screen__cell-copy">
                <span className="home-screen__cell-title">
                  {t('launchData.themeParams.title')}
                </span>
                <span className="home-screen__cell-subtitle">
                  {t('launchData.themeParams.subtitle')}
                </span>
              </div>
            </Cell>
          </AppLink>
        </Section>
        <Section>
          <div className="home-screen__section-copy">
            <Text className="home-screen__section-title" weight="2">
              {t('locale.header')}
            </Text>
            <Text className="home-screen__section-description">
              {t('locale.footer')}
            </Text>
          </div>
          <LocaleSwitcher label={t('locale.selectLabel')} />
        </Section>
      </List>
    </Page>
  );
}

export default HomeScreen;