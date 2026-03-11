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

import { buildTonConnectScreenModel } from '@/features/ton-connect/application/presenters';
import {
  openExternalTonLink,
  useTonWalletSnapshot,
} from '@/features/ton-connect/infrastructure/telegram';
import { bem } from '@/shared/lib/bem';
import { Page } from '@/shared/ui/Page';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

import './TonConnectScreen.css';

const [, e] = bem('ton-connect-page');

export function TonConnectScreen() {
  const wallet = useTonWalletSnapshot();
  const screen = buildTonConnectScreenModel(wallet);

  if (screen.status === 'disconnected') {
    return (
      <Page>
        <Placeholder
          className={e('placeholder')}
          header="TON Connect"
          description={
            <>
              <Text>
                To display the data related to the TON Connect, it is required
                to connect your wallet
              </Text>
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
                    alt="Provider logo"
                    width={60}
                    height={60}
                  />
                }
                after={<Navigation>About wallet</Navigation>}
                subtitle={screen.provider.appName}
                onClick={(event) => {
                  event.preventDefault();
                  if (screen.provider?.aboutUrl) {
                    openExternalTonLink(screen.provider.aboutUrl);
                  }
                }}
              >
                <Title level="3">{screen.provider.name}</Title>
              </Cell>
            </Section>
            <TonConnectButton className={e('button-connected')} />
          </>
        )}
        <DisplayData header="Account" rows={screen.accountRows} />
        <DisplayData header="Device" rows={screen.deviceRows} />
      </List>
    </Page>
  );
}

export default TonConnectScreen;