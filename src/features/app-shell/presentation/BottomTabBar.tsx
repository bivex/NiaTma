'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Briefcase, FileText, Home, Search } from 'lucide-react';

import { routePaths } from '@/features/navigation/domain/routes';

const tabs = [
  { path: routePaths.home, Icon: Home },
  { path: routePaths.cases, Icon: Briefcase },
  { path: routePaths.tools, Icon: Search },
  { path: routePaths.contact, Icon: FileText },
] as const;

const tabKeys = ['home', 'cases', 'tools', 'contact'] as const;

export function BottomTabBar() {
  const t = useTranslations('navigation.tabBar');
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        paddingTop: 6,
        paddingLeft: 4,
        paddingRight: 4,
        height: 50,
        background: 'color-mix(in srgb, var(--tg-theme-bg-color, #fff) 72%, transparent)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderTop: '0.5px solid var(--tg-theme-separator-color, rgba(0,0,0,0.12))',
      }}
    >
      {tabs.map(({ path, Icon }, i) => {
        const active = pathname === path;
        return (
          <button
            key={path}
            type="button"
            onClick={() => router.push(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              flex: '1 1 0',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              padding: '2px 0',
              minHeight: 38,
              WebkitTapHighlightColor: 'transparent',
              color: active
                ? 'var(--tg-theme-link-color, #007aff)'
                : 'var(--tg-theme-subtitle-text-color, #8e8e93)',
              transition: 'color 0.15s ease',
            }}
          >
            <Icon size={24} strokeWidth={1.8} />
            <span style={{ fontSize: 10, lineHeight: '12px', fontWeight: active ? 500 : 400 }}>
              {t(tabKeys[i])}
            </span>
          </button>
        );
      })}
      {/* safe area spacer */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 'env(safe-area-inset-bottom, 0px)', background: 'color-mix(in srgb, var(--tg-theme-bg-color, #fff) 72%, transparent)' }} />
    </nav>
  );
}
