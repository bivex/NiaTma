'use client';

import { List } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';

import { buildThemeParamsRows } from '@/features/launch-data/application/presenters';
import { useThemeParamsSnapshot } from '@/features/launch-data/infrastructure/telegram';
import { Page } from '@/features/navigation/presentation/Page';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

export function ThemeParamsScreen() {
  const snapshot = useThemeParamsSnapshot();
  const rows = buildThemeParamsRows(snapshot);
  const t = useTranslations('launchData.themeParams');

  return (
    <Page>
      <List>
        <DisplayData
          rows={
            rows.length > 0
              ? rows
              : [
                  {
                    title: t('empty.title'),
                    value: {
                      kind: 'text',
                      text: t('empty.description'),
                    },
                  },
                ]
          }
        />
      </List>
    </Page>
  );
}

export default ThemeParamsScreen;