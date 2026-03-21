import { notFound } from 'next/navigation';
import { db } from '@/lib/db';

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PreviewPage({ params }: Props): Promise<React.ReactElement> {
  const { token } = await params;

  const project = await db.project.findFirst({
    where: { previewToken: token, deletedAt: null },
    select: { generatedHtml: true, name: true },
  });

  if (!project?.generatedHtml) {
    notFound();
  }

  return (
    <div className="relative">
      {/* 미리보기 배너 */}
      <div className="fixed top-0 left-0 z-50 flex w-full items-center justify-center bg-amber-500 px-4 py-2 text-sm font-medium text-white">
        미리보기 모드 — 아직 공개되지 않은 페이지입니다
      </div>
      <iframe
        srcDoc={project.generatedHtml}
        className="h-screen w-screen border-0 pt-9"
        title={`미리보기: ${project.name}`}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
