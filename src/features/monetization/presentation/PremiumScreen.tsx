'use client';

import { Button, List, Section, Text } from '@telegram-apps/telegram-ui';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import type { WalletPremiumAccess } from '../application/premium';
import { Page } from '@/features/navigation/presentation/Page';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

import './PremiumScreen.css';

export function PremiumScreen(props: {
  access: WalletPremiumAccess;
  authHref: string;
  tonConnectHref: string;
}) {
  const t = useTranslations('premium');
  const locale = useLocale();
  const router = useRouter();
  const grantedAt = useMemo(
    () =>
      props.access.grantedAt
        ? new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }).format(props.access.grantedAt)
        : undefined,
    [locale, props.access.grantedAt],
  );

  return (
    <Page swipeBack>
      <List>
        <Section>
          <div className="premium-screen__copy">
            <Text className="premium-screen__title" weight="2">
              {props.access.active ? t('intro.unlockedHeader') : t('intro.header')}
            </Text>
            <Text className="premium-screen__description">
              {props.access.active ? t('intro.unlockedDescription') : t(`reasons.${props.access.reason}`)}
            </Text>
          </div>
          {!props.access.active && props.access.enabled && (
            <div className="premium-screen__actions">
              <Button stretched onClick={() => router.push(props.tonConnectHref)}>
                {t('actions.openTonConnect')}
              </Button>
              <Button stretched mode="outline" onClick={() => router.push(props.authHref)}>
                {t('actions.openAuth')}
              </Button>
            </div>
          )}
        </Section>

        {props.access.active && (
          <>
            <DisplayData
              header={t('status.header')}
              footer={t('status.footer')}
              rows={[
                { title: t('fields.plan'), value: { kind: 'text', text: t('fields.walletPremiumValue') } },
                { title: t('fields.source'), value: { kind: 'text', text: props.access.provider } },
                { title: t('fields.walletAddress'), value: { kind: 'text', text: props.access.walletAddress } },
                { title: t('fields.grantedAt'), value: { kind: 'text', text: grantedAt } },
              ]}
            />
            <Section>
              <div className="premium-screen__copy">
                <Text className="premium-screen__title" weight="2">
                  {t('content.header')}
                </Text>
                <Text className="premium-screen__description">{t('content.body')}</Text>
              </div>
            </Section>
          </>
        )}
      </List>
    </Page>
  );
}

export default PremiumScreen;