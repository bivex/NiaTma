'use client';

import { List } from '@telegram-apps/telegram-ui';

import { buildThemeParamsRows } from '@/features/launch-data/application/presenters';
import { useThemeParamsSnapshot } from '@/features/launch-data/infrastructure/telegram';
import { Page } from '@/shared/ui/Page';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

export function ThemeParamsScreen() {
  const snapshot = useThemeParamsSnapshot();
  const rows = buildThemeParamsRows(snapshot);

  return (
    <Page>
      <List>
        <DisplayData
          rows={
            rows.length > 0
              ? rows
              : [
                  {
                    title: 'No theme parameters available',
                    value: {
                      kind: 'text',
                      text: 'Theme parameters are not available in the current environment',
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