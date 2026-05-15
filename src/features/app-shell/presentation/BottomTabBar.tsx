'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabbar } from '@telegram-apps/telegram-ui';
import { useTranslations } from 'next-intl';
import { Briefcase, FileText, Home, Search } from 'lucide-react';

import { tabPaths, routePaths } from '@/features/navigation/domain/routes';

const tabs = [
  { path: routePaths.home, icon: Home },
  { path: routePaths.cases, icon: Briefcase },
  { path: routePaths.tools, icon: Search },
  { path: routePaths.contact, icon: FileText },
] as const;

const tabMessageKeys = ['home', 'cases', 'tools', 'contact'] as const;

export function BottomTabBar() {
  const t = useTranslations('navigation.tabBar');
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Tabbar>
      {tabs.map((tab, i) => (
        <Tabbar.Item
          key={tab.path}
          selected={pathname === tab.path}
          onClick={() => router.push(tab.path)}
          text={t(tabMessageKeys[i])}
        >
          <tab.icon size={28} />
        </Tabbar.Item>
      ))}
    </Tabbar>
  );
}
