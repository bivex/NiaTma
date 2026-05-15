export const routePaths = {
  auth: '/auth',
  home: '/',
  application: '/application',
  cases: '/cases',
  contact: '/contact',
  initData: '/init-data',
  launchParams: '/launch-params',
  platform: '/platform',
  premium: '/premium',
  profile: '/profile',
  themeParams: '/theme-params',
  tools: '/tools',
  tonConnect: '/ton-connect',
} as const;

export const tabPaths = [
  routePaths.home,
  routePaths.cases,
  routePaths.tools,
  routePaths.contact,
] as const;

export type AppRoutePath = (typeof routePaths)[keyof typeof routePaths];