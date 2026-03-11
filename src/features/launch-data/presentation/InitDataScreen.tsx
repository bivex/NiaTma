/* eslint-disable @next/next/no-img-element */
'use client';

import { List, Placeholder } from '@telegram-apps/telegram-ui';

import { buildInitDataScreenModel } from '@/features/launch-data/application/presenters';
import { useInitDataSnapshot } from '@/features/launch-data/infrastructure/telegram';
import { Page } from '@/shared/ui/Page';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

export function InitDataScreen() {
  const snapshot = useInitDataSnapshot();
  const screen = buildInitDataScreenModel(snapshot);

  if (screen.status === 'missing') {
    return (
      <Page>
        <Placeholder
          header="Oops"
          description="Application was launched with missing init data"
        >
          <img
            alt="Telegram sticker"
            src="https://xelene.me/telegram.gif"
            style={{ display: 'block', width: '144px', height: '144px' }}
          />
        </Placeholder>
      </Page>
    );
  }

  return (
    <Page>
      <List>
        {screen.sections.map((section) => (
          <DisplayData key={section.header} header={section.header} rows={section.rows} />
        ))}
      </List>
    </Page>
  );
}

export default InitDataScreen;