'use client';

import { ChevronsUpDown, CreditCard, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { DASHBOARD_ROUTES } from '@/features/dashboard/lib/routes';
import { authClient } from '@/lib/auth-client';
import { getDisplayName, getInitials, type UserMenuUser } from '../utils/display';
import { SIGN_IN_PATH } from '../utils';

export type { UserMenuUser } from '../utils/display';

function UserAvatar({ user, className }: { user: UserMenuUser; className?: string }) {
  return (
    <Avatar className={className}>
      {user.image ? <AvatarImage src={user.image} alt={getDisplayName(user)} /> : null}
      <AvatarFallback className="text-xs font-medium">{getInitials(user)}</AvatarFallback>
    </Avatar>
  );
}

/** Account menu shown at the bottom of the dashboard sidebar. */
export function SidebarUserMenu({ user, planLabel }: { user: UserMenuUser; planLabel: string }) {
  const router = useRouter();
  const displayName = getDisplayName(user);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(SIGN_IN_PATH);
          router.refresh();
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          tooltip={displayName}
          className="data-[state=open]:bg-sidebar-accent"
          aria-label="Open account menu"
        >
          <UserAvatar
            user={user}
            className="size-8 rounded-lg after:rounded-lg [&_img]:rounded-lg"
          />
          <div className="grid min-w-0 flex-1 text-left leading-tight">
            <span className="truncate text-sm font-medium">{displayName}</span>
            {user.email ? (
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            ) : null}
          </div>
          <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="start"
        className="w-(--radix-dropdown-menu-trigger-width) min-w-60"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2.5">
            <UserAvatar user={user} className="size-8" />
            <div className="grid min-w-0 leading-tight">
              <span className="truncate text-sm font-medium text-foreground">{displayName}</span>
              <span className="truncate text-xs text-muted-foreground">{planLabel} plan</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={DASHBOARD_ROUTES.settings}>
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`${DASHBOARD_ROUTES.settings}?tab=billing`}>
              <CreditCard />
              Billing
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
