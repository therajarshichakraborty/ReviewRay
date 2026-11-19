export const DASHBOARD_ROUTES = {
  overview: '/dashboard',
  repos: '/dashboard/repos',
  pullRequest: '/dashboard/pull-request',
  github: '/dashboard/github',
  settings: '/dashboard/settings',
} as const;

export type DashboardRoute = (typeof DASHBOARD_ROUTES)[keyof typeof DASHBOARD_ROUTES];

export const DASHBOARD_NAV_ITEMS = [
  { title: 'Overview', href: DASHBOARD_ROUTES.overview, icon: 'overview' },
  { title: 'Pull requests', href: DASHBOARD_ROUTES.pullRequest, icon: 'pull-requests' },
  { title: 'Repositories', href: DASHBOARD_ROUTES.repos, icon: 'repositories' },
  { title: 'GitHub App', href: DASHBOARD_ROUTES.github, icon: 'github' },
  { title: 'Settings', href: DASHBOARD_ROUTES.settings, icon: 'settings' },
] as const;

export type DashboardNavIcon = (typeof DASHBOARD_NAV_ITEMS)[number]['icon'];
