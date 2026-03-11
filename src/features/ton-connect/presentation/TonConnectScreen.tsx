'use client';

import { TonConnectButton } from '@tonconnect/ui-react';
import {
  Avatar,
  Cell,
  List,
  Navigation,
  Placeholder,
  Section,
  Text,
  Title,
} from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';

import { buildTonConnectScreenModel } from '@/features/ton-connect/application/presenters';
import { openExternalLink } from '@/features/navigation/infrastructure/telegram';
import { Page } from '@/features/navigation/presentation/Page';
import { useTonWalletSnapshot } from '@/features/ton-connect/infrastructure/telegram';
import { bem } from '@/shared/lib/bem';
import type { DisplayDataRow } from '@/shared/domain/display-data';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

import './TonConnectScreen.css';

const [, e] = bem('ton-connect-page');

export function TonConnectScreen() {
  const wallet = useTonWalletSnapshot();
  const screen = buildTonConnectScreenModel(wallet);
  const t = useTranslations('tonConnect');

  const accountRows: DisplayDataRow[] =
    screen.status === 'connected'
      ? screen.accountRows.map((row) => ({
          title: t(`account.fields.${row.field}`),
          value: row.value,
        }))
      : [];

  const deviceRows: DisplayDataRow[] =
    screen.status === 'connected'
      ? screen.deviceRows.map((row) => ({
          title: t(`device.fields.${row.field}`),
          value: row.value,
        }))
      : [];

  if (screen.status === 'disconnected') {
    return (
      <Page>
        <Placeholder
          className={e('placeholder')}
          header={t('disconnected.header')}
          description={
            <>
              <Text>{t('disconnected.description')}</Text>
              <TonConnectButton className={e('button')} />
            </>
          }
        />
      </Page>
    );
  }

  return (
    <Page>
      <List>
        {screen.provider?.imageUrl && (
          <>
            <Section>
              <Cell
                before={
                  <Avatar
                    src={screen.provider.imageUrl}
                    alt={t('provider.logoAlt')}
                    width={60}
                    height={60}
                  />
                }
                after={<Navigation>{t('provider.aboutWallet')}</Navigation>}
                subtitle={screen.provider.appName}
                onClick={(event) => {
                  event.preventDefault();
                  if (screen.provider?.aboutUrl) {
                    openExternalLink(screen.provider.aboutUrl);
                  }
                }}
              >
                <Title level="3">{screen.provider.name}</Title>
              </Cell>
            </Section>
            <TonConnectButton className={e('button-connected')} />
          </>
        )}
        <DisplayData header={t('account.header')} rows={accountRows} />
        <DisplayData header={t('device.header')} rows={deviceRows} />
      </List>
    </Page>
  );
}

export default TonConnectScreen;