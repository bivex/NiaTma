export const routePaths = {
  home: '/',
  application: '/application',
  initData: '/init-data',
  launchParams: '/launch-params',
  platform: '/platform',
  themeParams: '/theme-params',
  tonConnect: '/ton-connect',
} as const;

export type AppRoutePath = (typeof routePaths)[keyof typeof routePaths];