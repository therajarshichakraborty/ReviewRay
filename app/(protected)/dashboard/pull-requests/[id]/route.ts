import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/db.config';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const pullRequest = await prisma.pullRequest.findUnique({
    where: { id },
  });

  if (!pullRequest) {
    notFound();
  }

  redirect(`https://github.com/${pullRequest.repoFullName}/commit/${pullRequest.headSha}`);
}
