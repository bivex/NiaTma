import { createAuthConfig } from '@/features/auth/infrastructure/server/config';
import { readAuthenticatedAuthSession } from '@/features/auth/infrastructure/server/status';
import { resolveWalletPremiumAccess } from '@/features/monetization/application/premium';
import PremiumScreen from '@/features/monetization/presentation/PremiumScreen';
import { routePaths } from '@/features/navigation/domain/routes';
import { createAppConfig } from '@/shared/config/appConfig';

export default async function PremiumPage() {
  const authConfig = createAuthConfig();
  const appConfig = createAppConfig();
  const { session } = await readAuthenticatedAuthSession(authConfig);
  const access = resolveWalletPremiumAccess(session, appConfig.features.monetization);

  return (
    <PremiumScreen
      access={access}
      authHref={routePaths.auth}
      tonConnectHref={`${routePaths.tonConnect}?next=${encodeURIComponent(routePaths.premium)}`}
    />
  );
}