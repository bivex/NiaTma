'use client';

import { Placeholder } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';

import { Page } from '@/features/navigation/presentation/Page';

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <Page back={false}>
      <Placeholder header={t('header')} description={t('description')} />
    </Page>
  );
}
