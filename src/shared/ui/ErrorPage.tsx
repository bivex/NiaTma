'use client';

import { useEffect } from 'react';
import { Button, Placeholder } from '@telegram-apps/telegram-ui';

export function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Placeholder
      header="Something went wrong"
      description={error.message}
    >
      {reset && <Button mode="outline" onClick={() => reset()}>Try again</Button>}
    </Placeholder>
  );
}
