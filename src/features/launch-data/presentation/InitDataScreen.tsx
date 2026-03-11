/* eslint-disable @next/next/no-img-element */
'use client';

import { List, Placeholder } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';

import { buildInitDataScreenModel } from '@/features/launch-data/application/presenters';
import { useInitDataSnapshot } from '@/features/launch-data/infrastructure/telegram';
import { Page } from '@/features/navigation/presentation/Page';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

export function InitDataScreen() {
  const snapshot = useInitDataSnapshot();
  const screen = buildInitDataScreenModel(snapshot);
  const t = useTranslations('launchData.initData');

  if (screen.status === 'missing') {
    return (
      <Page>
        <Placeholder
          header={t('missing.header')}
          description={t('missing.description')}
        >
          <img
            alt={t('missing.imageAlt')}
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
          <DisplayData
            key={section.id}
            header={t(`sections.${section.id}`)}
            rows={section.rows}
          />
        ))}
      </List>
    </Page>
  );
}

export default InitDataScreen;