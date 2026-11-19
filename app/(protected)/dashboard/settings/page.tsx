import type { Metadata } from 'next';

import { requireAuth } from '@/features/auth/server/session';
import {
  DashboardHeader,
  PageBody,
  PageIntro,
} from '@/features/dashboard/components/dashboard-header';
import {
  SettingsContent,
  type SettingsTab,
} from '@/features/dashboard/components/settings-content';
import { getUserSettings } from '@/features/settings/server/get-settings';

export const metadata: Metadata = {
  title: 'Settings',
};

type SettingsPageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function DashboardSettingsPage({ searchParams }: SettingsPageProps) {
  const [{ tab }, session] = await Promise.all([searchParams, requireAuth()]);
  const settings = await getUserSettings(session.user.id);
  const initialTab: SettingsTab = tab === 'billing' ? 'billing' : 'profile';

  return (
    <>
      <DashboardHeader title="Settings" />
      <PageBody className="max-w-4xl">
        <PageIntro title="Settings" description="Manage your profile, plan and billing." />
        <SettingsContent
          profile={settings.profile}
          subscription={settings.subscription}
          usage={settings.usage}
          initialTab={initialTab}
        />
      </PageBody>
    </>
  );
}
