import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PublicLandingPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;

  const project = await db.project.findFirst({
    where: { slug, isDeployed: true, deletedAt: null },
    select: { generatedHtml: true, name: true },
  });

  if (!project?.generatedHtml) {
    notFound();
  }

  return (
    <iframe
      srcDoc={project.generatedHtml}
      className="h-screen w-screen border-0"
      title={project.name}
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
