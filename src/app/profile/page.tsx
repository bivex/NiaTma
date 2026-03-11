import { redirect } from 'next/navigation';

import { buildAuthRedirectPath } from '@/features/auth/application/navigation';
import { toAuthUserProfile } from '@/features/auth/application/profile';
import { createAuthConfig } from '@/features/auth/infrastructure/server/config';
import { readAuthenticatedAuthSession } from '@/features/auth/infrastructure/server/status';
import ProfileScreen from '@/features/auth/presentation/ProfileScreen';
import { routePaths } from '@/features/navigation/domain/routes';

export default async function ProfilePage() {
  const config = createAuthConfig();
  const { session } = await readAuthenticatedAuthSession(config);

  if (!session) {
    redirect(buildAuthRedirectPath(routePaths.profile));
  }

  return <ProfileScreen initialProfile={toAuthUserProfile(session)} />;
}