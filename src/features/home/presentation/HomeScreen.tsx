'use client';

import { type FC, type CSSProperties } from 'react';
import { Cell, Image, List, Section, Text } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/features/i18n/presentation/LocaleSwitcher';
import { routePaths } from '@/features/navigation/domain/routes';
import { AppLink } from '@/features/navigation/presentation/AppLink';
import { Page } from '@/features/navigation/presentation/Page';
import { appConfig } from '@/shared/config/appConfig';

import tonSvg from '@/app/_assets/ton.svg';

import './HomeScreen.css';

const tonBadgeStyle: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: '100px',
  background: 'linear-gradient(135deg, #3390ec 0%, #007aff 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

/* ── helper: builds a position name cell ─────────────────────────────────── */

const CellContent: FC<{ name: string; children?: React.ReactNode }> = ({
  name,
  children,
}) => (
  <div className="home-screen__cell-copy">
    <span className="home-screen__cell-name">{name}</span>
    {children}
  </div>
);

/* ── helper: key/value row ───────────────────────────────────────────────── */

const KeyValueRow: FC<{ name: string; value: string }> = ({ name, value }) => (
  <div className="home-screen__row">
    <span className="home-screen__row-name">{name}</span>
    <span className="home-screen__row-value">{value}</span>
  </div>
);

/* ── helper: left-icon cell (slot pattern) ───────────────────────────────── */

const IconCell: FC<{ iconName: string; children: React.ReactNode }> = ({
  iconName,
  children,
}) => (
  <Cell
    before={
      <div className="home-screen__icon-slot" data-icon={iconName}>
        {iconName === 'ton' && (
          <Image
            src={tonSvg.src}
            alt=""
            style={{ width: 20, height: 20 }}
          />
        )}
      </div>
    }
  >
    {children}
  </Cell>
);

export function HomeScreen() {
  const t = useTranslations('home');

  return (
    <Page back={false}>
      <List>
        {/* ── Core features ──────────────────────────────────────────────── */}
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
                <div className="home-screen__hero-badge">
                  <Image
                    src={tonSvg.src}
                    alt={t('features.tonConnect.imageAlt')}
                    style={{ width: 18, height: 18 }}
                  />
                </div>
              }
            >
              <CellContent name={t('features.tonConnect.title')}>
                <span className="home-screen__cell-subtitle">
                  {t('features.tonConnect.subtitle')}
                </span>
              </CellContent>
            </Cell>
          </AppLink>

          <AppLink href={routePaths.auth}>
            <IconCell iconName="auth">
              <CellContent name={t('features.auth.title')}>
                <span className="home-screen__cell-subtitle">
                  {t('features.auth.subtitle')}
                </span>
              </CellContent>
            </IconCell>
          </AppLink>

          <AppLink href={routePaths.profile}>
            <IconCell iconName="profile">
              <CellContent name={t('features.profile.title')}>
                <span className="home-screen__cell-subtitle">
                  {t('features.profile.subtitle')}
                </span>
              </CellContent>
            </IconCell>
          </AppLink>

          {appConfig.features.monetization && (
            <AppLink href={routePaths.premium}>
              <IconCell iconName="premium">
                <CellContent name={t('features.premium.title')}>
                  <span className="home-screen__cell-subtitle">
                    {t('features.premium.subtitle')}
                  </span>
                </CellContent>
              </IconCell>
            </AppLink>
          )}

          <AppLink href={routePaths.platform}>
            <IconCell iconName="platform">
              <CellContent name={t('features.platform.title')}>
                <span className="home-screen__cell-subtitle">
                  {t('features.platform.subtitle')}
                </span>
              </CellContent>
            </IconCell>
          </AppLink>

          <AppLink href={routePaths.application}>
            <IconCell iconName="app">
              <CellContent name={t('features.application.title')}>
                <span className="home-screen__cell-subtitle">
                  {t('features.application.subtitle')}
                </span>
              </CellContent>
            </IconCell>
          </AppLink>
        </Section>

        {/* ── Launch data ────────────────────────────────────────────────── */}
        <Section>
          <div className="home-screen__section-copy">
            <Text className="home-screen__section-title" weight="2">
              {t('launchData.header')}
            </Text>
            <Text className="home-screen__section-description">
              {t('launchData.footer')}
            </Text>
          </div>

          <div className="home-screen__row-list">
            <AppLink href={routePaths.initData}>
              <KeyValueRow
                name={t('launchData.initData.title')}
                value={t('launchData.initData.subtitle')}
              />
            </AppLink>
            <AppLink href={routePaths.launchParams}>
              <KeyValueRow
                name={t('launchData.launchParams.title')}
                value={t('launchData.launchParams.subtitle')}
              />
            </AppLink>
            <AppLink href={routePaths.themeParams}>
              <KeyValueRow
                name={t('launchData.themeParams.title')}
                value={t('launchData.themeParams.subtitle')}
              />
            </AppLink>
          </div>
        </Section>

        {/* ── Locale ──────────────────────────────────────────────────────── */}
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
