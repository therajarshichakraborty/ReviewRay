import type { Metadata } from "next";
import Link from "next/link";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { getInstallationStatus } from "@/features/github/server/installation";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/features/auth/actions";
import { RepoList } from "@/features/dashboard/components/repo-list";

export const metadata: Metadata = {
    title: "Repositories · Dashboard",
};


function ReposNotConnected() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
            <p className="text-sm text-muted-foreground">
                Install the GitHub App first to see your repositories.
            </p>
            <Button asChild>
                <Link href={DASHBOARD_ROUTES.github}>Go to GitHub App</Link>
            </Button>
        </div>
    );
}

/**
 * Repositories list page with GitHub connection guard.
 *
 * @returns Header plus either connect prompt or interactive repo table.
 */
export default async function DashboardReposPage() {
    const session = await requireAuth();
    const installation = await getInstallationStatus(session.user.id);

    const header = (
        <DashboardHeader
            title="Repositories"
            description="All public and private repositories available to the GitHub App."
        />
    );

    if (!installation.connected) {
        return (
            <>
                {header}
                <ReposNotConnected />
            </>
        );
    }

    return (
        <>
            {header}
            <RepoList />
        </>
    );
}