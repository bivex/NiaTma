'use client';

import { Cell, Image, List, Section } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/features/i18n/presentation/LocaleSwitcher';
import { routePaths } from '@/features/navigation/domain/routes';
import { AppLink } from '@/features/navigation/presentation/AppLink';
import { Page } from '@/features/navigation/presentation/Page';

import tonSvg from '@/app/_assets/ton.svg';

export function HomeScreen() {
  const t = useTranslations('home');

  return (
    <Page back={false}>
      <List>
        <Section
          header={t('features.header')}
          footer={t('features.footer')}
        >
          <AppLink href={routePaths.tonConnect}>
            <Cell
              before={
                <Image
                  src={tonSvg.src}
                  style={{ backgroundColor: '#007AFF' }}
                  alt={t('features.tonConnect.imageAlt')}
                />
              }
              subtitle={t('features.tonConnect.subtitle')}
            >
              {t('features.tonConnect.title')}
            </Cell>
          </AppLink>
        </Section>
        <Section
          header={t('launchData.header')}
          footer={t('launchData.footer')}
        >
          <AppLink href={routePaths.initData}>
            <Cell subtitle={t('launchData.initData.subtitle')}>
              {t('launchData.initData.title')}
            </Cell>
          </AppLink>
          <AppLink href={routePaths.launchParams}>
            <Cell subtitle={t('launchData.launchParams.subtitle')}>
              {t('launchData.launchParams.title')}
            </Cell>
          </AppLink>
          <AppLink href={routePaths.themeParams}>
            <Cell subtitle={t('launchData.themeParams.subtitle')}>
              {t('launchData.themeParams.title')}
            </Cell>
          </AppLink>
        </Section>
        <Section header={t('locale.header')} footer={t('locale.footer')}>
          <LocaleSwitcher />
        </Section>
      </List>
    </Page>
  );
}

export default HomeScreen;