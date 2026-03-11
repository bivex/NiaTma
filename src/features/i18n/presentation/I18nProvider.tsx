import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import React from 'react';

import { timeZone } from '../domain/locale';

export const I18nProvider: React.FC<React.PropsWithChildren> = async ({
  children,
}) => {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  );
};