'use client';

import { List } from '@telegram-apps/telegram-ui';

import { buildLaunchParamsRows } from '@/features/launch-data/application/presenters';
import { useLaunchParamsSnapshot } from '@/features/launch-data/infrastructure/telegram';
import { Page } from '@/shared/ui/Page';
import { DisplayData } from '@/shared/ui/DisplayData/DisplayData';

export function LaunchParamsScreen() {
  const snapshot = useLaunchParamsSnapshot();
  const rows = buildLaunchParamsRows(snapshot);

  return (
    <Page>
      <List>
        <DisplayData rows={rows} />
      </List>
    </Page>
  );
}

export default LaunchParamsScreen;