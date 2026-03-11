export const routePaths = {
  home: '/',
  initData: '/init-data',
  launchParams: '/launch-params',
  themeParams: '/theme-params',
  tonConnect: '/ton-connect',
} as const;

export type AppRoutePath = (typeof routePaths)[keyof typeof routePaths];