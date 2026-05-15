'use client';

import { Placeholder } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';

import { Page } from '@/features/navigation/presentation/Page';

export default function ToolsPage() {
  const t = useTranslations('tools');

  return (
    <Page back={false}>
      <Placeholder header={t('header')} description={t('description')} />
    </Page>
  );
}
